// src/app/sells/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import SellItem from '../components/SellItem';
import Link from 'next/link';

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

const fetchSells = async (): Promise<Sell[]> => {
  const res = await fetch('http://localhost:8080/sells');
  const data = await res.json();
  return data.sells;
};

const SellsPage: React.FC = () => {
  const [sells, setSells] = useState<Sell[]>([]);

  useEffect(() => {
    fetchSells().then(setSells);
  }, []);

  return (
    <div className="container mx-auto mt-5">
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
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 text-black">ID</th>
              <th className="py-2 text-black">Usuário</th>
              <th className="py-2 text-black">Total sem Imposto</th>
              <th className="py-2 text-black">Total com Imposto</th>
              <th className="py-2 text-black">Data</th>
              <th className="py-2 text-black">Produtos</th>
            </tr>
          </thead>
          <tbody>
            {sells.map((sell) => (
              <SellItem key={sell.id} sell={sell} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellsPage;