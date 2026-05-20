-- ============================================================
--  BIBLIOTECA VIRTUAL ESCOLAR — Schema MySQL
--  Versão: 1.0
-- ============================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;

-- ──────────────────────────────────────────
--  1. CATEGORIAS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    descricao   TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
--  2. UTILIZADORES
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL,
    email           VARCHAR(191) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            ENUM('aluno','professor','admin') NOT NULL DEFAULT 'aluno',
    numero_aluno    VARCHAR(50),                   -- apenas para alunos/professores
    turma           VARCHAR(20),                   -- apenas para alunos
    ativo           TINYINT(1) NOT NULL DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email  (email),
    INDEX idx_role   (role),
    INDEX idx_turma  (turma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
--  3. LIVROS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
    id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    titulo              VARCHAR(255) NOT NULL,
    autor               VARCHAR(255) NOT NULL,
    isbn                VARCHAR(20),
    categoria_id        INT UNSIGNED,
    ano_publicacao      YEAR,
    editora             VARCHAR(150),
    sinopse             TEXT,
    capa_url            VARCHAR(500),
    ficheiro_url        VARCHAR(500),              -- PDF/ebook (caminho seguro)
    copias_fisicas      INT UNSIGNED NOT NULL DEFAULT 0,
    copias_disponiveis  INT UNSIGNED NOT NULL DEFAULT 0,
    formato             ENUM('fisico','digital','ambos') NOT NULL DEFAULT 'ambos',
    ativo               TINYINT(1) NOT NULL DEFAULT 1,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FULLTEXT idx_pesquisa (titulo, autor, sinopse),
    INDEX idx_isbn       (isbn),
    INDEX idx_categoria  (categoria_id),
    INDEX idx_formato    (formato),
    CONSTRAINT fk_books_categoria
        FOREIGN KEY (categoria_id) REFERENCES categories(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
--  4. REQUISIÇÕES (empréstimos físicos)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS loans (
    id                      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id                 INT UNSIGNED NOT NULL,
    book_id                 INT UNSIGNED NOT NULL,
    data_requisicao         DATE NOT NULL DEFAULT (CURDATE()),
    data_devolucao_prevista DATE NOT NULL,
    data_devolvido          DATE,
    estado                  ENUM('pendente','ativo','devolvido','atrasado','cancelado')
                            NOT NULL DEFAULT 'pendente',
    notas_admin             TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_loan_user     (user_id),
    INDEX idx_loan_book     (book_id),
    INDEX idx_loan_estado   (estado),
    INDEX idx_loan_devolucao(data_devolucao_prevista),
    CONSTRAINT fk_loans_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_loans_book
        FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
--  5. ACESSO DIGITAL (leitura online)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS digital_access (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED NOT NULL,
    book_id         INT UNSIGNED NOT NULL,
    data_inicio     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_expira     TIMESTAMP NOT NULL,
    progresso_pag   INT UNSIGNED NOT NULL DEFAULT 1,
    ativo           TINYINT(1) NOT NULL DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_digital (user_id, book_id),
    INDEX idx_da_expira (data_expira),
    CONSTRAINT fk_da_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_da_book
        FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
--  6. PROGRESSO DE LEITURA
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reading_logs (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED NOT NULL,
    book_id         INT UNSIGNED NOT NULL,
    pagina_atual    INT UNSIGNED NOT NULL DEFAULT 1,
    total_paginas   INT UNSIGNED,
    ultima_leitura  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_reading (user_id, book_id),
    CONSTRAINT fk_rl_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_rl_book
        FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
--  7. AVALIAÇÕES E COMENTÁRIOS
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    book_id     INT UNSIGNED NOT NULL,
    estrelas    TINYINT UNSIGNED NOT NULL CHECK (estrelas BETWEEN 1 AND 5),
    comentario  TEXT,
    aprovado    TINYINT(1) NOT NULL DEFAULT 0,  -- moderação do admin
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_review (user_id, book_id),     -- 1 review por utilizador/livro
    INDEX idx_review_book     (book_id),
    INDEX idx_review_aprovado (aprovado),
    CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_book
        FOREIGN KEY (book_id) REFERENCES books(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────
--  8. REFRESH TOKENS (autenticação JWT)
-- ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    token       VARCHAR(512) NOT NULL UNIQUE,
    expira_em   TIMESTAMP NOT NULL,
    revogado    TINYINT(1) NOT NULL DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rt_token  (token(64)),
    INDEX idx_rt_user   (user_id),
    CONSTRAINT fk_rt_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  DADOS INICIAIS (seed)
-- ============================================================

-- Categorias base
INSERT INTO categories (nome, descricao) VALUES
('Literatura',          'Ficção, poesia e teatro'),
('Ciências',           'Ciências naturais, física, química e biologia'),
('Matemática',         'Álgebra, geometria e análise'),
('História',           'História de Angola e mundial'),
('Geografia',          'Geografia física e humana'),
('Filosofia',          'Lógica, ética e epistemologia'),
('Língua Portuguesa',  'Gramática, redação e literatura lusófona'),
('Informática',        'Programação e tecnologias digitais'),
('Arte e Cultura',     'Artes visuais, música e cinema');

-- Admin padrão (password: Admin@123 — MUDAR EM PRODUÇÃO)
INSERT INTO users (nome, email, password_hash, role) VALUES
('Administrador', 'admin@biblioteca.escola.ao',
 '$2y$12$placeholderHashMudarEmProducao000000000000000000000000u',
 'admin');

SET foreign_key_checks = 1;
