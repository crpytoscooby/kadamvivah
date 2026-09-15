<?php
/**
 * KadamVivah - Public / Authenticated Profiles Controller
 * Handles browsing approved matrimonial profiles with search & filters.
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class ProfileController {
    /**
     * GET /api/profiles
     * Browse approved profiles with filters and pagination.
     */
    public static function getProfiles(): void {
        $pdo = Database::getConnection();

        // 1. Authorization: require active authenticated user
        $currentUser = AuthMiddleware::requireAuth($pdo);
        $currentUserId = (int) $currentUser['id'];

        // 2. Parse pagination parameters
        $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
        $limit = isset($_GET['limit']) ? min(50, max(1, (int) $_GET['limit'])) : 12;
        $offset = ($page - 1) * $limit;

        // 3. Build query and filter conditions (exclude logged-in user's own profile and non-user accounts)
        $where = ['p.status = "approved"', 'u.account_status = "active"', 'u.role = "user"', 'p.user_id != ?'];
        $params = [$currentUserId];

        // Filter by gender
        if (!empty($_GET['gender'])) {
            $gender = strtolower(trim((string) $_GET['gender']));
            if (in_array($gender, ['male', 'female', 'other'], true)) {
                $where[] = 'p.gender = ?';
                $params[] = $gender;
            }
        }

        // Filter by city (partial match)
        if (!empty($_GET['city'])) {
            $city = trim((string) $_GET['city']);
            $where[] = 'p.city LIKE ?';
            $params[] = '%' . $city . '%';
        }

        // Filter by caste (partial match)
        if (!empty($_GET['caste'])) {
            $caste = trim((string) $_GET['caste']);
            $where[] = 'p.caste LIKE ?';
            $params[] = '%' . $caste . '%';
        }

        // Filter by education (partial match)
        if (!empty($_GET['education'])) {
            $education = trim((string) $_GET['education']);
            $where[] = 'p.education LIKE ?';
            $params[] = '%' . $education . '%';
        }

        // Filter by age_min
        if (!empty($_GET['age_min']) && is_numeric($_GET['age_min'])) {
            $ageMin = (int) $_GET['age_min'];
            $where[] = 'p.date_of_birth <= DATE_SUB(CURDATE(), INTERVAL ? YEAR)';
            $params[] = $ageMin;
        }

        // Filter by age_max
        if (!empty($_GET['age_max']) && is_numeric($_GET['age_max'])) {
            $ageMax = (int) $_GET['age_max'];
            $where[] = 'p.date_of_birth >= DATE_SUB(CURDATE(), INTERVAL (? + 1) YEAR)';
            $params[] = $ageMax;
        }

        // Filter by dobFrom (e.g. YYYY-MM-DD)
        if (!empty($_GET['dobFrom']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $_GET['dobFrom'])) {
            $where[] = 'p.date_of_birth >= ?';
            $params[] = $_GET['dobFrom'];
        }

        // Filter by dobTo (e.g. YYYY-MM-DD)
        if (!empty($_GET['dobTo']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) $_GET['dobTo'])) {
            $where[] = 'p.date_of_birth <= ?';
            $params[] = $_GET['dobTo'];
        }

        $whereSql = implode(' AND ', $where);

        // 4. Count total matching approved profiles
        $countSql = "
            SELECT COUNT(p.id) AS total 
            FROM profiles p 
            JOIN users u ON u.id = p.user_id 
            WHERE {$whereSql}
        ";
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($params);
        $total = (int) ($countStmt->fetchColumn() ?: 0);
        $totalPages = $limit > 0 ? (int) ceil($total / $limit) : 0;

        // 5. Fetch paginated records with safe public fields
        $sql = "
            SELECT 
                p.id,
                p.first_name,
                p.last_name,
                p.gender,
                p.date_of_birth,
                p.city,
                p.state,
                p.caste,
                p.sub_caste,
                p.education,
                p.occupation,
                p.height,
                p.bio,
                p.created_at,
                p.updated_at,
                ph.file_path AS primary_photo
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            LEFT JOIN profile_photos ph ON ph.profile_id = p.id AND ph.is_primary = 1
            WHERE {$whereSql}
            ORDER BY p.updated_at DESC, p.id DESC
            LIMIT ? OFFSET ?
        ";

        $fetchParams = array_merge($params, [$limit, $offset]);
        $stmt = $pdo->prepare($sql);
        $stmt->execute($fetchParams);
        $rows = $stmt->fetchAll();

        // 6. Format response objects with both camelCase & snake_case compatibility
        $profiles = array_map(function ($row) {
            $primaryPhoto = $row['primary_photo'] ?? null;
            $photos = $primaryPhoto ? [$primaryPhoto] : [];

            return [
                'id'            => (int) $row['id'],
                'first_name'    => $row['first_name'],
                'firstName'     => $row['first_name'],
                'last_name'     => $row['last_name'],
                'lastName'      => $row['last_name'],
                'gender'        => $row['gender'],
                'date_of_birth' => $row['date_of_birth'],
                'dob'           => $row['date_of_birth'],
                'city'          => $row['city'],
                'state'         => $row['state'],
                'caste'         => $row['caste'],
                'sub_caste'     => $row['sub_caste'],
                'subCaste'      => $row['sub_caste'],
                'education'     => $row['education'],
                'occupation'    => $row['occupation'],
                'height'        => $row['height'],
                'bio'           => $row['bio'],
                'primary_photo' => $primaryPhoto,
                'photos'        => $photos,
                'created_at'    => $row['created_at']
            ];
        }, $rows);

        Response::success([
            'profiles'   => $profiles,
            'pagination' => [
                'page'       => $page,
                'limit'      => $limit,
                'total'      => $total,
                'totalPages' => $totalPages
            ]
        ], 'Approved profiles retrieved successfully');
    }

    /**
     * GET /api/profiles/{id}
     * Get detailed view of an approved candidate profile.
     * Note: Contact details (phone/email) are withheld for privacy.
     */
    public static function getProfileById(int $id): void {
        $pdo = Database::getConnection();

        // 1. Authorization: require active authenticated user session
        $currentUser = AuthMiddleware::requireAuth($pdo);
        $myProfileId = (int) ($currentUser['profile_id'] ?? 0);
        $myProfileApproved = ($currentUser['profile_status'] ?? '') === 'approved';
        $isOwnProfile = ($myProfileId > 0 && $myProfileId === $id);

        // 2. Validate positive integer ID
        if ($id <= 0) {
            Response::badRequest('Invalid profile ID.');
        }

        // 3. Query approved profile belonging to active user
        $sql = "
            SELECT 
                p.id,
                p.first_name,
                p.middle_name,
                p.last_name,
                p.gender,
                p.date_of_birth,
                p.marital_status,
                p.city,
                p.district,
                p.state,
                p.pincode,
                p.caste,
                p.sub_caste,
                p.gotra,
                p.education,
                p.occupation,
                p.annual_income,
                p.bio,
                p.height,
                p.hobbies,
                p.family_type,
                p.father_name,
                p.mother_name,
                p.siblings,
                p.phone,
                p.alternate_phone,
                p.contact_email,
                p.created_at,
                p.updated_at
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            WHERE p.id = ? AND p.status = 'approved' AND u.account_status = 'active' AND u.role = 'user'
            LIMIT 1
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $row = $stmt->fetch();

        if (!$row) {
            Response::notFound('Profile not found or unavailable.');
        }

        // 4. Query profile photos
        $photoSql = "
            SELECT file_path, is_primary 
            FROM profile_photos 
            WHERE profile_id = ? 
            ORDER BY is_primary DESC, id ASC
        ";
        $photoStmt = $pdo->prepare($photoSql);
        $photoStmt->execute([$id]);
        $photoRows = $photoStmt->fetchAll();

        $photos = [];
        $primaryPhoto = null;
        foreach ($photoRows as $photoRow) {
            $filePath = $photoRow['file_path'];
            $photos[] = $filePath;
            if ((int) $photoRow['is_primary'] === 1 && $primaryPhoto === null) {
                $primaryPhoto = $filePath;
            }
        }
        if ($primaryPhoto === null && count($photos) > 0) {
            $primaryPhoto = $photos[0];
        }

        // 5. Determine interest status and contact disclosure permissions
        $contactUnlocked = false;
        $contacts = null;
        $interestStatus = null;

        if ($isOwnProfile) {
            $contactUnlocked = true;
            $contacts = [
                'phone'           => $row['phone'],
                'alternate_phone' => $row['alternate_phone'],
                'contact_email'   => $row['contact_email']
            ];
            $interestStatus = [
                'is_own_profile' => true,
                'has_interest'   => false,
                'direction'      => null,
                'status'         => null,
                'interest_id'    => null,
                'can_send'       => false
            ];
        } else if ($myProfileId > 0) {
            $intStmt = $pdo->prepare('
                SELECT id, sender_profile_id, receiver_profile_id, status 
                FROM interests 
                WHERE (sender_profile_id = ? AND receiver_profile_id = ?)
                   OR (sender_profile_id = ? AND receiver_profile_id = ?)
                LIMIT 1
            ');
            $intStmt->execute([$myProfileId, $id, $id, $myProfileId]);
            $interestRow = $intStmt->fetch();

            if ($interestRow) {
                $isSender = (int) $interestRow['sender_profile_id'] === $myProfileId;
                $direction = $isSender ? 'sent' : 'received';
                $status = $interestRow['status'];
                $isAccepted = ($status === 'accepted');

                if ($isAccepted) {
                    $contactUnlocked = true;
                    $contacts = [
                        'phone'           => $row['phone'],
                        'alternate_phone' => $row['alternate_phone'],
                        'contact_email'   => $row['contact_email']
                    ];
                }

                $interestStatus = [
                    'is_own_profile' => false,
                    'has_interest'   => true,
                    'direction'      => $direction,
                    'status'         => $status,
                    'interest_id'    => (int) $interestRow['id'],
                    'can_send'       => false
                ];
            } else {
                $interestStatus = [
                    'is_own_profile' => false,
                    'has_interest'   => false,
                    'direction'      => null,
                    'status'         => null,
                    'interest_id'    => null,
                    'can_send'       => $myProfileApproved
                ];
            }
        } else {
            $interestStatus = [
                'is_own_profile' => false,
                'has_interest'   => false,
                'direction'      => null,
                'status'         => null,
                'interest_id'    => null,
                'can_send'       => false
            ];
        }

        // 6. Structure payload with camelCase & snake_case compatibility
        $hasFamilyInfo = !empty($row['father_name']) || !empty($row['mother_name']) || !empty($row['siblings']) || !empty($row['family_type']);

        $response = [
            'id'               => (int) $row['id'],
            'first_name'       => $row['first_name'],
            'firstName'        => $row['first_name'],
            'middle_name'      => $row['middle_name'],
            'middleName'       => $row['middle_name'],
            'last_name'        => $row['last_name'],
            'lastName'         => $row['last_name'],
            'gender'           => $row['gender'],
            'date_of_birth'    => $row['date_of_birth'],
            'dob'              => $row['date_of_birth'],
            'marital_status'   => $row['marital_status'],
            'maritalStatus'    => $row['marital_status'],
            'city'             => $row['city'],
            'district'         => $row['district'],
            'state'            => $row['state'],
            'pincode'          => $row['pincode'],
            'caste'            => $row['caste'],
            'sub_caste'        => $row['sub_caste'],
            'subCaste'         => $row['sub_caste'],
            'gotra'            => $row['gotra'],
            'education'        => $row['education'],
            'occupation'       => $row['occupation'],
            'annual_income'    => $row['annual_income'],
            'annualIncome'     => $row['annual_income'],
            'bio'              => $row['bio'],
            'height'           => $row['height'],
            'hobbies'          => $row['hobbies'],
            'family_type'      => $row['family_type'],
            'familyType'       => $row['family_type'],
            'father_name'      => $row['father_name'],
            'fatherName'       => $row['father_name'],
            'mother_name'      => $row['mother_name'],
            'motherName'       => $row['mother_name'],
            'siblings'         => $row['siblings'],
            'familyDetails'    => $hasFamilyInfo ? [
                'fatherName' => $row['father_name'],
                'motherName' => $row['mother_name'],
                'siblings'   => $row['siblings'],
                'familyType' => $row['family_type']
            ] : null,
            'primary_photo'    => $primaryPhoto,
            'photos'           => $photos,
            'is_own_profile'   => $isOwnProfile,
            'contact_unlocked' => $contactUnlocked,
            'contacts'         => $contacts,
            'interest_status'  => $interestStatus,
            'created_at'       => $row['created_at'],
            'updated_at'       => $row['updated_at']
        ];

        Response::success($response, 'Profile details retrieved successfully');
    }

    /**
     * Clean and normalize optional strings.
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
     * Parse JSON body with fallback to $_POST.
     */
    private static function getJsonBody(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return $_POST ?? [];
        }
        $decoded = json_decode($raw, true);
        return is_array($decoded) ? $decoded : ($_POST ?? []);
    }

    /**
     * GET /api/profile/me
     * Retrieve the logged-in user's complete profile with all private fields & photos.
     */
    public static function getMyProfile(): void {
        $pdo = Database::getConnection();
        $user = AuthMiddleware::requireAuth($pdo);

        $stmt = $pdo->prepare('
            SELECT 
                p.*,
                u.email AS account_email,
                u.role AS user_role,
                u.account_status AS user_account_status
            FROM users u
            LEFT JOIN profiles p ON p.user_id = u.id
            WHERE u.id = ?
            LIMIT 1
        ');
        $stmt->execute([$user['id']]);
        $row = $stmt->fetch();

        if (!$row || empty($row['id'])) {
            // If user has no profile row yet, return basic template in draft status
            Response::success([
                'id'               => null,
                'user_id'          => $user['id'],
                'first_name'       => $user['first_name'] ?? '',
                'firstName'        => $user['first_name'] ?? '',
                'middle_name'      => null,
                'middleName'       => null,
                'last_name'        => $user['last_name'] ?? '',
                'lastName'         => $user['last_name'] ?? '',
                'gender'           => $user['gender'] ?? 'male',
                'date_of_birth'    => '1995-01-01',
                'dob'              => '1995-01-01',
                'marital_status'   => 'never_married',
                'maritalStatus'    => 'never_married',
                'city'             => $user['city'] ?? '',
                'district'         => null,
                'state'            => 'Maharashtra',
                'pincode'          => null,
                'caste'            => null,
                'sub_caste'        => null,
                'subCaste'         => null,
                'gotra'            => null,
                'education'        => null,
                'occupation'       => null,
                'annual_income'    => null,
                'annualIncome'     => null,
                'father_name'      => null,
                'fatherName'       => null,
                'mother_name'      => null,
                'motherName'       => null,
                'siblings'         => null,
                'family_type'      => null,
                'familyType'       => null,
                'phone'            => '',
                'alternate_phone'  => null,
                'alternatePhone'   => null,
                'contact_email'    => $user['email'] ?? null,
                'contactEmail'     => $user['email'] ?? null,
                'bio'              => null,
                'height'           => null,
                'hobbies'          => null,
                'status'           => 'draft',
                'rejection_reason' => null,
                'rejectionReason'  => null,
                'approved_at'      => null,
                'is_approved_once' => false,
                'primary_photo'    => null,
                'photos'           => [],
                'photos_count'     => 0
            ], 'My profile template retrieved');
            return;
        }

        $profileId = (int) $row['id'];

        // Query all photos
        $photoStmt = $pdo->prepare('
            SELECT id, file_path, is_primary, created_at 
            FROM profile_photos 
            WHERE profile_id = ? 
            ORDER BY is_primary DESC, id ASC
        ');
        $photoStmt->execute([$profileId]);
        $photoRows = $photoStmt->fetchAll();

        $photos = [];
        $primaryPhoto = null;
        foreach ($photoRows as $p) {
            $isPrimary = (bool) $p['is_primary'];
            $photos[] = [
                'id'         => (int) $p['id'],
                'file_path'  => $p['file_path'],
                'filePath'   => $p['file_path'],
                'is_primary' => $isPrimary,
                'isPrimary'  => $isPrimary,
                'created_at' => $p['created_at']
            ];
            if ($isPrimary && $primaryPhoto === null) {
                $primaryPhoto = $p['file_path'];
            }
        }
        if ($primaryPhoto === null && count($photos) > 0) {
            $primaryPhoto = $photos[0]['file_path'];
        }

        $hasFamilyInfo = !empty($row['father_name']) || !empty($row['mother_name']) || !empty($row['siblings']) || !empty($row['family_type']);
        $isApprovedOnce = ($row['status'] === 'approved' || !empty($row['approved_at']));

        $response = [
            'id'               => $profileId,
            'user_id'          => (int) $row['user_id'],
            'first_name'       => $row['first_name'],
            'firstName'        => $row['first_name'],
            'middle_name'      => $row['middle_name'],
            'middleName'       => $row['middle_name'],
            'last_name'        => $row['last_name'],
            'lastName'         => $row['last_name'],
            'gender'           => $row['gender'],
            'date_of_birth'    => $row['date_of_birth'],
            'dob'              => $row['date_of_birth'],
            'marital_status'   => $row['marital_status'],
            'maritalStatus'    => $row['marital_status'],
            'city'             => $row['city'],
            'district'         => $row['district'],
            'state'            => $row['state'],
            'pincode'          => $row['pincode'],
            'caste'            => $row['caste'],
            'sub_caste'        => $row['sub_caste'],
            'subCaste'         => $row['sub_caste'],
            'gotra'            => $row['gotra'],
            'education'        => $row['education'],
            'occupation'       => $row['occupation'],
            'annual_income'    => $row['annual_income'],
            'annualIncome'     => $row['annual_income'],
            'father_name'      => $row['father_name'],
            'fatherName'       => $row['father_name'],
            'mother_name'      => $row['mother_name'],
            'motherName'       => $row['mother_name'],
            'siblings'         => $row['siblings'],
            'family_type'      => $row['family_type'],
            'familyType'       => $row['family_type'],
            'familyDetails'    => $hasFamilyInfo ? [
                'fatherName' => $row['father_name'],
                'motherName' => $row['mother_name'],
                'siblings'   => $row['siblings'],
                'familyType' => $row['family_type']
            ] : null,
            'phone'            => $row['phone'],
            'alternate_phone'  => $row['alternate_phone'],
            'alternatePhone'   => $row['alternate_phone'],
            'contact_email'    => $row['contact_email'],
            'contactEmail'     => $row['contact_email'],
            'bio'              => $row['bio'],
            'height'           => $row['height'],
            'hobbies'          => $row['hobbies'],
            'status'           => $row['status'],
            'rejection_reason' => $row['rejection_reason'],
            'rejectionReason'  => $row['rejection_reason'],
            'approved_at'      => $row['approved_at'] ?? null,
            'is_approved_once' => $isApprovedOnce,
            'primary_photo'    => $primaryPhoto,
            'photos'           => $photos,
            'photos_count'     => count($photos),
            'created_at'       => $row['created_at'],
            'updated_at'       => $row['updated_at']
        ];

        Response::success($response, 'My profile retrieved successfully');
    }

    /**
     * PUT / POST /api/profile/me
     * Update logged-in user's profile details.
     * Preserves 'approved' status if profile has already been approved once.
     */
    public static function updateMyProfile(): void {
        $pdo = Database::getConnection();
        $user = AuthMiddleware::requireAuth($pdo);
        $userId = $user['id'];

        $input = self::getJsonBody();

        // 1. Validate required fields
        $firstName = trim((string) ($input['firstName'] ?? $input['first_name'] ?? ''));
        $lastName  = trim((string) ($input['lastName'] ?? $input['last_name'] ?? ''));
        $gender    = strtolower(trim((string) ($input['gender'] ?? '')));
        $dob       = trim((string) ($input['dob'] ?? $input['date_of_birth'] ?? ''));
        $city      = trim((string) ($input['city'] ?? ''));
        $phone     = trim((string) ($input['phone'] ?? ''));

        if (empty($firstName) || strlen($firstName) > 100) {
            Response::error('Please enter a valid first name (max 100 characters).', 422, ['field' => 'firstName']);
        }
        if (empty($lastName) || strlen($lastName) > 100) {
            Response::error('Please enter a valid last name (max 100 characters).', 422, ['field' => 'lastName']);
        }
        if (!in_array($gender, ['male', 'female', 'other'], true)) {
            Response::error('Please select a valid gender.', 422, ['field' => 'gender']);
        }
        if (empty($dob) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dob)) {
            Response::error('Please provide a valid date of birth in YYYY-MM-DD format.', 422, ['field' => 'dob']);
        }
        if ($dob >= date('Y-m-d')) {
            Response::error('Date of birth must be a past date.', 422, ['field' => 'dob']);
        }
        if (empty($city) || strlen($city) > 100) {
            Response::error('Please enter a valid city (max 100 characters).', 422, ['field' => 'city']);
        }
        if (empty($phone) || strlen($phone) > 30) {
            Response::error('Please enter a valid phone number (max 30 characters).', 422, ['field' => 'phone']);
        }

        // 2. Clean optional fields
        $middleName     = self::cleanOptional($input['middleName'] ?? $input['middle_name'] ?? null);
        $maritalStatus  = self::cleanOptional($input['maritalStatus'] ?? $input['marital_status'] ?? null) ?? 'never_married';
        if (!in_array($maritalStatus, ['never_married', 'divorced', 'widowed', 'separated', 'other'], true)) {
            $maritalStatus = 'never_married';
        }

        $district       = self::cleanOptional($input['district'] ?? null);
        $state          = self::cleanOptional($input['state'] ?? null) ?? 'Maharashtra';
        $pincode        = self::cleanOptional($input['pincode'] ?? null);
        $caste          = self::cleanOptional($input['caste'] ?? null);
        $subCaste       = self::cleanOptional($input['subCaste'] ?? $input['sub_caste'] ?? null);
        $gotra          = self::cleanOptional($input['gotra'] ?? null);
        $education      = self::cleanOptional($input['education'] ?? null);
        $occupation     = self::cleanOptional($input['occupation'] ?? null);
        $annualIncome   = self::cleanOptional($input['annualIncome'] ?? $input['annual_income'] ?? null);

        // Family fields: support both flat keys and familyDetails nested object
        $familyDetails  = is_array($input['familyDetails'] ?? null) ? $input['familyDetails'] : [];
        $fatherName     = self::cleanOptional($input['fatherName'] ?? $input['father_name'] ?? ($familyDetails['fatherName'] ?? null));
        $motherName     = self::cleanOptional($input['motherName'] ?? $input['mother_name'] ?? ($familyDetails['motherName'] ?? null));
        $siblings       = self::cleanOptional($input['siblings'] ?? ($familyDetails['siblings'] ?? null));
        $familyType     = self::cleanOptional($input['familyType'] ?? $input['family_type'] ?? ($familyDetails['familyType'] ?? null));
        if ($familyType !== null && !in_array($familyType, ['nuclear', 'joint', 'other'], true)) {
            $familyType = null;
        }

        $alternatePhone = self::cleanOptional($input['alternatePhone'] ?? $input['alternate_phone'] ?? null);
        $contactEmail   = self::cleanOptional($input['contactEmail'] ?? $input['contact_email'] ?? null);
        if ($contactEmail !== null && !filter_var($contactEmail, FILTER_VALIDATE_EMAIL)) {
            Response::error('Please provide a valid contact email format.', 422, ['field' => 'contactEmail']);
        }

        $bio            = self::cleanOptional($input['bio'] ?? null);
        $height         = self::cleanOptional($input['height'] ?? null);
        $hobbies        = self::cleanOptional($input['hobbies'] ?? null);

        // Check if profile exists for current user
        $checkStmt = $pdo->prepare('SELECT id, status, approved_at FROM profiles WHERE user_id = ? LIMIT 1');
        $checkStmt->execute([$userId]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            // Determine target status:
            // If already approved once (status = approved or approved_at is not null), KEEP approved!
            $isApprovedOnce = ($existing['status'] === 'approved' || !empty($existing['approved_at']));
            $targetStatus = $isApprovedOnce ? 'approved' : $existing['status'];

            $updateStmt = $pdo->prepare('
                UPDATE profiles SET
                    first_name       = ?,
                    middle_name      = ?,
                    last_name        = ?,
                    gender           = ?,
                    date_of_birth    = ?,
                    marital_status   = ?,
                    city             = ?,
                    district         = ?,
                    state            = ?,
                    pincode          = ?,
                    caste            = ?,
                    sub_caste        = ?,
                    gotra            = ?,
                    education        = ?,
                    occupation       = ?,
                    annual_income    = ?,
                    father_name      = ?,
                    mother_name      = ?,
                    siblings         = ?,
                    family_type      = ?,
                    phone            = ?,
                    alternate_phone  = ?,
                    contact_email    = ?,
                    bio              = ?,
                    height           = ?,
                    hobbies          = ?,
                    status           = ?,
                    updated_at       = NOW()
                WHERE id = ? AND user_id = ?
            ');

            $updateStmt->execute([
                $firstName,
                $middleName,
                $lastName,
                $gender,
                $dob,
                $maritalStatus,
                $city,
                $district,
                $state,
                $pincode,
                $caste,
                $subCaste,
                $gotra,
                $education,
                $occupation,
                $annualIncome,
                $fatherName,
                $motherName,
                $siblings,
                $familyType,
                $phone,
                $alternatePhone,
                $contactEmail,
                $bio,
                $height,
                $hobbies,
                $targetStatus,
                (int) $existing['id'],
                $userId
            ]);
        } else {
            // Insert new profile in 'draft' status
            $insertStmt = $pdo->prepare('
                INSERT INTO profiles (
                    user_id, first_name, middle_name, last_name, gender, date_of_birth,
                    marital_status, city, district, state, pincode, caste, sub_caste, gotra,
                    education, occupation, annual_income, father_name, mother_name, siblings,
                    family_type, phone, alternate_phone, contact_email, bio, height, hobbies,
                    status, rejection_reason, created_at, updated_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?,
                    "draft", NULL, NOW(), NOW()
                )
            ');

            $insertStmt->execute([
                $userId,
                $firstName,
                $middleName,
                $lastName,
                $gender,
                $dob,
                $maritalStatus,
                $city,
                $district,
                $state,
                $pincode,
                $caste,
                $subCaste,
                $gotra,
                $education,
                $occupation,
                $annualIncome,
                $fatherName,
                $motherName,
                $siblings,
                $familyType,
                $phone,
                $alternatePhone,
                $contactEmail,
                $bio,
                $height,
                $hobbies
            ]);
        }

        self::getMyProfile();
    }

    /**
     * POST /api/profile/submit
     * Explicitly submit completed matrimonial profile + photo for Admin Review.
     * Enforces strict server-side validation.
     */
    public static function submitForReview(): void {
        $pdo = Database::getConnection();
        $user = AuthMiddleware::requireAuth($pdo);
        $userId = (int) $user['id'];

        $input = self::getJsonBody();

        // Check if profile exists
        $stmt = $pdo->prepare('SELECT * FROM profiles WHERE user_id = ? LIMIT 1');
        $stmt->execute([$userId]);
        $profile = $stmt->fetch();

        if (!$profile) {
            Response::error('Please fill and save your matrimonial profile before submitting for review.', 422);
        }

        // Guard 1: Already-approved profiles cannot be submitted again
        if ($profile['status'] === 'approved' || !empty($profile['approved_at'])) {
            Response::error('Your profile has already been approved and is active.', 400);
        }

        // Guard 2: Already-pending profiles cannot be repeatedly submitted
        if ($profile['status'] === 'pending_approval') {
            Response::error('Your profile is already submitted and pending admin review.', 400);
        }

        // Guard 3: Only draft or rejected profiles can proceed to submission
        if (!in_array($profile['status'], ['draft', 'rejected'], true)) {
            Response::error('Profile submission is not permitted in the current profile status.', 400);
        }

        $profileId = (int) $profile['id'];

        // 1. Strict Validation of required matrimonial profile fields
        $firstName = trim((string) ($profile['first_name'] ?? ''));
        $lastName  = trim((string) ($profile['last_name'] ?? ''));
        $gender    = strtolower(trim((string) ($profile['gender'] ?? '')));
        $dob       = trim((string) ($profile['date_of_birth'] ?? ''));
        $city      = trim((string) ($profile['city'] ?? ''));
        $state     = trim((string) ($profile['state'] ?? ''));
        $caste     = trim((string) ($profile['caste'] ?? ''));
        $education = trim((string) ($profile['education'] ?? ''));
        $occupation= trim((string) ($profile['occupation'] ?? ''));
        $phone     = trim((string) ($profile['phone'] ?? ''));

        if (empty($firstName) || strlen($firstName) > 100) {
            Response::error('Please provide a valid first name before submitting.', 422, ['field' => 'firstName']);
        }
        if (empty($lastName) || strlen($lastName) > 100) {
            Response::error('Please provide a valid last name before submitting.', 422, ['field' => 'lastName']);
        }
        if (!in_array($gender, ['male', 'female', 'other'], true)) {
            Response::error('Please select a valid gender.', 422, ['field' => 'gender']);
        }
        if (empty($dob) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dob)) {
            Response::error('Please provide a valid date of birth.', 422, ['field' => 'dob']);
        }

        // Age 18+ validation
        $dobDate = DateTime::createFromFormat('Y-m-d', $dob);
        $today = new DateTime();
        if (!$dobDate || $dobDate >= $today) {
            Response::error('Date of birth must be a past date.', 422, ['field' => 'dob']);
        }
        $age = $today->diff($dobDate)->y;
        if ($age < 18) {
            Response::error('Candidates must be at least 18 years old to submit a profile.', 422, ['field' => 'dob']);
        }

        // Phone validation (min 10 digits)
        $cleanPhone = preg_replace('/[^\d]/', '', $phone);
        if (empty($phone) || strlen($cleanPhone) < 10) {
            Response::error('Please provide a valid 10-digit primary phone number.', 422, ['field' => 'phone']);
        }

        if (empty($city) || strlen($city) > 100) {
            Response::error('City is required before submitting for review.', 422, ['field' => 'city']);
        }
        if (empty($state) || strlen($state) > 100) {
            Response::error('State is required before submitting for review.', 422, ['field' => 'state']);
        }
        if (empty($caste) || strlen($caste) > 100) {
            Response::error('Caste is required before submitting for review.', 422, ['field' => 'caste']);
        }
        if (empty($education) || strlen($education) > 150) {
            Response::error('Education is required before submitting for review.', 422, ['field' => 'education']);
        }
        if (empty($occupation) || strlen($occupation) > 150) {
            Response::error('Occupation is required before submitting for review.', 422, ['field' => 'occupation']);
        }

        // 2. Strict Check: At least 1 uploaded profile photo must exist
        $photoStmt = $pdo->prepare('SELECT COUNT(*) FROM profile_photos WHERE profile_id = ?');
        $photoStmt->execute([$profileId]);
        $photoCount = (int) $photoStmt->fetchColumn();

        if ($photoCount === 0) {
            Response::error('Please upload at least one profile photo before submitting for admin review.', 422, ['field' => 'photos']);
        }

        // 3. Transition status to pending_approval and clear previous rejection reason
        $updateStmt = $pdo->prepare('
            UPDATE profiles 
            SET status = "pending_approval", rejection_reason = NULL, updated_at = NOW() 
            WHERE id = ? AND user_id = ?
        ');
        $updateStmt->execute([$profileId, $userId]);

        self::getMyProfile();
    }

    /**
     * POST /api/profile/photos
     * Secure profile photo upload using Hostinger local file storage.
     */
    public static function uploadPhoto(): void {
        $pdo = Database::getConnection();
        $user = AuthMiddleware::requireAuth($pdo);
        $userId = $user['id'];

        // Verify user has a profile
        $stmt = $pdo->prepare('SELECT id FROM profiles WHERE user_id = ? LIMIT 1');
        $stmt->execute([$userId]);
        $profile = $stmt->fetch();

        if (!$profile) {
            Response::badRequest('Please fill and save your profile details before uploading photos.');
        }

        $profileId = (int) $profile['id'];

        // Check uploaded file
        $file = $_FILES['photo'] ?? ($_FILES['image'] ?? ($_FILES['file'] ?? null));
        if (!$file || !isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
            $errMsg = 'No image file uploaded or an upload error occurred.';
            if ($file && isset($file['error'])) {
                switch ($file['error']) {
                    case UPLOAD_ERR_INI_SIZE:
                    case UPLOAD_ERR_FORM_SIZE:
                        $errMsg = 'Image size exceeds maximum allowed server upload limit.';
                        break;
                    case UPLOAD_ERR_NO_FILE:
                        $errMsg = 'No image file was selected for upload.';
                        break;
                }
            }
            Response::badRequest($errMsg);
        }

        // Enforce 5MB max file size
        $maxSizeBytes = 5 * 1024 * 1024;
        if ($file['size'] > $maxSizeBytes) {
            Response::badRequest('Image file size exceeds the maximum limit of 5MB.');
        }

        // Server-side MIME validation with finfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $detectedMime = $finfo->file($file['tmp_name']);

        $allowedMimes = [
            'image/jpeg' => 'jpg',
            'image/jpg'  => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp'
        ];

        if (!isset($allowedMimes[$detectedMime])) {
            Response::badRequest('Invalid image format. Only JPEG, PNG, and WebP images are allowed.');
        }

        $extension = $allowedMimes[$detectedMime];

        // Ensure file is a valid image using getimagesize
        $imageDimensions = @getimagesize($file['tmp_name']);
        if ($imageDimensions === false) {
            Response::badRequest('Uploaded file is corrupted or not a valid image.');
        }

        // Generate cryptographically random safe filename
        $safeFilename = 'profile_' . $profileId . '_' . bin2hex(random_bytes(10)) . '.' . $extension;

        // Destination uploads directory
        $uploadsDir = dirname(__DIR__, 2) . '/uploads/photos';
        if (!is_dir($uploadsDir)) {
            @mkdir($uploadsDir, 0755, true);
        }

        // Ensure security .htaccess exists in uploads directory
        $htaccessPath = $uploadsDir . '/.htaccess';
        if (!file_exists($htaccessPath)) {
            $htaccessContent = "# Disable script execution\n<FilesMatch \"(?i)\\.(php|phtml|php3|php4|php5|php7|php8|phps|pl|py|cgi|asp|aspx|sh|bash|exe|bat|cmd|dll)$\">\n    Order Deny,Allow\n    Deny from all\n</FilesMatch>\nOptions -Indexes -ExecCGI\n";
            @file_put_contents($htaccessPath, $htaccessContent);
        }

        $targetPath = $uploadsDir . '/' . $safeFilename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::serverError('Failed to save uploaded photo to storage directory.');
        }

        $publicFilePath = '/uploads/photos/' . $safeFilename;

        // Determine if this photo should be primary
        $countStmt = $pdo->prepare('SELECT COUNT(*) FROM profile_photos WHERE profile_id = ?');
        $countStmt->execute([$profileId]);
        $existingPhotosCount = (int) $countStmt->fetchColumn();

        $requestedPrimary = isset($_POST['is_primary']) && ($_POST['is_primary'] === '1' || $_POST['is_primary'] === 'true' || $_POST['is_primary'] === 1);
        $isPrimary = ($existingPhotosCount === 0 || $requestedPrimary) ? 1 : 0;

        if ($isPrimary === 1 && $existingPhotosCount > 0) {
            $resetStmt = $pdo->prepare('UPDATE profile_photos SET is_primary = 0 WHERE profile_id = ?');
            $resetStmt->execute([$profileId]);
        }

        // Insert record
        $insertPhotoStmt = $pdo->prepare('
            INSERT INTO profile_photos (profile_id, file_path, is_primary, created_at)
            VALUES (?, ?, ?, NOW())
        ');
        $insertPhotoStmt->execute([$profileId, $publicFilePath, $isPrimary]);
        $photoId = (int) $pdo->lastInsertId();

        Response::success([
            'id'         => $photoId,
            'file_path'  => $publicFilePath,
            'filePath'   => $publicFilePath,
            'is_primary' => (bool) $isPrimary,
            'isPrimary'  => (bool) $isPrimary,
            'created_at' => date('Y-m-d H:i:s')
        ], 'Profile photo uploaded successfully');
    }

    /**
     * DELETE /api/profile/photos/{id}
     * Delete an uploaded photo owned by the logged-in user.
     */
    public static function deletePhoto(int $photoId): void {
        $pdo = Database::getConnection();
        $user = AuthMiddleware::requireAuth($pdo);
        $userId = $user['id'];

        if ($photoId <= 0) {
            Response::badRequest('Invalid photo ID.');
        }

        // Verify photo ownership
        $stmt = $pdo->prepare('
            SELECT ph.id, ph.file_path, ph.is_primary, ph.profile_id
            FROM profile_photos ph
            JOIN profiles p ON p.id = ph.profile_id
            WHERE ph.id = ? AND p.user_id = ?
            LIMIT 1
        ');
        $stmt->execute([$photoId, $userId]);
        $photo = $stmt->fetch();

        if (!$photo) {
            Response::notFound('Photo not found or permission denied.');
        }

        $profileId = (int) $photo['profile_id'];
        $wasPrimary = (int) $photo['is_primary'] === 1;

        // Delete from database
        $deleteStmt = $pdo->prepare('DELETE FROM profile_photos WHERE id = ?');
        $deleteStmt->execute([$photoId]);

        // Delete physical file safely
        $baseUploadsDir = realpath(dirname(__DIR__, 2) . '/uploads/photos');
        $relPath = ltrim($photo['file_path'], '/');
        $fullFilePath = realpath(dirname(__DIR__, 2) . '/' . $relPath);

        if ($fullFilePath && $baseUploadsDir && strpos($fullFilePath, $baseUploadsDir) === 0 && file_exists($fullFilePath)) {
            @unlink($fullFilePath);
        }

        // If deleted photo was primary, promote newest remaining photo
        if ($wasPrimary) {
            $promoteStmt = $pdo->prepare('
                UPDATE profile_photos
                SET is_primary = 1
                WHERE profile_id = ?
                ORDER BY id DESC
                LIMIT 1
            ');
            $promoteStmt->execute([$profileId]);
        }

        Response::success(null, 'Photo deleted successfully');
    }

    /**
     * POST /api/profile/photos/{id}/primary
     * Set a photo as the primary profile picture.
     */
    public static function setPrimaryPhoto(int $photoId): void {
        $pdo = Database::getConnection();
        $user = AuthMiddleware::requireAuth($pdo);
        $userId = $user['id'];

        if ($photoId <= 0) {
            Response::badRequest('Invalid photo ID.');
        }

        // Verify ownership
        $stmt = $pdo->prepare('
            SELECT ph.id, ph.profile_id
            FROM profile_photos ph
            JOIN profiles p ON p.id = ph.profile_id
            WHERE ph.id = ? AND p.user_id = ?
            LIMIT 1
        ');
        $stmt->execute([$photoId, $userId]);
        $photo = $stmt->fetch();

        if (!$photo) {
            Response::notFound('Photo not found or permission denied.');
        }

        $profileId = (int) $photo['profile_id'];

        // Reset all photos for profile
        $resetStmt = $pdo->prepare('UPDATE profile_photos SET is_primary = 0 WHERE profile_id = ?');
        $resetStmt->execute([$profileId]);

        // Set this photo as primary
        $setStmt = $pdo->prepare('UPDATE profile_photos SET is_primary = 1 WHERE id = ?');
        $setStmt->execute([$photoId]);

        Response::success(null, 'Primary photo updated successfully');
    }
}
