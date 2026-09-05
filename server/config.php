<?php
/**
 * Loads configuration.
 *
 * Prefers config.local.php (your real, gitignored credentials). Falls back to
 * environment variables so the same code can run on other hosts/CI.
 */

$localFile = __DIR__ . '/config.local.php';
if (file_exists($localFile)) {
    return require $localFile;
}

return [
    'db_host' => getenv('DB_HOST') ?: 'localhost',
    'db_name' => getenv('DB_NAME') ?: '',
    'db_user' => getenv('DB_USER') ?: '',
    'db_pass' => getenv('DB_PASS') ?: '',
    'db_charset' => 'utf8mb4',
    'jwt_secret' => getenv('JWT_SECRET') ?: 'insecure-dev-secret-change-me',
    'jwt_ttl' => (int) (getenv('JWT_TTL') ?: 604800),
    'cors_origins' => array_filter(explode(',', getenv('CORS_ORIGINS') ?: '*')),
    'install_token' => getenv('INSTALL_TOKEN') ?: '',
];
