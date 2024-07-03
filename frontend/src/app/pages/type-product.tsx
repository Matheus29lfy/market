"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TypeProductModal from '../components/TypeProductModal';

interface TypeProduct {
  id: number;
  name: string;
}

const TypeProductPage: React.FC = () => {
  const [typeProducts, setTypeProducts] = useState<TypeProduct[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetch('http://localhost:8080/type-product', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setTypeProducts(data.type_product))
      .catch(error => console.error('Erro ao buscar tipos de produto:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tipos de Produto</h1>
      <button
        onClick={openModal}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Criar Tipo de Produto
      </button>
      <ul className="list-disc pl-5">
        {typeProducts.map((typeProduct) => (
          <li key={typeProduct.id}>
            <button
              onClick={() => router.push(`/products?type_product_id=${typeProduct.id}`)}
              className="text-blue-500 hover:underline"
            >
              {typeProduct.name}
            </button>
          </li>
        ))}
      </ul>
      <TypeProductModal isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  );
};

export default TypeProductPage;