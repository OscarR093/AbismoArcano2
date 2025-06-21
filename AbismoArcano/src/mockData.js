// src/mockData.js
// Esta es una base de datos simulada en memoria para blogs y posts.
// Las funciones de autenticación ahora se conectarán a tu backend.

// Base URL de tu backend de Node.js
export const BACKEND_BASE_URL = 'http://localhost:3001';

let blogs = [];
let posts = {}; // { blogId: [post1, post2], ... }

// Datos iniciales de ejemplo
const initialBlogs = [
  {
    id: 'blog-1',
    title: 'Aventuras en la Cocina',
    description: 'Recetas deliciosas y consejos culinarios para todos.',
    imageUrl: 'https://placehold.co/600x400/9AE6B4/276749?text=Cocina',
    ownerId: 'user-1', // ID de usuario de ejemplo, ajusta si es necesario
    createdAt: Date.now() - 86400000 * 5 // Hace 5 días
  },
  {
    id: 'blog-2',
    title: 'Explorando el Desarrollo Web',
    description: 'Artículos sobre React, JavaScript, CSS y más.',
    imageUrl: 'https://placehold.co/600x400/A0AEC0/2D3748?text=Desarrollo',
    ownerId: 'user-2', // Otro ID de usuario de ejemplo
    createdAt: Date.now() - 86400000 * 3 // Hace 3 días
  },
  {
    id: 'blog-3',
    title: 'Viajes alrededor del mundo',
    description: 'Compartiendo experiencias y consejos de mis aventuras.',
    imageUrl: 'https://placehold.co/600x400/B2F5EA/00B295?text=Viajes',
    ownerId: 'user-1', // El mismo user-1
    createdAt: Date.now() - 86400000 // Hace 1 día
  }
];

const initialPosts = {
  'blog-1': [
    {
      id: 'post-1-1',
      title: 'Mi Primera Receta: Pasta Carbonara',
      excerpt: 'Una auténtica carbonara italiana que puedes hacer en casa.',
      content: '<p>Aprende a preparar una deliciosa pasta carbonara con esta receta paso a paso...</p><p><strong>Ingredientes:</strong> Huevo, Pecorino Romano, Guanciale, Pasta.</p>',
      imageUrl: 'https://placehold.co/600x300/FEEBC6/9C4221?text=Carbonara',
      createdAt: Date.now() - 86400000 * 4
    },
    {
      id: 'post-1-2',
      title: 'Secretos para un Buen Pan Casero',
      excerpt: 'Descubre los trucos para hornear pan perfecto cada vez.',
      content: '<p>El pan casero es una delicia. Aquí te doy mis mejores consejos...</p>',
      imageUrl: 'https://placehold.co/600x300/FBD38D/C05621?text=Pan',
      createdAt: Date.now() - 86400000 * 2
    }
  ],
  'blog-2': [
    {
      id: 'post-2-1',
      title: 'Introducción a React Hooks',
      excerpt: 'Una guía sencilla para entender useState y useEffect.',
      content: '<p>Los Hooks cambiaron React. Aquí te explico cómo funcionan los más básicos...</p>',
      imageUrl: 'https://placehold.co/600x300/D6BCFA/44337A?text=Hooks',
      createdAt: Date.now() - 86400000 * 2
    }
  ]
};

// Inicializar datos
blogs = [...initialBlogs];
posts = { ...initialPosts };

// Funciones para interactuar con la "base de datos" simulada de blogs y posts
// (Estas funciones no cambian, siguen simulando datos locales)
export const getMockBlogs = () => {
  return new Promise(resolve => setTimeout(() => {
    resolve([...blogs].sort((a, b) => b.createdAt - a.createdAt));
  }, 300));
};

export const getMockBlogById = (id) => {
  return new Promise(resolve => setTimeout(() => {
    resolve(blogs.find(blog => blog.id === id));
  }, 200));
};

export const getMockPostsByBlogId = (blogId) => {
  return new Promise(resolve => setTimeout(() => {
    const blogPosts = posts[blogId] || [];
    resolve([...blogPosts].sort((a, b) => b.createdAt - a.createdAt));
  }, 250));
};

export const addMockBlog = (blogData) => {
  return new Promise(resolve => setTimeout(() => {
    const newBlog = { id: `blog-${crypto.randomUUID().substring(0,8)}`, ...blogData, createdAt: Date.now() };
    blogs.push(newBlog);
    console.log("Blog simulado añadido (Frontend):", newBlog);
    resolve(newBlog);
  }, 500));
};

export const addMockPost = (blogId, postData) => {
  return new Promise(resolve => setTimeout(() => {
    const newPost = { id: `post-${crypto.randomUUID().substring(0,8)}`, ...postData, createdAt: Date.now() };
    if (!posts[blogId]) {
      posts[blogId] = [];
    }
    posts[blogId].push(newPost);
    console.log(`Post simulado añadido al blog ${blogId} (Frontend):`, newPost);
    resolve(newPost);
  }, 500));
};

// --- Funciones de autenticación ahora REALES (contra el backend) ---

const AUTH_TOKEN_KEY = 'userAuthToken'; // Usaremos esto para almacenar un token/ID del backend

export const getToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};
