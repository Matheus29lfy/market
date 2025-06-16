"use client";

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isNumeric } from '../lib';
import { fetchProductTypes, createTax } from '../services/apiService';

interface ProductType {
  id: number;
  name: string;
}

interface TaxesModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onSuccess: () => void; // Renomeado para melhor semântica
}

const TaxesModal: React.FC<TaxesModalProps> = ({ isOpen, closeModal, onSuccess }) => {
  const [formData, setFormData] = useState({
    taxPercentage: '',
    typeProductId: ''
  });
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Limpa o formulário quando o modal fecha
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        taxPercentage: '',
        typeProductId: ''
      });
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Carrega os tipos de produto
  useEffect(() => {
    const loadProductTypes = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProductTypes();
        setProductTypes(response.type_product || []);
      } catch (error) {
        console.error('Failed to load product types:', error);
        toast.error('Falha ao carregar tipos de produto');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadProductTypes();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // Valida se a porcentagem é numérica
    if (!isNumeric(formData.taxPercentage)) {
      toast.error('A porcentagem deve ser um valor numérico');
      return false;
    }

    const percentage = parseFloat(formData.taxPercentage);
    
    // Valida o intervalo da porcentagem
    if (percentage <= 0 || percentage >= 100) {
      toast.error('A porcentagem deve ser maior que 0 e menor que 100');
      return false;
    }

    // Valida se um tipo de produto foi selecionado
    if (!formData.typeProductId) {
      toast.error('Selecione um tipo de produto');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const taxData = {
        tax_percentage: parseFloat(formData.taxPercentage.replace(',', '.')),
        type_product_id: parseInt(formData.typeProductId)
      };

      await createTax(taxData);
      
      toast.success('Imposto criado com sucesso!');
      closeModal();
      onSuccess(); // Notifica o componente pai para atualizar a lista
      
    } catch (error) {
      console.error('Error creating tax:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar imposto');
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
            <div className="fixed inset-0 bg-black bg-opacity-25" />
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
            <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Criar Imposto
                </Dialog.Title>
                <button
                  type="button"
                  className="hover:bg-gray-200 rounded-full p-1"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  <span className="sr-only">Fechar</span>
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="typeProductId">
                    Tipo de Produto
                  </label>
                  <select
                    id="typeProductId"
                    name="typeProductId"
                    value={formData.typeProductId}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                    disabled={isLoading || isSubmitting}
                  >
                    <option value="">Selecione o Tipo de Produto</option>
                    {productTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  {isLoading && <p className="text-xs text-gray-500 mt-1">Carregando tipos de produto...</p>}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taxPercentage">
                    Porcentagem do Imposto (%)
                  </label>
                  <input
                    type="text"
                    id="taxPercentage"
                    name="taxPercentage"
                    value={formData.taxPercentage}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Ex: 10.5"
                    required
                    disabled={isSubmitting}
                    inputMode="decimal"
                  />
                </div>

                <div className="flex justify-between mt-6 space-x-4">
                  <button
                    type="button"
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    onClick={closeModal}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                    disabled={isSubmitting || !formData.taxPercentage || !formData.typeProductId}
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaxesModal;