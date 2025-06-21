// src/pages/MyBlogs.jsx
import React, { useState, useEffect } from 'react';
import { getBlogs, getUserSubscriptions } from '../api'; // Obtiene todos los blogs del backend, y suscripciones
import BlogCard from '../components/BlogCard';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function MyBlogs({ userId }) {
  const [myBlogs, setMyBlogs] = useState([]);
  const [mySubscriptions, setMySubscriptions] = useState([]); // Nuevo estado para suscripciones
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("ID de usuario no disponible. Inicia sesión para ver tus blogs.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Obtener todos los blogs y filtrar los propios
        const allBlogs = await getBlogs();
        const filteredBlogs = allBlogs.filter(blog => `user-${blog.owner_id}` === userId);
        setMyBlogs(filteredBlogs);

        // Obtener las suscripciones del usuario
        const subscriptions = await getUserSubscriptions();
        setMySubscriptions(subscriptions);

        setLoading(false);
      } catch (err) {
        console.error("Error al obtener mis blogs o suscripciones del backend:", err);
        setError("Error al cargar tus blogs y suscripciones. Asegúrate de que el backend está corriendo.");
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]); // Dependencia: userId

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-text-light-gray text-lg">Cargando tus blogs y suscripciones...</p>
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

      {/* Sección de Mis Suscripciones */}
      <h2 className="text-3xl font-bold text-text-light-gray mt-12 mb-8 text-center">Mis Suscripciones</h2>
      {mySubscriptions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-text-light-gray text-lg">Aún no estás suscrito a ningún blog.</p>
          <p className="text-text-light-gray text-md mt-2">Explora la <Link to="/" className="text-accent-purple hover:underline">página de inicio</Link> para encontrar blogs interesantes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mySubscriptions.map(sub => (
            <BlogCard key={sub.blog_id} blog={{
                id: sub.blog_id,
                title: sub.title,
                description: sub.description,
                image_url: sub.image_url,
                owner_id: sub.owner_id,
                owner_username: sub.owner_username,
                created_at: sub.created_at, // Si tienes esta info en la suscripción
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBlogs;
