// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { getBlogs } from '../api'; // Importa la función de API
import BlogCard from '../components/BlogCard';

function Home({ userId }) { // userId se pasa para consistencia, aunque no se usa directamente aquí
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Llama a la API para obtener los blogs
        const blogsData = await getBlogs();
        setBlogs(blogsData);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener blogs del backend:", err);
        setError("Error al cargar los blogs. Asegúrate de que el backend está corriendo.");
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []); // Sin dependencias de Firebase o userId aquí, ya que obtiene todos los blogs públicos

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
        <p className="text-text-light-gray text-lg">No hay blogs disponibles todavía. ¡Crea uno desde "Mis Blogs"!</p>
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
