// src/app/products/index.tsx

import React from 'react';
import PrivateRoutes from '../components/PrivateRoutes';
import ProductPage from './page';

const ProductsPage: React.FC = () => {
  return (
    <PrivateRoutes>
      <ProductPage />
    </PrivateRoutes>
  );
};

export default ProductsPage;
