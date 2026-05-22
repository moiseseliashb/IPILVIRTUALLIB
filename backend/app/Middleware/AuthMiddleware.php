<?php
declare(strict_types=1);

class AuthMiddleware {
    public static function authenticate(): array {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!str_starts_with($header, 'Bearer ')) {
            http_response_code(401);
            echo json_encode(['error' => 'Token em falta ou inválido']);
            exit;
        }
        $token = substr($header, 7);
        $payload = json_decode(base64_decode($token, true) ?: '', true);

        if (!is_array($payload) || empty($payload['sub']) || empty($payload['exp']) || (int)$payload['exp'] < time()) {
            http_response_code(401);
            echo json_encode(['error' => 'Sessão expirada ou inválida']);
            exit;
        }

        require_once BASE_PATH . '/config/database.php';
        $db = Database::connect();
        $stmt = $db->prepare('SELECT id, nome, email, role, ativo FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([(int)$payload['sub']]);
        $user = $stmt->fetch();

        if (!$user || (int)$user['ativo'] !== 1) {
            http_response_code(401);
            echo json_encode(['error' => 'Utilizador inativo ou inexistente']);
            exit;
        }

        return $user;
    }

    public static function requireRole(array $user, string ...$roles): void {
        if (!in_array($user['role'], $roles, true)) {
            http_response_code(403);
            echo json_encode(['error' => 'Acesso não autorizado']);
            exit;
        }
    }
}
