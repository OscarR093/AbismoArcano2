// src/pages/CreatePost.jsx
import React, { useState, useEffect } from 'react';
import { createPost, getBlogById } from '../api'; // Importa funciones de API
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';

function CreatePost({ userId }) {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blogTitle, setBlogTitle] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState(''); // Contenido HTML o Markdown
  const [imageUrl, setImageUrl] = useState(''); // Estado para la URL de la imagen
  const [isPaid, setIsPaid] = useState(false); // Nuevo estado para post de pago
  const [loading, setLoading] = useState(false); // Para el envío del formulario
  const [initialLoad, setInitialLoad] = useState(true); // Nuevo estado para la carga inicial/verificación de propiedad
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!userId || !blogId) {
      setError("Error: Datos de usuario o blogId no disponibles. Recarga la página.");
      setInitialLoad(false); // Marca como cargado aunque haya error
      return;
    }

    const checkOwnership = async () => {
      setInitialLoad(true); // Inicia la carga inicial
      setError(null); // Limpia errores anteriores
      try {
        const blogData = await getBlogById(blogId); // Obtener blog del backend
        if (blogData) {
          setBlogTitle(blogData.title);
          // owner_id del backend es numérico, userId es 'user-X'
          if (`user-${blogData.owner_id}` === userId) {
            setIsOwner(true);
          } else {
            setError("No tienes permiso para añadir posts a este blog.");
            setIsOwner(false);
          }
        } else {
          setError("Blog no encontrado.");
          setIsOwner(false);
        }
      } catch (err) {
        console.error("Error al verificar la propiedad del blog:", err);
        setError(err.message || "Error al verificar el blog.");
        setIsOwner(false);
      } finally {
        setInitialLoad(false); // Finaliza la carga inicial
      }
    };

    checkOwnership();
  }, [userId, blogId]); // Dependencias: userId y blogId

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !isOwner) {
      setError("No tienes permiso para realizar esta acción.");
      return;
    }

    setLoading(true); // Inicia la carga del formulario
    setError(null);
    setSuccess(false);

    try {
      const newPostData = {
        title,
        excerpt,
        content,
        image_url: imageUrl || `https://placehold.co/600x300/2C2B3F/EAEAEA?text=${encodeURIComponent(title || 'Nuevo Post')}`, // Usar image_url para enviar al backend
        isPaid: isPaid, // Envía el estado de pago
      };

      await createPost(blogId, newPostData); // Llama a la API para crear el post

      setSuccess(true);
      setTitle('');
      setExcerpt('');
      setContent('');
      setImageUrl('');
      setIsPaid(false); // Reinicia el estado de pago
      setTimeout(() => {
        navigate(`/blogs/${blogId}`); // Redirige al blog después de crear el post
      }, 1500);
    } catch (err) {
      console.error("Error al crear post en el backend:", err);
      setError(err.message || "Error al crear el post. Inténtalo de nuevo.");
    } finally {
      setLoading(false); // Finaliza la carga del formulario
    }
  };

  // Muestra un mensaje de carga inicial mientras se verifica la propiedad
  if (initialLoad) {
    return (
      <div className="text-center py-10">
        <p className="text-text-light-gray text-lg">Verificando permisos...</p>
      </div>
    );
  }

  // Muestra el error si no es propietario o si hay otro error de carga inicial
  if (!isOwner && error) {
    return (
      <div className="text-center py-10 text-button-golden">
        <p className="text-lg">{error}</p>
        <Link to={`/blogs/${blogId}`} className="inline-flex items-center mt-4 px-6 py-3 bg-button-golden text-primary-dark-violet rounded-md hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-md">
          <ArrowLeft className="mr-2" size={20} />
          Volver al Blog
        </Link>
      </div>
    );
  }

  if (!isOwner && !error) {
    return (
      <div className="text-center py-10 text-button-golden">
        <p className="text-lg">Acceso Denegado: No eres el propietario de este blog.</p>
        <Link to={`/blogs/${blogId}`} className="inline-flex items-center mt-4 px-6 py-3 bg-button-golden text-primary-dark-violet rounded-md hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-md">
          <ArrowLeft className="mr-2" size={20} />
          Volver al Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-text-light-gray rounded-lg shadow-xl">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(`/blogs/${blogId}`)}
                className="inline-flex items-center px-4 py-2 bg-button-golden text-primary-dark-violet rounded-md hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-md mr-4">
          <ArrowLeft className="mr-2" size={20} />
          Volver a "{blogTitle || 'Blog'}"
        </button>
        <h1 className="text-4xl font-bold text-primary-dark-violet leading-tight">Crear Nuevo Post en "{blogTitle}"</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-medium text-primary-dark-violet mb-2">Título del Post</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg"
            placeholder="Ej. Mi primera receta de cocina"
            required
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-lg font-medium text-primary-dark-violet mb-2">Resumen (Excerpt)</label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg resize-y"
            placeholder="Un pequeño párrafo que resuma el contenido del post..."
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="content" className="block text-lg font-medium text-primary-dark-violet mb-2">Contenido del Post (HTML o Markdown)</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg resize-y"
            placeholder="Escribe el contenido de tu post aquí. Puedes usar HTML básico o Markdown."
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
            placeholder="https://ejemplo.com/imagen-post.jpg"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPaid"
            checked={isPaid}
            onChange={(e) => setIsPaid(e.target.checked)}
            className="h-5 w-5 text-accent-purple border-gray-300 rounded focus:ring-accent-purple"
          />
          <label htmlFor="isPaid" className="ml-2 block text-lg font-medium text-primary-dark-violet">
            Post de Pago (Requiere suscripción al blog)
          </label>
        </div>
        {error && <p className="text-button-golden text-center">{error}</p>}
        {success && <p className="text-hover-emerald-tint text-center font-semibold">Post creado exitosamente. Redirigiendo...</p>}
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
              Crear Post
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
