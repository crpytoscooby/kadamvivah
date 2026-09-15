<?php
/**
 * KadamVivah - CORS and Security Headers Middleware
 */

class CorsMiddleware {
    /**
     * Handle incoming CORS requests and attach security headers.
     */
    public static function handle(): void {
        $allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
            'https://plum-goat-262355.hostingersite.com',
            'https://www.plum-goat-262355.hostingersite.com',
            'https://kadamvivah.in',
            'https://www.kadamvivah.in'
        ];

        // Retrieve client origin (trimmed)
        $origin = trim((string)($_SERVER['HTTP_ORIGIN'] ?? ''));

        // Dynamic or environment-defined allowed origin (e.g. from .env)
        $envOrigin = getenv('CORS_ORIGIN') ?: ($_ENV['CORS_ORIGIN'] ?? '');
        if ($envOrigin && !in_array($envOrigin, $allowedOrigins, true)) {
            $allowedOrigins[] = trim($envOrigin);
        }

        $isDebug = (getenv('APP_DEBUG') ?: ($_ENV['APP_DEBUG'] ?? 'false')) === 'true';

        // Set CORS headers strictly for permitted origins
        if ($origin && in_array($origin, $allowedOrigins, true)) {
            header("Access-Control-Allow-Origin: {$origin}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token');
            header('Access-Control-Max-Age: 86400');
            header('Vary: Origin');
        } elseif ($isDebug && $origin) {
            // Local debug origin allowance
            header("Access-Control-Allow-Origin: {$origin}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token');
            header('Vary: Origin');
        }

        // Security headers applied to all responses
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');

        // Fast return on OPTIONS preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}
