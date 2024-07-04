<?php

use App\Middlewares\AuthMiddleware;
use Slim\Routing\RouteCollectorProxy;

$app->group('/products', function (RouteCollectorProxy $group) {
    $group->post('', \App\Controllers\ProductsController::class . ':insert');
    $group->get('', \App\Controllers\ProductsController::class . ':getAll');
    // $group->get('/{id}', \App\Controllers\ProductsController::class . ':show');
    // $group->put('/{id}', \App\Controllers\ProductsController::class . ':update');
    // $group->delete('/{id}', \App\Controllers\ProductsController::class . ':delete');
});

$app->group('/type-product', function (RouteCollectorProxy $group) {
    $group->get('', \App\Controllers\TypeProductController::class . ':getAll');
    $group->post('', \App\Controllers\TypeProductController::class . ':insert');
    // $group->get('/{id}', \App\Controllers\TypeProductController::class . ':show');
    // $group->put('/{id}', \App\Controllers\TypeProductController::class . ':update');
    // $group->delete('/{id}', \App\Controllers\TypeProductController::class . ':delete');
});

$app->group('/taxes', function (RouteCollectorProxy $group) {
    $group->get('', \App\Controllers\TaxesController::class . ':getAll');
    $group->post('', \App\Controllers\TaxesController::class . ':insert');
    // $group->get('/{id}', \App\Controllers\TaxesController::class . ':show');
    // $group->put('/{id}', \App\Controllers\TaxesController::class . ':update');
    // $group->delete('/{id}', \App\Controllers\TaxesController::class . ':delete');
});

$app->group('/sells', function (RouteCollectorProxy $group) {
    $group->get('', \App\Controllers\SellsController::class . ':getAll');
    $group->post('', \App\Controllers\SellsController::class . ':create');
    // $group->get('/{id}', \App\Controllers\SellsController::class . ':show');
// })->add(AuthMiddleware::class);
});

$app->group('/products-to-show', function (RouteCollectorProxy $group) {
    $group->get('', \App\Controllers\ProductsController::class . ':getAllProductsToShow');
});

$app->group('/auth', function (RouteCollectorProxy $group) {
    $group->post('/register', \App\Controllers\AuthController::class . ':register');
    $group->post('/login', \App\Controllers\AuthController::class . ':login');
});