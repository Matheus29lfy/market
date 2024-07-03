<?php
namespace App\Tests\Integration;

use PHPUnit\Framework\TestCase;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\ResponseFactory;
use App\Controllers\TypeProductController;
use App\Repositories\TypeProductRepository;
use App\Services\TypeProductService;

class TypeProductsControllerIntegrationTest extends TestCase {
    public function testGetAllIntegration() {
        $typeProductRepositoryMock = $this->createMock(TypeProductRepository::class);
 
        $typeProductService = new TypeProductService($typeProductRepositoryMock);
        
        $controller = new TypeProductController($typeProductService);

        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest('GET', '/type-products');

        $responseFactory = new ResponseFactory();
        $response = $responseFactory->createResponse();

        $response = $controller->getAll($request, $response, []);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJson((string) $response->getBody());
    }

    public function testInsertIntegration() {
        $typeProductRepositoryMock = $this->createMock(TypeProductRepository::class);
 
        $typeProductService = new TypeProductService($typeProductRepositoryMock);
        
        $controller = new TypeProductController($typeProductService);

        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest('POST', '/type-products');
        $typeData = [
            'name' => 'Test Type',
            // Adicione outros campos obrigatórios, se houver
        ];
        $request->getBody()->write(json_encode($typeData));
        $request->getBody()->rewind();

        $responseFactory = new ResponseFactory();
        $response = $responseFactory->createResponse();

        $response = $controller->insert($request, $response, []);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJson((string) $response->getBody());
    }
}
