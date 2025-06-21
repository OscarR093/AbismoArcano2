// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { getMockBlogs } from '../mockData'; // Importa la función para obtener blogs simulados
import BlogCard from '../components/BlogCard';

function Home({ userId }) { // userId no se usa directamente aquí, pero se mantiene por consistencia
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const blogsData = await getMockBlogs(); // Obtiene los blogs simulados
        setBlogs(blogsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener blogs simulados:", err);
        setError("Error al cargar los blogs.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []); // Sin dependencias de Firebase

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-text-light-gray text-lg">Cargando blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-button-golden">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-text-light-gray text-lg">No hay blogs disponibles todavía. ¡Sé el primero en crear uno!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-text-light-gray mb-8 text-center">Explora Nuestros Blogs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map(blog => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default Home;
