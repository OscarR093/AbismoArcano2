// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById, getPostsByBlogId, checkSubscriptionStatus, subscribeToBlog } from '../api'; // Importa funciones de API
import BlogPostCard from '../components/BlogPostCard';
import Modal from '../components/Modal'; // Importa el componente Modal
import { PlusCircle, ArrowLeft, CreditCard } from 'lucide-react';

function BlogDetail({ userId }) {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Nuevo estado de suscripción
  const [showSubscribeModal, setShowSubscribeModal] = useState(false); // Estado para el modal de suscripción

  // Estados para el formulario de tarjeta simulado
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!userId || !blogId) {
      console.log("userId o blogId no disponible.");
      setLoading(false);
      return;
    }

    const fetchBlogAndPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Obtener detalles del blog del backend
        const blogData = await getBlogById(blogId);

        if (blogData) {
          setBlog(blogData);
          setIsOwner(`user-${blogData.owner_id}` === userId); // Comprobar si el usuario actual es el dueño (el backend devuelve owner_id numérico)

          // 2. Verificar estado de suscripción si el blog es de pago y no es el dueño
          if (blogData.subscription_price > 0 && `user-${blogData.owner_id}` !== userId) {
            const subStatus = await checkSubscriptionStatus(blogId);
            setIsSubscribed(subStatus.isSubscribed);
          } else {
            setIsSubscribed(true); // Si es gratis o eres el dueño, consideras que "tienes acceso"
          }

          // 3. Obtener posts del blog del backend (el backend ya filtra los de pago)
          const postsData = await getPostsByBlogId(blogId);
          setPosts(postsData);
          setLoading(false);
        } else {
          setError("Blog no encontrado.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error al obtener detalles del blog o posts del backend:", err);
        setError(err.message || "Error al cargar el blog. Asegúrate de que el backend está corriendo.");
        setLoading(false);
      }
    };

    fetchBlogAndPosts();
  }, [userId, blogId]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    // Simulación de validación de tarjeta (muy básica)
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setPaymentError('Por favor, rellena todos los campos de la tarjeta.');
      setPaymentProcessing(false);
      return;
    }
    // Simular que el pago es exitoso
    // En una aplicación real, aquí integrarías con Stripe, PayPal, etc.
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      // Llama a la API de backend para registrar la suscripción
      await subscribeToBlog(blogId);
      setPaymentSuccess(true);
      setIsSubscribed(true); // Actualiza el estado local
      setPaymentProcessing(false);
      // Opcional: Recargar los posts para ver los de pago si aplicara
      // const postsData = await getPostsByBlogId(blogId); // Recargar los posts después de la suscripción
      // setPosts(postsData);
      setTimeout(() => setShowSubscribeModal(false), 1000); // Cierra el modal después de éxito
    } catch (err) {
      console.error("Error al suscribirse:", err);
      setPaymentError(err.message || "Error al procesar la suscripción. Inténtalo de nuevo.");
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-text-light-gray text-lg">Cargando blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-button-golden">
        <p className="text-lg">{error}</p>
        <Link to="/" className="inline-flex items-center mt-4 px-6 py-3 bg-button-golden text-primary-dark-violet rounded-md hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-md">
          <ArrowLeft className="mr-2" size={20} />
          Volver a la lista de blogs
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-text-light-gray">El blog no pudo ser cargado.</p>
        <Link to="/" className="inline-flex items-center mt-4 px-6 py-3 bg-button-golden text-primary-dark-violet rounded-md hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-md">
          <ArrowLeft className="mr-2" size={20} />
          Volver a la lista de blogs
        </Link>
      </div>
    );
  }

  // Comprueba si el blog tiene precio de suscripción y el usuario no es el dueño ni está suscrito
  const canSubscribe = blog.subscription_price > 0 && !isOwner && !isSubscribed;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-accent-purple hover:text-button-golden transition-colors duration-200 mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-4xl font-extrabold text-text-light-gray leading-tight">{blog.title}</h1>
      </div>
      <p className="text-text-light-gray text-xl mb-6">{blog.description}</p>
      
      {/* Mostrar precio de suscripción y botón de Suscribirse */}
      {blog.subscription_price > 0 && (
        <div className="bg-accent-purple bg-opacity-20 border border-accent-purple text-text-light-gray px-6 py-4 rounded-md mb-8 shadow-md flex justify-between items-center">
          <span className="text-xl font-semibold">
            Precio de suscripción: ${blog.subscription_price.toFixed(2)}
          </span>
          {canSubscribe && (
            <button
              onClick={() => setShowSubscribeModal(true)}
              className="inline-flex items-center px-6 py-3 bg-button-golden text-primary-dark-violet rounded-full font-semibold text-lg hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-lg"
            >
              <CreditCard className="mr-2" size={24} />
              Suscribirse
            </button>
          )}
          {isSubscribed && !isOwner && (
            <span className="text-hover-emerald-tint font-bold text-lg">¡Suscrito!</span>
          )}
          {isOwner && (
             <span className="text-accent-purple font-bold text-lg">Eres el dueño de este blog.</span>
          )}
        </div>
      )}


      {isOwner && (
        <div className="flex justify-center mb-10">
          <Link to={`/blogs/${blog.id}/create-post`}
                className="inline-flex items-center px-6 py-3 bg-button-golden text-primary-dark-violet rounded-full font-semibold text-lg hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-lg">
            <PlusCircle className="mr-2" size={24} />
            Crear Nuevo Post
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-text-light-gray text-lg">Este blog aún no tiene posts.</p>
          {isOwner && (
            <p className="text-text-light-gray text-md mt-2">¡Sé el primero en añadir uno!</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <BlogPostCard key={post.id} blogId={blog.id} post={post} />
          ))}
        </div>
      )}

      {/* Modal de Suscripción */}
      <Modal isOpen={showSubscribeModal} onClose={() => setShowSubscribeModal(false)} title={`Suscribirse a ${blog?.title}`}>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <p className="text-primary-dark-violet mb-4">
            Precio de suscripción: <span className="font-bold text-accent-purple">${blog?.subscription_price.toFixed(2)}</span>
          </p>
          <p className="text-primary-dark-violet text-sm">
            Ingresa tus detalles de tarjeta para simular el pago. Esto no procesará dinero real.
          </p>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-primary-dark-violet mb-1">Número de Tarjeta</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet"
              placeholder="XXXX XXXX XXXX XXXX"
              required
            />
          </div>
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-primary-dark-violet mb-1">Nombre en la Tarjeta</label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet"
              placeholder="Nombre Apellido"
              required
            />
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-primary-dark-violet mb-1">Fecha de Vencimiento (MM/AA)</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet"
                placeholder="MM/AA"
                maxLength="5"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="cvv" className="block text-sm font-medium text-primary-dark-violet mb-1">CVV</label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet"
                placeholder="XXX"
                maxLength="4"
                required
              />
            </div>
          </div>
          {paymentError && <p className="text-button-golden text-sm mt-2">{paymentError}</p>}
          {paymentSuccess && <p className="text-hover-emerald-tint text-sm mt-2 font-semibold">¡Pago simulado exitoso y suscripción activada!</p>}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-button-golden text-primary-dark-violet rounded-md font-semibold hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={paymentProcessing}
          >
            {paymentProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-primary-dark-violet" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              <span className="flex items-center">
                <CreditCard className="mr-2" size={20} />
                Confirmar Suscripción
              </span>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default BlogDetail;
