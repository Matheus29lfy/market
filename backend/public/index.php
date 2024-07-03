<?php
require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use DI\Container;
use Dotenv\Dotenv;

// Adicione isto no início do seu arquivo PHP que manipula requisições
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$dotenv = Dotenv::createUnsafeImmutable(__DIR__ . '/../'); // O problema estaca aqui
$dotenv->load();

$container = new Container();
AppFactory::setContainer($container);

$settings = require __DIR__ . '/../src/settings.php';
$container->set('settings', $settings);

$app = AppFactory::create();
require __DIR__ . '/../src/dependencies.php';
require __DIR__ . '/../src/routes.php';

$app->run();
