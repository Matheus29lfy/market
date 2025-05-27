<?php
namespace App\Services;

use App\Repositories\SellsRepository;
class  SellsService{

  private $sellsRepository;
  public function __construct(SellsRepository $sellsRepository ) {
    $this->sellsRepository = $sellsRepository;
  }
public function getAll() {
        try {
            $sells = $this->sellsRepository->getAll();
            
            $result = $this->convertValueFloat($sells);
            $grouped = $this->groupSells($result);
            
            if (empty($grouped)) {
                throw new \RuntimeException('Nenhuma venda encontrada', 400);
            }
            
            return $grouped;
            
        } catch (\RuntimeException $e) {
            // Repassa exceções com código 400
            if ($e->getCode() === 400) {
                throw $e;
            }
            throw new \RuntimeException('Erro ao processar vendas', 500);
        }
    }

  public function insertSingle($sell)
  {
     return $this->sellsRepository->insertSingle($sell);
  }

  public function insertBatch($sell)
  {
     return $this->sellsRepository->insertBatch($sell);
  }

  private function convertValueFloat($sells){

    if(empty($sells)){
      return $sells = [];
    }
    foreach ($sells as &$row) {
      $row['total_no_tax'] = floatval($row['total_no_tax']); 
      $row['total_with_taxes'] = floatval($row['total_with_taxes']); 
    }
    return $sells;
  }

  private function groupSells(array $results) {
    $grouped = [];

    foreach ($results as $row) {
        $sellId = $row['id'];

        if (!isset($grouped[$sellId])) {
            $grouped[$sellId] = [
                'id' => $row['id'],
                'total_no_tax' => $row['total_no_tax'],
                'total_with_taxes' => $row['total_with_taxes'],
                'user_id' => $row['user_id'],
                'username' => $row['username'],
                'created_at' => $row['created_at'],
                'products' => []
            ];
        }

        $grouped[$sellId]['products'][] = [
            'product_id' => $row['product_id'],
            'name' => $row['name'],
            'quantity' => $row['quantity']
        ];
    }

    return array_values($grouped);
}
}