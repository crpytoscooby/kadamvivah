<?php
/**
 * KadamVivah - Interest / Match Request Controller
 * Handles sending, receiving, accepting, rejecting interests, and managing mutual matches.
 * 
 * Strict Privacy & Security Rules:
 * - Only active users with admin-approved profiles can participate in the matching system.
 * - Senders cannot send interest to themselves.
 * - Duplicate active interests between same profiles are blocked.
 * - Contact details (phone, alternate_phone, contact_email) are NEVER exposed unless status = 'accepted'.
 * - Only the designated recipient profile can accept or decline an interest.
 * - An accepted interest cannot be altered or declined through unauthorized requests.
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class InterestController {
    /**
     * POST /api/interests
     * Send interest to an approved profile.
     */
    public static function send(): void {
        $pdo = Database::getConnection();
        $currentUser = AuthMiddleware::requireAuth($pdo);

        // 1. Verify current user profile eligibility
        if (empty($currentUser['has_profile']) || empty($currentUser['profile_id'])) {
            Response::forbidden('You must create a profile before you can send an interest.');
        }

        if (($currentUser['profile_status'] ?? '') !== 'approved') {
            Response::forbidden('Your profile is currently awaiting admin approval. You will be able to send interests once your profile is approved.');
        }

        $senderProfileId = (int) $currentUser['profile_id'];

        // 2. Parse payload
        $input = self::getJsonBody();
        $receiverProfileId = (int) ($input['receiver_profile_id'] ?? $input['target_profile_id'] ?? $input['profile_id'] ?? 0);
        $message = self::cleanOptional($input['message'] ?? null);

        if ($receiverProfileId <= 0) {
            Response::badRequest('Valid target profile ID is required.');
        }

        // 3. Prevent self-interest
        if ($senderProfileId === $receiverProfileId) {
            Response::badRequest('You cannot send an interest request to your own profile.');
        }

        // 4. Verify target profile exists, is approved, belongs to an active normal member (u.role = 'user')
        $targetStmt = $pdo->prepare('
            SELECT p.id, p.first_name, p.last_name, p.status, u.account_status, u.role 
            FROM profiles p 
            JOIN users u ON u.id = p.user_id 
            WHERE p.id = ? AND u.role = "user" 
            LIMIT 1
        ');
        $targetStmt->execute([$receiverProfileId]);
        $targetProfile = $targetStmt->fetch();

        if (!$targetProfile || $targetProfile['status'] !== 'approved' || $targetProfile['account_status'] !== 'active') {
            Response::notFound('The target profile is unavailable or has not been approved.');
        }

        // 5. Check existing interest in either direction
        // Case A: Sender -> Receiver already exists
        $checkStmt = $pdo->prepare('
            SELECT id, sender_profile_id, receiver_profile_id, status 
            FROM interests 
            WHERE sender_profile_id = ? AND receiver_profile_id = ?
            LIMIT 1
        ');
        $checkStmt->execute([$senderProfileId, $receiverProfileId]);
        $existingSent = $checkStmt->fetch();

        if ($existingSent) {
            if ($existingSent['status'] === 'pending') {
                Response::error('You have already sent an interest request to this candidate.', 409, [
                    'interest_id' => (int) $existingSent['id'],
                    'status'      => 'pending'
                ]);
            }

            if ($existingSent['status'] === 'accepted') {
                Response::error('You are already matched with this candidate.', 409, [
                    'interest_id' => (int) $existingSent['id'],
                    'status'      => 'accepted'
                ]);
            }

            // If previously declined, allow re-sending by updating to pending
            $updateStmt = $pdo->prepare('
                UPDATE interests 
                SET status = "pending", message = ?, updated_at = NOW() 
                WHERE id = ?
            ');
            $updateStmt->execute([$message, $existingSent['id']]);

            Response::success([
                'interest_id' => (int) $existingSent['id'],
                'status'      => 'pending',
                'message'     => 'Interest request re-sent successfully.'
            ], 'Interest sent successfully');
        }

        // Case B: Receiver -> Sender already sent an interest
        $reverseStmt = $pdo->prepare('
            SELECT id, status 
            FROM interests 
            WHERE sender_profile_id = ? AND receiver_profile_id = ?
            LIMIT 1
        ');
        $reverseStmt->execute([$receiverProfileId, $senderProfileId]);
        $existingReceived = $reverseStmt->fetch();

        if ($existingReceived) {
            if ($existingReceived['status'] === 'pending') {
                Response::error('This candidate has already sent you an interest request. You can accept their request.', 409, [
                    'interest_id' => (int) $existingReceived['id'],
                    'direction'   => 'received',
                    'status'      => 'pending'
                ]);
            }

            if ($existingReceived['status'] === 'accepted') {
                Response::error('You are already matched with this candidate.', 409, [
                    'interest_id' => (int) $existingReceived['id'],
                    'status'      => 'accepted'
                ]);
            }
        }

        // 6. Insert new interest record
        $insertStmt = $pdo->prepare('
            INSERT INTO interests (sender_profile_id, receiver_profile_id, status, message, created_at, updated_at) 
            VALUES (?, ?, "pending", ?, NOW(), NOW())
        ');
        $insertStmt->execute([$senderProfileId, $receiverProfileId, $message]);
        $newInterestId = (int) $pdo->lastInsertId();

        Response::success([
            'interest_id' => $newInterestId,
            'status'      => 'pending',
            'receiver'    => [
                'id'         => (int) $targetProfile['id'],
                'first_name' => $targetProfile['first_name'],
                'last_name'  => $targetProfile['last_name']
            ]
        ], 'Interest sent successfully', 201);
    }

    /**
     * GET /api/interests/received
     * List incoming interest requests received by the authenticated user.
     */
    public static function getReceived(): void {
        $pdo = Database::getConnection();
        $currentUser = AuthMiddleware::requireAuth($pdo);

        if (empty($currentUser['has_profile']) || empty($currentUser['profile_id'])) {
            Response::success(['interests' => []], 'No profile created yet.');
        }

        $myProfileId = (int) $currentUser['profile_id'];
        $statusFilter = isset($_GET['status']) ? trim((string) $_GET['status']) : null;

        $where = ['i.receiver_profile_id = ?', 'p.status = "approved"', 'u.account_status = "active"'];
        $params = [$myProfileId];

        if ($statusFilter && in_array($statusFilter, ['pending', 'accepted', 'declined', 'rejected'], true)) {
            $dbStatus = ($statusFilter === 'rejected') ? 'declined' : $statusFilter;
            $where[] = 'i.status = ?';
            $params[] = $dbStatus;
        }

        $whereSql = implode(' AND ', $where);

        $sql = "
            SELECT 
                i.id AS interest_id,
                i.status AS interest_status,
                i.message AS interest_message,
                i.created_at AS interest_created_at,
                i.updated_at AS interest_updated_at,
                p.id AS profile_id,
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
                p.phone,
                p.alternate_phone,
                p.contact_email,
                ph.file_path AS primary_photo
            FROM interests i
            JOIN profiles p ON p.id = i.sender_profile_id
            JOIN users u ON u.id = p.user_id
            LEFT JOIN profile_photos ph ON ph.profile_id = p.id AND ph.is_primary = 1
            WHERE {$whereSql}
            ORDER BY i.created_at DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $interests = array_map(function ($row) {
            $isAccepted = $row['interest_status'] === 'accepted';

            return [
                'id'            => (int) $row['interest_id'],
                'interest_id'   => (int) $row['interest_id'],
                'status'        => $row['interest_status'],
                'message'       => $row['interest_message'],
                'created_at'    => $row['interest_created_at'],
                'updated_at'    => $row['interest_updated_at'],
                'direction'     => 'received',
                'candidate'     => [
                    'id'            => (int) $row['profile_id'],
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
                    'primary_photo' => $row['primary_photo'],
                    'photos'        => $row['primary_photo'] ? [$row['primary_photo']] : []
                ],
                // Contact information unlocked ONLY upon mutual acceptance
                'contact_unlocked' => $isAccepted,
                'contacts' => $isAccepted ? [
                    'phone'           => $row['phone'],
                    'alternate_phone' => $row['alternate_phone'],
                    'contact_email'   => $row['contact_email']
                ] : null
            ];
        }, $rows);

        Response::success(['interests' => $interests], 'Received interests retrieved');
    }

    /**
     * GET /api/interests/sent
     * List outbound interest requests sent by the authenticated user.
     */
    public static function getSent(): void {
        $pdo = Database::getConnection();
        $currentUser = AuthMiddleware::requireAuth($pdo);

        if (empty($currentUser['has_profile']) || empty($currentUser['profile_id'])) {
            Response::success(['interests' => []], 'No profile created yet.');
        }

        $myProfileId = (int) $currentUser['profile_id'];
        $statusFilter = isset($_GET['status']) ? trim((string) $_GET['status']) : null;

        $where = ['i.sender_profile_id = ?', 'p.status = "approved"', 'u.account_status = "active"'];
        $params = [$myProfileId];

        if ($statusFilter && in_array($statusFilter, ['pending', 'accepted', 'declined', 'rejected'], true)) {
            $dbStatus = ($statusFilter === 'rejected') ? 'declined' : $statusFilter;
            $where[] = 'i.status = ?';
            $params[] = $dbStatus;
        }

        $whereSql = implode(' AND ', $where);

        $sql = "
            SELECT 
                i.id AS interest_id,
                i.status AS interest_status,
                i.message AS interest_message,
                i.created_at AS interest_created_at,
                i.updated_at AS interest_updated_at,
                p.id AS profile_id,
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
                p.phone,
                p.alternate_phone,
                p.contact_email,
                ph.file_path AS primary_photo
            FROM interests i
            JOIN profiles p ON p.id = i.receiver_profile_id
            JOIN users u ON u.id = p.user_id
            LEFT JOIN profile_photos ph ON ph.profile_id = p.id AND ph.is_primary = 1
            WHERE {$whereSql}
            ORDER BY i.created_at DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $interests = array_map(function ($row) {
            $isAccepted = $row['interest_status'] === 'accepted';

            return [
                'id'            => (int) $row['interest_id'],
                'interest_id'   => (int) $row['interest_id'],
                'status'        => $row['interest_status'],
                'message'       => $row['interest_message'],
                'created_at'    => $row['interest_created_at'],
                'updated_at'    => $row['interest_updated_at'],
                'direction'     => 'sent',
                'candidate'     => [
                    'id'            => (int) $row['profile_id'],
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
                    'primary_photo' => $row['primary_photo'],
                    'photos'        => $row['primary_photo'] ? [$row['primary_photo']] : []
                ],
                // Contact information unlocked ONLY upon mutual acceptance
                'contact_unlocked' => $isAccepted,
                'contacts' => $isAccepted ? [
                    'phone'           => $row['phone'],
                    'alternate_phone' => $row['alternate_phone'],
                    'contact_email'   => $row['contact_email']
                ] : null
            ];
        }, $rows);

        Response::success(['interests' => $interests], 'Sent interests retrieved');
    }

    /**
     * GET /api/interests/matches
     * List all mutual accepted connections with unlocked contact details.
     */
    public static function getMatches(): void {
        $pdo = Database::getConnection();
        $currentUser = AuthMiddleware::requireAuth($pdo);

        if (empty($currentUser['has_profile']) || empty($currentUser['profile_id'])) {
            Response::success(['matches' => []], 'No profile created yet.');
        }

        $myProfileId = (int) $currentUser['profile_id'];

        $sql = "
            SELECT 
                i.id AS interest_id,
                i.sender_profile_id,
                i.receiver_profile_id,
                i.status AS interest_status,
                i.created_at AS interest_created_at,
                i.updated_at AS matched_at,
                p.id AS profile_id,
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
                p.phone,
                p.alternate_phone,
                p.contact_email,
                ph.file_path AS primary_photo
            FROM interests i
            JOIN profiles p ON p.id = (
                CASE 
                    WHEN i.sender_profile_id = ? THEN i.receiver_profile_id
                    ELSE i.sender_profile_id
                END
            )
            JOIN users u ON u.id = p.user_id
            LEFT JOIN profile_photos ph ON ph.profile_id = p.id AND ph.is_primary = 1
            WHERE (i.sender_profile_id = ? OR i.receiver_profile_id = ?)
              AND i.status = 'accepted'
              AND p.status = 'approved'
              AND u.account_status = 'active'
            ORDER BY i.updated_at DESC
        ";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$myProfileId, $myProfileId, $myProfileId]);
        $rows = $stmt->fetchAll();

        $matches = array_map(function ($row) use ($myProfileId) {
            $isSender = (int) $row['sender_profile_id'] === $myProfileId;

            return [
                'interest_id'      => (int) $row['interest_id'],
                'matched_at'       => $row['matched_at'],
                'initiated_by_me'  => $isSender,
                'candidate'        => [
                    'id'            => (int) $row['profile_id'],
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
                    'primary_photo' => $row['primary_photo'],
                    'photos'        => $row['primary_photo'] ? [$row['primary_photo']] : []
                ],
                'contact_unlocked' => true,
                'contacts'         => [
                    'phone'           => $row['phone'],
                    'alternate_phone' => $row['alternate_phone'],
                    'contact_email'   => $row['contact_email']
                ]
            ];
        }, $rows);

        Response::success(['matches' => $matches], 'Accepted matches retrieved');
    }

    /**
     * POST /api/interests/{id}/accept
     * Accept a received interest request.
     */
    public static function accept(int $id): void {
        $pdo = Database::getConnection();
        $currentUser = AuthMiddleware::requireAuth($pdo);

        if (empty($currentUser['has_profile']) || empty($currentUser['profile_id'])) {
            Response::forbidden('Profile required to accept interests.');
        }

        if (($currentUser['profile_status'] ?? '') !== 'approved') {
            Response::forbidden('Your profile is pending admin approval.');
        }

        $myProfileId = (int) $currentUser['profile_id'];

        if ($id <= 0) {
            Response::badRequest('Invalid interest ID.');
        }

        // 1. Fetch interest record ensuring it was received by current user
        $stmt = $pdo->prepare('
            SELECT 
                i.id, 
                i.sender_profile_id, 
                i.receiver_profile_id, 
                i.status,
                p.first_name, 
                p.last_name, 
                p.phone, 
                p.alternate_phone, 
                p.contact_email, 
                p.status AS sender_profile_status,
                u.account_status AS sender_account_status
            FROM interests i
            JOIN profiles p ON p.id = i.sender_profile_id
            JOIN users u ON u.id = p.user_id
            WHERE i.id = ? AND i.receiver_profile_id = ?
            LIMIT 1
        ');
        $stmt->execute([$id, $myProfileId]);
        $interest = $stmt->fetch();

        if (!$interest) {
            Response::notFound('Interest request not found or not addressed to your profile.');
        }

        if ($interest['status'] === 'accepted') {
            Response::success([
                'interest_id'      => (int) $interest['id'],
                'status'           => 'accepted',
                'contact_unlocked' => true,
                'contacts'         => [
                    'phone'           => $interest['phone'],
                    'alternate_phone' => $interest['alternate_phone'],
                    'contact_email'   => $interest['contact_email']
                ]
            ], 'Interest is already accepted.');
        }

        // 2. Verify sender is still approved and active
        if ($interest['sender_profile_status'] !== 'approved' || $interest['sender_account_status'] !== 'active') {
            Response::error('The sender profile is no longer active or approved.', 400);
        }

        // 3. Update interest status to 'accepted'
        $updateStmt = $pdo->prepare('
            UPDATE interests 
            SET status = "accepted", updated_at = NOW() 
            WHERE id = ?
        ');
        $updateStmt->execute([$id]);

        $candidateName = "{$interest['first_name']} {$interest['last_name']}";

        Response::success([
            'interest_id'      => (int) $interest['id'],
            'status'           => 'accepted',
            'contact_unlocked' => true,
            'contacts'         => [
                'phone'           => $interest['phone'],
                'alternate_phone' => $interest['alternate_phone'],
                'contact_email'   => $interest['contact_email']
            ]
        ], "Interest from {$candidateName} accepted! Contact details are now unlocked.");
    }

    /**
     * POST /api/interests/{id}/reject (or /decline)
     * Decline/reject a received interest request.
     */
    public static function reject(int $id): void {
        $pdo = Database::getConnection();
        $currentUser = AuthMiddleware::requireAuth($pdo);

        if (empty($currentUser['has_profile']) || empty($currentUser['profile_id'])) {
            Response::forbidden('Profile required to decline interests.');
        }

        $myProfileId = (int) $currentUser['profile_id'];

        if ($id <= 0) {
            Response::badRequest('Invalid interest ID.');
        }

        // 1. Fetch interest record ensuring it was received by current user
        $stmt = $pdo->prepare('
            SELECT id, sender_profile_id, receiver_profile_id, status 
            FROM interests 
            WHERE id = ? AND receiver_profile_id = ?
            LIMIT 1
        ');
        $stmt->execute([$id, $myProfileId]);
        $interest = $stmt->fetch();

        if (!$interest) {
            Response::notFound('Interest request not found or not addressed to your profile.');
        }

        // 2. Prevent changing an already accepted interest
        if ($interest['status'] === 'accepted') {
            Response::error('Cannot decline an interest request that has already been accepted.', 400);
        }

        // 3. Update interest status to 'declined'
        $updateStmt = $pdo->prepare('
            UPDATE interests 
            SET status = "declined", updated_at = NOW() 
            WHERE id = ?
        ');
        $updateStmt->execute([$id]);

        Response::success([
            'interest_id' => (int) $interest['id'],
            'status'      => 'declined'
        ], 'Interest request has been declined.');
    }

    /**
     * GET /api/interests/status/{targetProfileId}
     * Check interest relationship and contact disclosure status between current user and target profile.
     */
    public static function getStatus(int $targetProfileId): void {
        $pdo = Database::getConnection();
        $currentUser = AuthMiddleware::requireAuth($pdo);

        if ($targetProfileId <= 0) {
            Response::badRequest('Invalid profile ID.');
        }

        $myProfileId = (int) ($currentUser['profile_id'] ?? 0);
        $myProfileApproved = ($currentUser['profile_status'] ?? '') === 'approved';

        // Check if viewing own profile
        if ($myProfileId > 0 && $myProfileId === $targetProfileId) {
            Response::success([
                'is_own_profile'   => true,
                'has_interest'     => false,
                'direction'        => null,
                'status'           => null,
                'interest_id'      => null,
                'can_send'         => false,
                'contact_unlocked' => true
            ], 'Own profile status');
        }

        if ($myProfileId <= 0) {
            Response::success([
                'is_own_profile'   => false,
                'has_interest'     => false,
                'direction'        => null,
                'status'           => null,
                'interest_id'      => null,
                'can_send'         => false,
                'contact_unlocked' => false,
                'reason'           => 'No profile created'
            ], 'Interest status');
        }

        // Query interest in either direction
        $stmt = $pdo->prepare('
            SELECT 
                i.id, 
                i.sender_profile_id, 
                i.receiver_profile_id, 
                i.status, 
                i.created_at,
                p.phone,
                p.alternate_phone,
                p.contact_email
            FROM interests i
            JOIN profiles p ON p.id = ?
            WHERE (i.sender_profile_id = ? AND i.receiver_profile_id = ?)
               OR (i.sender_profile_id = ? AND i.receiver_profile_id = ?)
            LIMIT 1
        ');
        $stmt->execute([$targetProfileId, $myProfileId, $targetProfileId, $targetProfileId, $myProfileId]);
        $interest = $stmt->fetch();

        if (!$interest) {
            Response::success([
                'is_own_profile'   => false,
                'has_interest'     => false,
                'direction'        => null,
                'status'           => null,
                'interest_id'      => null,
                'can_send'         => $myProfileApproved,
                'contact_unlocked' => false
            ], 'No interest between profiles');
        }

        $isSender = (int) $interest['sender_profile_id'] === $myProfileId;
        $direction = $isSender ? 'sent' : 'received';
        $status = $interest['status'];
        $isAccepted = $status === 'accepted';

        Response::success([
            'is_own_profile'   => false,
            'has_interest'     => true,
            'direction'        => $direction,
            'status'           => $status,
            'interest_id'      => (int) $interest['id'],
            'can_send'         => false,
            'contact_unlocked' => $isAccepted,
            'contacts'         => $isAccepted ? [
                'phone'           => $interest['phone'],
                'alternate_phone' => $interest['alternate_phone'],
                'contact_email'   => $interest['contact_email']
            ] : null
        ], 'Interest status retrieved');
    }

    /**
     * GET /api/interests/counts
     * Get pending received interests count and matches count for notifications/badges.
     */
    public static function getCounts(): void {
        $pdo = Database::getConnection();
        $currentUser = AuthMiddleware::requireAuth($pdo);

        if (empty($currentUser['has_profile']) || empty($currentUser['profile_id'])) {
            Response::success([
                'pending_received' => 0,
                'matches'          => 0,
                'sent_pending'     => 0
            ], 'Counts retrieved');
        }

        $myProfileId = (int) $currentUser['profile_id'];

        // 1. Pending received count
        $receivedStmt = $pdo->prepare('
            SELECT COUNT(i.id) 
            FROM interests i
            JOIN profiles p ON p.id = i.sender_profile_id
            JOIN users u ON u.id = p.user_id
            WHERE i.receiver_profile_id = ? 
              AND i.status = "pending"
              AND p.status = "approved"
              AND u.account_status = "active"
        ');
        $receivedStmt->execute([$myProfileId]);
        $pendingReceived = (int) ($receivedStmt->fetchColumn() ?: 0);

        // 2. Mutual accepted matches count
        $matchesStmt = $pdo->prepare('
            SELECT COUNT(i.id) 
            FROM interests i
            JOIN profiles p ON p.id = (
                CASE 
                    WHEN i.sender_profile_id = ? THEN i.receiver_profile_id
                    ELSE i.sender_profile_id
                END
            )
            JOIN users u ON u.id = p.user_id
            WHERE (i.sender_profile_id = ? OR i.receiver_profile_id = ?)
              AND i.status = "accepted"
              AND p.status = "approved"
              AND u.account_status = "active"
        ');
        $matchesStmt->execute([$myProfileId, $myProfileId, $myProfileId]);
        $matchesCount = (int) ($matchesStmt->fetchColumn() ?: 0);

        // 3. Sent pending count
        $sentStmt = $pdo->prepare('
            SELECT COUNT(i.id) 
            FROM interests i
            WHERE i.sender_profile_id = ? AND i.status = "pending"
        ');
        $sentStmt->execute([$myProfileId]);
        $sentPending = (int) ($sentStmt->fetchColumn() ?: 0);

        Response::success([
            'pending_received' => $pendingReceived,
            'matches'          => $matchesCount,
            'sent_pending'     => $sentPending
        ], 'Counts retrieved');
    }

    /**
     * Helper to clean optional string fields.
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
