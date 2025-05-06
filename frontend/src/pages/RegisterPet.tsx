import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useNavigate } from 'react-router-dom';
import FloatingInput from '../components/FloatingInput';
import ImageUploadModal from '../components/ImageUploadModal';

interface Status {
  IdPetStatus: number;
  PetStatus: string;
}

interface Species {
  IdSpecies: number;
  SpeciesName: string;
}

const RegisterPet: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.IdUser;
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    PetName: '',
    IdSpecies: '',
    Breed: '',
    Age: '',
    Weight: '',
    IdPetStatus: '',
    Image: null as File | null,
  });

  const text = {
    es: {
      title: 'Registrar Mascota',
      name: 'Nombre',
      breed: 'Raza',
      age: 'Edad',
      weight: 'Peso',
      status: 'Estado',
      species: 'Especie',
      register: 'Registrar',
      error: 'Error al registrar mascota',
      success: 'Mascota registrada exitosamente',
      userNotFound: 'Usuario no identificado',
      selectImage: 'Seleccionar imagen de mascota…',
    },
    en: {
      title: 'Register Pet',
      name: 'Name',
      breed: 'Breed',
      age: 'Age',
      weight: 'Weight',
      status: 'Status',
      species: 'Species',
      register: 'Register',
      error: 'Error registering pet',
      success: 'Pet registered successfully',
      userNotFound: 'User not identified',
      selectImage: 'Select pet image…',
    },
  };

  useEffect(() => {
    const fetchPetStatus = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/pets/getPetStatus');
        const data = await res.json();
        setStatuses(data);
        setFormData(prev => ({ ...prev, IdPetStatus: data[0]?.IdPetStatus?.toString() || '' }));
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };
    fetchPetStatus();
  }, []);

  useEffect(() => {
    const fetchPetSpecies = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/pets/getPetSpecies');
        const data = await res.json();
        setSpeciesList(data);
        setFormData(prev => ({ ...prev, IdSpecies: data[0]?.IdSpecies?.toString() || '' }));
      } catch (error) {
        console.error('Error fetching species:', error);
      }
    };
    fetchPetSpecies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert(text[language].userNotFound);
      return;
    }

    const data = new FormData();
    data.append('PetName', formData.PetName);
    data.append('Breed',    formData.Breed);
    data.append('Age',      formData.Age);
    data.append('Weight',   formData.Weight);
    data.append('IdSpecies',   formData.IdSpecies);
    data.append('IdPetStatus', formData.IdPetStatus);
    data.append('IdUser',      userId.toString());

    // Sólo si hay imagen:
    if (formData.Image) {
      data.append('image', formData.Image);
    }

    try {
      const res = await fetch('http://localhost:3000/api/pets/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      alert(result.message || text[language].success);
      navigate('/AddPet');
    } catch (error) {
      alert(text[language].error);
      console.error(error);
    }
  };

  return (
    <div className={`min-h-screen mt-10 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-100'}`}>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md p-6 rounded shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">{text[language].title}</h2>

        <div className="space-y-6">
          <FloatingInput label={text[language].name} name="PetName" value={formData.PetName} onChange={handleChange} type="text" required />
          <FloatingInput label={text[language].breed} name="Breed" value={formData.Breed} onChange={handleChange} type="text" />
          <FloatingInput label={text[language].age} name="Age" value={formData.Age} onChange={handleChange} type="number" />
          <FloatingInput label={text[language].weight} name="Weight" value={formData.Weight} onChange={handleChange} type="number" />

          <div className="relative">
            <select
              name="IdSpecies"
              onChange={handleChange}
              value={formData.IdSpecies}
              className={`w-full p-3 border rounded appearance-none ${theme === 'dark' ? 'text-gray-400 bg-gray-800' : 'text-gray-700 bg-white'}`}
              required
            >
              {speciesList.map(sp => (
                <option key={sp.IdSpecies} value={sp.IdSpecies}>
                  {sp.SpeciesName}
                </option>
              ))}
            </select>
            <label className={`absolute left-3 -top-2 px-1 text-sm ${theme === 'dark' ? 'text-green-500 bg-gray-900' : 'text-green-600 bg-white'}`}>
              {text[language].species}
            </label>
          </div>

          <div className="relative">
            <select
              name="IdPetStatus"
              onChange={handleChange}
              value={formData.IdPetStatus}
              className={`w-full p-3 border rounded appearance-none ${theme === 'dark' ? 'text-gray-400 bg-gray-800' : 'text-gray-700 bg-white'}`}
              required
            >
              {statuses.map(s => (
                <option key={s.IdPetStatus} value={s.IdPetStatus}>
                  {s.PetStatus}
                </option>
              ))}
            </select>
            <label className={`absolute left-3 -top-2 px-1 text-sm ${theme === 'dark' ? 'text-green-500 bg-gray-900' : 'text-green-600 bg-white'}`}>
              {text[language].status}
            </label>
          </div>

          <button
            type="button"
            onClick={() => setShowImageUploadModal(true)}
            className="w-full p-2 border border-gray-300 rounded bg-green-50 hover:bg-green-100 text-green-700"
          >
            {formData.Image ? formData.Image.name : text[language].selectImage}
          </button>

          <button
            type="submit"
            className="w-full mt-4 p-3 rounded bg-green-600 text-white hover:bg-green-700"
          >
            {text[language].register}
          </button>
        </div>
      </form>

      <ImageUploadModal
        isOpen={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        currentImage={formData.Image ? URL.createObjectURL(formData.Image) : null}
        onImageSelected={(file: File) => {
          setFormData(prev => ({ ...prev, Image: file }));
          setShowImageUploadModal(false);
        }}
      />
    </div>
  );
};

export default RegisterPet;
