import { useNavigate } from 'react-router-dom';

export default function PetPromoBanner() {
  const navigate = useNavigate();

  return (
    <div className="relative bg-[#000] rounded-2xl overflow-hidden px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between min-h-[400px] mr-20 ml-20">
      
      <div className="absolute inset-0 z-0 opacity-60 flex justify-center">
        <div className="w-full">
          <img
            src="https://images.unsplash.com/photo-1626204451832-91eb35617cc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Fondo mascotas"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
      <div className="relative z-10 text-center md:text-left max-w-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Las mejores promociones en productos para tu mascota
        </h2>
        <p className="mt-4 text-lg text-white">
          Juguetes, alimento, ropa y más para consentir a tu peludo amigo.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-6 bg-green-400 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-green-500 transition"
        >
          Ver productos
        </button>
      </div>
    </div>
  );
}
