// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Frown } from 'lucide-react'; // Icono

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-10 text-center bg-text-light-gray rounded-lg shadow-xl">
      <Frown size={80} className="text-button-golden mb-6" />
      <h1 className="text-5xl font-extrabold text-primary-dark-violet mb-4">404 - Página No Encontrada</h1>
      <p className="text-xl text-primary-dark-violet mb-8">
        Lo sentimos, la página que estás buscando no existe.
      </p>
      <Link to="/" className="inline-flex items-center px-8 py-4 bg-button-golden text-primary-dark-violet rounded-full font-bold text-lg hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-lg">
        Volver a la Página Principal
      </Link>
    </div>
  );
}

export default NotFound;
