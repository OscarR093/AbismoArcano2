// src/pages/About.jsx
import React from 'react';
import { Info } from 'lucide-react'; // Icono

function About() {
  return (
    <div className="container mx-auto px-4 py-8 bg-text-light-gray rounded-lg shadow-xl text-center">
      <h1 className="text-4xl font-bold text-primary-dark-violet mb-6 flex items-center justify-center">
        <Info className="mr-3 text-accent-purple" size={32} />
        Acerca de Mi Blog Multi-Usuario
      </h1>
      <p className="text-lg text-primary-dark-violet mb-4">
        Bienvenido a esta plataforma de blogs dinámica, donde cada usuario puede ser un creador de contenido.
      </p>
      <p className="text-lg text-primary-dark-violet mb-4">
        Aquí, te animamos a crear tus propios blogs, compartir tus ideas y gestionar tus publicaciones de manera sencilla. Nuestra misión es proporcionar una experiencia de blogging fluida y colaborativa.
      </p>
      <p className="text-lg text-primary-dark-violet">
        ¡Explora los blogs de otros usuarios, o empieza el tuyo propio hoy mismo!
      </p>
    </div>
  );
}

export default About;
