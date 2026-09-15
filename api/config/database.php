<?php
/**
 * KadamVivah - Database Configuration and PDO Connection
 *
 * Supports environment variables or default config definitions.
 * Optimized for MySQL/MariaDB on Hostinger Premium Web Hosting.
 */

class Database {
    private static ?PDO $instance = null;

    /**
     * Load environment configuration with fallback to defaults.
     */
    public static function getConfig(): array {
        // Look for .env file in the root or api directory if present
        self::loadEnvFile(__DIR__ . '/../../.env');
        self::loadEnvFile(__DIR__ . '/../.env');

        return [
            'host'     => getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? 'localhost'),
            'port'     => getenv('DB_PORT') ?: ($_ENV['DB_PORT'] ?? '3306'),
            'dbname'   => getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? 'kadamvivah'),
            'user'     => getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? 'root'),
            'password' => getenv('DB_PASS') !== false ? getenv('DB_PASS') : ($_ENV['DB_PASS'] ?? ''),
            'charset'  => 'utf8mb4'
        ];
    }

    /**
     * Get singleton PDO connection instance.
     *
     * @throws PDOException If connection fails
     * @return PDO
     */
    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $config = self::getConfig();

            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                $config['host'],
                $config['port'],
                $config['dbname'],
                $config['charset']
            );

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];

            self::$instance = new PDO($dsn, $config['user'], $config['password'], $options);
        }

        return self::$instance;
    }

    /**
     * Helper to test database connectivity without throwing unhandled exceptions.
     */
    public static function testConnection(): array {
        try {
            $pdo = self::getConnection();
            $version = $pdo->query('SELECT VERSION() AS version')->fetch();
            return [
                'connected' => true,
                'version'   => $version['version'] ?? 'Unknown'
            ];
        } catch (Throwable $e) {
            return [
                'connected' => false,
                'error'     => $e->getMessage()
            ];
        }
    }

    /**
     * Lightweight .env parser for shared hosting environments without composer.
     */
    private static function loadEnvFile(string $filePath): void {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            return;
        }

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || str_starts_with($line, '#')) {
                continue;
            }

            if (strpos($line, '=') !== false) {
                [$key, $value] = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);

                // Strip quotes if present
                if (preg_match('/^"(.+)"$/', $value, $matches) || preg_match("/^'(.+)'$/", $value, $matches)) {
                    $value = $matches[1];
                }

                if (!getenv($key)) {
                    putenv("{$key}={$value}");
                    $_ENV[$key] = $value;
                }
            }
        }
    }
}
