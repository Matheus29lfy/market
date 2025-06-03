// src/app/pages/TypeProductModal.tsx
"use client";

// Importações atualizadas:
import { Dialog, Transition } from '@headlessui/react';
// Não precisamos mais de DialogPanel, DialogOverlay, DialogTitle exportados separadamente
// mas sim como subcomponentes de Dialog
import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface TypeProductModalProps {
  isOpen: boolean;
  closeModal: () => void;
  addedTypeProduct: () => void;
}

const TypeProductModal: React.FC<TypeProductModalProps> = ({ isOpen, closeModal, addedTypeProduct }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const typeProduct = {
      name,
    };

    try {
      const response = await fetch('http://localhost:8080/type-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(typeProduct),
      });

      if (response.ok) {
        closeModal();
        addedTypeProduct();
        setName('');
        toast.success("Tipo de produto salvo com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(`Erro ao salvar tipo de produto: ${errorData.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado ao salvar o tipo de produto.");
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

          {/* Isso centraliza o conteúdo do modal */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

          {/* Painel do modal - De volta ao uso de Transition.Child com Dialog.Panel dentro */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* O Dialog.Panel é usado para o conteúdo do modal */}
            <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center">
                {/* Dialog.Title ainda é um subcomponente */}
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
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TypeProductModal;