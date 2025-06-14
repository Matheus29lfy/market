"use client";

import React, { useEffect, useState } from 'react';
import SellItem from '../components/SellItem';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { fetchSells } from '../services/apiService';

interface Product {
  product_id: number;
  name: string;
  quantity: number;
}

interface Sell {
  id: number;
  total_no_tax: number;
  total_with_taxes: number;
  user_id: number;
  username: string;
  created_at: string;
  products: Product[];
}

const SellsPage: React.FC = () => {
  const [sells, setSells] = useState<Sell[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSells = async () => {
    setIsLoading(true);
    setError(null);
    
    try {

      const response = await fetchSells();
      setSells(response.sells || []);

    } catch (error) {
      console.log('Failed to load sells:', error);
      setError('Falha ao carregar vendas');
      toast.error('Não foi possível carregar as vendas');
      setSells([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSells();
  }, []);

  return (
    <div className="container mx-auto mt-5 p-4">
      <h1 className="text-2xl font-bold mb-5">Vendas</h1>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/type-product" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Ver Tipos de Produtos
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

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando vendas...</p>
        </div>
      ) : sells.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Nenhuma venda encontrada. Realize sua primeira venda!
        </div>
      ) : (
        <div className="bg-white shadow-md rounded overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total sem Imposto</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total com Imposto</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produtos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sells.map((sell) => (
                <SellItem key={sell.id} sell={sell} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellsPage;