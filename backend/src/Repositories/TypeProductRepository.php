<?php
namespace App\Repositories;

use App\Database\Connection;

class TypeProductRepository{  
   private   $db;

   public function __construct(Connection $db) 
   {
        $this->db = $db->getPdo();
    }
  public function getAll()
  {
    try {
          $stmt = $this->db->query('SELECT * FROM type_products');

          return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    } catch (\PDOException $e) {
            error_log('Database Taxes error: ' . $e->getMessage());
            throw new \RuntimeException('Erro ao buscar Tipo de Impostos. Por favor, tente novamente mais tarde.');
    }
  }

  public function insert($typeProduct):bool
  {
    try {
        $sql = "INSERT INTO type_products (name) VALUES (:name)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':name', $typeProduct['name']);
 
        if($stmt->execute()){
          return true;
        }
    } catch (\PDOException $e) {
          error_log('Database Taxes error: ' . $e->getMessage());
          throw new \Exception('Erro ao inserir: Tipo de imposto');
    }
    return false;
  }

}