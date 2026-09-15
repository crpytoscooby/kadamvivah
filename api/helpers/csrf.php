<?php
/**
 * KadamVivah - Lightweight CSRF Protection Helper
 * Provides session-bound CSRF token generation and validation.
 */

require_once __DIR__ . '/../middleware/auth.php';

class CsrfHelper {
    /**
     * Generate or retrieve active session CSRF token.
     */
    public static function getToken(): string {
        AuthMiddleware::startSession();
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * Validate incoming CSRF token from header (X-CSRF-Token) or argument.
     *
     * @param string|null $token
     * @return bool
     */
    public static function validate(?string $token = null): bool {
        AuthMiddleware::startSession();
        $sessionToken = $_SESSION['csrf_token'] ?? '';
        if (empty($sessionToken)) {
            return false;
        }

        $headerToken = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
        $submittedToken = $token ?? $headerToken;

        return is_string($submittedToken) && hash_equals($sessionToken, $submittedToken);
    }
}
