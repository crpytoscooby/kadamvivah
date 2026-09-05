<?php
/**
 * Auth endpoints: register, login, change-password.
 */
class AuthController
{
    /** POST /auth/register */
    public static function register(): void
    {
        $in = read_json_body();

        $email = strtolower(trim($in['email'] ?? ''));
        $password = (string) ($in['password'] ?? '');
        $firstName = trim($in['firstName'] ?? '');
        $lastName = trim($in['lastName'] ?? '');

        if ($email === '' || $password === '') {
            json_error('Email and password are required', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            json_error('Please enter a valid email address', 422);
        }
        if (strlen($password) < 6) {
            json_error('Password must be at least 6 characters', 422);
        }

        $pdo = db();

        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            json_error('An account with this email already exists', 409);
        }

        $pdo->beginTransaction();
        try {
            // Create the account.
            $stmt = $pdo->prepare(
                'INSERT INTO users (email, password_hash, first_name, last_name, role)
                 VALUES (?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $email,
                password_hash($password, PASSWORD_DEFAULT),
                $firstName,
                $lastName,
                'user',
            ]);
            $userId = (int) $pdo->lastInsertId();

            // Create the matching profile (never stores the password).
            $cols = profile_input_to_columns($in);
            if ($cols['email'] === '') {
                $cols['email'] = $email;
            }
            $cols['user_id'] = $userId;

            self::insertProfile($pdo, $cols);

            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            json_error('Registration failed', 500);
        }

        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        $public = user_public($user);
        $token = jwt_encode(['sub' => $user['id'], 'role' => $user['role'], 'email' => $user['email']]);

        json_response(['token' => $token, 'user' => $public], 201);
    }

    /** POST /auth/login */
    public static function login(): void
    {
        $in = read_json_body();
        $email = strtolower(trim($in['email'] ?? ''));
        $password = (string) ($in['password'] ?? '');

        if ($email === '' || $password === '') {
            json_error('Please enter both email and password', 422);
        }

        $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            json_error('Invalid email or password', 401);
        }

        $public = user_public($user);
        $token = jwt_encode(['sub' => $user['id'], 'role' => $user['role'], 'email' => $user['email']]);

        json_response(['token' => $token, 'user' => $public]);
    }

    /** POST /auth/change-password */
    public static function changePassword(): void
    {
        $auth = require_auth();
        $in = read_json_body();

        $old = (string) ($in['oldPassword'] ?? '');
        $new = (string) ($in['newPassword'] ?? '');
        $confirm = (string) ($in['confirmPassword'] ?? '');

        if ($old === '' || $new === '' || $confirm === '') {
            json_error('All password fields are required', 422);
        }
        if ($new !== $confirm) {
            json_error('New passwords do not match', 422);
        }
        if (strlen($new) < 6) {
            json_error('New password must be at least 6 characters', 422);
        }

        $pdo = db();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$auth['sub']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($old, $user['password_hash'])) {
            json_error('Current password is incorrect', 401);
        }

        $stmt = $pdo->prepare(
            'UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?'
        );
        $stmt->execute([password_hash($new, PASSWORD_DEFAULT), $user['id']]);

        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$user['id']]);
        $updated = $stmt->fetch();

        $public = user_public($updated);
        $token = jwt_encode(['sub' => $updated['id'], 'role' => $updated['role'], 'email' => $updated['email']]);

        json_response(['token' => $token, 'user' => $public]);
    }

    /** Shared INSERT for a profile column map. Returns the new id. */
    public static function insertProfile(PDO $pdo, array $cols): int
    {
        $columns = array_keys($cols);
        $placeholders = array_map(fn ($c) => ':' . $c, $columns);
        $sql = 'INSERT INTO profiles (' . implode(', ', $columns) . ') VALUES ('
            . implode(', ', $placeholders) . ')';
        $stmt = $pdo->prepare($sql);
        foreach ($cols as $c => $v) {
            $stmt->bindValue(':' . $c, $v);
        }
        $stmt->execute();
        return (int) $pdo->lastInsertId();
    }
}
