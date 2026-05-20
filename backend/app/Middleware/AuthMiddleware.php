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
        // TODO: validar JWT com biblioteca (e.g. firebase/php-jwt)
        // Por enquanto retorna placeholder
        return ['id' => 0, 'role' => 'aluno'];
    }

    public static function requireRole(array $user, string ...$roles): void {
        if (!in_array($user['role'], $roles, true)) {
            http_response_code(403);
            echo json_encode(['error' => 'Acesso não autorizado']);
            exit;
        }
    }
}
