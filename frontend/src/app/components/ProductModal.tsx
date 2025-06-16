"use client";

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { isNumeric } from '../lib';
import { fetchProductTypes, createProduct } from '../services/apiService';

interface ProductType {
  id: number;
  name: string;
}

interface ProductModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addedProduct: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, closeModal, addedProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    productTypeId: '',
    price: '',
    quantity: ''
  });
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearInput = () => {
    setFormData({
      name: '',
      productTypeId: '',
      price: '',
      quantity: ''
    });
  };

  const fetchTypes = async () => {
    setIsLoading(true);
    try {
      const response = await fetchProductTypes();
      setProductTypes(response.type_product || []);
    } catch (error) {
      console.error('Failed to fetch product types:', error);
      toast.error('Falha ao carregar tipos de produto');
      setProductTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTypes();
    } else {
      clearInput();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('O nome do produto é obrigatório');
      return false;
    }

    if (!formData.productTypeId) {
      toast.error('Selecione um tipo de produto');
      return false;
    }

    if (!isNumeric(formData.price)) {
      toast.error('Preço deve ser um valor numérico');
      return false;
    }

    if (parseFloat(formData.price) <= 0) {
      toast.error('O preço deve ser maior que zero');
      return false;
    }

    if (!isNumeric(formData.quantity)) {
      toast.error('Quantidade deve ser um valor numérico');
      return false;
    }

    if (parseInt(formData.quantity, 10) <= 0) {
      toast.error('A quantidade deve ser maior que zero');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
        const product = {
          name: formData.name,
          price: parseFloat(formData.price.replace(',', '.')),
          quantity: parseInt(formData.quantity, 10),
          type_product_id: parseInt(formData.productTypeId),
        };

      const response = await createProduct(product);

      if (response) {
        toast.success('Produto cadastrado com sucesso!');
        closeModal();
        addedProduct();
        clearInput();
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Erro ao cadastrar produto');
    } finally {
      setIsSubmitting(false);
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
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productTypeId">
                    Tipo do Produto
                  </label>
                  <select
                    id="productTypeId"
                    name="productTypeId"
                    value={formData.productTypeId}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Selecione o Tipo de Produto</option>
                    {productTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {isLoading && <p className="text-xs text-gray-500 mt-1">Carregando tipos...</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Preço
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    inputMode="decimal"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
                    Quantidade
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    inputMode="numeric"
                  />
                </div>

                <div className="flex justify-between mt-4 space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
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