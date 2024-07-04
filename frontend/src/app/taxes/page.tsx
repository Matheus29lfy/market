"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TaxesModal from '../components/TaxesModal';
import Link from 'next/link';
import TaxesCard from '../components/TaxesCard';

interface Taxes {
    id: number,
    type_category_id: number,
    name: string,
    tax_percentage: number
}

const TaxesPage: React.FC = () => {
  const [taxes, setTaxes] = useState<Taxes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddedTaxes, setIsAddedTaxes] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const addedTaxes  = () => {
    setIsAddedTaxes(true);
  };

  useEffect(() => {

    const fetchTaxes = () =>
       fetch('http://localhost:8080/taxes', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => setTaxes(data.taxes))
      .catch(error => console.error('Erro ao buscar tipos de produto:', error));

      if(isAddedTaxes){
        fetchTaxes();
      }

      fetchTaxes();

  }, [isAddedTaxes]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tipos de Produto</h1>
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
      <button
        onClick={openModal}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Criar Tipo de Produto
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {taxes.map((taxe) => (
          <TaxesCard key={taxe.id} {...taxe} />
        ))}
      </div>
      <TaxesModal isOpen={isModalOpen} closeModal={closeModal} addedTaxes={addedTaxes}  />
    </div>
  );
};

export default TaxesPage;