<?php
namespace App\Tests\Integration;

use PHPUnit\Framework\TestCase;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\ResponseFactory;
use App\Controllers\ProductsController;
use App\Repositories\ProductsRepository;
use App\Services\ProductsService;

class ProductsControllerIntegrationTest extends TestCase {
    /**
     * @test
     */
    public function testGetAllIntegration() {
        $productsRepositoryMock = $this->createMock(ProductsRepository::class);
 
        $productsService = new ProductsService($productsRepositoryMock);
        
        $controller = new ProductsController($productsService);
     
        // Crie uma requisição GET para '/products'
        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest('GET', '/products');

  
        // Crie uma resposta vazia
        $responseFactory = new ResponseFactory();
        $response = $responseFactory->createResponse();
   
        // Chame o método getAll do controller
        $response = $controller->getAll($request, $response, []);
       
        // Teste se a resposta tem o código 200
        $this->assertEquals(200, $response->getStatusCode());
        
        // Teste se a resposta é um JSON válido
        $this->assertJson((string) $response->getBody());
    }
    
    /**
     * @test
     */
    public function testInsertIntegration() {
        // Crie um mock para ProductsRepository (não mostrado aqui, mas deve ser configurado)
        $productsRepositoryMock = $this->createMock(ProductsRepository::class);
        
        // Passe o mock de ProductsRepository para ProductsService
        $productsService = new ProductsService($productsRepositoryMock);
        
        $controller = new ProductsController($productsService);
    
        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest('POST', '/products');
        $productData = [
            'name' => 'Test Product',
            'price' => 9.99, 
            'description' => 'A test product',
            'quantity' => 5,
            'type_category_id' => 3
        ];
        $request->getBody()->write(json_encode($productData));
        $request->getBody()->rewind();
   
        $responseFactory = new ResponseFactory();
        $response = $responseFactory->createResponse();
    
        $response = $controller->insert($request, $response, []);
       
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJson((string) $response->getBody());
    }
    
}
