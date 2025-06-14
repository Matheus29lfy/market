"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
// import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getTokenSession } from '../lib';
import { fetchProducts, fetchTaxes, createSell } from '../services/apiService';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type_product_id: number;
}

interface CartItem extends Product {
  quantity: number;
}

interface Tax {
  id: number;
  type_product_id: number;
  name: string;
  tax_percentage: number;
}

interface User {
  username: number;
  role: number;
  token: string;
  authenticate:boolean;
}

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const[user, setUser]= useState<User>()
  // const { isAuthenticated } = useAuth();
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(true);
  const [totalNoTax, setTotalNoTax] = useState(0);
  const [totalWithTaxes, setTotalWithTaxes] = useState(0);

useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // Executa as requisições em paralelo
      const [productsResponse, taxesResponse] = await Promise.allSettled([
        fetchProducts(),
        fetchTaxes()
      ]);

      // Trata a resposta de produtos
      if (productsResponse.status === 'fulfilled') {
        setProducts(productsResponse.value.products || []);
      } else {
        console.error('Products fetch error:', productsResponse.reason);
        toast.error('Falha ao carregar produtos');
        setProducts([]); // Define um array vazio como fallback
      }

      // Trata a resposta de impostos
      if (taxesResponse.status === 'fulfilled') {
        setTaxes(taxesResponse.value.taxes || []);
      } else {
        console.error('Taxes fetch error:', taxesResponse.reason);
        toast.error('Falha ao carregar impostos');
        setTaxes([]); // Define um array vazio como fallback
      }

      // Carrega dados do usuário (operação local)
      const userLocal = getTokenSession();
      setUser(userLocal);

    } catch (error) {
      // Erros gerais (não relacionados às requisições individuais)
      console.error('Unexpected error:', error);
      toast.error('Erro inesperado ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  loadData();
}, []);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevCart.filter(item => item.id !== productId);
      }
    });
  };

  const deleteFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    let totalNoTaxCalc = 0;
    let totalWithTaxesCalc = 0;

    cart.forEach(item => {
      const tax = taxes.find(t => t.type_product_id === item.type_product_id);
      const taxRate = tax ? tax.tax_percentage / 100 : 0;
      const itemTotalNoTax = item.price * item.quantity;
      const itemTotalWithTax = itemTotalNoTax + itemTotalNoTax * taxRate;

      totalNoTaxCalc += itemTotalNoTax;
      totalWithTaxesCalc += itemTotalWithTax;
    });

    return { totalNoTaxCalc, totalWithTaxesCalc };
  };

//    function getTokenSession():any {
//     const token = localStorage.getItem("token")
//      const tokenConvert =  JSON.stringify(token)
//      const session = JSON.parse(tokenConvert);
// }
  const handleCheckout = async () => {
  
    // if (user && user.authenticate) {

    //   console.log(user.authenticate)
    // return

    const { totalNoTaxCalc, totalWithTaxesCalc } = calculateTotal();

    if(totalNoTaxCalc <= 0){
        toast.error('Adicione pelo menos um produto para finalizar a venda')
        return
    }

      try {
        await createSell({
          user_id: 1, // Substitua pela lógica real de usuário
          product_id: cart.map(item => item.id),
          quantity: cart.map(item => item.quantity),
          total_no_tax: totalNoTaxCalc,
          total_with_taxes: totalWithTaxesCalc,
        });
      setTotalNoTax(totalNoTaxCalc)
      setTotalWithTaxes(totalWithTaxesCalc)
      toast.success('Venda realizada com sucesso');
      setCart([]);
    } catch (error) {
      toast.error('Erro ao finalizar a venda');
    }
  };

  // ... (mantenha o restante do JSX como está, apenas adicione um loader)


    // if (response.ok) {
    //   toast.success('Venda realizada com sucesso');
    //   setCart([]);
    // } else {
    //  toast.error('Adicione pelo menos um produto para finalizar a venda')
    // }
  // } else {
  //   // console.log(user.authenticate)
  //   return
  //   // Redirecionar para a página de login se não estiver autenticado
  //   router.push('/login');
  // }
  // const { totalNoTax, totalWithTaxes } = calculateTotal();

  if (isLoading) {
    return (
      <div className="contain er mx-auto p-4">
        <div className="text-center py-8">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* <div className="flex justify-end mb-4">
          <Link  href="/login" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
            Login
          </Link>
      </div> */}
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>Preço: R$ {product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2">
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-4">Carrinho</h2>
      <ul>
        {cart.map(item => {
          const tax = taxes.find(t => t.type_product_id === item.type_product_id);
          const taxRate = tax ? tax.tax_percentage / 100 : 0;
          const itemTotalNoTax = item.price * item.quantity;
          const itemTax = itemTotalNoTax * taxRate;

          return (
            <li key={item.id} className="border p-4 mb-4">
              {item.name} - Quantidade: {item.quantity}
              <div>Preço: R$ {item.price.toFixed(2)}</div>
              <div>Imposto: R$ {itemTax.toFixed(2)}</div>
              <div>Subtotal: R$ {(itemTotalNoTax + itemTax).toFixed(2)}</div>
              <div className="mt-2 flex items-center">
                <button onClick={() => addToCart(item)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2">
                  +
                </button>
                <button onClick={() => removeFromCart(item.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2">
                  -
                </button>
                <button onClick={() => deleteFromCart(item.id)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded">
                  🗑️
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <h2 className="text-xl font-bold mt-4">Total</h2>
      <p>Total sem imposto: R$ {totalNoTax.toFixed(2)}</p>
      <p>Total com imposto: R$ {totalWithTaxes.toFixed(2)}</p>
      <button onClick={handleCheckout} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">
        Finalizar Compra
      </button>
      <div className="mt-4">
        <Link href="/type-product" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            Ver Tipos de Produtos
        </Link>
        <Link href="/sells" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            Ver Vendas
        </Link>
        <Link href="/products" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">  
            Ver Produtos
        </Link>
        <Link href="/taxes" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
            Ver Impostos
        </Link>
      </div>
      </div>
  );
};

export default HomePage;