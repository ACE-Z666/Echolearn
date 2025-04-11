const BASE_URL = 'http://localhost:5001';

export const createApi = (token) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const api = {
    async get(endpoint) {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers,
        credentials: 'include',
      });
      return this.handleResponse(response);
    },

    async post(endpoint, data) {
      console.log('Making POST request to:', `${BASE_URL}${endpoint}`);
      console.log('Request headers:', headers);
      console.log('Request data:', data);

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      return this.handleResponse(response);
    },

    async put(endpoint, data) {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return this.handleResponse(response);
    },

    async delete(endpoint) {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });
      return this.handleResponse(response);
    },

    async handleResponse(response) {
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('userToken');
          window.location.href = '/login';
          throw new Error('Authentication failed');
        }
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
      }

      const data = await response.json();
      console.log('Parsed response data:', data);
      return data;
    },
  };

  return api;
}; 