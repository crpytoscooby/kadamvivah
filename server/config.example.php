<?php
/**
 * KadamVivah backend configuration (EXAMPLE).
 *
 * Copy this file to `config.local.php` and fill in your Hostinger MySQL
 * credentials. `config.local.php` is gitignored so your secrets are never
 * committed.
 *
 * In hPanel: Databases → MySQL Databases shows the database name, username
 * and host. The password is the one you set when creating the DB user.
 */

return [
    // --- Database (Hostinger MySQL) ---
    'db_host' => 'localhost',              // usually 'localhost' on Hostinger
    'db_name' => 'u000000000_kadamvivah',  // your database name
    'db_user' => 'u000000000_kadam',       // your database user
    'db_pass' => 'CHANGE_ME',              // your database password
    'db_charset' => 'utf8mb4',

    // --- Auth ---
    // Use a long random string. Generate one with: openssl rand -hex 32
    'jwt_secret' => 'CHANGE_ME_TO_A_LONG_RANDOM_SECRET',
    'jwt_ttl'    => 60 * 60 * 24 * 7,      // token lifetime in seconds (7 days)

    // --- CORS ---
    // The origin(s) allowed to call this API (your frontend URL).
    // Use ['*'] only for quick testing; set your real domain in production.
    'cors_origins' => ['*'],

    // --- Installer ---
    // Secret token required to run install.php (then delete install.php).
    'install_token' => 'CHANGE_ME_INSTALL_TOKEN',
];
