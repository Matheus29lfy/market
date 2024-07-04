import React from 'react';
import PrivateRoutes from '../components/PrivateRoutes';
import TypeProductPage from './page';

const TypeProduct: React.FC = () => {
  return (
    <PrivateRoutes>
      <TypeProductPage />
    </PrivateRoutes>
  );
};

export default TypeProduct;
