<?php
namespace App\Database;

use PDO;
use PDOException;

class Connection {
    private $pdo;

    public function __construct($config) { 
         try {
          $dsn = "pgsql:host={$config['host']};port={$config['port']};dbname={$config['database']}";
          $this->pdo = new PDO($dsn,$config['username'], $config['password']);
          $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            throw new PDOException($e->getMessage(), (int)$e->getCode());
        }
    }

    public function getPdo() {
        return $this->pdo;
    }
}
