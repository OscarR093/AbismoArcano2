// src/components/Footer.jsx
import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react'; // Iconos para redes sociales

function Footer() {
  return (
    <footer className="bg-primary-dark-violet text-text-light-gray py-8 mt-12 shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm mb-4">&copy; {new Date().getFullYear()} Mi Blog Multi-Usuario. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-6">
          <a href="https://github.com/tu_usuario" target="_blank" rel="noopener noreferrer"
             className="text-text-light-gray hover:text-accent-purple transition-colors duration-200">
            <Github size={24} />
          </a>
          <a href="https://twitter.com/tu_usuario" target="_blank" rel="noopener noreferrer"
             className="text-text-light-gray hover:text-accent-purple transition-colors duration-200">
            <Twitter size={24} />
          </a>
          <a href="https://linkedin.com/in/tu_usuario" target="_blank" rel="noopener noreferrer"
             className="text-text-light-gray hover:text-accent-purple transition-colors duration-200">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
