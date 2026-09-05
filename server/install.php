<?php
/**
 * One-time installer.
 *
 * Creates the database tables and the initial admin user. Run it ONCE from
 * your browser, then DELETE this file.
 *
 *   https://your-domain.com/api/install.php?token=YOUR_INSTALL_TOKEN
 *
 * The token must match `install_token` in config.local.php.
 */

require __DIR__ . '/helpers.php';
require __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

$config = config();
$token = $_GET['token'] ?? '';

if (empty($config['install_token']) || $config['install_token'] === 'CHANGE_ME_INSTALL_TOKEN') {
    http_response_code(500);
    exit("Set a real 'install_token' in config.local.php first.\n");
}
if (!hash_equals($config['install_token'], $token)) {
    http_response_code(403);
    exit("Invalid or missing token.\n");
}

$pdo = db();

// 1. Create tables from schema.sql.
$schema = file_get_contents(__DIR__ . '/sql/schema.sql');
if ($schema === false) {
    http_response_code(500);
    exit("Could not read sql/schema.sql\n");
}
// Run each statement (split on ';' at line ends; comments are harmless).
foreach (array_filter(array_map('trim', explode(';', $schema))) as $stmt) {
    if ($stmt === '' || strpos($stmt, '--') === 0) {
        continue;
    }
    try {
        $pdo->exec($stmt);
    } catch (Throwable $e) {
        // Ignore "already exists" style errors so re-running is safe.
    }
}
echo "Tables ready.\n";

// 2. Create the admin user if it doesn't exist.
$adminEmail = 'admin@kadamvivah.in';
$adminPass = 'admin123';

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$adminEmail]);

if ($stmt->fetch()) {
    echo "Admin user already exists: $adminEmail\n";
} else {
    $stmt = $pdo->prepare(
        'INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES (?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $adminEmail,
        password_hash($adminPass, PASSWORD_DEFAULT),
        'Admin',
        'User',
        'admin',
    ]);
    echo "Admin created:\n  email: $adminEmail\n  password: $adminPass\n";
    echo "  >> Log in and change this password immediately.\n";
}

echo "\nDONE. Now DELETE this install.php file.\n";
