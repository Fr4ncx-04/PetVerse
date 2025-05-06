import { useState, useEffect } from "react";
import { useThemeLanguage } from "../contexts/ThemeLanguageContext";
import { ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion} from "framer-motion"; 

const translations = {
  es: {
    adoptionTitle: "Adopta un nuevo amigo",
    adoptionSubtitle: "Descubre mascotas que buscan un hogar lleno de amor.",
    adoptionCTA: "Ver adopciones",

    groomingTitle: "Educación personalizada",
    groomingSubtitle: "Haz que tu aprendizaje destaque con la guía de nuestros expertos.",
    groomingCTA: "Reservar cita",

    shopTitle: "Productos de calidad",
    shopSubtitle: "Todo lo que tu mascota necesita en un solo lugar.",
    shopCTA: "Ir a tienda"
  },
  en: {
    adoptionTitle: "Adopt a new friend",
    adoptionSubtitle: "Find pets looking for a loving forever home.",
    adoptionCTA: "View adoptions",

    groomingTitle: "Personalized Learning",
    groomingSubtitle: "Make your learning shine with guidance from our experts.",
    groomingCTA: "Book appointment",

    shopTitle: "Quality pet products",
    shopSubtitle: "Everything your pet needs in one place.",
    shopCTA: "Go to shop"
  }
};

// --- Skeleton Loader Component for Hero ---
const SkeletonHero: React.FC = () => {
    const { theme } = useThemeLanguage();
    const bgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
    const pulseColor = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300';

    return (
        // Use motion for a subtle fade-in animation for the skeleton itself
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative w-full h-[600px] overflow-hidden rounded-lg my-8 ${bgColor} animate-pulse flex items-center justify-center`}
        >
            {/* Placeholder content structure */}
            <div className="flex flex-col items-center text-center p-4">
                <div className={`w-20 h-20 rounded-full ${pulseColor} mb-6`}></div> {/* Placeholder for logo/icon */}
                <div className={`h-10 w-64 rounded ${pulseColor} mb-4`}></div> {/* Placeholder for main title */}
                <div className={`h-6 w-80 rounded ${pulseColor} mb-8`}></div> {/* Placeholder for subtitle */}
                <div className={`h-12 w-48 rounded-full ${pulseColor}`}></div> {/* Placeholder for CTA button */}
            </div>
        </motion.div>
    );
};


// --- Main Hero Component ---
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useThemeLanguage();
  const navigate = useNavigate();

  // State to simulate loading
  const [loading, setLoading] = useState(true);

  const content = translations[language];

  const carouselItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // adopción
      title: content.adoptionTitle,
      subtitle: content.adoptionSubtitle,
      cta: content.adoptionCTA,
      link: "/adoptionpage",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // peluquería
      title: content.groomingTitle,
      subtitle: content.groomingSubtitle,
      cta: content.groomingCTA,
      link: "/training",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee", // productos
      title: content.shopTitle,
      subtitle: content.shopSubtitle,
      cta: content.shopCTA,
      link: "/shop",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  // Effect to simulate loading and start auto-slide
  useEffect(() => {
    // Simulate a loading delay
    const loadTimer = setTimeout(() => {
        setLoading(false); // Set loading to false after delay
    }, 1000); // Adjust delay as needed (e.g., 1000ms = 1 second)

    // Start auto-sliding after loading
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 7000); // Keep auto-slide interval

    // Cleanup timers
    return () => {
        clearTimeout(loadTimer);
        clearInterval(slideInterval);
    };
  }, []); // Empty dependency array means this runs once on mount


  // Render Skeleton while loading
  if (loading) {
      return <SkeletonHero />;
  }

  // Render actual carousel once loaded
  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg my-8">
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 z-20" />
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center p-4">
            <div className="flex items-center justify-center mb-4">
              <PawPrint className="w-12 h-12 text-white" />
              <h1 className="text-5xl font-bold ml-2 text-white">PetVerse</h1>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {item.title}
            </h2>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
              {item.subtitle}
            </p>
            <button
              onClick={() => navigate(item.link)}
              className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition"
            >
              {item.cta}
            </button>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
