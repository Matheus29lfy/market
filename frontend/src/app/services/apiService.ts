import { apiConfig } from '../lib/apiConfig';

interface ProductType {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type_product_id: number;
}

interface ProductPage {
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
  products: ProductPage[];
}
// Funções para Produtos
export const fetchProducts = async (): Promise<{ products: Product[] }> => {
  try {
    const response = await fetch(apiConfig.endpoints.products);
    if (!response.ok) {
     console.error('Failed to fetch products');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await fetch(apiConfig.endpoints.products, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      console.error('Failed to create product');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Funções para Tipos de Produto
export const fetchProductTypes = async (): Promise<{ type_product?: ProductType[] }> => {
  try {
    const response = await fetch(apiConfig.endpoints.typeProducts);
    if (!response.ok) {
     console.log('Failed to fetch product types');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching product types:', error);
    throw error;
  }
};

// Funções para Impostos
export const fetchTaxes = async (): Promise<{ taxes?: any[] }> => {
  try {
    const response = await fetch(apiConfig.endpoints.taxes);
    if (!response.ok) {
      throw new Error('Failed to fetch taxes');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching taxes:', error);
    throw error;
  }
};

// Funções para Vendas
export const createSell = async (sellData: any): Promise<any> => {
  try {
    const response = await fetch(apiConfig.endpoints.sells, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sellData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create sell');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating sell:', error);
    throw error;
  }
};

export const createTypeProduct = async (typeProductData: { name: string }) => {
  const response = await fetch(`${apiConfig.baseUrl}/type-product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(typeProductData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData.message || 'Failed to create product type');
  }

  return response.json();
};

export const createTax = async (taxData: { tax_percentage: number; type_product_id: number }) => {
  const response = await fetch(`${apiConfig.baseUrl}/taxes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taxData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create tax');
  }

  return response.json();
};

export const fetchSells = async (): Promise<Sell[]> => {
  const response = await fetch(`${apiConfig.baseUrl}/sells`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch sells');
  }

  const data = await response.json();
  return data.sells || [];
};