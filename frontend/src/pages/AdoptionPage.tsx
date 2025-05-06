import { useEffect, useState } from 'react';
import axios from 'axios';
import PetCard from '../components/PetCard';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import type { Pet } from '../components/typesPets';
import { Plus } from 'lucide-react';

const AdoptionPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedBreed, setSelectedBreed] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  const { theme, setLanguage, language } = useThemeLanguage();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/pets/adoption');
        setPets(response.data);
        setFilteredPets(response.data);
      } catch (error) {
        console.error('Error al obtener mascotas:', error);
    } finally {
        // Simular un pequeño retraso para que el skeleton sea visible
        setTimeout(() => {
          setLoading(false); // Terminar carga
        }, 1000); // Puedes ajustar o quitar este retraso
      }
    };

    fetchPets();
  }, []);

  // Obtener especies y razas únicas
  const speciesOptions = Array.from(new Set(pets.map(p => p.SpeciesName)));
  const breedOptions = Array.from(new Set(
    pets.filter(p => selectedSpecies === 'all' || p.SpeciesName === selectedSpecies).map(p => p.Breed)
  ));

  // Filtrado
  useEffect(() => {
    const filtered = pets.filter(pet =>
      (selectedSpecies === 'all' || pet.SpeciesName === selectedSpecies) &&
      (selectedBreed === 'all' || pet.Breed === selectedBreed)
    );
    setFilteredPets(filtered);
  }, [selectedSpecies, selectedBreed, pets]);

  const translations = {
    es: {
      adoptionTitle: 'Mascotas en Adopción',
      toggleTheme: 'Cambiar tema',
      species: 'Especie',
      breed: 'Raza',
      all: 'Todas',
    },
    en: {
      adoptionTitle: 'Pets for Adoption',
      toggleTheme: 'Toggle Theme',
      species: 'Species',
      breed: 'Breed',
      all: 'All',
    },
  };

  const t = translations[language];

  const PetCardSkeleton = () => {
    const { theme } = useThemeLanguage();
  
    const skeletonBg = theme === "dark" ? "bg-gray-700" : "bg-gray-300"; 
    const skeletonBorder = theme === "dark" ? "border-gray-600" : "border-gray-300"; 
  
    return (
      <div
        className={`animate-pulse rounded-lg border p-4 w-full min-h-[400px] ${skeletonBg} ${skeletonBorder}`}
      >
        <div className="h-48 bg-gray-500 rounded mb-4" />
        <div className="h-4 bg-gray-500 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-500 rounded w-1/2 mb-2" />
        <div className="h-6 bg-gray-500 rounded w-full" />
        <div className="h-4 bg-gray-500 rounded w-3/4 mb-2" />
      </div>
    );
  };

  return (
    <div className="adoption-container px-4 py-6">
      <div className="toolbar flex justify-between items-center flex-wrap mb-6 gap-4">
        <div>
          <button onClick={() => setLanguage('en')} className="mr-1">EN</button>
          <button onClick={() => setLanguage('es')}>ES</button>
        </div>
        <h1 className="text-2xl font-bold">{t.adoptionTitle}</h1>
      </div>

      <div className="filters flex flex-wrap gap-4 mb-6">
        <div>
          <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {t.species}:
          </label>
          <select
            value={selectedSpecies}
            onChange={(e) => {
              setSelectedSpecies(e.target.value);
              setSelectedBreed('all'); // reset raza
            }}
            className={`px-2 py-1 rounded border ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-white text-black border-gray-300'
            }`}
          >
            <option value="all">{t.all}</option>
            {speciesOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            {t.breed}:
          </label>
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            className={`px-2 py-1 rounded border ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-white text-black border-gray-300'
            }`}
          >
            <option value="all">{t.all}</option>
            {breedOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <button className={` mt-5 flex items-center space-x-2 px-4 py-2 rounded border border-green-500 transition ${
            theme === "dark"
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-white hover:bg-gray-100 text-gray-800"
            } border disabled:opacity-50 disabled:cursor-not-allowed`}
          >
          <Plus className="w-5 h-5"/>
          {language === "es"
          ? "¿Deseas agregar una mascota para adopción?"
          : "Want to add a pet for adoption?"}
          </button>
        </div>
      </div>

        <div className="pet-grid grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading
                ? Array.from({ length: 8 }).map((_, i) => <PetCardSkeleton key={i} />)
                : filteredPets.map((pet) => (
                    <PetCard key={pet.IdPet} pet={pet} type="adoption" />
                ))
            }
        </div>
    </div>
  );
};

export default AdoptionPage;
