"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
// import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getTokenSession } from '../lib';
// import { Notyf } from 'notyf';
// import 'notyf/notyf.min.css';

interface Product {
  id: number;
  name: string;
  price: number;
  type_product: number; // Assumindo que este é o ID do tipo de produto
}

interface CartItem extends Product {
  quantity: number;
}

interface Tax {
  id: number;
  type_category_id: number;
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

  
  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then(response => response.json())
      .then(data => setProducts(data.products))
      .catch(error => console.error('Erro ao buscar produtos:', error));

      const userLocal =  getTokenSession()
      setUser(userLocal)
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/taxes')
      .then(response => response.json())
      .then(data => setTaxes(data.taxes))
      .catch(error => console.error('Erro ao buscar impostos:', error));
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
    let totalNoTax = 0;
    let totalWithTaxes = 0;

    cart.forEach(item => {
      const tax = taxes.find(t => t.type_category_id === item.type_product);
      const taxRate = tax ? tax.tax_percentage / 100 : 0;
      const itemTotalNoTax = item.price * item.quantity;
      const itemTotalWithTax = itemTotalNoTax + itemTotalNoTax * taxRate;

      totalNoTax += itemTotalNoTax;
      totalWithTaxes += itemTotalWithTax;
    });

    return { totalNoTax, totalWithTaxes };
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
    const { totalNoTax, totalWithTaxes } = calculateTotal();

    if(totalNoTax <= 0){
        toast.error('Adicione pelo menos um produto para finalizar a venda')
        return
    }


    const response = await fetch('http://localhost:8080/sells', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id:1,//Estou vendo para implementar a parte de login
        product_id: cart.map(item => item.id),
        quantity: cart.map(item => item.quantity),
        total_no_tax: totalNoTax,
        total_with_taxes: totalWithTaxes,
      }),
    });

    if (response.ok) {
      toast.success('Venda realizada com sucesso');
      setCart([]);
    } else {
     toast.error('Adicione pelo menos um produto para finalizar a venda')
    }
  // } else {
  //   // console.log(user.authenticate)
  //   return
  //   // Redirecionar para a página de login se não estiver autenticado
  //   router.push('/login');
  // }
  };

  const { totalNoTax, totalWithTaxes } = calculateTotal();

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
          const tax = taxes.find(t => t.type_category_id === item.type_product);
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