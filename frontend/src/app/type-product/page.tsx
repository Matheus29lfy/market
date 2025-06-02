"use client";

import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
import TypeProductModal from '../components/TypeProductModal';
import Link from 'next/link';

interface TypeProduct {
  id: number;
  name: string;
}

interface ApiResponse {
  type_product?: TypeProduct[];
  error?: string;
}

const TypeProductPage: React.FC = () => {
  const [typeProducts, setTypeProducts] = useState<TypeProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const router = useRouter();
  const [isAddedProductType, setIsAddedProductType] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const addedProductType  = () => {
    setIsAddedProductType(true);
  };

  useEffect(() => {
      const fetchTypeProducts = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch('http://localhost:8080/type-product', {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('response')
       console.log(response)
        if (!response.ok) {
          const errorData = await response.json();
           console.error('Erro ao buscar tipos de produto:', errorData);
        }

        const data: ApiResponse = await response.json();
        setTypeProducts(data.type_product || []);

      } catch (error) {
        console.error('Erro ao buscar tipos de produto:', error);
      } finally {
        setIsLoading(false);
      }
    };
      if(isAddedProductType){
        fetchTypeProducts();
      }
    fetchTypeProducts();

  }, [isAddedProductType]);

  return (
    <div className="container mx-auto p-4">
       <div className="mb-4">
            <Link href="/taxes" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                Ver Impostos
            </Link>
            <Link href="/sells" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                Ver Vendas
            </Link>
            <Link href="/products" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">  
              Ver Produtos
            </Link>
            <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
             Home
           </Link>
        </div>
      <h1 className="text-2xl font-bold mb-4">Tipos de Produto</h1>
      <button
        onClick={openModal}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Criar Tipo de Produto
      </button>
       {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando tipos de produto...</p>
        </div>
      ) : typeProducts.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Nenhum tipo de produto cadastrado. Clique no botão acima para criar o primeiro.
        </div>
      ) : (
      <ul className="list-disc pl-5">
        {typeProducts.map((typeProduct) => (
          <li key={typeProduct.id}>
            {/* <button
              onClick={() => router.push(`/products?type_product_id=${typeProduct.id}`)}
              className="text-blue-500 hover:underline"
            > */}
              {typeProduct.name}
            {/* </button> */}
          </li>
        ))}
      </ul>
      )}
      <TypeProductModal isOpen={isModalOpen} closeModal={closeModal} addedTypeProduct={addedProductType}  />
    </div>
  );
};

export default TypeProductPage;