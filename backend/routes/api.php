<?php
declare(strict_types=1);

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$baseUri = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
if ($baseUri !== '' && $baseUri !== '/' && str_starts_with($uri, $baseUri)) {
    $uri = substr($uri, strlen($baseUri)) ?: '/';
}
$uri    = '/' . trim(preg_replace('#^/api#', '', $uri), '/');
$parts  = explode('/', trim($uri, '/'));

// Helper de resposta JSON
function respond(array $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Handle OPTIONS (Pre-flight)
if ($method === 'OPTIONS') {
    exit;
}

// Rota de Teste (Ping)
if ($method === 'GET' && $uri === '/ping') {
    respond(['status' => 'ok']);
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

// Rotas de Administração
if (str_starts_with($uri, '/admin')) {
    AuthMiddleware::requireRole($authUser, 'admin');
    require BASE_PATH . '/app/Controllers/AdminController.php';
    $admin = new AdminController();

    if ($method === 'GET'    && $uri === '/admin/stats')  { $admin->stats(); }
    if ($method === 'GET'    && $uri === '/admin/users')  { $admin->listUsers(); }
    if ($method === 'DELETE' && preg_match('#^/admin/users/(\d+)$#', $uri, $m)) { $admin->deleteUser((int)$m[1], (int)$authUser['id']); }
    if ($method === 'GET'    && $uri === '/admin/utilizadores/contagem') { $admin->countUsersByRole(); }
    if ($method === 'GET'    && $uri === '/admin/utilizadores') { $admin->listUsersByRole(); }
    if ($method === 'DELETE' && preg_match('#^/admin/utilizadores/(\d+)$#', $uri, $m)) { $admin->deleteUser((int)$m[1], (int)$authUser['id']); }
    if ($method === 'GET'    && $uri === '/admin/publications') { $admin->listPublications(); }
    if ($method === 'POST'   && $uri === '/admin/publications') { $admin->createPublication((int)$authUser['id']); }
}

// Livros
if ($method === 'GET'  && $uri === '/books')           { /* BookController::index()  */ }
if ($method === 'GET'  && preg_match('#^/books/(\d+)$#', $uri, $m)) { /* BookController::show($m[1]) */ }
if ($method === 'POST' && $uri === '/books')           { /* BookController::store()  [admin] */ }

// Requisições
if ($method === 'GET'  && $uri === '/loans')           { /* LoanController::index()  */ }
if ($method === 'POST' && $uri === '/loans')           { /* LoanController::store()  */ }

respond(['error' => 'Rota não encontrada'], 404);
