// src/pages/BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById, checkSubscriptionStatus, getBlogById } from '../api'; // Importa funciones de API
import { CalendarDays, ArrowLeft, Lock } from 'lucide-react'; // Iconos

function BlogPost({ userId }) {
  const { blogId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isPaidPost, setIsPaidPost] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [blogRequiresSubscription, setBlogRequiresSubscription] = useState(false);

  useEffect(() => {
    if (!userId || !blogId || !postId) {
      console.log("userId, blogId o postId no disponible.");
      setError("Datos de acceso incompletos."); // Asigna un error para mostrarlo
      setLoading(false);
      return;
    }

    const fetchPostAndSubscriptionStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const blogData = await getBlogById(blogId);
        if (!blogData) {
          setError("Blog no encontrado.");
          setLoading(false);
          return;
        }
        setBlogRequiresSubscription(blogData.subscription_price > 0);
        setIsOwner(`user-${blogData.owner_id}` === userId);

        const postData = await getPostById(blogId, postId); // Ya no pasamos userId, el header X-User-Id se maneja en api.js
        if (postData) {
          setPost(postData);
          setIsPaidPost(postData.is_paid === 1); // El backend ya devuelve 0 o 1
        } else {
          setError("Post no encontrado o acceso denegado."); // Esto podría ser un error 403 del backend
          setLoading(false);
          return;
        }

        // Si el post es de pago y no es el dueño, verifica suscripción
        if (postData.is_paid === 1 && `user-${blogData.owner_id}` !== userId) {
          const subStatus = await checkSubscriptionStatus(blogId); // Ya no pasamos userId
          setIsSubscribed(subStatus.isSubscribed);
        } else {
          setIsSubscribed(true); // Es gratis, o es el dueño, o no requiere suscripción, o ya está suscrito
        }

        setLoading(false);
      } catch (err) {
        console.error("Error al obtener post o estado de suscripción del backend:", err);
        // Captura errores específicos como 403 del backend
        if (err.status === 403) {
          setError(err.message || 'Acceso denegado: Este post es premium.');
        } else {
          setError(err.message || "Error al cargar el post. Asegúrate de que el backend está corriendo.");
        }
        setLoading(false);
      }
    };

    fetchPostAndSubscriptionStatus();
  }, [userId, blogId, postId]);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-text-light-gray text-lg">Cargando post...</p>
      </div>
    );
  }

  if (error) {
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

  if (!post) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-text-light-gray">El post no pudo ser cargado.</p>
        <Link to={`/blogs/${blogId}`} className="inline-flex items-center mt-4 px-6 py-3 bg-button-golden text-primary-dark-violet rounded-md hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-md">
          <ArrowLeft className="mr-2" size={20} />
          Volver al Blog
        </Link>
      </div>
    );
  }

  // Lógica de acceso al contenido del post
  const canAccessContent = !isPaidPost || isOwner || isSubscribed || !blogRequiresSubscription;

  return (
    <div className="container mx-auto px-4 py-8 bg-text-light-gray rounded-lg shadow-xl">
      <div className="flex items-center mb-6">
        <Link to={`/blogs/${blogId}`} className="text-accent-purple hover:text-button-golden transition-colors duration-200 mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-4xl font-extrabold text-primary-dark-violet leading-tight">{post.title}</h1>
      </div>
      <img
        src={post.image_url || `https://placehold.co/800x400/2C2B3F/EAEAEA?text=${encodeURIComponent(post.title)}`} // Usa image_url
        alt={post.title}
        className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"
        onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/800x400/2C2B3F/EAEAEA?text=Imagen+No+Disp.` }}
      />
      <p className="text-primary-dark-violet text-sm mb-6 flex items-center">
        <CalendarDays className="mr-2" size={18} />
        {new Date(post.created_at).toLocaleDateString()} {/* Usa created_at */}
        {isPaidPost && (
          <span className="ml-4 px-3 py-1 bg-button-golden text-primary-dark-violet rounded-full text-xs font-semibold flex items-center">
            <Lock size={14} className="mr-1" />
            Premium
          </span>
        )}
      </p>

      {canAccessContent ? (
        <div className="prose prose-lg max-w-none text-primary-dark-violet leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      ) : (
        <div className="text-center py-10 bg-primary-dark-violet bg-opacity-10 rounded-lg border border-accent-purple p-8">
          <Lock size={64} className="text-button-golden mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-text-light-gray mb-4">Contenido Premium</h2>
          <p className="text-text-light-gray text-lg mb-6">Este post es de pago. Suscríbete al blog para acceder a este contenido.</p>
          <Link
            to={`/blogs/${blogId}`}
            className="inline-flex items-center px-8 py-4 bg-button-golden text-primary-dark-violet rounded-full font-bold text-lg hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-lg"
          >
            Ver opciones de suscripción
          </Link>
        </div>
      )}
    </div>
  );
}

export default BlogPost;
