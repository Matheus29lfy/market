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
    $stmt = $this->db->query('SELECT * FROM type_product');
 
    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
  }

  public function insert($typeProduct):bool
  {
    $sql = "INSERT INTO type_product (name) VALUES (:name)";
    $stmt = $this->db->prepare($sql);
    $stmt->bindParam(':name', $typeProduct['name']);
 
    if($stmt->execute()){
      return true;
    };
    return false;
 
  }

}