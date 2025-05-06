import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

const Footer: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const content = {
    en: {
      about: 'About PetVerse',
      description:
        "Your one-stop destination for quality pet products, pet adoption, and expert advice.",
      partners: 'Our Partners',
      contactUs: 'Contact Us',
      email: 'Email: support@petverse.com',
      phone: 'Phone: (123) 456-7890',
      rights: 'All rights reserved.',
    },
    es: {
      about: 'Sobre PetVerse',
      description:
        'Tu destino único para productos de calidad, adopción y servicios para tus mascotas.',
      partners: 'Nuestros Socios',
      contactUs: 'Contáctanos',
      email: 'Correo: support@petverse.com',
      phone: 'Teléfono: (123) 456-7890',
      rights: 'Todos los derechos reservados.',
    },
  };
  const text = content[language] || content.es;
  
  return (
    <footer
    className={`left-0 right-0 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-900 text-white'
    } transition-all duration-300 p-8`}
    style={{ boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Decorative top border */}
      <div className={`h-1 w-full ${theme === 'dark' ? 'bg-green-500' : 'bg-primary-500'}`}></div>
      
      {/* Main content area with new layout */}
      <div className="container mx-auto py-12 px-4">
        {/* Logo and description section */}
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <h2 className="text-2xl font-extrabold tracking-tight mb-4" style={{ letterSpacing: "-0.025em" }}>
              PetVerse
            </h2>
            <p className="text-sm leading-relaxed max-w-md opacity-80" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              {text.description}
            </p>
          </div>
          
          {/* Quick links in columns */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-primary-500">
                {text.about}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm hover:underline transition-all">
                    {language === 'en' ? 'Our Story' : 'Nuestra Historia'}
                  </Link>
                </li>
                <li>
                  <Link to="/mission" className="text-sm hover:underline transition-all">
                    {language === 'en' ? 'Mission' : 'Misión'}
                  </Link>
                </li>
                <li>
                  <Link to="/team" className="text-sm hover:underline transition-all">
                    {language === 'en' ? 'Team' : 'Equipo'}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-primary-500">
                {text.partners}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/partner/rover" className="text-sm hover:underline transition-all">
                    Rover
                  </Link>
                </li>
                <li>
                  <Link to="/partner/petco" className="text-sm hover:underline transition-all">
                    Petco
                  </Link>
                </li>
                <li>
                  <Link to="/partner/petsmart" className="text-sm hover:underline transition-all">
                    PetSmart
                  </Link>
                </li>
                <li>
                  <Link to="/partner/chewy" className="text-sm hover:underline transition-all">
                    Chewy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Contact section and social icons */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-700 dark:border-gray-700">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="mr-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2 text-primary-500">
                {text.contactUs}
              </h3>
              <p className="text-sm mb-1">{text.email}</p>
              <p className="text-sm">{text.phone}</p>
            </div>
          </div>
          
          {/* Social icons */}
          <div className="flex space-x-4">
            <a href="#" className={`h-10 w-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'} transition-colors`}>
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
              </svg>
            </a>
            <a href="#" className={`h-10 w-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'} transition-colors`}>
              <span className="sr-only">Instagram</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
              </svg>
            </a>
            <a href="#" className={`h-10 w-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-600 hover:bg-gray-700'} transition-colors`}>
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="mt-8 pt-6 text-center text-xs opacity-70">
          <p style={{ fontFamily: "'Open Sans', sans-serif" }}>&copy; 2024 PetVerse. {text.rights}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;