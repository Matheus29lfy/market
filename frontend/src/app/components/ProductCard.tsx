"use client";
import React from 'react';

interface ProductProps {
  id: number;
  name: string;
  type_product: string;
  price: number;
  quantity: number;
}

const ProductCard: React.FC<ProductProps> = ({  name, type_product, price, quantity }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-white-700">{type_product}</p>
      <p className="text-white-900 font-semibold">${price.toFixed(2)}</p>
      <p className="text-white-600">Quantidade: {quantity}</p>
    </div>
  );
};

export default ProductCard;