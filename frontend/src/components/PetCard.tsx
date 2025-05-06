import { useNavigate } from "react-router-dom";
import { useThemeLanguage } from "../contexts/ThemeLanguageContext";
import type { Pet } from "../components/typesPets";

interface PetCardProps {
  pet: Pet;
  type: "my-pet" | "adoption";
}

export default function PetCard({ pet, type }: PetCardProps) {
  const { theme, language } = useThemeLanguage();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/PetProfile/${pet.IdPet}`);
  };

  const translations = {
    es: {
      myPet: "Mi Mascota",
      adopt: "En Adopción",
      viewProfile: "Ver perfil",
      adoptMe: "Adóptame",
      years: "años",
      Kg: "Kg",
    },
    en: {
      myPet: "My Pet",
      adopt: "For Adoption",
      viewProfile: "View Profile",
      adoptMe: "Adopt Me",
      years: "years",
      Kg: "Kg",
    },
  };

  const t = translations[language];

  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  const secondaryText = theme === "dark" ? "text-gray-300" : "text-gray-500";
  const tagBg = theme === "dark" ? "bg-gray-700" : "bg-gray-200";

  const buttonBase = "w-full px-4 py-2 rounded text-white";
  const adoptButtonStyle =
    theme === "dark"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-green-500 hover:bg-green-600";
  const profileButtonStyle =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-blue-500 hover:bg-blue-600";

  return (
    <div
      className={`border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col min-h-[400px] w-full max-w-sm ${cardBg}`}
    >
      <img
        src={pet.Image || "https://via.placeholder.com/400x200?text=Mascota"}
        alt={pet.PetName || "Mascota"}
        className="w-full h-48 object-cover object-[center_30%]"
      />
      <div className={`p-4 flex flex-col flex-grow justify-between ${textColor}`}>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">{pet.PetName}</h3>
            <span className={`text-xs px-2 py-1 ${tagBg} rounded text-green-500`}>
              {type === "my-pet" ? t.myPet : t.adopt}
            </span>
          </div>
          <p className={`text-sm ${secondaryText}`}>{pet.SpeciesName}</p>
          <p className={`text-sm ${secondaryText}`}>{pet.Breed}</p>
          <p className={`text-sm mb-2 ${secondaryText}`}>
            {pet.Age} {t.years}
          </p>
          <p className={`text-sm ${secondaryText}`}>
            {pet.LastWeight} {t.Kg}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleClick}
            className={`${buttonBase} ${adoptButtonStyle}`}
          >
            {type === "my-pet" ? t.viewProfile : t.adoptMe}
          </button>

          {type === "adoption" && (
            <button
              onClick={handleClick}
              className={`${buttonBase} ${profileButtonStyle}`}
            >
              {t.viewProfile}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
