<?php
namespace App\Services;

use App\Repositories\TaxesRepository;
class  TaxesService{

  private $taxesRepository;
  public function __construct(TaxesRepository $taxesRepository ) {
    $this->taxesRepository = $taxesRepository ;
  }
  public function getAll()
  {
     $taxes =  $this->taxesRepository->getAll();
     return $this->convertValueFloat($taxes);
  }

  public function insert($taxes)
  {
     return $this->taxesRepository->insert($taxes);
  }

  private function convertValueFloat($taxes){
    if(empty($taxes)){
      return $taxes = [];
    }
    foreach ($taxes as &$row) {
      $row['tax_percentage'] = floatval($row['tax_percentage']); // Para float
    }
    return $taxes;
  }
}