<?php
use Psr\Container\ContainerInterface;
use App\Database\Connection;
use App\Middlewares\AuthMiddleware;
use App\Repositories\AuthRepository;
use App\Repositories\ProductsRepository;
use App\Repositories\SellsRepository;
use App\Repositories\TaxesRepository;
use App\Repositories\TypeProductRepository;

$container = $app->getContainer();

$container->set('db', function(ContainerInterface $c) {
    $config = $c->get('settings')['settings']['db'];
    return new Connection($config);
});

$container->set(ProductsRepository::class, function(ContainerInterface $c) {
    return new ProductsRepository($c->get('db'));
});

$container->set(TypeProductRepository::class, function(ContainerInterface $c) {
    return new TypeProductRepository($c->get('db'));
});

$container->set(TaxesRepository::class, function(ContainerInterface $c) {
    return new TaxesRepository($c->get('db'));
});

$container->set(SellsRepository::class, function(ContainerInterface $c) {
    return new SellsRepository($c->get('db'));
});

$container->set(AuthRepository::class, function(ContainerInterface $c) {
    $jwtSecret = getenv('JWT_SECRET');
    return new AuthRepository($c->get('db'),$jwtSecret);
});

$container->set(AuthMiddleware::class, function(ContainerInterface $c) {
    $jwtSecret = getenv('JWT_SECRET');
    return new AuthMiddleware($jwtSecret);
});