"use client";
import React from 'react';

interface TaxesProps {
  name: string,
  tax_percentage: number
}

const TaxesCard: React.FC<TaxesProps> = ({  name, tax_percentage }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-white-900 font-semibold">{tax_percentage.toFixed(2)}%</p>
    </div>
  );
};

export default TaxesCard;
