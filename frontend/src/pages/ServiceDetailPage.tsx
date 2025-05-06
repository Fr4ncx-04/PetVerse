import{ useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useNavigate } from 'react-router-dom';
import { Scissors, GraduationCap, Calendar, Stethoscope } from 'lucide-react';

// Skeleton component
const ServiceDetailSkeleton = () => {
  const titleVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
  };
  const cardVariants = {
    initial: { opacity: 0 },
    animate: (i: number) => ({ opacity: 1, transition: { duration: 0.5, delay: i * 0.1 } }),
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={titleVariants}
          initial="initial"
          animate="animate"
          className="w-64 h-10 bg-gray-300 dark:bg-gray-700 mx-auto rounded mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={idx}
              className="p-8 rounded-xl shadow-md flex flex-col items-center text-center bg-gray-200 dark:bg-gray-800 animate-pulse"
            >
              <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-full mb-6" />
              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-3" />
              <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 rounded" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceDetailPage = () => {
  const { theme, language } = useThemeLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carga de datos (reemplaza con fetch real)
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <ServiceDetailSkeleton />;
  }

  const services = [
    {
      id: 'grooming',
      icon: <Scissors className="h-16 w-16" />, // Tamaño fijo
      title: language === 'en' ? 'Pet Grooming' : 'Estética para Mascotas',
      description:
        language === 'en'
          ? 'Professional grooming services for your pets'
          : 'Servicios profesionales de estética para tus mascotas',
      link: '/grooming',
      color: 'text-green-500',
      ringColor: 'green-500',
    },
    {
      id: 'training',
      icon: <GraduationCap className="h-16 w-16" />,
      title: language === 'en' ? 'Training & School' : 'Entrenamiento y Escuela',
      description:
        language === 'en'
          ? 'Expert training programs for all breeds'
          : 'Programas de entrenamiento experto para todas las razas',
      link: '/training',
      color: 'text-blue-500',
      ringColor: 'blue-500',
    },
    {
      id: 'daycare',
      icon: <Calendar className="h-16 w-16" />,
      title: language === 'en' ? 'Pet Daycare' : 'Guardería de Mascotas',
      description:
        language === 'en'
          ? 'Safe and fun environment for your pets'
          : 'Ambiente seguro y divertido para tus mascotas',
      link: '/daycare',
      color: 'text-purple-500',
      ringColor: 'purple-500',
    },
    {
      id: 'veterinary',
      icon: <Stethoscope className="h-16 w-16" />,
      title: language === 'en' ? 'Veterinary Care' : 'Cuidado Veterinario',
      description:
        language === 'en'
          ? 'Complete healthcare for your pets'
          : 'Atención médica completa para tus mascotas',
      link: '/veterinary',
      color: 'text-red-500',
      ringColor: 'red-500',
    },
  ];

  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-12 px-4 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h1
          variants={titleVariants}
          initial="initial"
          animate="animate"
          className="text-4xl font-bold text-center mb-12"
        >
          {language === 'en' ? 'Our Services' : 'Nuestros Servicios'}
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={index}
              whileHover={{
                scale: 1.03,
                y: -5,
                boxShadow:
                  theme === 'dark'
                    ? '0 10px 20px rgba(0, 0, 0, 0.5)'
                    : '0 10px 20px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              onClick={() => navigate(service.link)}
              className={`p-8 rounded-xl shadow-md cursor-pointer flex flex-col items-center text-center border border-transparent ring-2 ring-transparent transition-all duration-300 ease-in-out ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              } hover:border-${service.ringColor} hover:ring-${service.ringColor} hover:ring-opacity-50`}
            >
              <div className={`${service.color} mb-6`}>{service.icon}</div>
              <h2 className="text-2xl font-bold mb-3">{service.title}</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;