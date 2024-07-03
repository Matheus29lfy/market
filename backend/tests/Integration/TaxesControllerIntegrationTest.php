<?php
namespace App\Tests\Integration;

use PHPUnit\Framework\TestCase;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\ResponseFactory;
use App\Controllers\TaxesController;
use App\Repositories\TaxesRepository;
use App\Services\TaxesService;

class TaxesControllerIntegrationTest extends TestCase {
    public function testGetAllIntegration() {
         $taxesRepositoryMock = $this->createMock(TaxesRepository::class);
          
         $taxesService = new TaxesService($taxesRepositoryMock);

         $controller = new TaxesController($taxesService);
        
         $requestFactory = new ServerRequestFactory();
         $request = $requestFactory->createServerRequest('GET', '/taxes');

        $responseFactory = new ResponseFactory();
        $response = $responseFactory->createResponse();

        $response = $controller->getAll($request, $response, []);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJson((string) $response->getBody());
    }

    public function testInsertIntegration() {
        $taxesRepositoryMock = $this->createMock(TaxesRepository::class);
          
        $taxesService = new TaxesService($taxesRepositoryMock);

        $controller = new TaxesController($taxesService);

        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest('POST', '/taxes');
        $taxData = [
            'name' => 'Test Tax',
            'tax_percentage' => 15,
            'type_product_id' =>1
        ];
        $request->getBody()->write(json_encode($taxData));
        $request->getBody()->rewind();

        $responseFactory = new ResponseFactory();
        $response = $responseFactory->createResponse();

        $response = $controller->insert($request, $response, []);

        $this->assertEquals(500, $response->getStatusCode());
        $this->assertJson((string) $response->getBody());
    }
}