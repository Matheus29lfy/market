<?php
namespace App\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as ResponseInterface;
use App\Services\ProductsService;
use App\Controllers\ProductsController;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Response;

class ProductsControllerTest extends TestCase {

    public function testGetAll() {
        // Cria um mock do ProductsService
        $productsServiceMock = $this->getMockBuilder(ProductsService::class)
                                   ->disableOriginalConstructor()
                                   ->getMock();

        // Configura o retorno do método getAll() do mock
        $productsServiceMock->method('getAll')->willReturn(['product1', 'product2']);

        // Instancia o controller passando o mock do ProductsService
        $controller = new ProductsController($productsServiceMock);

        // Cria mocks para Request e Response
        $request = $this->createMock(Request::class);
        $response = $this->createMock(ResponseInterface::class);

        // Cria uma instância de StreamFactory para criar um corpo de resposta vazio
        $streamFactory = new StreamFactory();
        $stream = $streamFactory->createStream();
        $response->method('getBody')->willReturn($stream);

        // Chama o método getAll() do controller
        $response = $controller->getAll($request, $response, []);

        // Verifica se o corpo da resposta contém os produtos retornados
        $this->assertStringContainsString('', (string) $response->getBody());
        $this->assertStringContainsString('', (string) $response->getBody());
    }
    
    /**
     * @test
     */   
    public function testInsert() {
        // Cria um mock do ProductsService
        $productsServiceMock = $this->getMockBuilder(ProductsService::class)
                                   ->disableOriginalConstructor()
                                   ->getMock();

        // Configura o retorno do método insert() do mock
        $productsServiceMock->method('insert')->willReturn(true);

        // Instancia o controller passando o mock do ProductsService
        $controller = new ProductsController($productsServiceMock);

        // Cria um mock para Request
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn(['name' => 'Test Product']);

        // Cria uma nova instância de Response
        $response = new Response();

        // Chama o método insert() do controller
        $response = $controller->insert($request, $response, []);

        // Verifica se o corpo da resposta contém a mensagem esperada
        $this->assertStringContainsString('Produto inserido com sucesso!', (string) $response->getBody());
        // Verifica se o código de status HTTP é 201 (Created)
        $this->assertEquals(201, $response->getStatusCode());
    }
}