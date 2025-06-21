// src/pages/CreateBlog.jsx
import React, { useState } from 'react';
import { addMockBlog } from '../mockData'; // Importa la función para añadir blog simulado
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';

function CreateBlog({ userId }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("Error: ID de usuario no disponible. Recarga la página.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await addMockBlog({
        title,
        description,
        imageUrl: imageUrl || `https://placehold.co/600x400/${encodeURIComponent('2C2B3F').substring(1)}/${encodeURIComponent('EAEAEA').substring(1)}?text=${encodeURIComponent(title || 'Mi Blog')}`,
        ownerId: userId, // Asigna el blog al usuario actual simulado
      });
      setSuccess(true);
      setTitle('');
      setDescription('');
      setImageUrl('');
      // Redirigir a "Mis Blogs" después de un breve retraso
      setTimeout(() => {
        navigate('/my-blogs');
      }, 1500);
    } catch (err) {
      console.error("Error al crear blog simulado:", err);
      setError("Error al crear el blog. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-text-light-gray rounded-lg shadow-xl">
      <div className="flex items-center mb-6">
        {/* Botón Volver a Mis Blogs: texto oscuro sobre dorado/esmeralda */}
        <button onClick={() => navigate('/my-blogs')}
                className="inline-flex items-center px-4 py-2 bg-button-golden text-primary-dark-violet rounded-md hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-md mr-4">
          <ArrowLeft className="mr-2" size={20} />
          Volver a Mis Blogs
        </button>
        <h1 className="text-4xl font-bold text-primary-dark-violet leading-tight">Crear Nuevo Blog</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-primary-dark-violet mb-2">Título del Blog</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg"
            placeholder="Ej. Mi Aventura de Viajes"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-lg font-medium text-primary-dark-violet mb-2">Descripción del Blog</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg resize-y"
            placeholder="Una breve descripción de lo que tratará tu blog..."
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-lg font-medium text-primary-dark-violet mb-2">URL de la Imagen (Opcional)</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
        {/* Mensajes de error y éxito con colores para contraste */}
        {error && <p className="text-button-golden text-center">{error}</p>}
        {success && <p className="text-hover-emerald-tint text-center font-semibold">Blog creado exitosamente. Redirigiendo...</p>}
        {/* Botón de submit: texto oscuro sobre dorado/esmeralda */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-button-golden text-primary-dark-violet rounded-md font-semibold text-xl hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-dark-violet" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando...
            </span>
          ) : (
            <span className="flex items-center">
              <PlusCircle className="mr-2" size={24} />
              Crear Blog
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

export default CreateBlog;
