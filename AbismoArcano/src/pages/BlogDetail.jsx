// src/pages/BlogDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMockBlogById, getMockPostsByBlogId } from '../mockData'; // Importa funciones simuladas
import BlogPostCard from '../components/BlogPostCard';
import { PlusCircle, ArrowLeft } from 'lucide-react';

function BlogDetail({ userId }) {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false); // Estado para saber si el usuario actual es el dueño del blog

  useEffect(() => {
    if (!userId || !blogId) {
      console.log("userId o blogId no disponible.");
      return;
    }

    const fetchBlogAndPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Obtener detalles del blog simulado
        const blogData = await getMockBlogById(blogId);

        if (blogData) {
          setBlog(blogData);
          setIsOwner(blogData.ownerId === userId); // Comprobar si el usuario actual es el dueño

          // 2. Obtener posts del blog simulado
          const postsData = await getMockPostsByBlogId(blogId);
          setPosts(postsData);
          setLoading(false);
        } else {
          setError("Blog no encontrado.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error al obtener detalles del blog o posts simulados:", err);
        setError("Error al cargar el blog.");
        setLoading(false);
      }
    };

    fetchBlogAndPosts();
  }, [userId, blogId]); // Dependencias: userId y blogId

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
        {/* Botón de volver a la lista de blogs: texto oscuro sobre dorado/esmeralda */}
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
        {/* Botón de volver a la lista de blogs: texto oscuro sobre dorado/esmeralda */}
        <Link to="/" className="inline-flex items-center mt-4 px-6 py-3 bg-button-golden text-primary-dark-violet rounded-md hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-md">
          <ArrowLeft className="mr-2" size={20} />
          Volver a la lista de blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="text-accent-purple hover:text-button-golden transition-colors duration-200 mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-4xl font-extrabold text-text-light-gray leading-tight">{blog.title}</h1>
      </div>
      <p className="text-text-light-gray text-xl mb-6">{blog.description}</p>

      {isOwner && (
        <div className="flex justify-center mb-10">
          {/* Botón Crear Nuevo Post: texto oscuro sobre dorado/esmeralda */}
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
    </div>
  );
}

export default BlogDetail;
