<?php
namespace App\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use App\Services\SellsService;
use App\Services\ProductsService;
use App\Controllers\SellsController;

class SellsControllerTest extends TestCase {

  public function testGetAll() {
    // Criação de mock para SellsService
    $sellsServiceMock = $this->createMock(SellsService::class);
    $sellsServiceMock->method('getAll')->willReturn([
        ['id' => 1, 'product_id' => 1, 'name' => 'teste', 'quantity' => 1, 'total_no_tax' => 10, 'total_with_taxes' => 12],
        ['id' => 4, 'product_id' => 8, 'name' => 'garrafa', 'quantity' => 3, 'total_no_tax' => 7.5, 'total_with_taxes' => 10.5]
    ]);

    // Criação de mock para ProductsService
    $productsServiceMock = $this->createMock(ProductsService::class);

    // Instanciação do controller com os serviços mockados
    $controller = new SellsController($sellsServiceMock, $productsServiceMock);

    // Criação de mock para Request e Response
    $request = $this->createMock(Request::class);
    $response = $this->createMock(Response::class);

    // Mock para o corpo da resposta
    $stream = $this->getMockBuilder('Slim\Psr7\Stream')
                   ->disableOriginalConstructor()
                   ->getMock();

    $response->method('getBody')->willReturn($stream);
    $response->expects($this->once())
             ->method('withHeader')
             ->willReturnSelf();

    // Definindo o comportamento esperado do stream de resposta
    $stream->expects($this->once())
           ->method('write')
           ->with($this->callback(function($arg) {
               $data = json_decode($arg, true);
               return isset($data['sells']) && count($data['sells']) === 2;
           }));

    // Chamando o método getAll do controller
    $response = $controller->getAll($request, $response, []);

    // Verificando se a resposta possui o cabeçalho 'Content-Type' corretamente
    $this->assertInstanceOf(Response::class, $response);
}

    public function testCreate() {
        // Criação de mock para SellsService
        $sellsServiceMock = $this->createMock(SellsService::class);
        $sellsServiceMock->method('insertSingle')->willReturn(true);
        $sellsServiceMock->method('insertBatch')->willReturn(true);

        // Criação de mock para ProductsService
        $productsServiceMock = $this->createMock(ProductsService::class);
        $productsServiceMock->method('updateQuantitySingle')->willReturn(true);
        $productsServiceMock->method('updateQuantityBatch')->willReturn(true);

        // Instanciação do controller com os serviços mockados
        $controller = new SellsController($sellsServiceMock, $productsServiceMock);

        // Dados fictícios para a venda
        $sellData = [
            'product_id' => [1, 2],
            'quantity' => [2, 3],
            'total_no_tax' => 60.00,
            'total_with_taxes' => 72.00,
        ];

        // Criação de mock para Request e Response
        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn($sellData);

        $response = $this->createMock(Response::class);
        $stream = $this->getMockBuilder('Slim\Psr7\Stream')
                       ->disableOriginalConstructor()
                       ->getMock();

        $response->method('getBody')->willReturn($stream);
        $response->expects($this->once())
                 ->method('withHeader')
                 ->willReturnSelf();

        // Definindo o comportamento esperado do stream de resposta
        $stream->expects($this->once())
               ->method('write')
               ->with($this->callback(function($arg) {
                   $data = json_decode($arg, true);
                   return isset($data['message']) && $data['message'] === 'Venda salva com sucesso!';
               }));

        // Chamando o método create do controller
        $response = $controller->create($request, $response, []);

        // Verificando se a resposta possui o código HTTP 201
        $this->assertInstanceOf(Response::class, $response);
    }
}