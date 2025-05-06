import { Scissors, GraduationCap, Calendar, Stethoscope } from "lucide-react";
import { useThemeLanguage } from "../contexts/ThemeLanguageContext";
import { useNavigate } from 'react-router-dom';

interface ServiceDetails {
    longDescription: string;
    keyFeatures: string[];
    pricing?: string;
    formType?: 'booking' | 'enrollment' | 'contact' | 'search';
    programList?: { id: string; name: string; description: string; link: string }[];
    bookingInstructions?: string;
    searchInstructions?: string;
}

interface ServiceData {
    id: string;
    icon: JSX.Element;
    title: string;
    description: string;
    action: string;
    link: string;
    details: ServiceDetails;
}

interface Translations {
    title: string;
    description: string;
    services: ServiceData[];
}

interface AllTranslations {
    en: Translations;
    es: Translations;
    [key: string]: Translations;
}

// --- Definición de Datos ---
const translations: AllTranslations = { 
    en: 
    {
        title: "Pet Services",
        description: "Professional services to ensure your pet's health, happiness, and well-being", 
        services: [
            {
                id: "grooming",
                icon: <Scissors className="h-10 w-10 text-green-700" />,
                title: "Grooming",
                description: "Professional grooming services to keep your pet looking and feeling their best.",
                action: "Book Appointment",
                link: "/grooming",
                details: {
                    longDescription: "Our professional grooming services include bathing, haircuts, nail trims, ear cleaning, and more. We use high-quality products safe for your pet's skin and coat.",
                    keyFeatures: ["Bathing", "Haircuts", "Nail Trimming", "Ear Cleaning", "Breed-Specific Styling"],
                    pricing: "Starting at $50 (varies by breed and service)",
                    formType: 'booking',
                    bookingInstructions: "Please fill out the form below to request an appointment. We will contact you to confirm availability."
                }
            },
            {
                id: "training",
                icon: <GraduationCap className="h-10 w-10 text-amber-500" />,
                title: "Training & School",
                description: "Behavioral training and pet schools to help your pet learn and socialize.",
                action: "Explore Programs",
                link: "/training",
                details: {
                    longDescription: "We offer a variety of training programs from basic obedience to advanced agility, as well as puppy socialization classes.",
                    keyFeatures: ["Basic Obedience", "Advanced Training", "Agility Classes", "Puppy Socialization"],
                    formType: 'enrollment',
                    programList: [
                        { id: "puppy-basics", name: "Puppy Basics", description: "Foundation training...", link: "/programs/puppy-basics" },
                        { id: "adult-obedience", name: "Adult Obedience", description: "Commands and behavior for adult dogs.", link: "/programs/adult-obedience" },
                        { id: "agility-fun", name: "Agility Fun", description: "Introduction to agility obstacles.", link: "/programs/agility-fun" },
                    ]
                }
            },
            {
                id: "daycare",
                icon: <Calendar className="h-10 w-10 text-blue-500" />,
                title: "Daycare",
                description: "Safe and fun environment for your pet while you're away during the day.",
                action: "Reserve Spot",
                link: "/daycare",
                details: {
                    longDescription: "Our daycare provides supervised playtime, socialization opportunities, and rest areas for your dog while you're at work or away. Full and half-day options available.",
                    keyFeatures: ["Supervised Play", "Socialization", "Indoor/Outdoor Areas", "Rest Periods"],
                    pricing: "Full Day: $30, Half Day: $20",
                    formType: 'booking',
                    bookingInstructions: "Use the form to reserve a spot for your dog's daycare needs. Please book in advance." 
                }
            },
            {
                id: "veterinary",
                icon: <Stethoscope className="h-10 w-10 text-rose-500" />,
                title: "Veterinary Care",
                description: "Connect with trusted veterinarians for your pet's health needs.",
                action: "Find Vets",
                link: "/veterinary'",
                details: {
                    longDescription: "We partner with trusted local veterinarians to provide comprehensive health care for your pet, from routine check-ups to emergency services.",
                    keyFeatures: ["Preventative Care", "Vaccinations", "Check-ups", "Emergency Services", "Surgery"],
                    formType: 'search',
                    searchInstructions: "Use the search or browse our list of affiliated veterinary clinics."
                }
            },
        ],
    },
    es: {
        title: "Servicios para Mascotas",
        description: "Servicios profesionales para asegurar la salud, felicidad y bienestar de tu mascota",
        services: [
            {
                id: "grooming",
                icon: <Scissors className="h-10 w-10 text-green-700" />,
                title: "Estética",
                description: "Servicios profesionales de estética para que tu mascota luzca y se sienta genial.",
                action: "Reservar Cita",
                link: "/grooming",
                details: {
                    longDescription: "Nuestros servicios profesionales de estética incluyen baño, cortes de pelo, corte de uñas, limpieza de oídos y más. Utilizamos productos de alta calidad seguros para la piel y el pelaje de tu mascota.",
                    keyFeatures: ["Baño", "Cortes de Pelo", "Corte de Uñas", "Limpieza de Oídos", "Estilo Específico por Raza"],
                    pricing: "Desde $50 (varía según raza y servicio)",
                    formType: 'booking',
                    bookingInstructions: "Por favor, completa el formulario a continuación para solicitar una cita. Nos pondremos en contacto contigo para confirmar la disponibilidad."
                }
            },
            {
                id: "training",
                icon: <GraduationCap className="h-10 w-10 text-amber-500" />,
                title: "Entrenamiento y Escuela",
                description: "Entrenamiento conductual y escuelas para ayudar a tu mascota a socializar y aprender.",
                action: "Ver Programas",
                link: "/training",
                details: {
                    longDescription: "Ofrecemos una variedad de programas de entrenamiento desde obediencia básica hasta agilidad avanzada, así como clases de socialización para cachorros.",
                    keyFeatures: ["Obediencia Básica", "Entrenamiento Avanzado", "Clases de Agilidad", "Socialización de Cachorros"],
                    formType: 'enrollment',
                    programList: [
                        { id: "puppy-basics", name: "Obediencia para Cachorros", description: "Habilidades fundamentales para cachorros.", link: "/programs/puppy-basics" },
                        { id: "adult-obedience", name: "Obediencia para Adultos", description: "Comandos y comportamiento para perros adultos.", link: "/programs/adult-obedience" },
                        { id: "agility-fun", name: "Agilidad Divertida", description: "Introducción a los obstáculos de agilidad.", link: "/programs/agility-fun" },
                    ]
                }
            },
            {
                id: "daycare",
                icon: <Calendar className="h-10 w-10 text-blue-500" />,
                title: "Guardería",
                description: "Ambiente seguro y divertido para tu mascota mientras estás fuera durante el día.",
                action: "Reservar Lugar",
                link: "/daycare",
                details: {
                    longDescription: "Nuestra guardería ofrece tiempo de juego supervisado, oportunidades de socialización y áreas de descanso para tu perro mientras estás en el trabajo o fuera. Opciones de día completo y medio día disponibles.",
                    keyFeatures: ["Juego Supervisado", "Socialización", "Áreas Interiores/Exteriores", "Periodos de Descanso"],
                    pricing: "Día Completo: $30, Medio Día: $20",
                    formType: 'booking',
                    bookingInstructions: "Usa el formulario para reservar un lugar para las necesidades de guardería de tu perro. Por favor, reserva con anticipación."
                }
            },
            {
                id: "veterinary",
                icon: <Stethoscope className="h-10 w-10 text-rose-500" />,
                title: "Cuidado Veterinario",
                description: "Conéctate con veterinarios confiables para la salud de tu mascota.",
                action: "Buscar Vets",
                link: "/veterinary",
                details: {
                    longDescription: "We partner with trusted local veterinarians to provide comprehensive health care for your pet, from routine check-ups to emergency services.",
                    keyFeatures: ["Preventative Care", "Vaccinations", "Check-ups", "Emergency Services", "Surgery"],
                    formType: 'search',
                    searchInstructions: "Usa el buscador o navega por nuestra lista de clínicas veterinarias afiliadas."
                }
            },
        ],
    },
};

