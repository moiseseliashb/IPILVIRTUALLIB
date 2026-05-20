# Biblioteca Virtual Escolar — Especificação Base do Projeto

## 1. Visão Geral

**Nome do projeto:** Biblioteca Virtual Escolar  
**Tipo:** Aplicação Web  
**Stack:** React (frontend) + PHP (backend/API REST) + MySQL (base de dados)  
**Idioma:** Português  

A Biblioteca Virtual Escolar é uma plataforma web que permite a gestão e consulta do acervo bibliográfico de uma escola. Os utilizadores podem pesquisar, requisitar e ler livros online, enquanto administradores gerem o catálogo e acompanham estatísticas de utilização.

---

## 2. Perfis de Utilizador

### 2.1 Aluno
- Registo e autenticação com credenciais escolares
- Pesquisa e consulta do catálogo de livros
- Requisição e devolução de livros (físicos ou digitais)
- Leitura de livros online (PDF/ebook no browser)
- Avaliação e comentário de livros lidos
- Histórico de leituras e requisições

### 2.2 Professor
- Todas as permissões do Aluno
- Acesso a materiais de suporte pedagógico
- Visualização de estatísticas de leitura da turma (opcional futura)
- Possibilidade de recomendar livros a alunos

### 2.3 Administrador
- Gestão completa do catálogo (CRUD de livros, categorias, autores)
- Gestão de utilizadores (criar, editar, desativar contas)
- Gestão de requisições (aprovar, recusar, registar devoluções)
- Dashboard com estatísticas: livros mais lidos, requisições por período, utilizadores mais ativos, categorias populares
- Upload de ficheiros PDF/ebook
- Moderação de avaliações e comentários

---

## 3. Funcionalidades Principais

### 3.1 Catálogo de Livros
- Pesquisa por título, autor, ISBN, categoria, ano
- Filtros avançados (disponibilidade, formato, língua)
- Página de detalhe do livro com capa, sinopse, informação técnica
- Indicador de disponibilidade (cópias físicas / acesso digital)

### 3.2 Sistema de Requisição e Empréstimo
- Requisição de livros físicos com prazo de devolução configurável
- Acesso a livros digitais por período limitado
- Histórico de empréstimos por utilizador
- Registo de devoluções pelo administrador

### 3.3 Leitura Online
- Visualizador de PDF embutido no browser
- Suporte a ebooks (formato básico)
- Marcadores e progresso de leitura guardados por utilizador

### 3.4 Avaliações e Comentários
- Sistema de estrelas (1–5) para avaliação de livros
- Caixa de comentário por livro (por utilizadores autenticados)
- Moderação de comentários pelo administrador
- Média de avaliações visível no catálogo

### 3.5 Dashboard de Administração
- Métricas: total de livros, requisições ativas, utilizadores registados
- Gráfico: livros mais requisitados / mais lidos
- Gráfico: requisições por mês
- Tabela: utilizadores com requisições em atraso
- Exportação de relatórios (CSV)

---

## 4. Arquitetura Técnica

### 4.1 Frontend — React
- Framework: React (Create React App ou Vite)
- Routing: React Router v6
- Estado global: Context API ou Zustand
- UI: Tailwind CSS ou Chakra UI
- Leitura de PDF: `react-pdf` ou iframe com PDF.js
- HTTP: Axios

### 4.2 Backend — PHP
- Estrutura: PHP 8.x com arquitetura MVC simples ou framework Laravel
- API: REST JSON
- Autenticação: JWT (JSON Web Tokens)
- Upload de ficheiros: armazenamento local ou S3-compatível
- Validação e sanitização de inputs

### 4.3 Base de Dados — MySQL
- ORM: Eloquent (Laravel) ou PDO nativo
- Migrações para controlo de versão do schema
- Indexes em campos de pesquisa frequente (título, autor, ISBN)

### 4.4 Segurança
- Autenticação por JWT com refresh tokens
- Controlo de acesso por papel (RBAC)
- Proteção contra SQL Injection (prepared statements)
- Proteção CSRF nos formulários
- HTTPS obrigatório em produção

---

## 5. Modelo de Dados (Entidades Principais)

| Entidade        | Campos principais                                                   |
|-----------------|---------------------------------------------------------------------|
| `users`         | id, nome, email, password_hash, role (aluno/professor/admin), ativo |
| `books`         | id, titulo, autor, isbn, categoria_id, ano, sinopse, capa_url, ficheiro_url, copias_fisicas |
| `categories`    | id, nome, descricao                                                 |
| `loans`         | id, user_id, book_id, data_requisicao, data_devolucao_prevista, data_devolvido, estado |
| `digital_access`| id, user_id, book_id, data_inicio, data_expira, progresso_pagina   |
| `reviews`       | id, user_id, book_id, estrelas, comentario, data, aprovado          |
| `reading_logs`  | id, user_id, book_id, pagina_atual, ultima_leitura                 |

---

## 6. Estrutura de Pastas Sugerida

```
/projeto
├── frontend/                  # Aplicação React
│   ├── public/
│   └── src/
│       ├── components/        # Componentes reutilizáveis
│       ├── pages/             # Páginas (Home, Catálogo, Livro, Dashboard...)
│       ├── contexts/          # Context API (Auth, etc.)
│       ├── services/          # Chamadas à API (axios)
│       └── utils/
│
└── backend/                   # API PHP
    ├── app/
    │   ├── Controllers/
    │   ├── Models/
    │   └── Middleware/
    ├── database/
    │   └── migrations/
    ├── public/                # index.php (ponto de entrada)
    ├── routes/                # Definição de rotas da API
    └── storage/               # Uploads (PDFs, capas)
```

---

## 7. Rotas da API (Exemplos)

| Método | Endpoint                        | Acesso         | Descrição                        |
|--------|---------------------------------|----------------|----------------------------------|
| POST   | /api/auth/login                 | Público        | Autenticação                     |
| GET    | /api/books                      | Autenticado    | Listar livros (com pesquisa)     |
| GET    | /api/books/{id}                 | Autenticado    | Detalhe de livro                 |
| POST   | /api/loans                      | Aluno/Professor| Criar requisição                 |
| PUT    | /api/loans/{id}/return          | Admin          | Registar devolução               |
| GET    | /api/books/{id}/read            | Autenticado    | Acesso ao ficheiro digital       |
| POST   | /api/books/{id}/reviews         | Aluno/Professor| Publicar avaliação               |
| GET    | /api/admin/stats                | Admin          | Estatísticas do dashboard        |
| POST   | /api/admin/books                | Admin          | Adicionar livro                  |

---

## 8. Fases de Desenvolvimento Sugeridas

### Fase 1 — Base (MVP)
- Autenticação e gestão de sessão (JWT)
- Catálogo com pesquisa e filtros
- Detalhe de livro
- Sistema de requisição básico

### Fase 2 — Leitura e Interação
- Visualizador PDF/ebook online
- Sistema de avaliações e comentários
- Histórico do utilizador

### Fase 3 — Administração
- Dashboard com estatísticas e gráficos
- Gestão completa do catálogo
- Moderação de comentários
- Exportação de relatórios

### Fase 4 — Polimento
- Testes automatizados (frontend + backend)
- Optimizações de performance
- SEO e acessibilidade
- Deploy e configuração de produção

---

## 9. Considerações Adicionais
- O sistema deve ser responsivo (mobile-friendly)
- Os PDFs devem ser servidos de forma segura (sem acesso direto via URL pública)
- O painel admin deve ter confirmações antes de ações destrutivas
- Os comentários dos alunos devem ser aprovados pelo admin antes de serem visíveis
