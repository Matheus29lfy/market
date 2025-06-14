"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TypeProductModal from '../components/TypeProductModal';
import { toast } from 'react-toastify';
import { fetchProductTypes } from '../services/apiService';
import Link from 'next/link';

interface TypeProduct {
  id: number;
  name: string;
}

const TypeProductPage: React.FC = () => {
  const [typeProducts, setTypeProducts] = useState<TypeProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadTypeProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchProductTypes();
      setTypeProducts(response.type_product || []);
    } catch (error) {
      console.error('Failed to load product types:', error);
      setError('Falha ao carregar tipos de produto');
      toast.error('Não foi possível carregar os tipos de produto');
      setTypeProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTypeProducts();
  }, []);
  const handleTypeProductAdded = () => {
    loadTypeProducts(); // Recarrega a lista quando um novo imposto é adicionado
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tipos de Produto</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/sells" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ver Vendas
        </Link>
        <Link href="/products" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">  
          Ver Produtos
        </Link>
        <Link href="/taxes" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ver Impostos
        </Link>
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Home
        </Link>
      </div>
      
      <button
        onClick={openModal}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        disabled={isLoading}
      >
        Criar Tipo de Produto
      </button>

      {/* Estados de carregamento e erro */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {typeProducts.map((typeProduct) => (
            <div 
              key={typeProduct.id} 
              className="border p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/products?type_product_id=${typeProduct.id}`)}
            >
              <h3 className="font-medium text-lg">{typeProduct.name}</h3>
              <p className="text-sm text-gray-500">ID: {typeProduct.id}</p>
            </div>
          ))}
        </div>
      )}
      
      <TypeProductModal 
        isOpen={isModalOpen} 
        closeModal={closeModal}
        onSuccess={handleTypeProductAdded}
      />
    </div>
  );
};

export default TypeProductPage;