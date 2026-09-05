<?php
/**
 * Profile endpoints: list (filters + pagination), get, create, update,
 * delete, and bulk import. Mutations require an admin token.
 */
class ProfileController
{
    /** GET /profiles  (query: gender, dobFrom, dobTo, city, education, page, limit) */
    public static function index(): void
    {
        require_auth();
        $pdo = db();

        $where = [];
        $params = [];

        if (!empty($_GET['gender'])) {
            $where[] = 'gender = :gender';
            $params[':gender'] = $_GET['gender'];
        }
        if (!empty($_GET['city'])) {
            $where[] = 'city LIKE :city';
            $params[':city'] = '%' . $_GET['city'] . '%';
        }
        if (!empty($_GET['education'])) {
            $where[] = 'education LIKE :education';
            $params[':education'] = '%' . $_GET['education'] . '%';
        }
        if (!empty($_GET['dobFrom'])) {
            $where[] = 'dob >= :dobFrom';
            $params[':dobFrom'] = $_GET['dobFrom'];
        }
        if (!empty($_GET['dobTo'])) {
            $where[] = 'dob <= :dobTo';
            $params[':dobTo'] = $_GET['dobTo'];
        }

        $whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

        // Total count.
        $countStmt = $pdo->prepare("SELECT COUNT(*) AS c FROM profiles $whereSql");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetch()['c'];

        // Pagination.
        $page = max(1, (int) ($_GET['page'] ?? 1));
        $limit = (int) ($_GET['limit'] ?? 12);
        $limit = max(1, min(100, $limit));
        $offset = ($page - 1) * $limit;
        $totalPages = $total > 0 ? (int) ceil($total / $limit) : 1;

        $sql = "SELECT * FROM profiles $whereSql ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $stmt = $pdo->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $profiles = array_map('profile_public', $stmt->fetchAll());

        json_response([
            'profiles' => $profiles,
            'total' => $total,
            'page' => $page,
            'totalPages' => $totalPages,
        ]);
    }

    /** GET /profiles/{id} */
    public static function show(string $id): void
    {
        require_auth();
        $stmt = db()->prepare('SELECT * FROM profiles WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            json_error('Profile not found', 404);
        }
        json_response(['profile' => profile_public($row)]);
    }

    /** POST /profiles  (admin) */
    public static function store(): void
    {
        require_admin();
        $in = read_json_body();
        $cols = profile_input_to_columns($in);

        $id = AuthController::insertProfile(db(), $cols);

        $stmt = db()->prepare('SELECT * FROM profiles WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['profile' => profile_public($stmt->fetch())], 201);
    }

    /** PUT /profiles/{id}  (admin) */
    public static function update(string $id): void
    {
        require_admin();
        $pdo = db();

        $stmt = $pdo->prepare('SELECT id FROM profiles WHERE id = ?');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            json_error('Profile not found', 404);
        }

        $cols = profile_input_to_columns(read_json_body());
        $assignments = implode(', ', array_map(fn ($c) => "$c = :$c", array_keys($cols)));

        $sql = "UPDATE profiles SET $assignments WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        foreach ($cols as $c => $v) {
            $stmt->bindValue(':' . $c, $v);
        }
        $stmt->bindValue(':id', $id);
        $stmt->execute();

        $stmt = $pdo->prepare('SELECT * FROM profiles WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['profile' => profile_public($stmt->fetch())]);
    }

    /** DELETE /profiles/{id}  (admin) */
    public static function destroy(string $id): void
    {
        require_admin();
        $stmt = db()->prepare('DELETE FROM profiles WHERE id = ?');
        $stmt->execute([$id]);
        json_response(['success' => true]);
    }

    /** POST /profiles/import  (admin) — body: { profiles: [ ... ] } or a raw array */
    public static function import(): void
    {
        require_admin();
        $body = read_json_body();
        $items = $body['profiles'] ?? $body;

        if (!is_array($items) || $items === [] || array_keys($items) !== range(0, count($items) - 1)) {
            json_error('Expected a JSON array of profiles', 422);
        }

        $pdo = db();
        $pdo->beginTransaction();
        $inserted = 0;
        try {
            foreach ($items as $item) {
                if (!is_array($item)) {
                    continue;
                }
                AuthController::insertProfile($pdo, profile_input_to_columns($item));
                $inserted++;
            }
            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            json_error('Import failed', 500);
        }

        json_response(['success' => true, 'imported' => $inserted]);
    }
}
