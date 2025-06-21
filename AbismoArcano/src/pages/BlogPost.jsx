// src/pages/BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMockPostsByBlogId } from '../mockData'; // Importa funciones simuladas
import { CalendarDays, ArrowLeft } from 'lucide-react'; // Iconos

function BlogPost({ userId }) { // userId no se usa directamente aquí, pero se mantiene por consistencia
  const { blogId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!blogId || !postId) {
      console.log("blogId o postId no disponible.");
      return;
    }

    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const blogPosts = await getMockPostsByBlogId(blogId);
        const foundPost = blogPosts.find(p => p.id === postId);

        if (foundPost) {
          setPost(foundPost);
        } else {
          setError("Post no encontrado.");
        }
      } catch (err) {
        console.error("Error al obtener post simulado:", err);
        setError("Error al cargar el post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [blogId, postId]); // Dependencias: blogId y postId

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
        {/* Botón de volver al Blog: texto oscuro sobre dorado/esmeralda */}
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
        {/* Botón de volver al Blog: texto oscuro sobre dorado/esmeralda */}
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
        <Link to={`/blogs/${blogId}`} className="text-accent-purple hover:text-button-golden transition-colors duration-200 mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-4xl font-extrabold text-primary-dark-violet leading-tight">{post.title}</h1>
      </div>
      <img
        src={post.imageUrl || `https://placehold.co/800x400/${encodeURIComponent('2C2B3F').substring(1)}/${encodeURIComponent('EAEAEA').substring(1)}?text=${encodeURIComponent(post.title)}`}
        alt={post.title}
        className="w-full h-80 object-cover rounded-lg mb-8 shadow-md"
        onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/800x400/${encodeURIComponent('2C2B3F').substring(1)}/${encodeURIComponent('EAEAEA').substring(1)}?text=Imagen+No+Disp.` }}
      />
      <p className="text-primary-dark-violet text-sm mb-6 flex items-center">
        <CalendarDays className="mr-2" size={18} />
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div className="prose prose-lg max-w-none text-primary-dark-violet leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </div>
  );
}

export default BlogPost;
