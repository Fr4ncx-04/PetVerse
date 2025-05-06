"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { usePets } from "../contexts/PetContext"
import PetCard from "../components/PetCard"
import { Plus } from "lucide-react"

export default function PetsByUser() {
  const { user } = useAuth()
  const { pets } = usePets()
  const navigate = useNavigate()

  

  // Filtrar mascotas del usuario actual
const userPets = user ? pets.filter((pet) => pet.IdUser === user.IdUser) : [];


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">My Pets</h1>
        <button
          onClick={() => navigate("/AddPet")}
          className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-full w-[100px] h-[25px] transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {userPets.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            You don't have any pets registered yet. Click the + button to add your first pet!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPets.map((pet) => (
            <div key={pet.IdPet} className="flex justify-center">
              <PetCard pet={pet} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

