<?php
require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use DI\Container;
use Dotenv\Dotenv;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

// Carregar variáveis de ambiente
if (file_exists(__DIR__ . '/../.env')) {
$dotenv = Dotenv::createUnsafeImmutable(__DIR__ . '/../');
$dotenv->load();
}

// Criar container e app
$container = new Container();
AppFactory::setContainer($container); 
$app = AppFactory::create();

// Middleware de erros
$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setDefaultErrorHandler(function (
    Request $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails
) use ($app) {
    $payload = [
        'success' => false,
        'error' => $exception->getMessage()
    ];
    
    $response = $app->getResponseFactory()->createResponse();
    $response->getBody()->write(json_encode($payload));
    
    return $response
        ->withHeader('Content-Type', 'application/json')
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->withStatus(500);
});

// Middleware CORS
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});

$app->options('/{routes:.+}', function (Request $request, Response $response): Response {
    return $response;
});

// Configurações, dependências, rotas
$settings = require __DIR__ . '/../src/settings.php';
$container->set('settings', $settings);

require __DIR__ . '/../src/dependencies.php';
require __DIR__ . '/../src/routes.php';

$app->run();
