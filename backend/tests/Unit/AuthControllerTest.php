<?php
namespace App\Tests\Unit;

use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Controllers\AuthController;
use App\Services\AuthService;
use Slim\Psr7\Factory\ResponseFactory;

class AuthControllerTest extends TestCase
{
    protected $authServiceMock;
    protected $controller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authServiceMock = $this->createMock(AuthService::class);

        $this->controller = new AuthController($this->authServiceMock);
    }

    public function testRegisterSuccess()
    {
        // Dados de requisição
        $requestData = [
            'username' => 'testuser',
            'password' => 'password123'
        ];

        // Mock do objeto de requisição e resposta
        $request = $this->createMock(Request::class);
        $request->expects($this->once())
            ->method('getParsedBody')
            ->willReturn($requestData);

            // Crie uma resposta vazia
            $responseFactory = new ResponseFactory();
            $response = $responseFactory->createResponse();

        // Resultado esperado do serviço
        $this->authServiceMock->expects($this->once())
            ->method('register')
            ->with($requestData)
            ->willReturn(['status' => 'success']);

        // Chamada ao método register do controlador
        $result = $this->controller->register($request, $response, []);

        // Verificações
        $this->assertEquals(201, $result->getStatusCode());
 
    }

   
}
