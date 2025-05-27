export const fetchSells = async () => {
  const response = await fetch('http: //localhost:8080/sells');
  if (!response.ok) {
      throw new Error('Failed to fetch sells');
  }
  return response.json();
};