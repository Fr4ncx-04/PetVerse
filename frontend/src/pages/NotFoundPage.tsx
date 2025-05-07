import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const NotFoundPage: React.FC = () => {

  const { language, theme } = useThemeLanguage();

  const title = language === 'es' ? 'Página no encontrada' : 'Page Not Found';
  const message = language === 'es' ? 'Lo sentimos, la página que estás buscando no existe.' : 'Sorry, the page you are looking for does not exist.';
  const linkText = language === 'es' ? 'Volver a la página de inicio' : 'Go back to Home';

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen
                  p-5 transition-colors duration-300
                  ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        404
      </h1>
      <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6 text-center">
        {title}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center">
        {message}
      </p>
      <Link
        to="/"
        className={`px-6 py-3 rounded-lg text-lg font-medium transition duration-300 ease-in-out
                    ${theme === 'dark'
                      ? 'bg-green-700 text-white hover:bg-green-600'
                      : 'bg-green-600 text-white hover:bg-green-700'
                    }
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
      >
        {linkText}
      </Link>
    </div>
  );
};

export default NotFoundPage;