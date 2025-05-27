<?php
namespace App\Repositories;

use App\Database\Connection;
use PDO;
use PDOException;

class ProductsRepository{  
   private   $db;
   public function __construct(Connection $db = null)
    {
      $this->db = $db->getPdo();
    }
 
  public function getAll()
  {
    $stmt = $this->db->query('SELECT * FROM products');
 
    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
  }

  public function insert($product):bool
  {
    try {
      
  
        $sql = "INSERT INTO products (name,price, quantity, type_category_id) VALUES (:name, :price, :quantity,:type_category_id)";
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindParam(':name', $product['name']);
        $stmt->bindParam(':price', $product['price']);
        $stmt->bindParam(':quantity', $product['quantity']);
        $stmt->bindParam(':type_category_id', $product['type_category_id']);
    
        if($stmt->execute()){
          return true;
        };
      } catch (\Exception $exception) {
        throw new \Exception('Erro ao inserir: ' . $exception->getMessage());
      }
    return false;
 
  }

  public function updateQuantityBatch(array $productIds, array $quantities) {
    try {
        // Inicia uma transação
        $this->db->beginTransaction();

        // Prepara a consulta SQL para atualização em lote
        $sql = "UPDATE products SET quantity = quantity - :quantity WHERE id = :product_id";

        $stmt = $this->db->prepare($sql);

        // Executa a atualização para cada produto
        foreach ($productIds as $index => $productId) {
            $quantity = $quantities[$index];
            $stmt->bindParam(':quantity', $quantity, PDO::PARAM_INT);
            $stmt->bindParam(':product_id', $productId, PDO::PARAM_INT);
            $stmt->execute();
        }

        // Comita a transação
        $this->db->commit();

        return true; // Retorna verdadeiro se tudo ocorrer bem
    } catch (PDOException $e) {
        // Desfaz a transação em caso de erro
        $this->db->rollBack();
        return false; // Retorna falso se houver erro
    }
}

public function updateQuantitySingle($productId, int $quantityChange) {
    try {
   
        // Prepara a consulta SQL para atualização individual
        $sql = "UPDATE products SET quantity = quantity - :quantityChange WHERE id = :product_id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':quantityChange', $quantityChange, PDO::PARAM_INT);
        $stmt->bindParam(':product_id', $productId, PDO::PARAM_INT);
        $stmt->execute();

        return true; // Retorna verdadeiro se a atualização ocorrer bem
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage(), (int)$e->getCode());

    }
}

 public function getAllProductsToShow()
  {
    $stmt = $this->db->query('SELECT p.id, p.name, p.price, p.type_category_id, tp.name
                            FROM products p
                            LEFT JOIN  type_product  tp on tp.id = p.type_category_id');

    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
  }

}