<?php
namespace App\Repositories;

use App\Database\Connection;

class TaxesRepository{  
   private   $db;

   public function __construct(Connection $db) 
   {
      $this->db = $db->getPdo();
  }
  public function getAll()
  {
    $stmt = $this->db->query('SELECT t.id, t.type_product_id, tp.name, t.tax_percentage FROM taxes t 
                              LEFT JOIN type_product tp on tp.id = t.type_product_id
                            ');
 
    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
  }

  public function insert($taxes):bool
  {
    try {
      $sql = "INSERT INTO taxes (type_product_id, tax_percentage) VALUES (:type_product_id,:tax_percentage)";
      $stmt = $this->db->prepare($sql);
      $stmt->bindParam(':type_product_id', $taxes['type_product_id']);
      $stmt->bindParam(':tax_percentage', $taxes['tax_percentage']);
   
      if($stmt->execute()){
        return true;
      };
    } catch (\Exception $exception) {
        throw new \Exception('Erro ao inserir: ' . $exception->getMessage());
    }
    return false;
  }

}