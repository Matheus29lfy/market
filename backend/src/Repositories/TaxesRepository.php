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
    try {
         $stmt = $this->db->query('SELECT t.id, t.type_product_id, tp.name, t.tax_percentage FROM taxes t 
                              LEFT JOIN type_products tp on tp.id = t.type_product_id
                            ');
 
          return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    } catch (\PDOException $e) {
            error_log('Database Taxes error: ' . $e->getMessage());
            throw new \RuntimeException('Erro ao buscar Impostos. Por favor, tente novamente mais tarde.');
    }

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
         error_log('Database Taxes error: ' . $exception->getMessage());
         throw new \Exception('Erro ao inserir novo imposto');
    }
    return false;
  }

}