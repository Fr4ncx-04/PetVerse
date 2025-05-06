import { createContext, useContext, ReactNode, useState } from "react";
import type { Pet } from "../components/typesPets";
import { useAuth } from "./AuthContext";

interface PetContextType {
  pets: Pet[];
  addPet: (pet: Omit<Pet, "IdPet" | "IdUser">) => void;
  currentUser: { IdUser: number; UserName: string } | null;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [pets, setPets] = useState<Pet[]>([
    {
      IdPet: 1,
      PetName: "Max",
      SpeciesName: "Dog",
      Breed: "Golden Retriever",
      Age: 3,
      LastWeight: 15,
      IdUser: user ? user.IdUser : 0,
      Image: "/placeholder.svg?height=200&width=200",
    },
    {
      IdPet: 2,
      PetName: "Luna",
      SpeciesName: "Cat",
      Breed: "Siamese",
      Age: 2,
      LastWeight: 4,
      IdUser: user ? user.IdUser : 0,
      Image: "/placeholder.svg?height=200&width=200",
    },
  ]);

  const addPet = (pet: Omit<Pet, "IdPet" | "IdUser">) => {
    if (!user) {
      console.error("No hay usuario logueado");
      return;
    }
    const newPet: Pet = {
      ...pet,
      IdPet: Math.floor(Math.random() * 100000),
      IdUser: user.IdUser,
    };
    setPets([...pets, newPet]);
  };

  return (
    <PetContext.Provider value={{ pets, addPet, currentUser: user }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error("usePets must be used within a PetProvider");
  }
  return context;
}
