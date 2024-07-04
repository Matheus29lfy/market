<?php

namespace App\Middlewares;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response as SlimResponse;

class AuthMiddleware {
    protected $jwtSecret;

    public function __construct($jwtSecret) {
        $this->jwtSecret = $jwtSecret;
    }

    public function __invoke(Request $request, RequestHandler $handler): Response {
        $authHeader = $request->getHeader('Authorization');
        $response = new SlimResponse();
        if (!$authHeader) {
            $response->getBody()->write(json_encode(['message' => 'Authorization header not found']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }

        $token = str_replace('Bearer ', '', $authHeader[0]);

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
        
             if (!$this->isAdmin($decoded)) {
                $response->getBody()->write(json_encode(['message' => 'Unauthorized: Only admin users allowed']));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
            }

            $request = $request->withAttribute('user', $decoded);
            return $handler->handle($request);
        } catch (\Exception $e) {
           
            $response->getBody()->write(json_encode(['message' => 'Invalid token']));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(401);
        }
    }

      // Method to check if user is admin
      private function isAdmin($decoded): bool {
        return isset($decoded->user->role) &&$decoded->user->role === 'admin';
    }
}