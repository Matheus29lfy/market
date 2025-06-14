const getApiBaseUrl = () => {
  // Em desenvolvimento, sempre use a URL de desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  }
  
  // Em produção, use a URL de produção
  return process.env.NEXT_PUBLIC_API_BASE_URL_PRODUCTION || 
         process.env.NEXT_PUBLIC_API_BASE_URL || 
         'http://localhost:8080';
};

export const apiConfig = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    products: `${getApiBaseUrl()}/products`,
    taxes: `${getApiBaseUrl()}/taxes`,
    sells: `${getApiBaseUrl()}/sells`,
    typeProducts: `${getApiBaseUrl()}/type-product`,
    // Adicione outros endpoints conforme necessário
  }
};