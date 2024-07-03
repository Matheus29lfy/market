// pages/product.tsx

import React from 'react';
import PrivateRoute from '../components/PrivateRoutes';
// import ProductList from '../components/ProductList';
import { useAuth } from '../contexts/AuthContext';
import HomePage from '.';

const ProductPage: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <PrivateRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Produtos</h1>
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
