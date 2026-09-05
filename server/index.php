<?php
/**
 * Front controller / router for the KadamVivah API.
 *
 * All requests are rewritten here by .htaccess. Routes are matched against the
 * path AFTER this script's directory, so the API works whether it's deployed
 * at the domain root (/) or in a subfolder (e.g. /api).
 *
 * Example (deployed at https://example.com/api):
 *   POST https://example.com/api/auth/login
 */

require __DIR__ . '/helpers.php';
require __DIR__ . '/db.php';
require __DIR__ . '/controllers/AuthController.php';
require __DIR__ . '/controllers/ProfileController.php';

send_cors_headers();

// Preflight.
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Resolve the request path relative to the folder this script lives in.
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
if ($scriptDir !== '/' && $scriptDir !== '' && strpos($uri, $scriptDir) === 0) {
    $uri = substr($uri, strlen($scriptDir));
}
$path = trim($uri, '/');            // e.g. "auth/login" or "profiles/12"
$segments = $path === '' ? [] : explode('/', $path);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Root: simple health check.
if ($segments === [] || $segments === ['index.php']) {
    json_response(['name' => 'KadamVivah API', 'status' => 'ok']);
}

try {
    // ---- Auth ----
    if ($segments[0] === 'auth') {
        $action = $segments[1] ?? '';
        if ($method === 'POST' && $action === 'register') {
            AuthController::register();
        }
        if ($method === 'POST' && $action === 'login') {
            AuthController::login();
        }
        if ($method === 'POST' && $action === 'change-password') {
            AuthController::changePassword();
        }
        json_error('Not found', 404);
    }

    // ---- Profiles ----
    if ($segments[0] === 'profiles') {
        // /profiles/import
        if (($segments[1] ?? '') === 'import') {
            if ($method === 'POST') {
                ProfileController::import();
            }
            json_error('Method not allowed', 405);
        }

        $id = $segments[1] ?? null;

        if ($id === null) {
            if ($method === 'GET') {
                ProfileController::index();
            }
            if ($method === 'POST') {
                ProfileController::store();
            }
            json_error('Method not allowed', 405);
        }

        // /profiles/{id}
        if ($method === 'GET') {
            ProfileController::show($id);
        }
        if ($method === 'PUT') {
            ProfileController::update($id);
        }
        if ($method === 'DELETE') {
            ProfileController::destroy($id);
        }
        json_error('Method not allowed', 405);
    }

    json_error('Not found', 404);
} catch (Throwable $e) {
    json_error('Server error', 500);
}
