import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as Tabs from "@radix-ui/react-tabs";
import { PawPrint, Heart } from "lucide-react";
import axios from "axios";
import PetCard from "./PetCard"; 


interface Pet {
    IdPet: number;
    PetName: string;
    SpeciesName: string; 
    Breed: string;
    Age: number;
    Image: string;
    PetStatus: string; 
    LastWeight: number;
    IdUser: number;
    Owner?: string;
}

export default function PetShowcase() {
  const [tab, setTab] = useState("my-pets");
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [adoptionPets, setAdoptionPets] = useState<Pet[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPets = async () => {
      // Solo fetchear si el usuario está logeado
      if (user?.IdUser) {
        try {
          // Tipar la respuesta de axios.get con UserPet[]
          const response = await axios.get<Pet[]>(`http://localhost:3000/api/pets/getPetsByUser/${user.IdUser}`);
          setMyPets(response.data);

        } catch (error) {
          console.error("Error al obtener mascotas:", error);
        }
      } else {
        setMyPets([]);
      }
    };

    const fetchAdoptionPets = async () => {
      try {
        const response = await axios.get<Pet[]>("http://localhost:3000/api/pets/adoption");
        const topThree = response.data.slice(0, 2);
        setAdoptionPets(topThree);
      } catch (error) {
        console.error("Error al obtener mascotas en adopción:", error);
      }
    };

    fetchAdoptionPets();
    fetchMyPets();
  }, [user]);

  const handleAddPet = () => {
    if (user) {
      // Navegar a la página de registro de mascota
      navigate("/RegisterPet");
    } else {
      // Manejo si el usuario no está logeado (alerta simple, considera redireccionar)
      alert("Para añadir una mascota, inicia sesión.");
    }
  };

  const ViewAdoptions = () => {
    navigate("/adoptionpage");
  }

  // --- Renderizado ---
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Perfiles de Mascotas</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Administra tus mascotas o encuentra una nueva para adoptar.
        </p>
      </div>

      <Tabs.Root value={tab} onValueChange={setTab} className="w-full">
        <Tabs.List className="flex justify-center mb-8 gap-4">
          <Tabs.Trigger
            value="my-pets"
            className={`px-4 py-2 rounded border transition ${
              tab === "my-pets" ? "bg-green-600 text-white" : "bg-gray-100 text-black"
            }`}
          >
            <PawPrint className="inline-block w-4 h-4 mr-2" />
            Mis Mascotas
          </Tabs.Trigger>
          <Tabs.Trigger
            value="adoption"
            className={`px-4 py-2 rounded border transition ${
              tab === "adoption" ? "bg-green-600 text-white" : "bg-gray-100 text-black"
            }`}
          >
            <Heart className="inline-block w-4 h-4 mr-2" />
            En Adopción
          </Tabs.Trigger>
        </Tabs.List>

        {/* --- Mis mascotas --- */}
        <Tabs.Content value="my-pets">
          <div className="justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {myPets.length > 0 ? (
              <>
                {myPets.map((pet) => (
                  <PetCard key={pet.IdPet} pet={pet} type="my-pet" />
                ))}
                {user && (
                  <>
                    <AddCard
                      onClick={handleAddPet}
                      icon={<PawPrint className="w-12 h-12 text-gray-400 mb-4" />}
                      title="Añadir una mascota"
                    />
                    <div className="col-span-full w-full flex justify-center">
                      <Link to="/AddPet">
                        <button className="border border-green-500 hover:scale-105 transition px-6 py-2 rounded">
                          Ver mis mascotas
                        </button>
                      </Link>
                    </div>
                  </>
                )}
              </>
            ) : user ? (
              <AddCard
                onClick={handleAddPet}
                icon={<PawPrint className="w-12 h-12 text-gray-400 mb-4" />}
                title="No tienes mascotas registradas"
                message="Registra una para comenzar a cuidarla."
                buttonLabel="Añadir mascota"
              />
            ) : (
              <div className="text-center col-span-full">
                <p className="text-gray-600 text-lg">Inicia sesión para ver tus mascotas.</p>
                <button className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded">
                  <Link to="/login">Iniciar Sesión</Link>
                </button>
              </div>
            )}
          </div>
        </Tabs.Content>

        {/* --- Adopción --- */}
        <Tabs.Content value="adoption">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
    {/* Mostrar solo las primeras 2 mascotas en adopción */}
    {adoptionPets.slice(0, 2).map((pet) => (
      <PetCard key={pet.IdPet} pet={pet} type="adoption" />
    ))}

    {/* Mostrar AddCard si hay mascotas en adopción */}
    {adoptionPets.length > 0 && (
      <AddCard
        onClick={ViewAdoptions}
        icon={<Heart className="w-12 h-12 text-gray-400 mb-4" />}
        title="Más oportunidades de adopción"
        message="Descubre otras mascotas disponibles para adoptar."
        buttonLabel="¡Quiero adoptar!"
      />
    )}
  </div>
</Tabs.Content>
      </Tabs.Root>
    </section>
  );
}


function AddCard({
  onClick,
  icon,
  title,
  message = "Registra a tu mascota para comenzar a cuidarla",
  buttonLabel = "Añadir mascota",
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  message?: string;
  buttonLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg min-h-[400px] w-full max-w-sm">
      {icon}
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-500 text-center mb-4">{message}</p>
      <button onClick={onClick} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        {buttonLabel}
      </button>
    </div>
  );
}