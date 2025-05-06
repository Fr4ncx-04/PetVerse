import { motion } from 'framer-motion';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Scissors, Check } from 'lucide-react';

const GroomingSection = () => {
  const { theme, language } = useThemeLanguage();

  const services = [
    {
      title: language === 'en' ? 'Basic Grooming' : 'Aseo Básico',
      price: '$30',
      features:
        language === 'en'
          ? ['Bath', 'Brush', 'Nail Trimming', 'Ear Cleaning']
          : ['Baño', 'Cepillado', 'Corte de Uñas', 'Limpieza de Oídos'],
    },
    {
      title: language === 'en' ? 'Full Service' : 'Servicio Completo',
      price: '$50',
      features:
        language === 'en'
          ? [
              'All Basic Services',
              'Hair Cut',
              'Teeth Brushing',
              'Anal Gland Expression',
            ]
          : [
              'Todos los Servicios Básicos',
              'Corte de Pelo',
              'Cepillado de Dientes',
              'Expresión de Glándulas Anales',
            ],
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
          <Scissors className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Pet Grooming Services' : 'Servicios de Estética'}
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {language === 'en'
              ? 'Professional grooming services for your beloved pets'
              : 'Servicios profesionales de estética para tus mascotas'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`p-6 rounded-lg shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
              <p className="text-3xl font-bold text-green-500 mb-6">
                {service.price}
              </p>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <button className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors">
            {language === 'en' ? 'Book Appointment' : 'Agendar Cita'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default GroomingSection;