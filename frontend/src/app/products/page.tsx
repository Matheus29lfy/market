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
    const fetchProducts = () =>
      fetch('http://localhost:8080/products', {
        method: 'GET',
        mode: 'cors', // Modo CORS para permitir requisições de outro domínio
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setProducts(data.products);
        setIsLoading(false); // Marca o carregamento como completo
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setIsLoading(false); // Marca o carregamento como completo mesmo em caso de erro
      });

      if(isAddedProduct){
        fetchProducts();
      }

      fetchProducts();
       // Chama a função para buscar os produtos apenas uma vez
  }, [isAddedProduct]); // Array vazio indica que o useEffect será executado somente uma vez, após a montagem inicial
  
      
      
  // if (isLoading) {
  //   return <div>Carregando...</div>;
  // }

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
        Create Product
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <ProductModal isOpen={isModalOpen} closeModal={closeModal}  addedProduct={addedProduct}/>
    </div>
  );
};

export default ProductPage;
