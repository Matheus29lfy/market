// src/app/taxes/index.tsx

import React from 'react';
import PrivateRoutes from '../components/PrivateRoutes';
import TaxesPage from './page';

const Taxes: React.FC = () => {
  return (
    <PrivateRoutes>
      <TaxesPage />
    </PrivateRoutes>
  );
};

export default Taxes;
