"use client"; 

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isNumeric } from '../lib';

interface ProductType {
  id: number;
  name: string;
}

interface TaxesModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addedTaxes:() =>void;
}

const TaxesModal: React.FC<TaxesModalProps> = ({ isOpen, closeModal, addedTaxes }) => {
  const [taxPercentage, setTaxPercentage] = useState('');
  const [typeProductId, setTypeProductId] = useState('');
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const clearInput = () =>{
    setTaxPercentage('')
    setTypeProductId('')
  }

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const response = await fetch('http://localhost:8080/type-product', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          return
        }
        const data = await response.json();
        setProductTypes(data.type_product);
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao buscar tipos de produto:', error);
        toast.error("Erro ao buscar tipos de produto")
        setIsLoading(false);
      }
    };

    fetchProductTypes();

    if(!isOpen){
      clearInput()
    }

  }, [isOpen]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validTaxPercentage = isNumeric(taxPercentage)

    if(!validTaxPercentage){
       toast.error("Erro ao buscar tipos de produto")
      return
    }

    const taxProduct = {
      tax_percentage:parseFloat(taxPercentage) ,
      type_product_id: parseInt(typeProductId)
    };

    if(taxProduct.tax_percentage <= 0 || taxProduct.tax_percentage >= 100){
       toast.error("O valor da taxa do imposto deve ser maior que 0 e menor que 100")
       return
    }
    const response = await fetch('http://localhost:8080/taxes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taxProduct),
    });

    if (response.ok) {
      closeModal();
      addedTaxes();
      clearInput()
     toast.success("Imposto criado com sucesso")
    } else {
     toast.success("Falha ao criar tipo de imposto")
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Criar Tipo de Produto
                </Dialog.Title>
                <button
                  type="button"
                  className="hover:bg-gray-200 rounded-full p-1"
                  onClick={closeModal}
                >
                  <span className="sr-only">Close</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productType">
                   Tipo de Produto
                  </label>
                  <select
                    id="productType"
                    value={typeProductId}
                    onChange={(e) => setTypeProductId(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Selecione o Tipo De Produto</option>
                    {productTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Porcentagem do imposto
                  </label>
                  <input
                    type="text"
                    id="tax-percentage"
                    value={taxPercentage}
                    onChange={(e) => setTaxPercentage(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="flex justify-space-between mt-4 space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Criar
                  </button>
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={closeModal}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaxesModal;