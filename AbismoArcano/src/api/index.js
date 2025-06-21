// src/api/index.js

// URL base de tu backend de Node.js
export const BACKEND_BASE_URL = 'http://localhost:3001'; // <-- ¡VERIFICA ESTE PUERTO!

const AUTH_TOKEN_KEY = 'userAuthToken'; // Clave para almacenar el token/ID del usuario en localStorage

// --- Funciones para manejar el token de autenticación (userId) ---
export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// --- Función genérica para realizar llamadas a la API ---
// Incluye el token de usuario en los headers si está disponible
const apiCall = async (endpoint, method = 'GET', data = null, needsAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (needsAuth) {
    const token = getToken();
    if (token) {
      // Usamos 'x-user-id' como header de autenticación, como configuramos en el backend
      headers['X-User-Id'] = token;
    } else {
      throw new Error('No autorizado: Token de usuario no encontrado.');
    }
  }

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  try {
    const response = await fetch(`${BACKEND_BASE_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return responseData;
  } catch (error) {
    console.error(`Error en la llamada a la API ${endpoint}:`, error);
    throw error;
  }
};

// --- Funciones específicas para tu Backend ---

// Autenticación
export const login = (username, password) => apiCall('/login', 'POST', { username, password });
export const register = (username, password) => apiCall('/register', 'POST', { username, password });

// Blogs
export const getBlogs = () => apiCall('/blogs');
export const getBlogById = (blogId) => apiCall(`/blogs/${blogId}`);
export const createBlog = (blogData) => apiCall('/blogs', 'POST', blogData, true); // Requiere autenticación

// Posts
// Obtener posts de un blog (el backend ya maneja la lógica de paid/subscribed)
export const getPostsByBlogId = (blogId) => apiCall(`/blogs/${blogId}/posts`, 'GET', null, true); // Requiere autenticación para verificar suscripción
export const getPostById = (blogId, postId) => apiCall(`/blogs/${blogId}/posts/${postId}`, 'GET', null, true); // Requiere autenticación para verificar suscripción
export const createPost = (blogId, postData) => apiCall(`/blogs/${blogId}/posts`, 'POST', postData, true); // Requiere autenticación

// Suscripciones
export const checkSubscriptionStatus = (blogId) => apiCall(`/blogs/${blogId}/check-subscription`, 'GET', null, true); // Requiere autenticación
export const subscribeToBlog = (blogId) => apiCall(`/blogs/${blogId}/subscribe`, 'POST', {}, true); // Requiere autenticación
export const getUserSubscriptions = () => apiCall('/user/subscriptions', 'GET', null, true); // Requiere autenticación
