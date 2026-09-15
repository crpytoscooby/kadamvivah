<?php
/**
 * KadamVivah - JSON API Response Helper
 */

class Response {
    /**
     * Send structured JSON response and terminate script execution.
     *
     * @param int $statusCode HTTP Status Code
     * @param bool $success Success boolean
     * @param string $message Descriptive message
     * @param mixed|null $data Payload data
     * @param mixed|null $errors Error details if applicable
     */
    public static function send(
        int $statusCode,
        bool $success,
        string $message,
        $data = null,
        $errors = null
    ): void {
        // Clear any previous buffer outputs
        if (ob_get_length()) {
            ob_clean();
        }

        http_response_code($statusCode);
        header('Content-Type: application/json; charset=UTF-8');

        $response = [
            'success'   => $success,
            'message'   => $message,
            'timestamp' => date('c')
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Success response helper (200 OK by default).
     */
    public static function success($data = null, string $message = 'Success', int $statusCode = 200): void {
        self::send($statusCode, true, $message, $data, null);
    }

    /**
     * Created response helper (201 Created).
     */
    public static function created($data = null, string $message = 'Resource created successfully'): void {
        self::send(201, true, $message, $data, null);
    }

    /**
     * Error response helper (400 Bad Request by default).
     */
    public static function error(string $message = 'An error occurred', int $statusCode = 400, $errors = null): void {
        self::send($statusCode, false, $message, null, $errors);
    }

    /**
     * Not found response helper (404 Not Found).
     */
    public static function notFound(string $message = 'Resource not found'): void {
        self::send(404, false, $message, null, null);
    }

    /**
     * Unauthorized response helper (401 Unauthorized).
     */
    public static function unauthorized(string $message = 'Unauthorized access'): void {
        self::send(401, false, $message, null, null);
    }

    /**
     * Forbidden response helper (403 Forbidden).
     */
    public static function forbidden(string $message = 'Access forbidden'): void {
        self::send(403, false, $message, null, null);
    }

    /**
     * Internal server error helper (500 Server Error).
     */
    public static function serverError(string $message = 'Internal server error', $errors = null): void {
        self::send(500, false, $message, null, $errors);
    }
}
