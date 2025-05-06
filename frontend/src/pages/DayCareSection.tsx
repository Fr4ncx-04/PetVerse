import { motion } from 'framer-motion';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Calendar, Sun, Moon, Heart } from 'lucide-react';

const DayCareSection = () => {
  const { theme, language } = useThemeLanguage();

  const features = [
    {
      icon: <Sun className="h-8 w-8" />,
      title: language === 'en' ? 'Day Care' : 'Guardería de Día',
      description:
        language === 'en'
          ? 'Full day of activities and care for your pet'
          : 'Día completo de actividades y cuidado para tu mascota',
    },
    {
      icon: <Moon className="h-8 w-8" />,
      title: language === 'en' ? 'Night Care' : 'Guardería Nocturna',
      description:
        language === 'en'
          ? 'Overnight care in a safe and comfortable environment'
          : 'Cuidado nocturno en un ambiente seguro y cómodo',
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: language === 'en' ? 'Extended Stay' : 'Estancia Prolongada',
      description:
        language === 'en'
          ? 'Long-term care for extended periods'
          : 'Cuidado a largo plazo para períodos extensos',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: language === 'en' ? 'Special Care' : 'Cuidado Especial',
      description:
        language === 'en'
          ? 'Personalized attention for pets with special needs'
          : 'Atención personalizada para mascotas con necesidades especiales',
    },
  ];

  return (
    <div
      className={`min-h-screen pt-24 px-4 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Calendar className="h-16 w-16 mx-auto mb-4 text-purple-500" />
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Pet Day Care Services' : 'Servicios de Guardería'}
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {language === 'en'
              ? 'A safe and fun environment for your pets'
              : 'Un ambiente seguro y divertido para tus mascotas'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`p-6 rounded-lg shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="text-purple-500 mb-4">{feature.icon}</div>
              <h2 className="text-2xl font-semibold mb-4">{feature.title}</h2>
              <p
                className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-purple-100 dark:bg-purple-900 p-8 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en'
              ? 'Book a Stay for Your Pet'
              : 'Reserva una Estancia para tu Mascota'}
          </h2>
          <button className="bg-purple-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-600 transition-colors">
            {language === 'en' ? 'Make Reservation' : 'Hacer Reservación'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DayCareSection;