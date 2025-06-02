"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
// import Link from 'next/link';
import ProductModal from '../components/ProductModal';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  type_product: string;
  price: number;
  quantity: number;
}
interface ApiResponse {
  products?: Product[];
  error?: string;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddedProduct, setIsAddedProduct] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const addedProduct  = () => {
    setIsAddedProduct(true);
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
            
      try {
        const response = await fetch('http://localhost:8080/products', {
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
         console.log(`Erro ao buscar produtos ${errorData}`);
        }

        const data: ApiResponse = await response.json();
        setProducts(data.products || []);
       console.log(data.products)
       console.log('products')
       console.log(products)
      } catch (error) {
        console.error('Erro ao buscar tipos de produto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [isAddedProduct]); // Array vazio indica que o useEffect será executado somente uma vez, após a montagem inicial
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>

       <div className="mb-4">
            <Link href="/type-product" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                Ver Tipos de Produtos
            </Link>
            <Link href="/sells" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                Ver Vendas
            </Link>
            <Link href="/taxes" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                Ver Impostos
            </Link>
            <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
                 Home
            </Link>
        </div>

       <button
        onClick={openModal}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Adicionar Produto
      </button>
      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando os produtos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Nenhum produto cadastrado. Clique no botão acima para criar o primeiro.
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      )}
      <ProductModal isOpen={isModalOpen} closeModal={closeModal}  addedProduct={addedProduct}/>
    </div>
  );
};

export default ProductPage;
