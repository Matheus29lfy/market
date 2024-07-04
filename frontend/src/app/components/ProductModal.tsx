"use client"; // Adicione esta linha

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useEffect } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { isNumeric } from '../lib';

interface ProductType {
  id: number;
  name: string;
}

interface ProductModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addedProduct:() =>void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, closeModal,addedProduct }) => {
  const [name, setName] = useState('');
  const [productTypeId, setProductTypeId] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notyf = new Notyf();


  const clearInput = () =>{
    setName('')
    setPrice('')
    setProductTypeId('')
    setQuantity('')
  }

  const fetchProductTypes = async () => {
    try {
      const response = await fetch('http://localhost:8080/type-product', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar tipos de produto');
      }
      const data = await response.json();
      setProductTypes(data.type_product);
      setIsLoading(false);
    } catch (error) {
      notyf.error("Erro ao buscar tipos de produto")
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductTypes();
    if(!isOpen){
      clearInput()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validPrice =  isNumeric(price)
    const validQuantity =  isNumeric(quantity)

    if(!validPrice){
      notyf.error("O valor do preço é inválido")
      return
    }

    if(!validQuantity){
      notyf.error("O valor da quantidade é inválido")
      return
     }

  
    const product = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      type_category_id: parseInt(productTypeId),
    };
 
    if(product.price <= 0){
      notyf.error("O valor do preço deve ser maior que 0")
      return
    }
    if(product.quantity <= 0){
      notyf.error("O valor da quantidade deve ser maior que 0")
      return
     }

    const response = await fetch('http://localhost:8080/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });


    if (response.ok) {
      closeModal();
      addedProduct();
      clearInput()
      notyf.success('Produto cadastrado com sucesso')
    } else {
      // Handle errors here
      console.error('Failed to create product');
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
                  Criar Produto
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productType">
                    Tipo do Produto
                  </label>
                  <select
                    id="productType"
                    value={productTypeId}
                    onChange={(e) => setProductTypeId(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Selecione o Tipo de Produto</option>
                    {productTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Preço
                  </label>
                  <input
                    type="text"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    inputMode="numeric" // Impede setas de incremento/decremento
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                    Quantidade
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    inputMode="numeric" // Impede setas de incremento/decremento
                  />
                </div>
                <div className="flex justify-between mt-4 space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Salvar
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

export default ProductModal;