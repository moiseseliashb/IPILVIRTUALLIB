<?php
declare(strict_types=1);

require_once BASE_PATH . '/config/database.php';

class AuthController {
    public function login(): never {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $email    = trim($body['email']    ?? '');
        $password = trim($body['password'] ?? '');

        if (!$email || !$password) {
            respond(['error' => 'Email e palavra-passe são obrigatórios'], 422);
        }

        $db   = Database::connect();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = ? AND ativo = 1 LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            respond(['error' => 'Credenciais inválidas'], 401);
        }

        // TODO: gerar JWT real com firebase/php-jwt
        $token = base64_encode(json_encode([
            'sub'  => $user['id'],
            'role' => $user['role'],
            'exp'  => time() + (int)($_ENV['JWT_EXPIRY'] ?? 3600),
        ]));

        respond([
            'token' => $token,
            'user'  => [
                'id'    => $user['id'],
                'nome'  => $user['nome'],
                'email' => $user['email'],
                'role'  => $user['role'],
                'turma' => $user['turma'],
            ],
        ]);
    }

    public function refresh(): never {
        respond(['error' => 'Não implementado'], 501);
    }
}
