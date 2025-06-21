// src/pages/Contact.jsx
import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react'; // Iconos

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Enviando...');
    // setError(null); // No hay setError aquí, ya que no hay llamadas a la API que puedan fallar de esta manera.

    try {
      // Simulación de envío - En una app real, aquí enviarías a un backend/servicio de correo
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Datos del formulario:', formData);
      setStatus('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
      setFormData({ name: '', email: '', message: '' }); // Limpiar formulario
    } catch (error) {
      console.error('Error al enviar el formulario (simulado):', error);
      setStatus('Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-text-light-gray rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold text-primary-dark-violet mb-8 text-center flex items-center justify-center">
        <Mail className="mr-3 text-accent-purple" size={32} />
        Contáctanos
      </h1>
      <p className="text-lg text-primary-dark-violet mb-8 text-center">
        ¿Tienes preguntas, sugerencias o simplemente quieres saludar? ¡Envíanos un mensaje!
      </p>

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-primary-dark-violet mb-2">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg"
            placeholder="Tu nombre completo"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-lg font-medium text-primary-dark-violet mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg"
            placeholder="tu@correo.com"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-lg font-medium text-primary-dark-violet mb-2">Mensaje</label>
          <textarea
            id="message"
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg resize-y"
            placeholder="Escribe tu mensaje aquí..."
            required
          ></textarea>
        </div>

        {status && (
          <p className={`text-center font-semibold text-lg ${status.includes('éxito') ? 'text-hover-emerald-tint' : 'text-button-golden'}`}>
            {status}
          </p>
        )}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center px-6 py-3 bg-button-golden text-primary-dark-violet rounded-md font-semibold text-xl hover:bg-hover-emerald-tint hover:text-text-light-gray transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-dark-violet" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </span>
          ) : (
            <span className="flex items-center">
              <Send className="mr-2" size={24} />
              Enviar Mensaje
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

export default Contact;
