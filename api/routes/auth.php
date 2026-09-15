<?php
/**
 * KadamVivah - Authentication Controller
 * Handles Register, Login, Logout, and Current User (Me) endpoints.
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/rate_limiter.php';
require_once __DIR__ . '/../helpers/csrf.php';
require_once __DIR__ . '/../helpers/disposable_emails.php';
require_once __DIR__ . '/../middleware/auth.php';

class AuthController {
    /**
     * POST /api/auth/check-email
     * Early check for email availability during registration.
     */
    public static function checkEmail(): void {
        $pdo = Database::getConnection();

        // Rate limiting: max 60 availability checks per 15 minutes per IP
        if (!RateLimiter::hit($pdo, 'check_email', 60, 900)) {
            Response::error('Too many checks requested. Please try again in a few minutes.', 429);
        }

        $input = self::getJsonBody();
        $rawEmail = $input['email'] ?? $_POST['email'] ?? $_GET['email'] ?? '';
        $email = trim(strtolower((string) $rawEmail));

        // 1. Format check
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
            Response::success([
                'available' => false,
                'reason'    => 'invalid',
                'message'   => 'Please enter a valid email address.'
            ], 'Email format is invalid');
        }

        $domain = DisposableEmailBlocker::getDomain($email);
        if (!$domain || !str_contains($domain, '.') || !preg_match('/^[a-z0-9.-]+\.[a-z]{2,}$/i', $domain)) {
            Response::success([
                'available' => false,
                'reason'    => 'invalid',
                'message'   => 'Please enter a valid email address.'
            ], 'Email domain is invalid');
        }

        // 2. Disposable / temporary email check
        if (DisposableEmailBlocker::isDisposable($email)) {
            Response::success([
                'available' => false,
                'reason'    => 'disposable',
                'message'   => 'Temporary or disposable email addresses are not allowed.'
            ], 'Disposable email not allowed');
        }

        // 3. Duplicate check against users table (case-insensitive & whitespace trimmed)
        $stmt = $pdo->prepare('SELECT id FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) LIMIT 1');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            Response::success([
                'available' => false,
                'reason'    => 'duplicate',
                'message'   => 'An account with this email already exists. Please log in instead.'
            ], 'Email is already registered');
        }

        // 4. Available
        Response::success([
            'available' => true,
            'message'   => 'Email is available'
        ], 'Email is available');
    }

    /**
     * POST /api/auth/register
     */
    public static function register(): void {
        $pdo = Database::getConnection();

        // Rate limiting: max 10 registrations per 15 minutes per IP
        if (!RateLimiter::hit($pdo, 'register', 10, 900)) {
            Response::error('Too many registration attempts. Please try again later.', 429);
        }

        $input = self::getJsonBody();

        // 1. Validate Terms of Service & Privacy Policy Acceptance
        $acceptTerms = $input['acceptTerms'] ?? $input['accept_terms'] ?? $input['terms'] ?? false;
        if (!filter_var($acceptTerms, FILTER_VALIDATE_BOOLEAN)) {
            Response::error('You must accept the Terms of Service and Privacy Policy to register.', 422, ['field' => 'acceptTerms']);
        }

        // 2. Email Normalization & Strict Validation
        $rawEmail = $input['email'] ?? '';
        $email = trim(strtolower((string) $rawEmail));

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
            Response::error('Please provide a valid email address.', 422, ['field' => 'email']);
        }

        $domain = DisposableEmailBlocker::getDomain($email);
        if (!$domain || !str_contains($domain, '.') || !preg_match('/^[a-z0-9.-]+\.[a-z]{2,}$/i', $domain)) {
            Response::error('Please provide a valid email address with a valid domain.', 422, ['field' => 'email']);
        }

        // 3. Block Disposable / Temporary Email Domains
        if (DisposableEmailBlocker::isDisposable($email)) {
            Response::error('Temporary or disposable email addresses are not allowed.', 422, ['field' => 'email']);
        }

        // 4. Duplicate Email Protection Check
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            Response::error('An account with this email address already exists.', 409, ['field' => 'email']);
        }

        // 5. Password Rules & Complexity Enforcement
        $password = (string) ($input['password'] ?? '');
        if (strlen($password) < 8) {
            Response::error('Password must be at least 8 characters long.', 422, ['field' => 'password']);
        }

        if (
            !preg_match('/[A-Z]/', $password) || 
            !preg_match('/[a-z]/', $password) || 
            !preg_match('/[0-9]/', $password) || 
            !preg_match('/[^A-Za-z0-9]/', $password)
        ) {
            Response::error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.', 422, ['field' => 'password']);
        }

        if (self::isCommonPassword($password)) {
            Response::error('This password is too common or easily guessed. Please choose a stronger password.', 422, ['field' => 'password']);
        }

        // 6. Name Validation
        $firstName = trim((string) ($input['firstName'] ?? $input['first_name'] ?? ''));
        $lastName  = trim((string) ($input['lastName'] ?? $input['last_name'] ?? ''));
        if (empty($firstName)) {
            Response::error('First name is required.', 422, ['field' => 'firstName']);
        }
        if (empty($lastName)) {
            Response::error('Last name is required.', 422, ['field' => 'lastName']);
        }

        // 7. Date of Birth / Strict 18+ Age Validation
        $rawDob = trim((string) ($input['dob'] ?? $input['date_of_birth'] ?? ''));
        if (empty($rawDob) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $rawDob)) {
            Response::error('Please provide a valid date of birth in YYYY-MM-DD format.', 422, ['field' => 'dob']);
        }

        $dobDate = DateTime::createFromFormat('Y-m-d', $rawDob);
        if (!$dobDate || $dobDate->format('Y-m-d') !== $rawDob) {
            Response::error('Please provide a valid calendar date for date of birth.', 422, ['field' => 'dob']);
        }

        $today = new DateTime('today');
        if ($dobDate > $today) {
            Response::error('Date of birth cannot be in the future.', 422, ['field' => 'dob']);
        }

        $age = $dobDate->diff($today)->y;
        if ($age < 18) {
            Response::error('You must be at least 18 years old to register.', 422, ['field' => 'dob']);
        }
        if ($age > 100) {
            Response::error('Please enter a valid date of birth.', 422, ['field' => 'dob']);
        }
        $dob = $rawDob;

        // 8. Phone Number Normalization & Indian Mobile Validation
        $rawPhone = (string) ($input['phone'] ?? '');
        $phone = self::normalizeIndianPhone($rawPhone);
        if (!$phone) {
            Response::error('Please enter a valid 10-digit Indian mobile number.', 422, ['field' => 'phone']);
        }

        // Gender validation
        $rawGender = strtolower(trim((string) ($input['gender'] ?? '')));
        $gender = in_array($rawGender, ['male', 'female', 'other'], true) ? $rawGender : 'male';

        // Location & community fields
        $city          = trim((string) ($input['city'] ?? ''));
        if (empty($city)) {
            $city = 'Pune';
        }

        $middleName     = self::cleanOptional($input['middleName'] ?? $input['middle_name'] ?? null);
        $maritalStatus  = self::cleanOptional($input['maritalStatus'] ?? $input['marital_status'] ?? null) ?? 'never_married';
        $district       = self::cleanOptional($input['district'] ?? null);
        $state          = self::cleanOptional($input['state'] ?? null) ?? 'Maharashtra';
        $pincode        = self::cleanOptional($input['pincode'] ?? null);
        $caste          = self::cleanOptional($input['caste'] ?? null);
        $subCaste       = self::cleanOptional($input['subCaste'] ?? $input['sub_caste'] ?? null);
        $gotra          = self::cleanOptional($input['gotra'] ?? null);
        $education      = self::cleanOptional($input['education'] ?? null);
        $occupation     = self::cleanOptional($input['occupation'] ?? null);
        $annualIncome   = self::cleanOptional($input['annualIncome'] ?? $input['annual_income'] ?? null);
        $fatherName     = self::cleanOptional($input['fatherName'] ?? $input['familyDetails']['fatherName'] ?? null);
        $motherName     = self::cleanOptional($input['motherName'] ?? $input['familyDetails']['motherName'] ?? null);
        $siblings       = self::cleanOptional($input['siblings'] ?? $input['familyDetails']['siblings'] ?? null);
        $familyType     = self::cleanOptional($input['familyType'] ?? $input['family_type'] ?? null);
        $altPhone       = self::cleanOptional($input['alternatePhone'] ?? $input['alternate_phone'] ?? null);
        if ($altPhone !== null) {
            $normalizedAltPhone = self::normalizeIndianPhone($altPhone);
            $altPhone = $normalizedAltPhone ?: $altPhone;
        }
        $contactEmail   = self::cleanOptional($input['contactEmail'] ?? $input['contact_email'] ?? $email) ?? $email;
        $bio            = self::cleanOptional($input['bio'] ?? null);
        $height         = self::cleanOptional($input['height'] ?? null);
        $hobbies        = self::cleanOptional($input['hobbies'] ?? null);

        // Hash password securely with bcrypt
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Core transaction for User + Profile creation in draft state
        $pdo->beginTransaction();

        try {
            // 1. Insert User (Always force role = 'user' for public registration)
            $userStmt = $pdo->prepare('
                INSERT INTO users (email, password_hash, role, account_status, created_at, updated_at) 
                VALUES (?, ?, "user", "active", NOW(), NOW())
            ');
            $userStmt->execute([$email, $passwordHash]);
            $userId = (int) $pdo->lastInsertId();

            // 2. Insert Profile record in 'draft' status
            $profileStmt = $pdo->prepare('
                INSERT INTO profiles (
                    user_id, first_name, middle_name, last_name, gender, date_of_birth, marital_status,
                    city, district, state, pincode, caste, sub_caste, gotra,
                    education, occupation, annual_income,
                    father_name, mother_name, siblings, family_type,
                    phone, alternate_phone, contact_email,
                    bio, height, hobbies, status, created_at, updated_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?,
                    ?, ?, ?, "draft", NOW(), NOW()
                )
            ');

            $profileStmt->execute([
                $userId, $firstName, $middleName, $lastName, $gender, $dob, $maritalStatus,
                $city, $district, $state, $pincode, $caste, $subCaste, $gotra,
                $education, $occupation, $annualIncome,
                $fatherName, $motherName, $siblings, $familyType,
                $phone, $altPhone, $contactEmail,
                $bio, $height, $hobbies
            ]);

            $profileId = (int) $pdo->lastInsertId();
            $hasProfile = true;
            $profileStatus = 'draft';

            $pdo->commit();

            // Log user in automatically via session
            AuthMiddleware::startSession();
            $_SESSION = [];
            session_regenerate_id(true);
            $_SESSION['user_id'] = $userId;
            $_SESSION['role'] = 'user';

            RateLimiter::reset($pdo, 'register');

            $responseData = [
                'user' => [
                    'id'             => $userId,
                    'email'          => $email,
                    'role'           => 'user',
                    'account_status' => 'active',
                    'has_profile'    => $hasProfile,
                    'profile_id'     => $profileId,
                    'profile_status' => $profileStatus,
                    'first_name'     => $firstName,
                    'last_name'      => $lastName,
                    'gender'         => $gender,
                    'city'           => $city
                ],
                'csrf_token' => CsrfHelper::getToken()
            ];

            Response::created($responseData, 'Registration successful. Complete your profile and upload a photo to submit for admin review.');

        } catch (PDOException $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            // SQLSTATE 23000 / Error 1062 is duplicate entry key collision (race condition protection)
            if ($e->getCode() == '23000' || ($e->errorInfo[1] ?? 0) === 1062) {
                Response::error('An account with this email address already exists.', 409, ['field' => 'email']);
            }
            throw $e;
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $e;
        }
    }

    /**
     * POST /api/auth/login
     */
    public static function login(): void {
        $pdo = Database::getConnection();

        // Rate limiting: max 10 failed login attempts per 15 minutes per IP
        if (!RateLimiter::hit($pdo, 'login', 10, 900)) {
            Response::error('Too many failed login attempts. Please try again in 15 minutes.', 429);
        }

        $input = self::getJsonBody();

        $rawEmail = $input['email'] ?? '';
        $email = trim(strtolower((string) $rawEmail));
        $password = (string) ($input['password'] ?? '');

        if (empty($email) || empty($password)) {
            Response::error('Please enter both email and password.', 422);
        }

        // Fetch user record
        $stmt = $pdo->prepare('
            SELECT id, email, password_hash, role, account_status 
            FROM users 
            WHERE email = ? 
            LIMIT 1
        ');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        // Verify password
        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::error('Invalid email or password.', 401);
        }

        // Verify account status
        if ($user['account_status'] === 'suspended') {
            Response::error('Your account has been suspended. Please contact support.', 403);
        }

        // Reset rate limiter on valid login
        RateLimiter::reset($pdo, 'login');

        // Initialize session
        AuthMiddleware::startSession();
        $_SESSION = [];
        session_regenerate_id(true);

        $_SESSION['user_id'] = (int) $user['id'];
        $_SESSION['role']    = $user['role'];

        // Fetch profile info
        $profileStmt = $pdo->prepare('
            SELECT id, first_name, last_name, gender, city, status AS profile_status 
            FROM profiles 
            WHERE user_id = ? 
            LIMIT 1
        ');
        $profileStmt->execute([(int) $user['id']]);
        $profile = $profileStmt->fetch();

        $hasProfile = !empty($profile);

        $responseData = [
            'user' => [
                'id'             => (int) $user['id'],
                'email'          => $user['email'],
                'role'           => $user['role'],
                'account_status' => $user['account_status'],
                'has_profile'    => $hasProfile,
                'profile_id'     => $hasProfile ? (int) $profile['id'] : null,
                'profile_status' => $hasProfile ? $profile['profile_status'] : null,
                'first_name'     => $profile['first_name'] ?? null,
                'last_name'      => $profile['last_name'] ?? null,
                'gender'         => $profile['gender'] ?? null,
                'city'           => $profile['city'] ?? null
            ],
            'csrf_token' => CsrfHelper::getToken()
        ];

        Response::success($responseData, 'Login successful');
    }

    /**
     * POST /api/auth/logout
     */
    public static function logout(): void {
        AuthMiddleware::clearSession();
        Response::success(null, 'Logged out successfully');
    }

    /**
     * GET /api/auth/me
     */
    public static function me(): void {
        $pdo = Database::getConnection();
        $user = AuthMiddleware::requireAuth($pdo);
        $csrfToken = CsrfHelper::getToken();

        Response::success([
            'user'       => $user,
            'csrf_token' => $csrfToken
        ], 'Authenticated user profile retrieved');
    }

    /**
     * Check for common easily-guessed passwords.
     */
    private static function isCommonPassword(string $password): bool {
        $commonList = [
            'password', 'password123', 'password123!', 'password@123',
            'admin123', 'admin123!', 'admin12345!', 'admin@123',
            '12345678', '123456789', '12345678aA!', 'qwerty1234!',
            'qwertyuiop', 'welcome123!', 'welcome@123',
            'kadam1234!', 'kadamvivah123!', 'maratha123!'
        ];
        $lower = strtolower($password);
        return in_array($lower, $commonList, true);
    }

    /**
     * Normalizes and validates a 10-digit Indian mobile number.
     * Returns 10-digit string if valid, or null if invalid.
     */
    private static function normalizeIndianPhone(string $rawPhone): ?string {
        // Strip spaces, hyphens, periods, parentheses
        $clean = preg_replace('/[\s\-\(\)\.]/', '', trim($rawPhone));

        // Strip leading +91 / 91 / 0 if present
        if (str_starts_with($clean, '+91') && strlen($clean) === 13) {
            $clean = substr($clean, 3);
        } elseif (str_starts_with($clean, '91') && strlen($clean) === 12) {
            $clean = substr($clean, 2);
        } elseif (str_starts_with($clean, '0') && strlen($clean) === 11) {
            $clean = substr($clean, 1);
        }

        // Must be exactly 10 digits starting with 6, 7, 8, or 9
        if (!preg_match('/^[6-9]\d{9}$/', $clean)) {
            return null;
        }

        // Reject repeated single-digit fake numbers (e.g. 0000000000..9999999999)
        if (preg_match('/^(\d)\1{9}$/', $clean)) {
            return null;
        }

        return $clean;
    }

    /**
     * Helper to clean and sanitize optional string fields without passing null to trim().
     */
    private static function cleanOptional($value): ?string {
        if ($value === null) {
            return null;
        }

        if (is_array($value) || is_object($value)) {
            return null;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    /**
     * Helper to parse JSON request body safely.
     */
    private static function getJsonBody(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return [];
        }

        $data = json_decode($raw, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            Response::error('Invalid JSON payload provided.', 400);
        }

        return is_array($data) ? $data : [];
    }
}
