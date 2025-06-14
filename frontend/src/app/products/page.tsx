"use client";

import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { fetchProducts } from '../services/apiService';

interface Product {
  id: number;
  name: string;
  type_product_id: number;
  price: number;
  quantity: number;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddedProduct, setIsAddedProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funções para gerenciar o modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const addedProduct = () => setIsAddedProduct(true);

  // Carregar produtos
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {

         const response = await fetchProducts();
         setProducts(response.products || []);

      } catch (error) {
        console.log('Erro ao carregar produtos:', error);
        setError('Falha ao carregar produtos');
        toast.error('Não foi possível carregar os produtos');
        setProducts([]); // Garante que products não seja undefined
      } finally {
        setIsLoading(false);
        setIsAddedProduct(false); // Reseta o flag após o carregamento
      }
    };

    loadProducts();
  }, [isAddedProduct]); // Remove 'products' das dependências para evitar loop infinito

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
      ): products.length === 0 ? (
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

      <ProductModal 
        isOpen={isModalOpen} 
        closeModal={closeModal}  
        addedProduct={addedProduct}
      />
    </div>
  );
};

export default ProductPage;