<?php
namespace App\Repositories;

use App\Database\Connection;

class SellsRepository{  
   private   $db;


   public function __construct(Connection $db) {
    $this->db = $db->getPdo();
 }
  public function getAll()
  {
    $stmt = $this->db->query('SELECT s.id, s.product_id, p.name, s.quantity, 
                                     s.total_no_tax, s.total_with_taxes
                              FROM sells s
                              LEFT JOIN products p on p.id = s.product_id');
 
    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
  }

  public function insertSingle($sell):bool
  {
 
    $sql = "INSERT INTO sells (product_id,quantity,total_no_tax,total_with_taxes) VALUES (:product_id,:quantity, :total_no_tax, :total_with_taxes)";
    $stmt = $this->db->prepare($sql);
    
    $stmt->bindParam(':product_id', $sell['product_id'][0]);
    $stmt->bindParam(':quantity', $sell['quantity'][0]);
    $stmt->bindParam(':total_no_tax', $sell['total_no_tax']);
    $stmt->bindParam(':total_with_taxes', $sell['total_with_taxes']);
 
    if($stmt->execute()){
      return true;
    };
    return false;
 
  }

  public function insertBatch($sell):bool
  {
    $query = "INSERT INTO sells (product_id, quantity, total_no_tax, total_with_taxes) VALUES ";
    $values = [];
    $params = [];

    foreach ($sell['product_id'] as $index => $productId) {
        $values[] = "(?, ?, ?, ?)";
        $params[] = $productId;
        $params[] = $sell['quantity'][$index];
        $params[] = $sell['total_no_tax'];
        $params[] = $sell['total_with_taxes'];
    }

    $query .= implode(", ", $values);
    $stmt = $this->db->prepare($query);
   
    if( $stmt->execute($params)){
      return true;
    };
    return false;
 
  }

}