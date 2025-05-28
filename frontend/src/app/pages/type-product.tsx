"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TypeProductModal from '../components/TypeProductModal';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchTypeProducts = async () => {
      setIsLoading(true);
      setError(null);
      
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
          throw new Error(errorData.error || 'Erro ao buscar tipos de produto');
        }

        const data: ApiResponse = await response.json();
        setTypeProducts(data.type_product || []);
           console.log('data.type_product')
       console.log(data.type_product)
       console.log('typeProducts')
       console.log(typeProducts)
      } catch (error) {
        console.error('Erro ao buscar tipos de produto:', error);
        setError(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTypeProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
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
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : typeProducts.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Nenhum tipo de produto cadastrado. Clique no botão acima para criar o primeiro.
        </div>
      ) : (
        <ul className="list-disc pl-5">
          {typeProducts.map((typeProduct) => (
            <li key={typeProduct.id} className="mb-2">
              <button
                onClick={() => router.push(`/products?type_product_id=${typeProduct.id}`)}
                className="text-blue-500 hover:underline hover:text-blue-700"
              >
                {typeProduct.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      
      {/* <TypeProductModal isOpen={isModalOpen} closeModal={closeModal} /> */}
    </div>
  );
};

export default TypeProductPage;