import { useNavigate } from "react-router-dom";
import { useThemeLanguage } from "../contexts/ThemeLanguageContext";
import { Heart, ShoppingBag, MessageCircle, BookOpen } from "lucide-react";

export default function Features() {
  const { language, theme } = useThemeLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Heart className="h-10 w-10 text-red-500" />,
      title: language === "en" ? "Pet Adoption" : "Adopción de Mascotas",
      description:
        language === "en"
          ? "Find your perfect companion"
          : "Encuentra tu compañero perfecto",
      link: "/adoption",
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-blue-500" />,
      title: language === "en" ? "Pet Shop" : "Tienda de Mascotas",
      description:
        language === "en"
          ? "Quality products for your pets"
          : "Productos de calidad para tus mascotas",
      link: "/shop",
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-green-500" />,
      title: language === "en" ? "Expert Forums" : "Foros de Expertos",
      description:
        language === "en"
          ? "Get advice from professionals"
          : "Obtén consejos de profesionales",
      link: "/forums",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-yellow-500" />,
      title: language === "en" ? "Pet Care Blog" : "Blog de Cuidado",
      description:
        language === "en"
          ? "Learn about pet care and health"
          : "Aprende sobre cuidado y salud",
      link: "/blog",
    },
  ];

  return (
    <section
      className={`py-16 rounded-lg my-8 p-8 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          {language === "en" ? "What We Offer" : "Nuestros Servicios"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-md border flex flex-col items-center text-center h-full transition-colors ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-200 text-gray-800"
            }`}
            onClick={() => navigate(feature.link)}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p
              className={`mb-6 flex-grow ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}