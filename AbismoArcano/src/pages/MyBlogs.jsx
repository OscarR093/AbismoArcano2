// src/pages/MyBlogs.jsx
import React, { useState, useEffect } from 'react';
import { getMockBlogs } from '../mockData'; // Importa la función para obtener blogs simulados
import BlogCard from '../components/BlogCard';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function MyBlogs({ userId }) {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("ID de usuario no disponible. Asegúrate de que la autenticación simulada funciona.");
      setLoading(false);
      return;
    }

    const fetchMyBlogs = async () => {
      try {
        setLoading(true);
        const allBlogs = await getMockBlogs(); // Obtiene todos los blogs simulados
        const filteredBlogs = allBlogs.filter(blog => blog.ownerId === userId); // Filtra por el ID de usuario simulado
        setMyBlogs(filteredBlogs);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener mis blogs simulados:", err);
        setError("Error al cargar tus blogs.");
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [userId]); // Dependencia: userId

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-text-light-gray text-lg">Cargando tus blogs...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-text-light-gray mb-8 text-center">Mis Blogs</h1>

      <div className="flex justify-center mb-10">
        {/* Botón Crear Nuevo Blog: texto oscuro sobre dorado/esmeralda */}
        <Link to="/create-blog"
              className="inline-flex items-center px-6 py-3 bg-button-golden text-primary-dark-violet rounded-full font-semibold text-lg hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-lg">
          <PlusCircle className="mr-2" size={24} />
          Crear Nuevo Blog
        </Link>
      </div>

      {myBlogs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-text-light-gray text-lg">Aún no has creado ningún blog.</p>
          <p className="text-text-light-gray text-md mt-2">¡Haz clic en "Crear Nuevo Blog" para empezar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBlogs;
