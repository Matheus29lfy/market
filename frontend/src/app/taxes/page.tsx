"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TaxesModal from '../components/TaxesModal';
import Link from 'next/link';
import TaxesCard from '../components/TaxesCard';
import { toast } from 'react-toastify';
import { fetchTaxes } from '../services/apiService';

interface Tax {
  id: number;
  type_product_id: number; // Corrigido para o nome correto da coluna
  name: string;
  tax_percentage: number;
}

const TaxesPage: React.FC = () => {
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const loadTaxes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchTaxes();
      setTaxes(response.taxes || []);
    } catch (error) {
      console.error('Failed to load taxes:', error);
      setError('Falha ao carregar impostos');
      toast.error('Não foi possível carregar os impostos');
      setTaxes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const handleTaxAdded = () => {
    loadTaxes(); // Recarrega a lista quando um novo imposto é adicionado
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Impostos</h1>
      
      <div className="mb-4">
        <Link href="/type-product" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Ver Tipos de Produtos
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
      
      <button
        onClick={openModal}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Criar Imposto
      </button>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando impostos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : taxes.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Nenhum imposto cadastrado. Clique no botão acima para criar o primeiro.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {taxes.map((tax) => (
            <TaxesCard key={tax.id} {...tax} />
          ))}
        </div>
      )}
      
      <TaxesModal 
        isOpen={isModalOpen} 
        closeModal={closeModal}
        onSuccess={handleTaxAdded} // Passa a função de callback
      />
    </div>
  );
};

export default TaxesPage;