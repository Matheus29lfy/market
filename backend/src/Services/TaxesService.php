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
      try {
            $taxes = $this->taxesRepository->getAll();
            
            $result = $this->convertValueFloat($taxes);

            if (empty($result)) {
                throw new \RuntimeException('Nenhum imposto encontrado', 400);
            }
            
            return $result;
            
        } catch (\RuntimeException $e) {
            // Repassa exceções com código 400
            if ($e->getCode() === 400) {
                throw $e;
            }
            throw new \RuntimeException('Erro ao processar imposto', 500);
        }
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