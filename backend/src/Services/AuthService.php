<?php

namespace App\Services;

use App\Repositories\AuthRepository;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {
    protected $authRepository;
    private $secretKey;

    public function __construct(AuthRepository $authRepository) {
        $this->authRepository = $authRepository;
        $this->secretKey =  getenv('JWT_SECRET'); // Use uma chave secreta forte e segura
    }

    public function register($data) {
        $existingUser = $this->authRepository->findUserByUsername($data['username']);
        
        if ($existingUser) {
            return ['status' => 'error', 'message' => 'Username already taken'];
        }

        $success = $this->authRepository->createUser($data);

        if ($success) {
            return ['status' => 'success'];
        } else {
            return ['status' => 'error', 'message' => 'Failed to register user'];
        }
    }

    public function login($data) {
    
        $user = $this->authRepository->findUserByUsername($data['username']);


        if ($user && password_verify($data['password'], $user['password'])) {
            $token = $this->generateJWT($user);

            return ['status' => 'success', 'token' => $token , 'user'=> $user];
        } else {
            return ['status' => 'error', 'message' => 'Invalid credentials'];
        }
    }

    private function generateJWT($user) {
        $payload = [
            'iat' => time(), // Hora em que o token foi gerado
            'nbf' => time(), // Hora em que o token começa a ser válido
            'exp' => time() + 3600, // Tempo de expiração do token (1 hora)
            'sub' => $user['id'], // Identificação do usuário
            'user' => $user, // Dados adicionais do usuário
        ];
 
        return JWT::encode($payload, $this->secretKey, 'HS256');
    }
}