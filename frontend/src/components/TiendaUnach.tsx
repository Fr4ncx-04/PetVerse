import { useThemeLanguage } from '../contexts/ThemeLanguageContext';

export default function TiendaUNACH() {
  const { theme, language } = useThemeLanguage();

  // Traducciones
  const content = {
    title: language === 'en' ? 'Visit our location at UNACH!' : '¡Visita nuestra sede en la UNACH!',
    subtitle: language === 'en'
      ? 'Tuxtla Gutiérrez, Chiapas - Autonomous University of Chiapas'
      : 'Tuxtla Gutiérrez, Chiapas - Universidad Autónoma de Chiapas',
    locationLabel: language === 'en' ? 'Tuxtla Gutiérrez, Chiapas' : 'Tuxtla Gutiérrez, Chiapas',
    buttonLabel: language === 'en' ? 'View map' : 'Ver mapa',
  };

  return (
    <div
      className={`
        flex flex-col md:flex-row items-center justify-between 
        rounded-2xl overflow-hidden px-6 py-10 shadow-lg min-h-[500px] mt-10 mb-10
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
      `}
    >
      {/* Texto a la izquierda */}
      <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
        <h2 className={`text-4xl font-extrabold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {content.title}
        </h2>
        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {content.subtitle}
        </p>
      </div>

      {/* Imagen a la derecha con leyenda y botón */}
      <div className="relative md:w-1/2 h-full">
        <img
          src="../../public/img/mascotas/Edificio.png"
          alt="UNACH Tuxtla"
          className="rounded-xl w-full object-cover h-[400px]"
        />
        <div
          className={`
            absolute bottom-4 left-4 px-4 py-2 rounded-xl shadow-md flex justify-between items-center w-[calc(100%-2rem)]
            ${theme === 'dark' ? 'bg-gray-700/90' : 'bg-white/90'}
          `}
        >
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {content.locationLabel}
          </span>
          <button
            onClick={() => window.open("https://maps.app.goo.gl/4GGX5AZc9M9YfB7y5", "_blank")}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-full text-sm transition"
          >
            {content.buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
