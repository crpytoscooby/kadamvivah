<?php
/**
 * KadamVivah - Admin Controller
 * Handles administrative actions: profile approval, rejection, and review.
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../middleware/auth.php';

class AdminController {
    /**
     * GET /api/admin/profiles/pending
     * Retrieve all profiles awaiting admin review/approval.
     */
    public static function getPendingProfiles(): void {
        $pdo = Database::getConnection();
        AuthMiddleware::requireAdmin($pdo);

        $stmt = $pdo->prepare('
            SELECT 
                p.id,
                p.user_id,
                u.email AS user_email,
                u.account_status,
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
                p.father_name,
                p.mother_name,
                p.siblings,
                p.family_type,
                p.phone,
                p.alternate_phone,
                p.contact_email,
                p.bio,
                p.height,
                p.hobbies,
                p.status,
                p.rejection_reason,
                p.approved_at,
                p.created_at,
                p.updated_at
            FROM profiles p
            JOIN users u ON u.id = p.user_id
            WHERE p.status = "pending_approval"
            ORDER BY p.updated_at ASC, p.id ASC
        ');
        $stmt->execute();
        $profiles = $stmt->fetchAll();

        // Fetch photos for each pending profile
        $formatted = [];
        foreach ($profiles as $row) {
            $profileId = (int) $row['id'];
            $photoStmt = $pdo->prepare('
                SELECT file_path, is_primary 
                FROM profile_photos 
                WHERE profile_id = ? 
                ORDER BY is_primary DESC, id ASC
            ');
            $photoStmt->execute([$profileId]);
            $photoRows = $photoStmt->fetchAll();

            $photos = [];
            $primaryPhoto = null;
            foreach ($photoRows as $pr) {
                $photos[] = $pr['file_path'];
                if ((int) $pr['is_primary'] === 1 && $primaryPhoto === null) {
                    $primaryPhoto = $pr['file_path'];
                }
            }
            if ($primaryPhoto === null && count($photos) > 0) {
                $primaryPhoto = $photos[0];
            }

            $row['id'] = $profileId;
            $row['user_id'] = (int) $row['user_id'];
            $row['primary_photo'] = $primaryPhoto;
            $row['photos'] = $photos;
            $row['photos_count'] = count($photos);
            $formatted[] = $row;
        }

        Response::success([
            'profiles' => $formatted,
            'count'    => count($formatted)
        ], 'Pending profiles retrieved successfully');
    }

    /**
     * POST /api/admin/profiles/{id}/approve
     * Approve a pending profile.
     */
    public static function approveProfile(int $profileId): void {
        $pdo = Database::getConnection();
        AuthMiddleware::requireAdmin($pdo);

        if ($profileId <= 0) {
            Response::error('Invalid profile ID provided.', 422);
        }

        // Verify profile exists
        $checkStmt = $pdo->prepare('SELECT id, status, first_name, last_name FROM profiles WHERE id = ? LIMIT 1');
        $checkStmt->execute([$profileId]);
        $profile = $checkStmt->fetch();

        if (!$profile) {
            Response::notFound('Profile not found.');
        }

        // Only profiles in pending_approval status can be approved
        if ($profile['status'] !== 'pending_approval') {
            Response::error('Only pending profiles can be moderated through this queue.', 400);
        }

        // Update status to approved and record approved_at conditionally (atomic against race conditions)
        $updateStmt = $pdo->prepare('
            UPDATE profiles 
            SET status = "approved", approved_at = NOW(), rejection_reason = NULL, updated_at = NOW() 
            WHERE id = ? AND status = "pending_approval"
        ');
        $updateStmt->execute([$profileId]);

        if ($updateStmt->rowCount() === 0) {
            Response::error('Profile is no longer pending approval.', 400);
        }

        Response::success([
            'id'     => $profileId,
            'status' => 'approved'
        ], 'Profile has been approved successfully.');
    }

    /**
     * POST /api/admin/profiles/{id}/reject
     * Reject a profile with a specified reason.
     */
    public static function rejectProfile(int $profileId): void {
        $pdo = Database::getConnection();
        AuthMiddleware::requireAdmin($pdo);

        if ($profileId <= 0) {
            Response::error('Invalid profile ID provided.', 422);
        }

        $input = self::getJsonBody();
        $rawReason = $input['rejection_reason'] ?? $input['reason'] ?? '';
        $rejectionReason = trim((string) $rawReason);

        if (empty($rejectionReason)) {
            Response::error('Please provide a reason for rejecting the profile.', 422, ['field' => 'rejection_reason']);
        }

        if (strlen($rejectionReason) > 1000) {
            Response::error('Rejection reason must not exceed 1000 characters.', 422, ['field' => 'rejection_reason']);
        }

        // Verify profile exists
        $checkStmt = $pdo->prepare('SELECT id, status FROM profiles WHERE id = ? LIMIT 1');
        $checkStmt->execute([$profileId]);
        $profile = $checkStmt->fetch();

        if (!$profile) {
            Response::notFound('Profile not found.');
        }

        // Only profiles in pending_approval status can be rejected
        if ($profile['status'] !== 'pending_approval') {
            Response::error('Only pending profiles can be moderated through this queue.', 400);
        }

        // Update status to rejected conditionally (atomic against race conditions)
        $updateStmt = $pdo->prepare('
            UPDATE profiles 
            SET status = "rejected", rejection_reason = ?, updated_at = NOW() 
            WHERE id = ? AND status = "pending_approval"
        ');
        $updateStmt->execute([$rejectionReason, $profileId]);

        if ($updateStmt->rowCount() === 0) {
            Response::error('Profile is no longer pending approval.', 400);
        }

        Response::success([
            'id'               => $profileId,
            'status'           => 'rejected',
            'rejection_reason' => $rejectionReason
        ], 'Profile has been marked as rejected.');
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
