<?php
/**
 * KadamVivah - Authentication and Authorization Middleware
 * Session-based authentication with HttpOnly cookies for Hostinger shared hosting.
 */

require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/database.php';

class AuthMiddleware {
    /**
     * Start secure session if not already active.
     */
    public static function startSession(): void {
        if (session_status() === PHP_SESSION_NONE) {
            $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
                || (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https')
                || (getenv('APP_ENV') === 'production');

            // 7 days session lifetime
            $cookieLifetime = 86400 * 7;

            ini_set('session.use_strict_mode', '1');
            ini_set('session.use_only_cookies', '1');

            session_set_cookie_params([
                'lifetime' => $cookieLifetime,
                'path'     => '/',
                'domain'   => '',
                'secure'   => $isHttps,
                'httponly' => true,
                'samesite' => 'Lax'
            ]);

            session_name('kadamvivah_session');
            session_start();
        }
    }

    /**
     * Get currently authenticated user with profile status.
     *
     * @param PDO $pdo
     * @return array|null
     */
    public static function getCurrentUser(PDO $pdo): ?array {
        self::startSession();

        $userId = $_SESSION['user_id'] ?? null;
        if (!$userId) {
            return null;
        }

        $stmt = $pdo->prepare('
            SELECT 
                u.id AS user_id,
                u.email,
                u.role,
                u.account_status,
                u.created_at AS user_created_at,
                p.id AS profile_id,
                p.first_name,
                p.last_name,
                p.gender,
                p.city,
                p.status AS profile_status
            FROM users u
            LEFT JOIN profiles p ON p.user_id = u.id
            WHERE u.id = ?
            LIMIT 1
        ');
        $stmt->execute([$userId]);
        $row = $stmt->fetch();

        if (!$row) {
            // User was deleted or ID invalid -> clear session
            self::clearSession();
            return null;
        }

        // Account suspended check
        if ($row['account_status'] === 'suspended') {
            self::clearSession();
            return null;
        }

        $hasProfile = !empty($row['profile_id']);

        return [
            'id'             => (int) $row['user_id'],
            'email'          => $row['email'],
            'role'           => $row['role'],
            'account_status' => $row['account_status'],
            'has_profile'    => $hasProfile,
            'profile_id'     => $hasProfile ? (int) $row['profile_id'] : null,
            'profile_status' => $hasProfile ? $row['profile_status'] : null,
            'first_name'     => $row['first_name'] ?? null,
            'last_name'      => $row['last_name'] ?? null,
            'gender'         => $row['gender'] ?? null,
            'city'           => $row['city'] ?? null,
            'created_at'     => $row['user_created_at']
        ];
    }

    /**
     * Require authenticated session or terminate with 401 Unauthorized.
     *
     * @param PDO $pdo
     * @return array
     */
    public static function requireAuth(PDO $pdo): array {
        $user = self::getCurrentUser($pdo);
        if (!$user) {
            Response::unauthorized('Authentication required. Please log in.');
        }
        return $user;
    }

    /**
     * Require admin role or terminate with 403 Forbidden.
     *
     * @param PDO $pdo
     * @return array
     */
    public static function requireAdmin(PDO $pdo): array {
        $user = self::requireAuth($pdo);
        if ($user['role'] !== 'admin') {
            Response::forbidden('Access denied. Administrator privileges required.');
        }
        return $user;
    }

    /**
     * Destroy session and delete cookie.
     */
    public static function clearSession(): void {
        self::startSession();
        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();
    }
}
