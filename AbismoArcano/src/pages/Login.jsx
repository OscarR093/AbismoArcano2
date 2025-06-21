// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register, setToken } from '../api'; // Importa las funciones de API y setToken
import { LogIn, UserPlus } from 'lucide-react'; // Iconos

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false); // Nuevo estado para alternar entre login y registro
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let data;
      if (isRegisterMode) {
        data = await register(username, password);
      } else {
        data = await login(username, password);
      }
      
      setToken(data.userId); // Almacena el userId retornado por el backend como nuestro "token"
      if (onLoginSuccess) {
        onLoginSuccess(data.userId); // Pasa el userId al App.jsx
      }
      navigate('/'); // Redirige a la página principal
    } catch (err) {
      console.error('Error de autenticación:', err);
      // El backend ya debería enviar un mensaje de error legible
      setError(err.message || 'Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark-violet px-4">
      <div className="bg-text-light-gray rounded-lg shadow-xl p-8 md:p-10 max-w-md w-full text-center">
        {isRegisterMode ? (
          <UserPlus size={64} className="text-accent-purple mx-auto mb-6" />
        ) : (
          <LogIn size={64} className="text-accent-purple mx-auto mb-6" />
        )}
        
        <h1 className="text-3xl font-bold text-primary-dark-violet mb-6">
          {isRegisterMode ? 'Registrarse' : 'Iniciar Sesión'}
        </h1>
        <p className="text-primary-dark-violet mb-8">
          {isRegisterMode 
            ? 'Crea una cuenta para empezar a publicar blogs.'
            : 'Ingresa tus credenciales para acceder.'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg"
              placeholder="Nombre de usuario"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-accent-purple focus:border-accent-purple text-primary-dark-violet text-lg"
              placeholder="Contraseña"
              required
            />
          </div>

          {error && <p className="text-button-golden text-sm mb-4">{error}</p>}

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
                {isRegisterMode ? 'Registrando...' : 'Iniciando...'}
              </span>
            ) : (
              <span className="flex items-center">
                {isRegisterMode ? <UserPlus className="mr-2" size={24} /> : <LogIn className="mr-2" size={24} />}
                {isRegisterMode ? 'Registrarse' : 'Entrar'}
              </span>
            )}
          </button>
        </form>

        <button
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          className="mt-6 text-accent-purple hover:text-button-golden transition-colors duration-200 text-sm"
        >
          {isRegisterMode 
            ? '¿Ya tienes una cuenta? Iniciar Sesión' 
            : '¿No tienes una cuenta? Regístrate aquí'}
        </button>
      </div>
    </div>
  );
}

export default Login;
