<?php
/**
 * Shared helpers: JSON I/O, CORS, JWT (HS256), auth guards, profile mapping.
 * Pure PHP — no Composer dependencies, so it runs on Hostinger shared hosting.
 */

function config(): array
{
    static $c = null;
    if ($c === null) {
        $c = require __DIR__ . '/config.php';
    }
    return $c;
}

/* ------------------------------------------------------------------ CORS */

function send_cors_headers(): void
{
    $config = config();
    $allowed = $config['cors_origins'] ?? ['*'];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array('*', $allowed, true)) {
        header('Access-Control-Allow-Origin: *');
    } elseif ($origin && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');
}

/* --------------------------------------------------------------- JSON I/O */

function json_response($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error(string $message, int $status = 400): void
{
    json_response(['message' => $message], $status);
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === '' || $raw === false) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/* ------------------------------------------------------------------- JWT */

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode(array $payload): string
{
    $config = config();
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];

    $payload['iat'] = time();
    $payload['exp'] = time() + (int) $config['jwt_ttl'];

    $segments = [
        base64url_encode(json_encode($header)),
        base64url_encode(json_encode($payload, JSON_UNESCAPED_UNICODE)),
    ];
    $signingInput = implode('.', $segments);
    $signature = hash_hmac('sha256', $signingInput, $config['jwt_secret'], true);
    $segments[] = base64url_encode($signature);

    return implode('.', $segments);
}

function jwt_decode(string $jwt): ?array
{
    $config = config();
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) {
        return null;
    }
    [$h, $p, $s] = $parts;

    $expected = base64url_encode(
        hash_hmac('sha256', "$h.$p", $config['jwt_secret'], true)
    );
    if (!hash_equals($expected, $s)) {
        return null;
    }

    $payload = json_decode(base64url_decode($p), true);
    if (!is_array($payload)) {
        return null;
    }
    if (isset($payload['exp']) && time() >= (int) $payload['exp']) {
        return null;
    }
    return $payload;
}

/* ---------------------------------------------------------------- Auth */

function bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    // Some Apache/LiteSpeed setups expose it here instead:
    if ($header === '' && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? ($headers['authorization'] ?? '');
    }
    if (preg_match('/Bearer\s+(.+)/i', $header, $m)) {
        return trim($m[1]);
    }
    return null;
}

/** Returns the decoded token payload or null if not authenticated. */
function current_auth(): ?array
{
    $token = bearer_token();
    if (!$token) {
        return null;
    }
    return jwt_decode($token);
}

function require_auth(): array
{
    $auth = current_auth();
    if (!$auth) {
        json_error('Unauthorized', 401);
    }
    return $auth;
}

function require_admin(): array
{
    $auth = require_auth();
    if (($auth['role'] ?? '') !== 'admin') {
        json_error('Admin access required', 403);
    }
    return $auth;
}

/* ------------------------------------------------------- Serialization */

/** Shape a DB user row into the public user object the frontend expects. */
function user_public(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'email' => $row['email'],
        'firstName' => $row['first_name'],
        'lastName' => $row['last_name'],
        'role' => $row['role'],
        'mustChangePassword' => (bool) ($row['must_change_password'] ?? false),
    ];
}

/** Shape a DB profile row into the JSON object the frontend expects. */
function profile_public(array $row): array
{
    $photos = [];
    if (!empty($row['photos'])) {
        $decoded = json_decode($row['photos'], true);
        if (is_array($decoded)) {
            $photos = $decoded;
        }
    }

    return [
        'id' => (string) $row['id'],
        'userId' => isset($row['user_id']) && $row['user_id'] !== null
            ? (string) $row['user_id'] : null,
        'firstName' => $row['first_name'],
        'middleName' => $row['middle_name'],
        'lastName' => $row['last_name'],
        'email' => $row['email'],
        'phone' => $row['phone'],
        'dob' => $row['dob'],
        'gender' => $row['gender'],
        'city' => $row['city'],
        'state' => $row['state'],
        'pincode' => $row['pincode'],
        'caste' => $row['caste'],
        'subCaste' => $row['sub_caste'],
        'education' => $row['education'],
        'occupation' => $row['occupation'],
        'annualIncome' => $row['annual_income'],
        'familyDetails' => [
            'fatherName' => $row['father_name'],
            'motherName' => $row['mother_name'],
            'siblings' => $row['siblings'],
        ],
        'bio' => $row['bio'],
        'photos' => $photos,
        'createdAt' => $row['created_at'],
    ];
}

/**
 * Map an incoming (camelCase, possibly nested) profile payload to the flat
 * snake_case columns used by the DB. Returns [column => value].
 */
function profile_input_to_columns(array $in): array
{
    $family = $in['familyDetails'] ?? [];

    $photos = $in['photos'] ?? [];
    if (!is_array($photos)) {
        $photos = [];
    }

    return [
        'first_name' => (string) ($in['firstName'] ?? ''),
        'middle_name' => (string) ($in['middleName'] ?? ''),
        'last_name' => (string) ($in['lastName'] ?? ''),
        'email' => (string) ($in['email'] ?? ''),
        'phone' => (string) ($in['phone'] ?? ''),
        'dob' => !empty($in['dob']) ? (string) $in['dob'] : null,
        'gender' => !empty($in['gender']) ? (string) $in['gender'] : null,
        'city' => (string) ($in['city'] ?? ''),
        'state' => (string) ($in['state'] ?? ''),
        'pincode' => (string) ($in['pincode'] ?? ''),
        'caste' => (string) ($in['caste'] ?? ''),
        'sub_caste' => (string) ($in['subCaste'] ?? ''),
        'education' => (string) ($in['education'] ?? ''),
        'occupation' => (string) ($in['occupation'] ?? ''),
        'annual_income' => (string) ($in['annualIncome'] ?? ''),
        'father_name' => (string) ($family['fatherName'] ?? ($in['fatherName'] ?? '')),
        'mother_name' => (string) ($family['motherName'] ?? ($in['motherName'] ?? '')),
        'siblings' => (string) ($family['siblings'] ?? ($in['siblings'] ?? '')),
        'bio' => (string) ($in['bio'] ?? ''),
        'photos' => json_encode(array_values($photos)),
    ];
}
