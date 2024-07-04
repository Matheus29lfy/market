// pages/product.tsx

import React from 'react';
import PrivateRoute from '../components/PrivateRoutes';
// import ProductList from '../components/ProductList';
import { useAuth } from '../contexts/AuthContext';
import HomePage from '.';
import Link from 'next/link';

const ProductPage: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <PrivateRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Produtos</h1>
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
        <HomePage />
        {/* <ProductList /> */}
        {isAdmin && (
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
            Create Product
          </button>
        )}
      </div>
    </PrivateRoute>
  );
};

export default ProductPage;
