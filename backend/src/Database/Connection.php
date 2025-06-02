<?php
namespace App\Database;

use PDO;
use PDOException;

class Connection {
    private $pdo;

    public function __construct($config) { 
         try {
            $host = getenv('DB_HOST');
            $db   = getenv('DB_DATABASE');
            $user = getenv('DB_USERNAME');
            $pass = getenv('DB_PASSWORD');
            $port = getenv('DB_PORT') ?: 5432;
          $dsn = "pgsql:host={$host};port={$port};dbname={$db}";
          $this->pdo = new PDO($dsn,$user,$pass);
          $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }

    public function getPdo() {
        return $this->pdo;
    }
}
