<?php
declare(strict_types=1);

$envFile = BASE_PATH . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
        [$key, $val] = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($val);
    }
}

date_default_timezone_set('Africa/Luanda');

spl_autoload_register(function (string $class): void {
    $path = BASE_PATH . '/app/' . str_replace('\\', '/', $class) . '.php';
    if (file_exists($path)) require_once $path;
});
