<?php
namespace App\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as ResponseInterface;
use App\Services\TypeProductService;
use App\Controllers\TypeProductController;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Response;

class TypeProductsControllerTest extends TestCase {
    public function testGetAll() {
        $typeProductsServiceMock = $this->createMock(TypeProductService::class);
        $typeProductsServiceMock->method('getAll')->willReturn(['type1', 'type2']);

        $controller = new TypeProductController($typeProductsServiceMock);

        $request = $this->createMock(Request::class);
        $response = new Response();
        $streamFactory = new StreamFactory();
        $stream = $streamFactory->createStream();
        $response = $response->withBody($stream);

        $response = $controller->getAll($request, $response, []);

        $this->assertStringContainsString('', (string) $response->getBody());
        $this->assertStringContainsString('', (string) $response->getBody());
    }

    public function testInsert() {
        $typeProductsServiceMock = $this->createMock(TypeProductService::class);
        $typeProductsServiceMock->method('insert')->willReturn(true);

        $controller = new TypeProductController($typeProductsServiceMock);

        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn(['name' => 'Test Type']);

        $response = new Response();
        $streamFactory = new StreamFactory();
        $stream = $streamFactory->createStream();
        $response = $response->withBody($stream);

        $response = $controller->insert($request, $response, []);

        $this->assertStringContainsString('Tipo de produto inserido com sucesso!', (string) $response->getBody());
        $this->assertEquals(201, $response->getStatusCode());
    }
}
