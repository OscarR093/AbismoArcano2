// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { BookText, PlusCircle, User, LogOut, LogIn } from 'lucide-react'; // Importa iconos de Lucide

function Header({ userId, onLogout }) {
  return (
    <header className="bg-primary-dark-violet text-text-light-gray shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-accent-purple hover:text-button-golden transition-colors duration-200">
          AbismoArcano
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="flex items-center text-lg font-semibold hover:text-accent-purple transition-colors duration-200">
            <BookText className="mr-2" size={20} />
            Inicio
          </Link>
          
          {userId && ( // Muestra estos enlaces solo si el usuario está logueado
            <>
              <Link to="/my-blogs" className="flex items-center text-lg font-semibold hover:text-accent-purple transition-colors duration-200">
                <User className="mr-2" size={20} />
                Mis Blogs
              </Link>
              <Link to="/create-blog" className="flex items-center text-lg font-semibold hover:text-accent-purple transition-colors duration-200">
                <PlusCircle className="mr-2" size={20} />
                Crear Blog
              </Link>
            </>
          )}

          <Link to="/about" className="text-lg font-semibold hover:text-accent-purple transition-colors duration-200">
            Acerca de
          </Link>
          <Link to="/contact" className="text-lg font-semibold hover:text-accent-purple transition-colors duration-200">
            Contacto
          </Link>

          {userId ? ( // Si el usuario está logueado, muestra el botón de Logout
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 bg-button-golden text-primary-dark-violet rounded-md font-semibold text-base hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-md"
            >
              <LogOut className="mr-2" size={20} />
              Cerrar Sesión
            </button>
          ) : ( // Si no está logueado, muestra el botón de Login
            <Link to="/login" className="inline-flex items-center px-4 py-2 bg-accent-purple text-text-light-gray rounded-md font-semibold text-base hover:bg-button-golden transition-colors duration-200 shadow-md">
              <LogIn className="mr-2" size={20} />
              Iniciar Sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
