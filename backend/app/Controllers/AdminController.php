<?php
declare(strict_types=1);

require_once BASE_PATH . '/config/database.php';

class AdminController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::connect();
    }

    public function stats(): never {
        $totalUsers = (int)$this->db->query('SELECT COUNT(*) FROM users')->fetchColumn();
        $newUsers = (int)$this->db->query("SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)")->fetchColumn();
        $activeUsers = $this->hasColumn('users', 'last_login')
            ? (int)$this->db->query("SELECT COUNT(*) FROM users WHERE last_login >= DATE_SUB(NOW(), INTERVAL 7 DAY)")->fetchColumn()
            : 0;

        respond([
            'metrics' => [
                'totalUsers' => $totalUsers,
                'totalFavorites' => $this->countFavorites(),
                'newUsers30Days' => $newUsers,
                'activeUsers7Days' => $activeUsers,
            ],
            'userGrowth' => $this->userGrowth(),
            'favoriteCategories' => $this->favoriteCategories(),
            'recentUsers' => $this->recentUsers(5),
        ]);
    }

    public function listUsers(): never {
        $search = trim($_GET['search'] ?? '');
        $status = $_GET['status'] ?? 'all';
        $page = max(1, (int)($_GET['page'] ?? 1));
        $perPage = min(50, max(5, (int)($_GET['perPage'] ?? 10)));
        $offset = ($page - 1) * $perPage;

        $where = [];
        $params = [];

        if ($search !== '') {
            $where[] = '(nome LIKE ? OR email LIKE ?)';
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }

        if ($status === 'active') {
            $where[] = 'ativo = 1';
        } elseif ($status === 'inactive') {
            $where[] = 'ativo = 0';
        }

        $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $lastLoginSelect = $this->hasColumn('users', 'last_login') ? 'last_login' : 'NULL AS last_login';

        $countStmt = $this->db->prepare("SELECT COUNT(*) FROM users {$whereSql}");
        $countStmt->execute($params);
        $total = (int)$countStmt->fetchColumn();

        $stmt = $this->db->prepare("
            SELECT id, nome, email, role, ativo, created_at, {$lastLoginSelect}
            FROM users
            {$whereSql}
            ORDER BY created_at DESC, id DESC
            LIMIT {$perPage} OFFSET {$offset}
        ");
        $stmt->execute($params);

        respond([
            'data' => $stmt->fetchAll(),
            'pagination' => [
                'page' => $page,
                'perPage' => $perPage,
                'total' => $total,
                'totalPages' => max(1, (int)ceil($total / $perPage)),
            ],
        ]);
    }

    public function deleteUser(int $id, int $currentUserId): never {
        if ($id === $currentUserId) {
            respond(['error' => 'Não podes excluir a tua própria conta de administrador'], 422);
        }

        $stmt = $this->db->prepare('SELECT id FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            respond(['error' => 'Utilizador não encontrado'], 404);
        }

        $delete = $this->db->prepare('DELETE FROM users WHERE id = ?');
        $delete->execute([$id]);

        respond(['message' => 'Utilizador excluído com sucesso']);
    }

    public function listPublications(): never {
        $this->ensurePublicationsTable();

        $stmt = $this->db->query("
            SELECT p.id, p.tipo, p.titulo, p.conteudo, p.book_id, p.ativo, p.created_at, p.updated_at,
                   b.titulo AS livro_titulo,
                   u.nome AS autor_nome
            FROM admin_publications p
            LEFT JOIN books b ON b.id = p.book_id
            LEFT JOIN users u ON u.id = p.created_by
            ORDER BY p.created_at DESC, p.id DESC
            LIMIT 50
        ");

        respond(['data' => $stmt->fetchAll()]);
    }

    public function createPublication(int $adminId): never {
        $this->ensurePublicationsTable();

        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $tipo = in_array(($body['tipo'] ?? ''), ['livro', 'informacao'], true) ? $body['tipo'] : 'informacao';
        $titulo = trim($body['titulo'] ?? '');
        $conteudo = trim($body['conteudo'] ?? '');
        $bookId = isset($body['book_id']) && $body['book_id'] !== '' ? (int)$body['book_id'] : null;
        $ativo = isset($body['ativo']) ? (int)(bool)$body['ativo'] : 1;

        if ($titulo === '' || $conteudo === '') {
            respond(['error' => 'Título e conteúdo são obrigatórios'], 422);
        }

        if ($tipo === 'livro' && $bookId === null) {
            respond(['error' => 'Seleciona o livro relacionado com esta publicação'], 422);
        }

        $stmt = $this->db->prepare('
            INSERT INTO admin_publications (tipo, titulo, conteudo, book_id, created_by, ativo)
            VALUES (?, ?, ?, ?, ?, ?)
        ');
        $stmt->execute([$tipo, $titulo, $conteudo, $bookId, $adminId, $ativo]);

        respond(['message' => 'Publicação criada com sucesso', 'id' => (int)$this->db->lastInsertId()], 201);
    }

    private function countFavorites(): int {
        if ($this->hasTable('favorites')) {
            return (int)$this->db->query('SELECT COUNT(*) FROM favorites')->fetchColumn();
        }

        return 0;
    }

    private function userGrowth(): array {
        $stmt = $this->db->query("
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS total
            FROM users
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC
        ");

        return $stmt->fetchAll();
    }

    private function favoriteCategories(): array {
        if ($this->hasTable('favorites') && $this->hasColumn('favorites', 'book_id')) {
            $stmt = $this->db->query("
                SELECT COALESCE(c.nome, 'Sem categoria') AS category, COUNT(*) AS total
                FROM favorites f
                JOIN books b ON b.id = f.book_id
                LEFT JOIN categories c ON c.id = b.categoria_id
                GROUP BY COALESCE(c.nome, 'Sem categoria')
                ORDER BY total DESC
                LIMIT 8
            ");

            return $stmt->fetchAll();
        }

        $stmt = $this->db->query("
            SELECT COALESCE(c.nome, 'Sem categoria') AS category, COUNT(b.id) AS total
            FROM books b
            LEFT JOIN categories c ON c.id = b.categoria_id
            GROUP BY COALESCE(c.nome, 'Sem categoria')
            ORDER BY total DESC
            LIMIT 8
        ");

        return $stmt->fetchAll();
    }

    private function recentUsers(int $limit): array {
        $lastLoginSelect = $this->hasColumn('users', 'last_login') ? 'last_login' : 'NULL AS last_login';
        $stmt = $this->db->query("
            SELECT id, nome, email, role, ativo, created_at, {$lastLoginSelect}
            FROM users
            ORDER BY created_at DESC, id DESC
            LIMIT {$limit}
        ");

        return $stmt->fetchAll();
    }

    private function ensurePublicationsTable(): void {
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS admin_publications (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                tipo ENUM('livro','informacao') NOT NULL DEFAULT 'informacao',
                titulo VARCHAR(180) NOT NULL,
                conteudo TEXT NOT NULL,
                book_id INT UNSIGNED NULL,
                created_by INT UNSIGNED NOT NULL,
                ativo TINYINT(1) NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_pub_tipo (tipo),
                INDEX idx_pub_ativo (ativo),
                INDEX idx_pub_book (book_id),
                INDEX idx_pub_user (created_by),
                CONSTRAINT fk_pub_book
                    FOREIGN KEY (book_id) REFERENCES books(id)
                    ON DELETE SET NULL ON UPDATE CASCADE,
                CONSTRAINT fk_pub_user
                    FOREIGN KEY (created_by) REFERENCES users(id)
                    ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
    }

    private function hasTable(string $table): bool {
        $stmt = $this->db->prepare('
            SELECT COUNT(*)
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = ?
        ');
        $stmt->execute([$table]);
        return (int)$stmt->fetchColumn() > 0;
    }

    private function hasColumn(string $table, string $column): bool {
        $stmt = $this->db->prepare('
            SELECT COUNT(*)
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = ?
              AND COLUMN_NAME = ?
        ');
        $stmt->execute([$table, $column]);
        return (int)$stmt->fetchColumn() > 0;
    }
}
