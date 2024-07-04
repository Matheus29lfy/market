// src/components/SellItem.tsx
import React, { useState } from 'react';

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

interface SellItemProps {
  sell: Sell;
}

const SellItem: React.FC<SellItemProps> = ({ sell }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <tr onClick={toggleExpanded} className="cursor-pointer hover:bg-gray-100">
        <td className="py-2 px-4 border text-black">{sell.id}</td>
        <td className="py-2 px-4 border text-black">{sell.username}</td>
        <td className="py-2 px-4 border text-black">{sell.total_no_tax}</td>
        <td className="py-2 px-4 border text-black">{sell.total_with_taxes}</td>
        <td className="py-2 px-4 border text-black">{new Date(sell.created_at).toLocaleString()}</td>
        <td className="py-2 px-4 border text-black">{isExpanded ? '-' : '+'}</td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-4">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 text-black">ID do Produto</th>
                  <th className="py-2 text-black">Nome</th>
                  <th className="py-2 text-black">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {sell.products.map((product) => (
                  <tr key={product.product_id}>
                    <td className="py-2 text-black px-4 border">{product.product_id}</td>
                    <td className="py-2 text-black px-4 border">{product.name}</td>
                    <td className="py-2 text-black px-4 border">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
};

export default SellItem;