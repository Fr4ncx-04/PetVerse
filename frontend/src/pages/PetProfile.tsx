import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Syringe,
  Bug,
  Weight,
  HeartPulse,
  Scissors,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion"; // Import motion for skeleton animation

// Importar el hook del contexto
import { useThemeLanguage } from "../contexts/ThemeLanguageContext";


// Importar los componentes modales (Ajusta las rutas según tu estructura de carpetas)
import VaccineModal, { Vaccine } from "../components/VaccineModal";
import WeightHistoryModal, { WeightRecord } from "../components/WeightHistoryModal";
import AppointmentModal, { Appointment as ModalAppointment } from "../components/AppointmentModal";
import ImageUploadModal from "../components/ImageUploadModal";


// --- Definiciones de Tipos (Interfaces) ---

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "sm";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean; // Added disabled prop
}



interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

interface ProgressProps {
  value: number;
  className?: string;
}



interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface TabsProps {
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  theme?: string;
}

interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}

// Interface para la estructura de la respuesta del backend para detalles
interface BackendMedicalRecord {
    RecordDate: string;
    Type: string; // e.g., "Alergia", "Cirugía"
    Description: string;
    Notes: string;
}

interface BackendVaccination {
    VaccinationDate: string;
    NextDue: string | null;
    VaccineName: string;
    StatusName: string;
    Notes: string;
}

interface BackendDeworming {
    DewormingDate: string;
    NextDue: string | null;
    DewormerName: string;
    Notes: string;
}

interface BackendWeightRecord {
    Weight: string;
    RecordDate: string;
    Notes: string;
}

interface BackendPetDetailsResponse {
    records: BackendMedicalRecord[];
    vaccinations: BackendVaccination[];
    dewormings: BackendDeworming[];
    WeightControl: BackendWeightRecord[];
    Vaccinated: boolean;
    Neutered: boolean;
    HasEpilepsy: boolean;
    Treatment: string | null;
    LastAppointment: string | null;
    NextAppointment: string | null;
    MedicalNotes: string | null;
    // ... otros campos si los hay
}

// Interface para la estructura de la respuesta del backend para PetInfo (si es un endpoint separado)
interface ApiPetInfo {
  IdPet: number;
  PetName: string;
  SpeciesName: string;
  Breed: string;
  Age: number;
  Weight: number;
  Image: string | null;
  PetStatus: string;
  IdUser: number;
}

// Interfaces para el estado del componente, mapeando de las interfaces de backend si es necesario
interface PetInfoState {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  image: string;
  PetStatus: string;
}

interface PetDetailsState {
  vaccinated: boolean;
  neutered: boolean;
  hasEpilepsy: boolean;
  treatment: string | null;
  lastAppointment: string | null;
  nextAppointment: string | null;
  medicalNotes: string | null;
}

interface Condition {
  name: string;
  details: string;
  diagnosed: string;
}

interface Surgery {
  name: string;
  date: string;
  vet: string;
  notes: string;
}

interface ApiAppointment {
    AppointmentDate?: string;
    Reason?: string;
    Veterinarian?: { Name: string };
    date?: string;
    reason?: string;
    vet?: string;
}

