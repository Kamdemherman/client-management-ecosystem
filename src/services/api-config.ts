
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json'
    // Nous ne définissons pas Content-Type par défaut pour permettre à axios de le définir automatiquement
    // selon le type de données envoyées (JSON ou FormData)
  }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token from localStorage:', token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Added token to request headers');
  } else {
    console.log('No token found in localStorage');
  }
  
  // Ne pas modifier le Content-Type si déjà défini par l'appel
  if (!config.headers['Content-Type'] && !config.headers.get('Content-Type')) {
    // Par défaut, utiliser application/json sauf si on détecte que c'est un FormData
    if (config.data instanceof FormData) {
      // Laisser axios gérer le Content-Type pour FormData (il ajoutera le boundary)
      console.log('FormData detected, letting axios set Content-Type');
    } else {
      config.headers['Content-Type'] = 'application/json';
      console.log('Set default Content-Type to application/json');
    }
  }
  
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('401 Unauthorized response received');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiresAt');
      // Don't redirect here to avoid infinite loops
    }
    return Promise.reject(error);
  }
);
