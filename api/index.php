<?php
/**
 * KadamVivah - API Front Controller & Router
 * Hostinger Shared Hosting & Local Development Entry Point
 */

// Centralized error reporting setup
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// Load Core Dependencies
require_once __DIR__ . '/helpers/response.php';
require_once __DIR__ . '/middleware/cors.php';
require_once __DIR__ . '/middleware/auth.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/routes/health.php';
require_once __DIR__ . '/routes/auth.php';
require_once __DIR__ . '/routes/admin.php';
require_once __DIR__ . '/routes/profiles.php';
require_once __DIR__ . '/routes/interests.php';

// Global Exception Handler
set_exception_handler(function (Throwable $e) {
    $isDebug = (getenv('APP_DEBUG') ?: ($_ENV['APP_DEBUG'] ?? 'false')) === 'true';

    $errorDetails = $isDebug ? [
        'exception' => get_class($e),
        'message'   => $e->getMessage(),
        'file'      => $e->getFile(),
        'line'      => $e->getLine(),
        'trace'     => explode("\n", $e->getTraceAsString())
    ] : null;

    Response::serverError('An unexpected server error occurred.', $errorDetails);
});

// Global Error Handler
set_error_handler(function (int $severity, string $message, string $file, int $line) {
    // Ignore deprecated notices on PHP 8.2+
    if ($severity === E_DEPRECATED || $severity === E_USER_DEPRECATED) {
        return true;
    }

    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// Apply CORS & Security Headers
CorsMiddleware::handle();

// Parse Request Method & URI
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';

// Parse path and remove query strings
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'] ?? '/';

// Normalize path: strip script directory or /api prefix if present
$scriptName = dirname($_SERVER['SCRIPT_NAME'] ?? '');
if ($scriptName !== '/' && $scriptName !== '\\' && strpos($path, $scriptName) === 0) {
    $path = substr($path, strlen($scriptName));
}

// Remove leading/trailing slashes and trim
$path = trim($path, '/');

// Standardize route path (e.g. "api/health" -> "health", "api/auth/login" -> "auth/login")
if (strpos($path, 'api/') === 0) {
    $path = substr($path, 4);
}

// -------------------------------------------------------------
// Route Dispatcher
// -------------------------------------------------------------
switch (true) {
    // Health Check: GET /api/health or GET /health
    case ($path === 'health' || $path === 'api/health') && $method === 'GET':
        HealthController::check();
        break;

    // Authentication Endpoints
    // POST /api/auth/check-email
    case ($path === 'auth/check-email' || $path === 'api/auth/check-email') && $method === 'POST':
        AuthController::checkEmail();
        break;

    // POST /api/auth/register
    case ($path === 'auth/register' || $path === 'api/auth/register') && $method === 'POST':
        AuthController::register();
        break;

    // POST /api/auth/login
    case ($path === 'auth/login' || $path === 'api/auth/login') && $method === 'POST':
        AuthController::login();
        break;

    // POST /api/auth/logout
    case ($path === 'auth/logout' || $path === 'api/auth/logout') && $method === 'POST':
        AuthController::logout();
        break;

    // GET /api/auth/me
    case ($path === 'auth/me' || $path === 'api/auth/me') && $method === 'GET':
        AuthController::me();
        break;

    // Admin Endpoints
    // GET /api/admin/profiles/pending
    case ($path === 'admin/profiles/pending' || $path === 'api/admin/profiles/pending') && $method === 'GET':
        AdminController::getPendingProfiles();
        break;

    // POST /api/admin/profiles/{id}/approve
    case preg_match('#^(?:api/)?admin/profiles/(\d+)/approve$#', $path, $matches) && $method === 'POST':
        AdminController::approveProfile((int) $matches[1]);
        break;

    // POST /api/admin/profiles/{id}/reject
    case preg_match('#^(?:api/)?admin/profiles/(\d+)/reject$#', $path, $matches) && $method === 'POST':
        AdminController::rejectProfile((int) $matches[1]);
        break;

    // Current User Profile Endpoints (My Profile)
    // GET /api/profile/me or GET /api/profiles/me
    case ($path === 'profile/me' || $path === 'profiles/me' || $path === 'api/profile/me' || $path === 'api/profiles/me') && $method === 'GET':
        ProfileController::getMyProfile();
        break;

    // PUT/POST /api/profile/me or PUT/POST /api/profiles/me
    case ($path === 'profile/me' || $path === 'profiles/me' || $path === 'api/profile/me' || $path === 'api/profiles/me') && ($method === 'PUT' || $method === 'POST'):
        ProfileController::updateMyProfile();
        break;

    // POST /api/profile/submit or /api/profile/me/submit
    case ($path === 'profile/submit' || $path === 'profiles/submit' || $path === 'profile/me/submit' || $path === 'profiles/me/submit' || $path === 'api/profile/submit' || $path === 'api/profiles/submit') && $method === 'POST':
        ProfileController::submitForReview();
        break;

    // Profile Photo Upload: POST /api/profile/photos or POST /api/profiles/photos
    case ($path === 'profile/photos' || $path === 'profiles/photos' || $path === 'api/profile/photos' || $path === 'api/profiles/photos') && $method === 'POST':
        ProfileController::uploadPhoto();
        break;

    // Profile Photo Set Primary: POST /api/profile/photos/{id}/primary
    case preg_match('#^(?:api/)?(?:profile|profiles)/photos/(\d+)/primary$#', $path, $matches) && $method === 'POST':
        ProfileController::setPrimaryPhoto((int) $matches[1]);
        break;

    // Profile Photo Delete: DELETE /api/profile/photos/{id} or POST /api/profile/photos/{id}/delete
    case preg_match('#^(?:api/)?(?:profile|profiles)/photos/(\d+)$#', $path, $matches) && $method === 'DELETE':
    case preg_match('#^(?:api/)?(?:profile|profiles)/photos/(\d+)/delete$#', $path, $matches) && $method === 'POST':
        ProfileController::deletePhoto((int) $matches[1]);
        break;

    // Browse Profiles Endpoints
    // GET /api/profiles
    case ($path === 'profiles' || $path === 'api/profiles') && $method === 'GET':
        ProfileController::getProfiles();
        break;

    // GET /api/profiles/{id}
    case preg_match('#^(?:api/)?profiles/(\d+)$#', $path, $matches) && $method === 'GET':
        ProfileController::getProfileById((int) $matches[1]);
        break;

    // Interest & Match Requests Endpoints
    // POST /api/interests (Send interest)
    case ($path === 'interests' || $path === 'api/interests') && $method === 'POST':
        InterestController::send();
        break;

    // GET /api/interests/received (List received interests)
    case ($path === 'interests/received' || $path === 'api/interests/received') && $method === 'GET':
        InterestController::getReceived();
        break;

    // GET /api/interests/sent (List sent interests)
    case ($path === 'interests/sent' || $path === 'api/interests/sent') && $method === 'GET':
        InterestController::getSent();
        break;

    // GET /api/interests/matches or GET /api/matches (List accepted mutual matches)
    case ($path === 'interests/matches' || $path === 'api/interests/matches' || $path === 'matches' || $path === 'api/matches') && $method === 'GET':
        InterestController::getMatches();
        break;

    // GET /api/interests/counts or /api/interests/count (Badge counts)
    case ($path === 'interests/counts' || $path === 'interests/count' || $path === 'api/interests/counts' || $path === 'api/interests/count') && $method === 'GET':
        InterestController::getCounts();
        break;

    // GET /api/interests/status/{targetProfileId} (Status between logged-in user and target)
    case preg_match('#^(?:api/)?interests/status/(\d+)$#', $path, $matches) && $method === 'GET':
        InterestController::getStatus((int) $matches[1]);
        break;

    // POST /api/interests/{id}/accept (Accept received interest)
    case preg_match('#^(?:api/)?interests/(\d+)/accept$#', $path, $matches) && $method === 'POST':
        InterestController::accept((int) $matches[1]);
        break;

    // POST /api/interests/{id}/reject or /decline (Decline received interest)
    case preg_match('#^(?:api/)?interests/(\d+)/(?:reject|decline)$#', $path, $matches) && $method === 'POST':
        InterestController::reject((int) $matches[1]);
        break;

    // Root API Info: GET /api or GET /
    case ($path === '' || $path === 'api') && $method === 'GET':
        Response::success([
            'service' => 'KadamVivah REST API',
            'version' => '1.0.0',
            'status'  => 'online',
            'endpoints' => [
                'health'                 => 'GET /api/health',
                'auth_register'          => 'POST /api/auth/register',
                'auth_login'             => 'POST /api/auth/login',
                'auth_logout'            => 'POST /api/auth/logout',
                'auth_me'                => 'GET /api/auth/me',
                'admin_pending_profiles' => 'GET /api/admin/profiles/pending',
                'admin_approve_profile'  => 'POST /api/admin/profiles/{id}/approve',
                'admin_reject_profile'   => 'POST /api/admin/profiles/{id}/reject',
                'browse_profiles'        => 'GET /api/profiles',
                'view_profile'           => 'GET /api/profiles/{id}',
                'my_profile_get'         => 'GET /api/profile/me',
                'my_profile_update'      => 'PUT /api/profile/me',
                'photo_upload'           => 'POST /api/profile/photos',
                'photo_delete'           => 'DELETE /api/profile/photos/{id}',
                'photo_set_primary'      => 'POST /api/profile/photos/{id}/primary',
                'interest_send'          => 'POST /api/interests',
                'interest_received'      => 'GET /api/interests/received',
                'interest_sent'          => 'GET /api/interests/sent',
                'interest_matches'       => 'GET /api/interests/matches',
                'interest_accept'        => 'POST /api/interests/{id}/accept',
                'interest_reject'        => 'POST /api/interests/{id}/reject',
                'interest_status'        => 'GET /api/interests/status/{id}',
                'interest_counts'        => 'GET /api/interests/counts'
            ]
        ], 'Welcome to KadamVivah API');
        break;

    // Default 404
    default:
        Response::notFound("Endpoint not found: [{$method}] /{$path}");
        break;
}
