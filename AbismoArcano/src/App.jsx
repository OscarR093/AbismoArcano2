// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getToken, removeToken } from './mockData'; // Importa las funciones de token

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import BlogPost from './pages/BlogPost';
import MyBlogs from './pages/MyBlogs';
import CreateBlog from './pages/CreateBlog';
import CreatePost from './pages/CreatePost';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Login from './pages/Login'; // Importa el componente de Login

function App() {
  const [userId, setUserId] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Para saber si ya se verificó el login

  useEffect(() => {
    // Al cargar la app, intenta obtener el ID del usuario del localStorage
    const storedUserId = getToken(); // Usa getToken para verificar si hay un ID/token
    if (storedUserId) {
      setUserId(storedUserId);
    }
    setIsAuthChecked(true); // Marca que la verificación inicial de autenticación ha terminado
  }, []);

  const handleLoginSuccess = (id) => {
    setUserId(id);
  };

  const handleLogout = () => {
    removeToken(); // Llama a removeToken para limpiar el localStorage
    setUserId(null);
  };

  // Muestra una pantalla de carga mientras se verifica el estado de autenticación
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark-violet">
        <p className="text-xl text-text-light-gray">Verificando sesión...</p>
      </div>
    );
  }

  // Rutas protegidas
  const ProtectedRoute = ({ children }) => {
    if (!userId) {
      // Si no hay userId (token), redirige a la página de login
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Rutas públicas o de autenticación
  const AuthRoute = ({ children }) => {
    if (userId) {
      // Si ya está logueado, redirige a la home
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen font-inter bg-primary-dark-violet">
        <Header userId={userId} onLogout={handleLogout} /> {/* Pasar userId y la función de logout */}
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* Muestra el ID de usuario si está logueado y no es la página de login */}
          {userId && (
            <div className="bg-accent-purple bg-opacity-20 border border-accent-purple text-text-light-gray px-4 py-3 rounded-md relative mb-4 shadow-md text-sm">
              <span className="font-semibold">Tu ID de Usuario:</span> <span className="break-all">{userId}</span>
              <p className="mt-1 text-xs text-text-light-gray">Este ID es el que te asigna el backend al iniciar sesión.</p>
            </div>
          )}

          <Routes>
            {/* Ruta de Login (pública, con redirección si ya estás logueado) */}
            <Route path="/login" element={<AuthRoute><Login onLoginSuccess={handleLoginSuccess} /></AuthRoute>} />

            {/* Rutas Públicas (Home y detalle de blog/post) */}
            <Route path="/" element={<Home userId={userId} />} />
            <Route path="/blogs/:blogId" element={<BlogDetail userId={userId} />} />
            <Route path="/blogs/:blogId/posts/:postId" element={<BlogPost userId={userId} />} />

            {/* Rutas Protegidas (Requieren autenticación) */}
            <Route path="/my-blogs" element={<ProtectedRoute><MyBlogs userId={userId} /></ProtectedRoute>} />
            <Route path="/create-blog" element={<ProtectedRoute><CreateBlog userId={userId} /></ProtectedRoute>} />
            <Route path="/blogs/:blogId/create-post" element={<ProtectedRoute><CreatePost userId={userId} /></ProtectedRoute>} />

            {/* Rutas Estáticas (públicas) */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
