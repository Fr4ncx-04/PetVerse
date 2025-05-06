import { motion } from 'framer-motion';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Stethoscope, Syringe, Microscope, Clipboard } from 'lucide-react';

const VeterinarySection = () => {
  const { theme, language } = useThemeLanguage();

  const services = [
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: language === 'en' ? 'General Checkup' : 'Revisión General',
      description:
        language === 'en'
          ? 'Complete physical examination and health assessment'
          : 'Examen físico completo y evaluación de salud',
    },
    {
      icon: <Syringe className="h-8 w-8" />,
      title: language === 'en' ? 'Vaccinations' : 'Vacunaciones',
      description:
        language === 'en'
          ? 'Essential vaccines and preventive care'
          : 'Vacunas esenciales y cuidado preventivo',
    },
    {
      icon: <Microscope className="h-8 w-8" />,
      title: language === 'en' ? 'Laboratory Tests' : 'Pruebas de Laboratorio',
      description:
        language === 'en'
          ? 'Comprehensive diagnostic testing'
          : 'Pruebas diagnósticas completas',
    },
    {
      icon: <Clipboard className="h-8 w-8" />,
      title: language === 'en' ? 'Treatment Plans' : 'Planes de Tratamiento',
      description:
        language === 'en'
          ? 'Customized treatment and recovery plans'
          : 'Planes personalizados de tratamiento y recuperación',
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
          <Stethoscope className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en'
              ? 'Veterinary Services'
              : 'Servicios Veterinarios'}
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {language === 'en'
              ? 'Professional healthcare for your beloved pets'
              : 'Atención médica profesional para tus mascotas'}
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
              <div className="text-red-500 mb-4">{service.icon}</div>
              <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
              <p
                className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-red-100 dark:bg-red-900 p-8 rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en'
              ? 'Schedule a Consultation'
              : 'Programa una Consulta'}
          </h2>
          <p className="mb-6">
            {language === 'en'
              ? 'Our veterinary team is here to help'
              : 'Nuestro equipo veterinario está aquí para ayudar'}
          </p>
          <button className="bg-red-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-600 transition-colors">
            {language === 'en' ? 'Book Appointment' : 'Agendar Cita'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default VeterinarySection;