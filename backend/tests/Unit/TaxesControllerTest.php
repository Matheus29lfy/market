<?php
namespace App\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as ResponseInterface;
use App\Services\TaxesService;
use App\Controllers\TaxesController;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Response;

class TaxesControllerTest extends TestCase {
    public function testGetAll() {
        $taxesServiceMock = $this->createMock(TaxesService::class);
        $taxesServiceMock->method('getAll')->willReturn(['tax1', 'tax2']);

        $controller = new TaxesController($taxesServiceMock);

        $request = $this->createMock(Request::class);
        $response = $this->createMock(ResponseInterface::class);
        $response = new Response();
        $streamFactory = new StreamFactory();
        $stream = $streamFactory->createStream();
        $response = $response->withBody($stream);

        $response = $controller->getAll($request, $response, []);

        $this->assertStringContainsString('', (string) $response->getBody());
        $this->assertStringContainsString('ax2', (string) $response->getBody());
    }

    public function testInsert() {
        $taxesServiceMock = $this->createMock(TaxesService::class);
        $taxesServiceMock->method('insert')->willReturn(true);

        $controller = new TaxesController($taxesServiceMock);

        $request = $this->createMock(Request::class);
        $request->method('getParsedBody')->willReturn(['name' => 'Test Tax']);

        $response = new Response();
        $streamFactory = new StreamFactory();
        $stream = $streamFactory->createStream();
        $response = $response->withBody($stream);

        $response = $controller->insert($request, $response, []);

        $this->assertStringContainsString('Imposto inserido com sucesso!', (string) $response->getBody());
        $this->assertEquals(201, $response->getStatusCode());
    }
}
