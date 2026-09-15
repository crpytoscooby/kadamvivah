<?php
/**
 * KadamVivah - Health Check Endpoint Handler
 * Route: GET /api/health or GET /health
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/response.php';

class HealthController {
    public static function check(): void {
        $dbStatus = Database::testConnection();

        $isDebug = (getenv('APP_DEBUG') ?: ($_ENV['APP_DEBUG'] ?? 'false')) === 'true';

        $data = [
            'status'      => 'healthy',
            'environment' => getenv('APP_ENV') ?: ($_ENV['APP_ENV'] ?? 'production'),
            'php_version' => PHP_VERSION,
            'database'    => [
                'status'  => $dbStatus['connected'] ? 'connected' : 'disconnected',
                'version' => $dbStatus['connected'] ? ($dbStatus['version'] ?? null) : null,
                'error'   => !$dbStatus['connected'] ? ($isDebug ? ($dbStatus['error'] ?? null) : 'Database connection unavailable') : null
            ],
            'server_time' => date('Y-m-d H:i:s T')
        ];

        if (!$dbStatus['connected']) {
            Response::send(
                200, // Keep 200 so monitoring sees payload details, or 503 if strict
                true,
                'API running (Database disconnected. Please check database configuration in .env or config/database.php)',
                $data
            );
        }

        Response::success($data, 'KadamVivah API is operational and connected to database');
    }
}
