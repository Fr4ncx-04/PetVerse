import { motion } from 'framer-motion';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { GraduationCap, Star } from 'lucide-react';

const TrainingSection = () => {
  const { theme, language } = useThemeLanguage();

  const programs = [
    {
      title: language === 'en' ? 'Basic Training' : 'Entrenamiento Básico',
      duration: language === 'en' ? '4 weeks' : '4 semanas',
      description:
        language === 'en'
          ? 'Perfect for puppies and dogs needing basic obedience training'
          : 'Perfecto para cachorros y perros que necesitan entrenamiento básico de obediencia',
      skills:
        language === 'en'
          ? [
              'Sit and Stay',
              'Walking on Leash',
              'Basic Commands',
              'Socialization',
            ]
          : [
              'Sentarse y Quedarse',
              'Caminar con Correa',
              'Comandos Básicos',
              'Socialización',
            ],
    },
    {
      title: language === 'en' ? 'Advanced Training' : 'Entrenamiento Avanzado',
      duration: language === 'en' ? '8 weeks' : '8 semanas',
      description:
        language === 'en'
          ? 'Advanced training for dogs ready to learn complex commands'
          : 'Entrenamiento avanzado para perros listos para aprender comandos complejos',
      skills:
        language === 'en'
          ? [
              'Off-leash Control',
              'Advanced Commands',
              'Behavior Correction',
              'Agility Training',
            ]
          : [
              'Control sin Correa',
              'Comandos Avanzados',
              'Corrección de Comportamiento',
              'Entrenamiento de Agilidad',
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
          <GraduationCap className="h-16 w-16 mx-auto mb-4 text-blue-500" />
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en'
              ? 'Pet Training Programs'
              : 'Programas de Entrenamiento'}
          </h1>
          <p
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {language === 'en'
              ? 'Professional training programs for all breeds'
              : 'Programas de entrenamiento profesional para todas las razas'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`p-6 rounded-lg shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h2 className="text-2xl font-semibold mb-2">{program.title}</h2>
              <p className="text-blue-500 font-semibold mb-4">
                {program.duration}
              </p>
              <p
                className={`mb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {program.description}
              </p>
              <ul className="space-y-3">
                {program.skills.map((skill, i) => (
                  <li key={i} className="flex items-center">
                    <Star className="h-5 w-5 text-blue-500 mr-2" />
                    <span>{skill}</span>
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
          <button className="bg-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors">
            {language === 'en' ? 'Enroll Now' : 'Inscribirse Ahora'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingSection;