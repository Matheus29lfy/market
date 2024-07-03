<?php

namespace App\Repositories;
use App\Database\Connection;

use PDO;

class AuthRepository {
    protected $db;
    protected $jwtSecret;

    public function __construct(Connection $db, string $jwtSecret ) {
        $this->db = $db->getPdo();
        $this->jwtSecret = $jwtSecret;
    }

    public function findUserByUsername($username) {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE username = :username');
        $stmt->execute(['username' => $username]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createUser($data) {
        $stmt = $this->db->prepare('INSERT INTO users (username, password, email) VALUES (:username, :password, :email)');
        return $stmt->execute([
            'username' => $data['username'],
            'password' => password_hash($data['password'], PASSWORD_BCRYPT),
            // 'email' => $data['email']
        ]);
    }
}
