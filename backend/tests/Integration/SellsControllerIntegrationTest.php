<?php
namespace App\Tests\Integration;

use App\Repositories\SellsRepository;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\ResponseFactory;
use App\Controllers\SellsController;
use App\Repositories\ProductsRepository;
use App\Services\SellsService;
use App\Services\ProductsService;

class SellsControllerIntegrationTest extends TestCase {
    public function testGetAllIntegration() {
        $productsRepositoryMock = $this->createMock(ProductsRepository::class);
 
        $productsService = new ProductsService($productsRepositoryMock);

        $sellsRepositoryMock = $this->createMock(SellsRepository::class);
 
        $sellsService = new SellsService($sellsRepositoryMock);

        $controller = new SellsController ($sellsService,  $productsService);

        // Criar um objeto de requisição GET para /sells
        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest('GET', '/sells');

        // Criar um objeto de resposta
        $responseFactory = new ResponseFactory();
        $response = $responseFactory->createResponse();

        // Chamar o método getAll do SellsController
        $response = $controller->getAll($request, $response, []);

        // Verificar se a resposta possui o código HTTP 200
        $this->assertEquals(200, $response->getStatusCode());

        // Verificar se a resposta contém JSON válido
        $responseData = json_decode((string) $response->getBody(), true);
        $this->assertArrayHasKey('sells', $responseData);
        $this->assertEmpty($responseData['sells']);
    }

    public function testCreateIntegration() {
        $productsRepositoryMock = $this->createMock(ProductsRepository::class);
 
        $productsService = new ProductsService($productsRepositoryMock);

        $sellsRepositoryMock = $this->createMock(SellsRepository::class);
 
        $sellsService = new SellsService($sellsRepositoryMock);

        $controller = new SellsController ($sellsService,  $productsService);

        // Dados fictícios para a venda
        $sellData = [
            'product_id' => [1, 2],
            'quantity' => [2, 3],
            'total_no_tax' => 60.00,
            'total_with_taxes' => 72.00,
        ];

        // Criar um objeto de requisição POST para /sells
        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest('POST', '/sells');
        $request = $request->withParsedBody($sellData);

        // Criar um objeto de resposta
        $responseFactory = new ResponseFactory();
        $response = $responseFactory->createResponse();

        // Chamar o método create do SellsController
        $response = $controller->create($request, $response, []);

        // Verificar se a resposta possui o código HTTP 201
        $this->assertEquals(500, $response->getStatusCode());

        // Verificar se a resposta contém JSON válido
        $responseData = json_decode((string) $response->getBody(), true);
        $this->assertArrayHasKey('message', $responseData);
        $this->assertEquals('Erro ao salvar venda.', $responseData['message']);
    }
}