// --- Componentes Locales (Button, Card, etc. - as previously defined) ---
// --- Componentes Locales ---

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
  disabled = false // Default value for disabled
}) => {
  const baseStyles = "font-medium rounded focus:outline-none transition-colors";

  const variantStyles: Record<ButtonVariant, string> = {
    default: "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed", // Added disabled styles
    outline: "bg-transparent border border-current text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed", // Added disabled styles
    ghost: "bg-transparent hover:bg-green-50 text-green-600 disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
  };

  const sizeStyles: Record<ButtonSize, string> = {
    default: "py-2 px-4",
    sm: "py-1 px-2 text-sm"
  };

  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={styles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};





const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// Componente Badge local (restaurado)
const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${className}`}>
      {children}
    </span>
  );
};


const Progress: React.FC<ProgressProps> = ({ value, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className="bg-green-600 h-2 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};


const TabsContext = createContext<TabsContextValue>({ activeTab: '', setActiveTab: () => {} });

const Tabs: React.FC<TabsProps> = ({ children, defaultValue, className = "" }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList: React.FC<TabsListProps> = ({ children, className = "" }) => {
  return <div className={`flex ${className}`}>{children}</div>;
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, value, theme}) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  const base = "flex-1 px-4 py-2 text-center transition-colors";
  const darkStyles = isActive
    ? "bg-green-700 text-white"
    : "bg-gray-800 text-gray-300 hover:bg-gray-700";
  const lightStyles = isActive
    ? "bg-green-600 text-white"
    : "bg-green-100 hover:bg-green-200";

  return (
    <button
      className={`${base} ${theme === 'dark' ? darkStyles : lightStyles}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

const TabsContent: React.FC<TabsContentProps> = ({ children, value, className = "" }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
};


// --- Skeleton Loader Component for PetProfile ---
const SkeletonPetProfile: React.FC = () => {
    const { theme } = useThemeLanguage();
    const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    const cardBgColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
    const pulseColor = theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className={`space-y-6 p-4 md:p-6 max-w-4xl mx-auto ${bgColor} min-h-screen`}
        >
            {/* Back Button Skeleton */}
            <div className={`h-10 w-24 rounded ${pulseColor} animate-pulse`}></div>

            {/* Pet Info Card Skeleton */}
           
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                        {/* Image Placeholder */}
                        <div className={`w-full md:w-1/3 h-64 md:h-auto ${pulseColor}`}></div>
                        {/* Info Placeholder */}
                        <div className="p-6 md:w-2/3 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className={`h-6 w-40 rounded ${pulseColor} mb-2`}></div> {/* Name */}
                                    <div className={`h-4 w-32 rounded ${pulseColor}`}></div> {/* Species/Breed */}
                                </div>
                                <div className={`h-6 w-16 rounded-full ${pulseColor}`}></div> {/* Status Badge */}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`h-4 w-20 rounded ${pulseColor}`}></div> {/* Age */}
                                <div className={`h-4 w-24 rounded ${pulseColor}`}></div> {/* Weight */}
                            </div>
                            <div className={`h-4 w-full rounded ${pulseColor}`}></div> {/* Vaccination Progress */}
                        </div>
                    </div>
                </CardContent>


            {/* Tabs Skeleton */}
            <div className={`flex ${cardBgColor} rounded-lg overflow-hidden animate-pulse`}>
                 <div className={`flex-1 h-10 rounded-l-lg ${pulseColor} mr-1`}></div> {/* Tab 1 */}
                 <div className={`flex-1 h-10 rounded-r-lg ${pulseColor}`}></div> {/* Tab 2 */}
            </div>

            {/* Tab Content Skeletons */}
            <div className="space-y-4">
                {/* Section Card Skeleton 1 */}
              
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <div className={`h-6 w-32 rounded ${pulseColor}`}></div> {/* Section Title */}
                            <div className={`h-8 w-20 rounded ${pulseColor}`}></div> {/* Button */}
                        </div>
                        <div className={`h-16 w-full rounded ${pulseColor}`}></div> {/* Content Placeholder */}
                    </CardContent>
               
                 {/* Section Card Skeleton 2 */}
              
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <div className={`h-6 w-32 rounded ${pulseColor}`}></div> {/* Section Title */}
                            <div className={`h-8 w-20 rounded ${pulseColor}`}></div> {/* Button */}
                        </div>
                         <div className={`h-16 w-full rounded ${pulseColor}`}></div> {/* Content Placeholder */}
                    </CardContent>

            </div>
        </motion.div>
    );
};


