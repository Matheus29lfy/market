<?php
require __DIR__.'/src/index.php';
require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use DI\Container;
use Dotenv\Dotenv;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$dotenv = Dotenv::createUnsafeImmutable(__DIR__ . '/../');
$dotenv->load();

$container = new Container();
AppFactory::setContainer($container); 

$app = AppFactory::create();

// Adicione isso antes das rotas
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Configurar o handler de erro
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
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});
// Adicione o middleware CORS


// Opção para lidar com requisições OPTIONS
$app->options('/{routes:.+}', function (Request $request, Response $response): Response {
    return $response;
});

$settings = require __DIR__ . '/../src/settings.php';
$container->set('settings', $settings);

require __DIR__ . '/../src/dependencies.php';
require __DIR__ . '/../src/routes.php';

$app->run();