"use client";

import React, { useEffect, useState } from 'react';
import SellItem from '../components/SellItem';
import Link from 'next/link';
import { toast } from 'react-toastify';

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

interface ApiError {
  error?: string;
  status?: number;
}

const fetchSells = async (): Promise<Sell[]> => {
  try {
    const response = await fetch('http://localhost:8080/sells');
    
    if (!response.ok) {
      const errorData: ApiError = await response.json();
      
      if (response.status === 400 && errorData.error?.includes('Nenhuma venda encontrada')) {
        return []; 
      }
      
      throw new Error(errorData.error || 'Erro ao carregar vendas');
    }
    
    const data = await response.json();
    return data.sells || [];
    
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Ocorreu um erro inesperado');
    }
    
    return [];
  }
};

const SellsPage: React.FC = () => {
  const [sells, setSells] = useState<Sell[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSells = async () => {
      setIsLoading(true);
      const data = await fetchSells();
      setSells(data);
      setIsLoading(false);
    };
    
    loadSells();
  }, []);

  return (
    <div className="container mx-auto mt-5 p-4">
      <h1 className="text-2xl font-bold mb-5">Vendas</h1>
      <div className="mb-4">
        <Link href="/type-product" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Ver Tipos de Produtos
        </Link>
        <Link href="/products" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">  
          Ver Produtos
        </Link>
        <Link href="/taxes" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Ver Impostos
        </Link>
        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Home
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p>Carregando vendas...</p>
        </div>
      ) : sells.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Ainda não foi registrada nenhuma venda.
        </div>
      ) : (
        <div className="bg-white shadow-md rounded overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Usuário</th>
                <th className="py-2 px-4 text-left">Total sem Imposto</th>
                <th className="py-2 px-4 text-left">Total com Imposto</th>
                <th className="py-2 px-4 text-left">Data</th>
                <th className="py-2 px-4 text-left">Produtos</th>
              </tr>
            </thead>
            <tbody>
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