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
     return $this->typeProductRepository->getAll();
  }

  public function insert($typeProduct)
  {
     return $this->typeProductRepository->insert($typeProduct);
  }
}