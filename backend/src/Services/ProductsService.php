<?php
namespace App\Services;

use App\Repositories\ProductsRepository;
class  ProductsService{
  protected $productsRepository;
  
  public function __construct(ProductsRepository $productsRepository) {
    $this->productsRepository = $productsRepository;
}
  public function getAll()
  {

         try {            
            $products = $this->productsRepository->getAll();
            $result = $this->convertValueFloat($products);
            if (empty($result)) {
                throw new \RuntimeException('Nenhuma produto encontrado', 400);
            }
            
            return $result;
            
        } catch (\RuntimeException $e) {
            // Repassa exceções com código 400
            if ($e->getCode() === 400) {
                throw $e;
            }
            throw new \RuntimeException('Erro ao processar produto', 500);
        }

  }

  public function insert($product)
  {
     return $this->productsRepository->insert($product);
  }

  public function updateQuantityBatch($productId, $quantity)
  {
     return $this->productsRepository->updateQuantityBatch($productId,$quantity );
  }

  public function updateQuantitySingle($productId, $quantity)
  {
     return $this->productsRepository->updateQuantitySingle($productId,$quantity );
  }
  public function getAllProductsToShow()
  {
    $products = $this->productsRepository->getAllProductsToShow();
     return $this->convertValueFloat($products);
  }
  
  private function convertValueFloat($products){
    
    if(empty($products)){
      return $products = [];
    }
    foreach ($products as &$row) {
      $row['price'] = floatval($row['price']); // Para float
    }
    return $products;
  }
}