// src/components/BlogPostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react'; // Icono

function BlogPostCard({ blogId, post }) {
  return (
    <div className="bg-text-light-gray rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <Link to={`/blogs/${blogId}/posts/${post.id}`}>
        <img
          src={post.image_url || `https://placehold.co/600x300/2C2B3F/EAEAEA?text=${encodeURIComponent(post.title)}`} // Usar post.image_url
          alt={post.title}
          className="w-full h-40 object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x300/2C2B3F/EAEAEA?text=Imagen+No+Disp.` }}
        />
      </Link>
      <div className="p-5 flex flex-col justify-between h-auto">
        <h3 className="text-xl font-bold text-primary-dark-violet mb-2 leading-tight">
          <Link to={`/blogs/${blogId}/posts/${post.id}`} className="hover:text-accent-purple transition-colors duration-200">
            {post.title}
          </Link>
        </h3>
        <p className="text-primary-dark-violet text-sm mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center text-primary-dark-violet text-xs mt-auto">
          <CalendarDays className="mr-1" size={16} />
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogPostCard;
