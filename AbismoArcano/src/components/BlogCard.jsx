// src/components/BlogCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { User, CalendarDays } from 'lucide-react'; // Iconos

function BlogCard({ blog }) {
  // Asegúrate de que owner_username esté disponible si viene del backend
  const ownerDisplay = blog.owner_username || blog.ownerId; // Usa owner_username del backend o fallback a ownerId

  return (
    <div className="bg-text-light-gray rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <Link to={`/blogs/${blog.id}`}>
        <img
          src={blog.image_url || `https://placehold.co/600x400/2C2B3F/EAEAEA?text=${encodeURIComponent(blog.title)}`} // Usar blog.image_url
          alt={blog.title}
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/2C2B3F/EAEAEA?text=Imagen+No+Disp.` }}
        />
      </Link>
      <div className="p-6 flex flex-col justify-between h-auto">
        <h2 className="text-2xl font-bold text-primary-dark-violet mb-2 leading-tight">
          <Link to={`/blogs/${blog.id}`} className="hover:text-accent-purple transition-colors duration-200">
            {blog.title}
          </Link>
        </h2>
        <p className="text-primary-dark-violet text-sm mb-4 flex-grow line-clamp-3">{blog.description}</p>
        <div className="flex items-center text-primary-dark-violet text-xs mt-auto">
          <User className="mr-1" size={16} />
          <span>Creado por: {ownerDisplay}</span>
          <CalendarDays className="ml-4 mr-1" size={16} />
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
