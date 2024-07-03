<?php

namespace App\Tests\Integration;

use PHPUnit\Framework\TestCase;
use Slim\App;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\ResponseFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\AuthService;
use App\Controllers\AuthController;
use App\Repositories\AuthRepository;

class AuthControllerIntegrationTest extends TestCase
{
    protected static $app;
    protected $responseFactory;
    protected $appInstance;
    protected $authRepositoryMock;

    protected function setUp(): void
    {
        parent::setUp();

        // Inicializar o Slim App com ResponseFactory
        $this->responseFactory = new ResponseFactory();
        $this->appInstance = new App($this->responseFactory);

        // Mock para AuthRepository
        $this->authRepositoryMock = $this->getMockBuilder(AuthRepository::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Registrar rota /auth/register
        $this->appInstance->post('/auth/register', function (Request $request, Response $response, $args) {
            $authService = new AuthService($this->authRepositoryMock);
            $controller = new AuthController($authService);
            return $controller->register($request, $response, $args);
        });

        // Registrar rota /auth/login
        // $authRepositoryMock = $this->authRepositoryMock; // Passando para escopo local
        $this->appInstance->post('/auth/login', function (Request $request, Response $response, $args){
            $authService = new AuthService( $this->authRepositoryMock);
            $controller = new AuthController($authService);
            return $controller->login($request, $response, $args);
        });
    }

    public function testRegisterIntegration()
    {
        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest('POST', '/auth/register')
            ->withHeader('Content-Type', 'application/json');

        // Dados válidos para registro
        $validData = [
            'username' => 'testuser',
            'password' => 'password123'
        ];
        $request = $request->withParsedBody($validData);

        // Criar um objeto de resposta
        $response = $this->responseFactory->createResponse();

        // Enviar a requisição para o Slim App
        $response = $this->appInstance->handle($request);

     
        // Verificações
        $this->assertEquals(400, $response->getStatusCode());
        $responseData = json_decode((string) $response->getBody(), true);
        $this->assertArrayHasKey('message', $responseData);
        $this->assertEquals('Failed to register user', $responseData['message']);

        // Tentar registrar novamente com os mesmos dados deve retornar erro
        $response = $this->appInstance->handle($request);
        $this->assertEquals(400, $response->getStatusCode());
        $responseData = json_decode((string) $response->getBody(), true);
        $this->assertArrayHasKey('message', $responseData);
        $this->assertEquals('Failed to register user', $responseData['message']);
    }

    public function testLoginIntegration()
    {
        $requestFactory = new ServerRequestFactory();
        $request = $requestFactory->createServerRequest('POST', '/auth/login')
            ->withHeader('Content-Type', 'application/json');

        // Dados válidos para login
        $validData = [
            'username' => 'testuser',
            'password' => 'password123'
        ];
        $request = $request->withParsedBody($validData);

        // Criar um objeto de resposta
        $response = $this->responseFactory->createResponse();

        // Enviar a requisição para o Slim App
        $response = $this->appInstance->handle($request);

        // Verificações
        $this->assertEquals(401, $response->getStatusCode());
        $responseData = json_decode((string) $response->getBody(), true);
     

        // Tentar fazer login com credenciais inválidas deve retornar erro
        $invalidData = [
            'username' => 'testuser',
            'password' => 'wrongpassword'
        ];
        $request = $request->withParsedBody($invalidData);
        $response = $this->appInstance->handle($request);
        $this->assertEquals(401, $response->getStatusCode());
        $responseData = json_decode((string) $response->getBody(), true);
        $this->assertArrayHasKey('message', $responseData);
        $this->assertEquals('Invalid credentials', $responseData['message']);
    }
}