export { translations, type ServiceData };


export default function Services() {
    const { language, theme } = useThemeLanguage();
    const navigate = useNavigate();

    const { title, description, services: currentServices } = translations[language];

    const handleButtonClick = (serviceLink: string) => {
        navigate(serviceLink);
    };

    return (
        <section
        className={`py-16 rounded-lg my-8 p-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{title}</h2>
                <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                {description}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Ahora mapeamos sobre currentServices */}
                {currentServices.map((service, index) => (
                <div
                key={index}
                className={`p-6 rounded-lg shadow-md border flex flex-col items-center text-center h-full
                transition-colors duration-300 ease-in-out
                hover:transform hover:-translate-y-1 hover:shadow-lg
                ${ theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-800"
                }`}
                >
                <div className="mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p
                    className={`mb-6 flex-grow ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                    >
                    {service.description}
                    </p>
                    <button
                    className={`px-4 py-2 rounded-lg border transition duration-300 ease-in-out
                    ${ theme === "dark"
                    ? "border-gray-600 text-white bg-transparent hover:bg-gray-700"
                    : "border-green-600 text-green-600 bg-white hover:bg-green-100"
                    }
                    hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                    onClick={() => handleButtonClick(service.link)}
                    >
                    {service.action}
                    </button>
                </div>
            ))}
        </div>
    </section>
    );
};