<?php
/**
 * KadamVivah - Database-Backed Rate Limiter for Auth Routes
 * Suitable for Hostinger shared hosting environments.
 */

class RateLimiter {
    /**
     * Get client IP address.
     */
    public static function getClientIp(): string {
        $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] 
            ?? $_SERVER['HTTP_X_FORWARDED_FOR'] 
            ?? $_SERVER['REMOTE_ADDR'] 
            ?? '127.0.0.1';

        // Extract first IP in comma-separated proxy list
        if (strpos($ip, ',') !== false) {
            $parts = explode(',', $ip);
            $ip = trim($parts[0]);
        }

        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '127.0.0.1';
    }

    /**
     * Check and increment attempt count for an action.
     *
     * @param PDO $pdo Active PDO connection
     * @param string $action Action key (e.g., 'login', 'register')
     * @param int $maxAttempts Maximum allowed attempts in window
     * @param int $decaySeconds Window duration in seconds (default 900 = 15 mins)
     * @return bool True if within limit, false if rate limited
     */
    public static function hit(PDO $pdo, string $action, int $maxAttempts = 10, int $decaySeconds = 900): bool {
        $ip = self::getClientIp();

        try {
            // Find existing record
            $stmt = $pdo->prepare('
                SELECT id, attempts, UNIX_TIMESTAMP(last_attempt_at) AS last_attempt_time 
                FROM auth_rate_limits 
                WHERE ip_address = ? AND action = ?
            ');
            $stmt->execute([$ip, $action]);
            $record = $stmt->fetch();

            $now = time();

            if ($record) {
                $lastTime = (int) $record['last_attempt_time'];
                $attempts = (int) $record['attempts'];

                // Window expired -> reset
                if (($now - $lastTime) > $decaySeconds) {
                    $updateStmt = $pdo->prepare('
                        UPDATE auth_rate_limits 
                        SET attempts = 1, last_attempt_at = NOW() 
                        WHERE id = ?
                    ');
                    $updateStmt->execute([$record['id']]);
                    return true;
                }

                // Check limit
                if ($attempts >= $maxAttempts) {
                    return false;
                }

                // Increment
                $updateStmt = $pdo->prepare('
                    UPDATE auth_rate_limits 
                    SET attempts = attempts + 1, last_attempt_at = NOW() 
                    WHERE id = ?
                ');
                $updateStmt->execute([$record['id']]);
                return true;
            } else {
                // Insert new record
                $insertStmt = $pdo->prepare('
                    INSERT INTO auth_rate_limits (ip_address, action, attempts, last_attempt_at) 
                    VALUES (?, ?, 1, NOW())
                ');
                $insertStmt->execute([$ip, $action]);
                return true;
            }
        } catch (Throwable $e) {
            // If rate limits table is not yet created, allow request to avoid breaking auth
            return true;
        }
    }

    /**
     * Reset rate limit attempts upon successful authentication.
     */
    public static function reset(PDO $pdo, string $action): void {
        $ip = self::getClientIp();
        try {
            $stmt = $pdo->prepare('DELETE FROM auth_rate_limits WHERE ip_address = ? AND action = ?');
            $stmt->execute([$ip, $action]);
        } catch (Throwable $e) {
            // Ignore failure
        }
    }
}
