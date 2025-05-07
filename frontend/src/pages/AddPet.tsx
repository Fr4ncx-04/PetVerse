// src/components/AddPet.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useThemeLanguage } from "../contexts/ThemeLanguageContext";
import * as Tabs from "@radix-ui/react-tabs";
import { Plus, PawPrint, Heart, X, } from "lucide-react";
import axios from "axios";
import PetCard from "../components/PetCard";
import { motion } from "framer-motion";

const SkeletonPetCard: React.FC = () => {
    const { theme } = useThemeLanguage();
    const cardBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
    const pulseColor = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`rounded-lg overflow-hidden shadow-lg ${cardBgColor} animate-pulse w-full max-w-sm`} // Added max-w-sm for consistent size
        >
            <div className={`w-full h-48 ${pulseColor}`}></div>
            <div className="p-4 space-y-2">
                <div className={`h-6 w-3/4 rounded ${pulseColor}`}></div>
                <div className={`h-4 w-1/2 rounded ${pulseColor}`}></div>
                <div className={`h-4 w-1/3 rounded ${pulseColor}`}></div>
                <div className={`h-8 w-full rounded ${pulseColor} mt-4`}></div>
            </div>
        </motion.div>
    );
};

export default function AddPet() {
  const { user, isLoggedIn } = useAuth();
  const { language, theme } = useThemeLanguage();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"my-pets" | "adoption">("my-pets");
  const [myPets, setMyPets] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [adoptionPets, setAdoptionPets] = useState<any[]>([]);
    const [isLoadingAdoption, setIsLoadingAdoption] = useState(true);

  const t = {
    registerPrompt:
      language === "es"
        ? "¿Deseas registrar otra mascota?"
        : "Want to register another pet?",
    adoptPrompt:
      language === "es"
        ? "¿Deseas ir a la pagina de adopciones?"
        : "Want go to adoption page?",
    confirm: language === "es" ? "Confirmar" : "Confirm",
    cancel: language === "es" ? "Cancelar" : "Cancel",
  };

  useEffect(() => {
    if (!user?.IdUser) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    axios.get(`http://localhost:3000/api/pets/getPetsByUser/${user.IdUser}`).then((res) => {
      const delayDuration = 2000;
        setTimeout(() => {
            setMyPets(Array.isArray(res.data) ? res.data : []);
            setIsLoading(false);
        }, delayDuration);
    }).catch((err) => {
        console.error("Error fetching pets:", err);
        const delayDuration = 1000;
        setTimeout(() => {
            setMyPets([]);
            setIsLoading(false);
        }, delayDuration);
    });
  }, [user]);

useEffect(() => {
    setIsLoadingAdoption(true)
    axios
      .get('http://localhost:3000/api/pets/adoption')
      .then((res) => {
        const delayDuration = 2000;
        setTimeout(() => {
            setAdoptionPets(res.data.slice(0, 3)); 
            setIsLoadingAdoption(false);
        }, delayDuration)
        })
      .catch((err) => {
        console.error("Error fetching adoption pets:", err);
        const delayDuration = 1000;
        setTimeout(() => {
            setAdoptionPets([]);
            setIsLoadingAdoption(false);
        }, delayDuration);
      });
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const onConfirm = () => {
    closeModal();
    tab === "my-pets" ? navigate("/RegisterPet") : navigate("/adoptionpage");
  };

  return (
    <section
      className={`mx-auto px-4 py-8 flex flex-col justify-center items-center ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800" 
        }
      `}
    >
      <header className="text-center mb-10 mt-10">
        <h2 className="text-3xl font-bold mb-2">
          {language === 'en'
            ? `${user?.UserName}'s Pets`
            : `Mascotas de ${user?.UserName}`}
        </h2>
        <p className={`text-gray-500 max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : ''}`}> 
          {language === "es"
            ? "Administra tus mascotas o encuentra una nueva para adoptar."
            : "Manage your pets or find one to adopt."}
        </p>
      </header>

      <Tabs.Root
        value={tab}
        onValueChange={(v) => setTab(v as any)}
        className="w-full max-w-4xl" 
      >
        <Tabs.List className={`flex justify-center mb-6 gap-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}> 
          <Tabs.Trigger
            value="my-pets"
            className={`flex items-center px-4 py-2 rounded border transition ${
            tab === "my-pets"
              ? "bg-green-600 text-white border-green-600"
              : `${theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-800 border-green-500 hover:bg-gray-100'}` 
            }`}
          >
            <PawPrint className="inline-block w-4 h-4 mr-2" />
              {language === "es" ? "Mis Mascotas" : "My Pets"}
          </Tabs.Trigger>
          <Tabs.Trigger
            value="adoption"
            className={`flex items-center px-4 py-2 rounded border transition ${
              tab === "adoption"
                ? "bg-green-600 text-white border-green-600" 
                : `${theme === 'dark' ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-800 border-green-500 hover:bg-gray-100'}` 
              }`}
          >
            <Heart className="inline-block w-4 h-4 mr-2" />
              {language === "es" ? "En Adopción" : "Adoption"}
          </Tabs.Trigger>
        </Tabs.List>
          {/* Action Button */}
          <div className="w-full flex justify-center mb-10">
            <button
              onClick={openModal}
              className={`flex items-center space-x-2 px-4 py-2 rounded border border-green-500 transition ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-white hover:bg-gray-100 text-gray-800"
              } border disabled:opacity-50 disabled:cursor-not-allowed`} 
              disabled={!isLoggedIn || isLoading}
            >
              <Plus className="w-5 h-5" />
                <span>
                  {tab === "my-pets" ? t.registerPrompt : t.adoptPrompt}
                </span>
            </button>
          </div>

        {/* Tab Contents */}
        <Tabs.Content value="my-pets" className="w-full min-h-[520px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {isLoading ? (
                Array.from({ length: 2 }).map((_, i) => <SkeletonPetCard key={i} />)
            ) : (
                myPets.length > 0 ? (
                myPets.map((pet) => (
                    <PetCard key={pet.IdPet} pet={pet} type="my-pet"/>
                ))
                ) : (
                <div className={`col-span-full text-center text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}> 
                    {language === 'es' ? 'No tienes mascotas registradas.' : 'You have no registered pets.'}
                </div>
                )
            )}
          </div>
        </Tabs.Content>

        <Tabs.Content value="adoption" className="min-h-[520px] w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {isLoadingAdoption ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonPetCard key={i} />) // Mostrar Skeletons mientras cargan
            ) : (
            adoptionPets.length > 0 ? (
            adoptionPets.map((pet) => (
              <PetCard key={pet.IdPet} pet={pet} type="adoption" />
            ))
            ) : (
            <div className={`col-span-full text-center text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'es' ? 'No hay mascotas en adopción en este momento.' : 'No pets available for adoption at the moment.'}
            </div>
            )
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div
            className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg w-80 text-center space-y-4`} 
          >
            <button
              onClick={closeModal}
              className={`absolute top-2 right-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`} 
            >
              <X />
            </button>
              <div className="flex justify-center">
                {tab === "my-pets" ? (
                  <PawPrint className="w-12 h-12 text-green-600" />
                ) : (
                  <Heart className="w-12 h-12 text-green-600" />
                )}
              </div>
              <p className="text-lg font-medium">
                {tab === "my-pets" ? t.registerPrompt : t.adoptPrompt}
              </p>
                <div className="flex justify-around mt-4">
                  <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    {t.confirm}
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                  >
                    {t.cancel}
                  </button>
                </div>
          </div>
        </div>
      )}
    </section>
  );
}