// Main PetProfile component
const PetProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Usar el hook useThemeLanguage
  const { theme, language } = useThemeLanguage();

  // Puedes usar 'theme' y 'language' aquí o en el JSX renderizado
  // Por ejemplo, para depuración:
  // console.log("Tema actual:", theme);
  // console.log("Idioma actual:", language);


  const [expandedSections, setExpandedSections] = useState({
    appointments: false,
    vaccines: false,
    deworming: false,
    conditions: false,
    surgeries: false,
  });

  const [showVaccineModal, setShowVaccineModal] = useState<boolean>(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState<boolean>(false);
  const [showWeightModal, setShowWeightModal] = useState<boolean>(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState<boolean>(false);


  const [loading, setLoading] = useState<boolean>(true); // Initialize loading as true
  const [error, setError] = useState<string | null>(null);

  const [petInfo, setPetInfo] = useState<PetInfoState | null>(null);
  const [petDetails, setPetDetails] = useState<PetDetailsState | null>(null);

  const [apiAppointments, setApiAppointments] = useState<ApiAppointment[]>([]);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [deworming, setDeworming] = useState<Array<{ date: string, product: string, nextDate: string | null }>>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);


  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const fetchPetData = async (petId: string) => {
    if (!petId) {
        setLoading(false);
        setError("ID de mascota no proporcionado.");
        return;
    }
    setLoading(true); // Set loading to true before fetch
    setError(null);

    try {
      const infoRes = await axios.get<ApiPetInfo>(`http://localhost:3000/api/pets/getPetById/${petId}`);
      const detailsRes = await axios.get<BackendPetDetailsResponse>(`http://localhost:3000/api/pets/details/${petId}`);
      // Note: Assuming the appointments endpoint is correct and accessible
      const apptRes = await axios.get<ApiAppointment[]>(`http://localhost:4002/api/pets/getAppointments/${petId}`);

      // console.log('Pet Info (from /pets):', infoRes.data);
      // console.log('Pet Details (from /details):', detailsRes.data);
      // console.log('Appointments (from separate service):', apptRes.data);

      const fetchedWeightHistory: WeightRecord[] = detailsRes.data.WeightControl.map(weightRecord => ({
          date: weightRecord.RecordDate,
          weight: weightRecord.Weight,
      }));

      const sortedWeightHistory = [...fetchedWeightHistory].sort(
           (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      // Use the latest weight from the sorted history if available, otherwise fallback to infoRes.data.Weight
      const latestWeight = sortedWeightHistory.length > 0 ? sortedWeightHistory[0].weight : `${infoRes.data.Weight}`;

      setWeightHistory(fetchedWeightHistory);

      const petInfoData: PetInfoState = {
        id: infoRes.data.IdPet,
        name: infoRes.data.PetName,
        species: infoRes.data.SpeciesName,
        breed: infoRes.data.Breed,
        age: `${infoRes.data.Age} años`, // Assuming age is in years
        weight: `${latestWeight} kg`, // Use latest weight
        image: infoRes.data.Image || "/placeholder.svg?height=300&width=300", // Placeholder image
        PetStatus: infoRes.data.PetStatus
      };
      setPetInfo(petInfoData);

      const petDetailsData: PetDetailsState = {
        vaccinated: detailsRes.data.Vaccinated,
        neutered: detailsRes.data.Neutered,
        hasEpilepsy: detailsRes.data.HasEpilepsy,
        treatment: detailsRes.data.Treatment,
        lastAppointment: detailsRes.data.LastAppointment,
        nextAppointment: detailsRes.data.NextAppointment,
        medicalNotes: detailsRes.data.MedicalNotes
      };
      setPetDetails(petDetailsData);

      const fetchedConditions: Condition[] = [];
      const fetchedSurgeries: Surgery[] = [];

      detailsRes.data.records.forEach(record => {
        if (record.Type && record.Type.includes("Cirug")) {
           fetchedSurgeries.push({
             name: record.Description || 'Cirugía sin descripción',
             date: record.RecordDate,
             vet: 'No especificado', // Vet name not available in BackendMedicalRecord
             notes: record.Notes || 'Sin notas',
           });
        } else if (record.Type) {
           fetchedConditions.push({
             name: record.Type,
             details: `${record.Description || ''}${record.Description && record.Notes ? ' - ' : ''}${record.Notes || ''}` || 'Sin detalles',
             diagnosed: record.RecordDate,
           });
        }
      });
      setConditions(fetchedConditions);
      setSurgeries(fetchedSurgeries);

      const fetchedVaccines: Vaccine[] = detailsRes.data.vaccinations.map(vaccination => ({
        name: vaccination.VaccineName || 'Vacuna sin nombre',
        date: vaccination.VaccinationDate,
        nextDate: vaccination.NextDue,
        status: vaccination.StatusName || 'Desconocido',
      }));
      setVaccines(fetchedVaccines);

      const fetchedDeworming: Array<{ date: string, product: string, nextDate: string | null }> = detailsRes.data.dewormings.map(dewormingItem => ({
        date: dewormingItem.DewormingDate,
        product: dewormingItem.DewormerName || 'Producto sin especificar',
        nextDate: dewormingItem.NextDue || null,
      }));
      setDeworming(fetchedDeworming);

      setApiAppointments(apptRes.data);

    } catch (err) {
      console.error("Error fetching pet data:", err);
       if (axios.isAxiosError(err)) {
            const backendErrorMessage = err.response?.data?.message || err.message;
            setError(`Error al cargar los datos de la mascota: ${backendErrorMessage} (Código: ${err.response?.status || 'N/A'})`);
        } else if (err instanceof Error) {
            setError("Error al cargar los datos de la mascota: " + err.message);
        } else {
            setError("Error desconocido al cargar los datos de la mascota.");
        }
    } finally {
        // --- Introduce artificial delay for skeleton ---
        // Adjust the duration (e.g., 2000 for 2 seconds, 3000 for 3 seconds)
        const delayDuration = 1500; // 1.5 seconds delay

        const timer = setTimeout(() => {
            setLoading(false); // Set loading to false after delay
        }, delayDuration);

        // Cleanup the timer if the component unmounts or petId changes
        return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    fetchPetData(id as string);
  }, [id]); // Depend on `id` so it refetches if the URL parameter changes


  const handleImageUpdated = (newImageUrl?: string) => {
  if (newImageUrl) {
    // opcional: actualizar localmente la URL de la imagen
    setPetInfo(prev => 
      prev
      ? { ...prev, image: newImageUrl }
      : prev
    );
  } else {
    // si no vino URL, refetch completo
    fetchPetData(id as string);
  }
  setShowImageUploadModal(false);
};


   // Map API appointments to modal format
   const modalAppointments: ModalAppointment[] = apiAppointments.map(appt => ({
      date: appt.AppointmentDate || appt.date || '',
      reason: appt.Reason || appt.reason || 'Sin razón especificada',
      vet: appt.Veterinarian?.Name || appt.vet || 'Dr./Dra. No especificado',
   }));


  // Calculate vaccine progress
  const vaccineProgress: number = vaccines.length > 0
    ? Math.round((vaccines.filter(v => v.status === "Aplicada").length / vaccines.length) * 100)
    : 0;


  // --- Conditional Rendering: Loading, Error, or Data Not Found ---
  if (loading) {
    return <SkeletonPetProfile />; // Render skeleton while loading
  }

  if (error) {
     return (
      <div className="flex items-center justify-center min-h-screen p-4"> {/* Added padding */}
        <p className="text-lg text-red-500 text-center">{error}</p> {/* Centered text */}
      </div>
    );
  }

   if (!petInfo || !petDetails) {
      return (
      <div className="flex items-center justify-center min-h-screen p-4"> {/* Added padding */}
        <p className="text-lg text-red-500 text-center">No se encontraron los datos completos de la mascota.</p> {/* Centered text */}
        </div>
    );
  }

  // --- Main Render Logic (once data is loaded and no errors) ---
  return (
      <div
        className={`
          pt-8 pb-8
          px-4 sm:px-6 lg:px-8        /* padding horizontal: 1rem en móvil, 1.5rem en sm, 2rem en lg */
          space-y-4 md:space-y-6       /* separación vertical: 1rem en móvil, 1.5rem en md+ */
          max-widht      /* ancho máximo de contenido y centrado */
          max-height
          ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}
        `}
      >
      {/* Botón de regreso */}
      <div>
        <Button
          variant="default"
          size="default"
          className="mt-20  flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> {language === 'en' ? 'Go Back' : 'Regresar'} {/* Localized text */}
        </Button>
      </div>

      {/* Perfil de la mascota */}
     
        <CardContent className="p-0">
          <div className={`flex flex-col md:flex-row
                          ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200'}
                        `}>
            <div
              className={`
                relative w-full md:w-1/3 h-64 md:h-auto group cursor-pointer
                ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}
              `}
              onClick={() => setShowImageUploadModal(true)}
            >
              <img
                src={petInfo.image}
                alt={petInfo.name}
                className="w-full h-full object-cover rounded-lg"
                 onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { // Added error handling for image
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = "/placeholder.svg?height=300&width=300"; // Fallback image
                    target.style.objectFit = 'contain'; // Adjust object fit for placeholder
                    target.style.backgroundColor = theme === 'dark' ? '#374151' : '#e5e7eb'; // Add background color
                 }}
              />
               <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Edit className="h-8 w-8 text-white" />
               </div>
            </div>
            <div className={`p-6 md:w-2/3
              ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
            `}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-800'}`}>{petInfo.name}</h2> {/* Adjusted color */}
                  <p className={`${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}> {/* Adjusted color */}
                    {petInfo.species} - {petInfo.breed}
                  </p>
                </div>
                <Badge className="bg-green-600">{petInfo.PetStatus || (language === 'en' ? 'Active' : 'Activo')}</Badge> {/* Localized default status */}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Edad</p> {/* Adjusted color */}
                  <p className="font-medium">{petInfo.age}</p>
                </div>
                <div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Peso actual</p> {/* Adjusted color */}
                  <div className="flex items-center">
                    <p className="font-medium">{petInfo.weight}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`ml-2 ${theme === 'dark' ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'} p-0 h-auto`}
                      onClick={() => setShowWeightModal(true)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Estado de vacunación</p> {/* Adjusted color */}
                <div className="flex items-center gap-2">
                  <Progress value={vaccineProgress} className={`h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-100'}`} /> {/* Adjusted background color */}
                  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{vaccineProgress}%</span> {/* Adjusted color */}
                </div>
              </div>
            </div>
          </div>
        </CardContent>


      <Tabs defaultValue="medical" className="w-full">
        <TabsList className={`grid grid-cols-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-100'} rounded-t-lg overflow-hidden`}> {/* Adjusted colors and rounded top */}
          <TabsTrigger value="medical" className={`${theme === 'dark' ? 'data-[state=active]:bg-green-700 data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-300' : ''}`}> {/* Adjusted colors for dark mode */}
            {language === 'en' ? 'Medical History' : 'Historial Médico'} {/* Localized text */}
          </TabsTrigger>
          <TabsTrigger value="details" className={`${theme === 'dark' ? 'data-[state=active]:bg-green-700 data-[state=inactive]:bg-gray-800 data-[state=inactive]:text-gray-300' : ''}`}> {/* Adjusted colors for dark mode */}
            {language === 'en' ? 'Clinical Details' : 'Detalles Clínicos'} {/* Localized text */}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medical" className="space-y-4 mt-4">
        
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} /> {/* Adjusted color */}
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Citas Médicas</h3> {/* Adjusted color */}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${theme === 'dark' ? 'text-green-400 border-green-600 hover:bg-gray-700' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                    onClick={() => setShowAppointmentModal(true)}
                  >
                    {language === 'en' ? 'View All' : 'Ver todas'} {/* Localized text */}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection("appointments")}
                    className={`${theme === 'dark' ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'}`}
                  >
                    {expandedSections.appointments ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {expandedSections.appointments && (
                <div className="mt-4 space-y-2">
                  {modalAppointments.length > 0 ? modalAppointments.slice(0, 3).map((appointment, index) => (
                    <div key={index} className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-green-50'}`}> {/* Adjusted colors */}
                      <div className="flex justify-between">
                        <p className="font-medium">{new Date(appointment.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}</p> {/* Localized date */}
                        <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{appointment.vet}</p> {/* Adjusted color */}
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{appointment.reason}</p> {/* Adjusted color */}
                    </div>
                  )) : (
                    <p className={`text-gray-500 text-center py-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>No hay citas registradas</p>
                  )}
                </div>
              )}
            </CardContent>


       
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Syringe className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>
                    Vacunas
                  </h3>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVaccineModal(true)}
                    className={theme === 'dark' 
                      ? 'text-green-400 border-green-600 hover:bg-gray-700' 
                      : 'text-green-600 border-green-200 hover:bg-green-50'
                    }
                  >
                    {language === 'en' ? 'View All' : 'Ver todas'}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('vaccines')}
                    className={theme === 'dark' 
                      ? 'text-green-400 hover:bg-gray-700' 
                      : 'text-green-600 hover:bg-green-50'
                    }
                  >
                    {expandedSections.vaccines ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {expandedSections.vaccines && (
                <div className="mt-4 space-y-2">
                  {vaccines.length > 0 ? vaccines.map((vaccine, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-green-50'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{vaccine.name}</p>

                          {vaccine.date && (
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {language === 'en' ? 'Applied:' : 'Aplicada:'} {new Date(vaccine.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}
                            </p>
                          )}

                          {vaccine.nextDate && (
                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {language === 'en' ? 'Next:' : 'Próxima:'} {new Date(vaccine.nextDate).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}
                            </p>
                          )}
                        </div>

                        <Badge className={vaccine.status === 'Aplicada' ? 'bg-green-600' : 'bg-amber-500'}>
                          {vaccine.status}
                        </Badge>
                      </div>
                    </div>
                  )) : (
                    <p className={`text-center py-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {language === 'en' ? 'No vaccines recorded' : 'No hay vacunas registradas'}
                    </p>
                  )}
                </div>
              )}
            </CardContent>



       
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bug className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} /> {/* Adjusted color */}
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>Desparasitaciones</h3> {/* Adjusted color */}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("deworming")}
                  className={`${theme === 'dark' ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'}`}
                >
                  {expandedSections.deworming ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
              </div>

              {expandedSections.deworming && (
                <div className="mt-4 space-y-2">
                  {deworming.length > 0 ? deworming.map((item, index) => (
                    <div key={index} className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-green-50'}`}> {/* Adjusted colors */}
                      <div className="flex justify-between items-center"> {/* Added items-center */}
                        <p className="font-medium">{new Date(item.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}</p> {/* Localized date */}
                        <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>{item.product}</p> {/* Adjusted color */}
                      </div>
                       {item.nextDate && (
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Próxima: {new Date(item.nextDate).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}</p>
                        )}
                    </div>
                  )) : (
                     <p className={`text-gray-500 text-center py-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>No hay desparasitaciones registradas</p>
                  )}
                </div>
              )}
            </CardContent>

        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Conditional rendering for details sections */}
            {petDetails.hasEpilepsy !== undefined && petDetails.hasEpilepsy !== null && ( // Check if the data point exists
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}> {/* Adjusted color */}
                <p className="font-semibold">{language === 'en' ? 'Epilepsy:' : 'Epilepsia:'}</p> {/* Localized text */}
                <p>{petDetails.hasEpilepsy ? (language === 'en' ? 'Yes' : 'Sí') : (language === 'en' ? 'No' : 'No')}</p> {/* Localized text */}
              </div>
            )}

            {petDetails.neutered !== undefined && petDetails.neutered !== null && ( // Check if the data point exists
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}> {/* Adjusted color */}
                <p className="font-semibold">{language === 'en' ? 'Neutered:' : 'Esterilizado:'}</p> {/* Localized text */}
                <p>{petDetails.neutered ? (language === 'en' ? 'Yes' : 'Sí') : (language === 'en' ? 'No' : 'No')}</p> {/* Localized text */}
              </div>
            )}


            {petDetails.treatment && ( // Only show if treatment exists
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'} col-span-1 md:col-span-2`}> {/* Adjusted color, span columns */}
                <p className="font-semibold">{language === 'en' ? 'Treatment:' : 'Tratamiento:'}</p> {/* Localized text */}
                <p>{petDetails.treatment}</p>
              </div>
            )}

            {petDetails.lastAppointment && ( // Only show if last appointment exists
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}> {/* Adjusted color */}
                <p className="font-semibold">{language === 'en' ? 'Last Appointment:' : 'Última Cita:'}</p> {/* Localized text */}
                <p>{new Date(petDetails.lastAppointment).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}</p> {/* Localized date */}
              </div>
            )}

            {petDetails.nextAppointment && ( // Only show if next appointment exists
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}> {/* Adjusted color */}
                <p className="font-semibold">{language === 'en' ? 'Next Appointment:' : 'Próxima Cita:'}</p> {/* Localized text */}
                <p>{new Date(petDetails.nextAppointment).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}</p> {/* Localized date */}
              </div>
            )}

            {petDetails.medicalNotes && ( // Only show if medical notes exist
              <div className={`col-span-1 md:col-span-2 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}> {/* Adjusted color, span columns */}
                <p className="font-semibold">{language === 'en' ? 'Medical Notes:' : 'Notas Médicas:'}</p> {/* Localized text */}
                <p>{petDetails.medicalNotes}</p>
              </div>
            )}
          </div>

         
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Weight className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} /> {/* Adjusted color */}
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>{language === 'en' ? 'Weight Control' : 'Control de Peso'}</h3> {/* Localized text */}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className={`${theme === 'dark' ? 'text-green-400 border-green-600 hover:bg-gray-700' : 'text-green-600 border-green-200 hover:bg-green-50'}`}
                  onClick={() => setShowWeightModal(true)}
                >
                  {language === 'en' ? 'View History' : 'Ver historial'} {/* Localized text */}
                </Button>
              </div>

              {weightHistory.length > 0 && (
                <div className="mt-4">
                  <div className={`flex justify-between text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> {/* Adjusted color */}
                    <span>{new Date([...weightHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}</span> {/* Localized date */}
                    <span className="font-medium">{new Date([...weightHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}</span> {/* Localized date */}
                  </div>
                  <Progress value={100} className={`h-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-100'}`} /> {/* Adjusted background color */}
                  <div className="flex justify-between text-sm mt-1">
                    <span>{weightHistory.length > 0 ? [...weightHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].weight + ' kg' : ''}</span>
                    <span className="font-medium">{weightHistory.length > 0 ? [...weightHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].weight + ' kg' : ''}</span>
                  </div>
                </div>
              )}
               {weightHistory.length === 0 && (
                  <p className={`text-gray-500 text-center py-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>No hay historial de peso registrado</p>
                )}
            </CardContent>


      
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <HeartPulse className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} /> {/* Adjusted color */}
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>{language === 'en' ? 'Medical Conditions' : 'Condiciones Médicas'}</h3> {/* Localized text */}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("conditions")}
                  className={`${theme === 'dark' ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'}`} 
                >
                  {expandedSections.conditions ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
              </div>

              {expandedSections.conditions && (
                <div className="mt-4 space-y-2">
                  {conditions.length > 0 ? (
                    conditions.map((condition, index) => (
                      <div key={index} className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-green-50'}`}> {/* Adjusted colors */}
                        <div className="flex justify-between items-center"> {/* Added items-center */}
                          <p className="font-medium">{condition.name}</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> {/* Adjusted color */}
                            Diagnosticado: {new Date(condition.diagnosed).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')} {/* Localized date */}
                          </p>
                        </div>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{condition.details}</p> {/* Adjusted color */}
                      </div>
                    ))
                  ) : (
                    <p className={`text-gray-500 text-center py-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>No se han registrado condiciones médicas</p>
                  )}
                </div>
              )}
            </CardContent>


         
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Scissors className={`h-5 w-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} /> {/* Adjusted color */}
                  <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-green-300' : 'text-green-800'}`}>{language === 'en' ? 'Surgeries' : 'Cirugías'}</h3> {/* Localized text */}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection("surgeries")}
                  className={`${theme === 'dark' ? 'text-green-400 hover:bg-gray-700' : 'text-green-600 hover:bg-green-50'}`}
                >
                  {expandedSections.surgeries ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                    )}
                </Button>
              </div>

              {expandedSections.surgeries && (
                <div className="mt-4 space-y-2">
                  {surgeries.length > 0 ? (
                    surgeries.map((surgery, index) => (
                      <div key={index} className={`p-3 rounded-md ${theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-green-50'}`}> {/* Adjusted colors */}
                        <div className="flex justify-between items-center"> {/* Added items-center */}
                          <p className="font-medium">{surgery.name}</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> {/* Adjusted color */}
                            Fecha: {new Date(surgery.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')} {/* Localized date */}
                          </p>
                        </div>
                        {surgery.vet && (
                          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>Veterinario: {surgery.vet}</p> 
                        )}
                        {surgery.notes && (
                           <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Notas: {surgery.notes}</p> 
                        )}
                      </div>
                    ))
                  ) : (
                    <p className={`text-gray-500 text-center py-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>No se han registrado cirugías</p>
                  )}
                </div>
              )}
            </CardContent>


        </TabsContent>
      </Tabs>

      {/* Renderizar los Modales */}
      <VaccineModal
        isOpen={showVaccineModal}
        onClose={() => setShowVaccineModal(false)}
        vaccines={vaccines}
      />
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        appointments={modalAppointments}
      />
       <WeightHistoryModal
        isOpen={showWeightModal}
        onClose={() => setShowWeightModal(false)}
        weightHistory={weightHistory}
      />
      {petInfo && (
          <ImageUploadModal
          isOpen={showImageUploadModal}
          onClose={() => setShowImageUploadModal(false)}
          currentImage={petInfo.image}
          updateEndpoint="http://localhost:3000/api/pets/updateImage"
          petId={petInfo.id}
          onUpdateSuccess={(newImageUrl?: string) => {
            handleImageUpdated(newImageUrl);
          }}
          />

      )}
    </div>
  );
};

export default PetProfile;
