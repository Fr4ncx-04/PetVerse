import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import Services from '../components/Services';
import Features from '../components/Features';
import Hero from './Carousel';
import PetShowcase from '../components/PetShowcase';
import PetPromoBanner from '../components/PetPromoBanner';
import TiendaUNACH from '../components/TiendaUnach';

const Home: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const navigate = useNavigate();

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen`}>
      
      {/* Carousel Section */}
      <div>
        <Hero/>
      </div>

      {/* Services Section */}
      <div>
        <Services/>
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <PetShowcase />
      </div>


      {/* Features Section*/}
      <div>
        <Features/>
      </div>

      {/* petpromoshop */}
      <div>
        <PetPromoBanner/>
      </div>

      {/* Tiendas Fisicas */}
      <div>
        <TiendaUNACH/>
      </div>

      <div className={`relative overflow-hidden border-t-2 border-b-2 border-green-500 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'} py-16 mb-10`}>
        
        <div className="absolute inset-0 z-0 ">
          <img
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Mascota feliz"
            className="w-full h-full object-cover blur-sm opacity-80"
          />
        </div>

        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10 h-full">
          
          <div className="text-center md:text-left md:max-w-xl z-20">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'en' 
                ? 'Join Our Pet-Loving Community'
                : 'Únete a Nuestra Comunidad de Amantes de Mascotas'}
            </h2>
            <p className="mb-8">
              {language === 'en'
                ? 'Connect with other pet owners, share experiences, and learn from experts'
                : 'Conéctate con otros dueños de mascotas, comparte experiencias y aprende de expertos'}
            </p>
          </div>

          <div className="mt-10 md:mt-0 md:flex md:items-center md:justify-center md:h-full z-20">
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-gray-800 px-8 py-3 border-2 border-green-500 rounded-full text-lg font-semibold
                      hover:bg-white hover:scale-105 transition-all duration-200 dark:bg-gray-800 dark:text-white"
            >
              {language === 'en' ? 'Sign Up Now' : 'Regístrate Ahora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;