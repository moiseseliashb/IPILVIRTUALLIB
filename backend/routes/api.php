<?php
declare(strict_types=1);

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = '/' . trim(preg_replace('#^/api#', '', $uri), '/');
$parts  = explode('/', trim($uri, '/'));

// Helper de resposta JSON
function respond(array $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Rotas públicas
if ($method === 'POST' && $uri === '/auth/login') {
    require BASE_PATH . '/app/Controllers/AuthController.php';
    (new AuthController())->login();
}

if ($method === 'POST' && $uri === '/auth/refresh') {
    require BASE_PATH . '/app/Controllers/AuthController.php';
    (new AuthController())->refresh();
}

// Middleware de autenticação para rotas protegidas
require BASE_PATH . '/app/Middleware/AuthMiddleware.php';
$authUser = AuthMiddleware::authenticate();

// Livros
if ($method === 'GET'  && $uri === '/books')           { /* BookController::index()  */ }
if ($method === 'GET'  && preg_match('#^/books/(\d+)$#', $uri, $m)) { /* BookController::show($m[1]) */ }
if ($method === 'POST' && $uri === '/books')           { /* BookController::store()  [admin] */ }

// Requisições
if ($method === 'GET'  && $uri === '/loans')           { /* LoanController::index()  */ }
if ($method === 'POST' && $uri === '/loans')           { /* LoanController::store()  */ }

// Admin stats
if ($method === 'GET'  && $uri === '/admin/stats')     { /* AdminController::stats() [admin] */ }

respond(['error' => 'Rota não encontrada'], 404);
