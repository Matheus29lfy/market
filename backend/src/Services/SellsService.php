<?php
namespace App\Services;

use App\Repositories\SellsRepository;
class  SellsService{

  private $sellsRepository;
  public function __construct(SellsRepository $sellsRepository ) {
    $this->sellsRepository = $sellsRepository;
  }
  public function getAll()
  {
     $sells = $this->sellsRepository->getAll();
     return $this->convertValueFloat($sells);
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
}