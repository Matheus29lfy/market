<?php
namespace App\Services;

use App\Repositories\TypeProductRepository;
class  TypeProductService{

  private $typeProductRepository;
  public function __construct(TypeProductRepository $typeProductRepository ) {
    $this->typeProductRepository =  $typeProductRepository;
  }
  public function getAll()
  {
    try {
           $result = $this->typeProductRepository->getAll();
            
            if (empty($result)) {
                throw new \RuntimeException('Nenhum Tipo de imposto encontrado', 400);
            }
            
            return $result;
            
        } catch (\RuntimeException $e) {
            // Repassa exceções com código 400
            if ($e->getCode() === 400) {
                throw $e;
            }
            throw new \RuntimeException('Erro ao processar imposto', 500);
        }
    //  return 
  }

  public function insert($typeProduct)
  {
     return $this->typeProductRepository->insert($typeProduct);
  }
}