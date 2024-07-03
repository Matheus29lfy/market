<?php

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\AuthService;

/**
 * @OA\Info(title="API market", version="1.0")
 * @OA\Server(url="http://localhost:8080")
 * 
 */

class AuthController {
    protected $authService;

    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    /**
     * @OA\Post(
     *     path="/auth/register",
     *     summary="Registra um novo usuário",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"username","password"},
     *             @OA\Property(property="username", type="string", example="user123"),
     *             @OA\Property(property="password", type="string", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Usuário registrado com sucesso",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User registered successfully")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Erro ao registrar usuário",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Username already taken")
     *         )
     *     )
     * )
     */
    public function register(Request $request, Response $response, $args) {

        $data = $request->getParsedBody();
     
        if (empty($data)) {
            $body = $request->getBody();
            $data = json_decode($body, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $response->getBody()->write(json_encode(['message' => 'Invalid JSON']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }
        }

        $result = $this->authService->register($data);

        if ($result['status'] === 'success') {
            $response->getBody()->write(json_encode(['message' => 'User registered successfully']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
        } else {
            $response->getBody()->write(json_encode(['message' => $result['message']]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }
    }

    /**
     * @OA\Post(
     *     path="/auth/login",
     *     summary="Autentica um usuário",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"username","password"},
     *             @OA\Property(property="username", type="string", example="user123"),
     *             @OA\Property(property="password", type="string", example="password123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login bem-sucedido",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string", example="jwt_token")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Credenciais inválidas",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Invalid credentials")
     *         )
     *     )
     * )
     */
    public function login(Request $request, Response $response, $args) {
       $data = $request->getParsedBody();
     
        if (empty($data)) {
            $body = $request->getBody();
            $data = json_decode($body, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                $response->getBody()->write(json_encode(['message' => 'Invalid JSON']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }
        }

        $result = $this->authService->login($data);
   
        if ($result['status'] === 'success') {
            $response->getBody()->write(json_encode([ 'username' => $result['user']['username'],
                                                       'role' => $result['user']['role'],
                                                       'token' => $result['token']]
                                                        ));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(['message' => $result['message']]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }
    }
}