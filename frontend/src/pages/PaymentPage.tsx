import { useState, useEffect } from 'react';
import { Trash2, Truck, CheckCircle, CreditCard, Banknote } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useThemeLanguage } from "../contexts/ThemeLanguageContext";

interface CartItem {
  IdCart: number;
  IdUser: number;
  product: {
    IdProduct: number;
    ProductName: string;
    Description?: string;
    Price: number;
    Image: string;
  };
  Quantity: number;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

const PaymentSkeleton = ({ theme }: { theme: 'light' | 'dark', language: 'en' | 'es' }) => (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-green-100'} py-10 px-4 sm:px-6 lg:px-8 flex justify-center animate-pulse`}>
        <div className={`w-full max-w-4xl rounded-lg shadow-xl p-6 md:p-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>

            <div className={`h-8 w-1/2 mx-auto mb-8 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

             <div className="flex justify-end space-x-2 mb-4">
                <div className={`h-6 w-12 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className={`h-6 w-12 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
             </div>

            <div className={`mb-8 border-b pb-6 ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className={`h-6 w-1/3 mb-4 mx-auto rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => ( // Simulate 3 cart items
                        <div key={index} className={`flex items-center space-x-4 border rounded-md p-4 shadow-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
                            <div className={`w-20 h-20 rounded-md ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                            <div className="flex-grow space-y-2">
                                <div className={`h-4 w-2/3 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                                <div className={`h-3 w-1/3 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                                <div className={`h-3 w-1/4 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                            </div>
                            <div className={`h-6 w-1/6 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-8 text-center">
                 <div className={`h-7 w-1/4 mx-auto rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
            </div>

            <div className="mb-8 text-center">
                 <div className={`h-6 w-1/4 mb-3 mx-auto rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                 <div className="flex justify-center space-x-4">
                    <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    <div className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                 </div>
            </div>

            <div className="space-y-6">
                <div className={`h-6 w-1/3 mx-auto mb-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                {[...Array(3)].map((_, index) => ( // Simulate 3 form rows (label + input)
                    <div key={index}>
                        <div className={`h-4 w-1/4 mb-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        <div className={`h-10 w-full rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    </div>
                ))}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className={`h-4 w-1/4 mb-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        <div className={`h-10 w-full rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    </div>
                     <div>
                        <div className={`h-4 w-1/4 mb-2 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                        <div className={`h-10 w-full rounded-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                    </div>
                 </div>

                  <div className={`h-5 w-1/2 mx-auto mt-6 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

                <div className={`h-12 w-full rounded-md mt-6 ${theme === 'dark' ? 'bg-green-800' : 'bg-green-300'}`}></div>
            </div>
        </div>
    </div>
);


export default function PaymentPage() {
  const { cartItems, fetchCartCount, fetchCartItems, removeItemFromCart, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth(); 
  const { theme, language } = useThemeLanguage(); 
  const [isLoading, setIsLoading] = useState(true); 
  const [fetchError, setFetchError] = useState<string | null>(null); 
  const [showModal, setShowModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [progress, setProgress] = useState(0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.Price * item.Quantity, 0);
  const navigate = useNavigate()

  useEffect(() => {
      if (!isLoggedIn || !user?.IdUser) {
        setIsLoading(false); 
        setFetchError(language === 'es' ? 'Debes iniciar sesión para ver tu carrito.' : 'You must log in to see your cart.');
        return;
      }

      setIsLoading(true);
      setFetchError(null);

      try {
        fetchCartCount()
        fetchCartItems()

      } catch (err: any) { // Capturar el error con tipo any o Error
        console.error('Error fetching cart items:', err);
        setFetchError(err.message || (language === 'es' ? 'Error desconocido al cargar el carrito.' : 'Unknown error loading cart.'));
      } finally {
        // Simular un pequeño retraso para que el skeleton sea visible
        setTimeout(() => {
          setIsLoading(false); // Terminar carga
        }, 1000); // Puedes ajustar o quitar este retraso
      }
    // Dependencias: isLoggedIn, user.IdUser (si cambia el usuario, recargar), language (para mensajes de error)
  }, [isLoggedIn, user?.IdUser, language]); // Añadir setCartItemsContext a dependencias

  // --- useEffect para simular la barra de progreso del procesamiento de pago ---
  useEffect(() => {
    if (paymentStatus === 'processing') {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setPaymentStatus('success');
              clearCart();
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 2);

      return () => clearInterval(interval);
    }
    return () => {}; // Efecto vacío cuando no está procesando
  }, [paymentStatus, clearCart]); // Depende solo de paymentStatus

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (cartItems.length === 0) {
        alert(language === 'es' ? "No hay productos en el carrito para pagar." : "No products in the cart to pay.");
        return;
    }

    if (!isLoggedIn) {
        alert(language === 'es' ? "Debes iniciar sesión para proceder con el pago." : "You must log in to proceed with payment.");
        return;
    }

    // No permitir pago si hay error de carga inicial
     if (fetchError) {
         alert(language === 'es' ? `No puedes pagar debido a un error de carga anterior: ${fetchError}` : `Cannot pay due to a previous loading error: ${fetchError}`);
         return;
     }


    setShowModal(true);
    setPaymentStatus('processing');

    // El resto del procesamiento (simulado) está en el useEffect del progreso
  };

  const handleCloseModal = () => {
      setShowModal(false);
      setProgress(0);
      // Acciones después de una simulación de pago exitosa
      if (paymentStatus === 'success') {
         if (clearCart) {
           clearCart(); // Vaciar el carrito globalmente al cerrar modal exitoso
         } else {
           console.warn("La función clearCart no está disponible en el CartContext");
         }
      }
       // Resetear el estado de procesamiento después de cerrar el modal
       setPaymentStatus('idle');
  };

  // --- Lógica de Renderizado Condicional (Skeleton, Error, Contenido Real) ---
  // Renderizar esqueleto si está cargando (el fetch inicial)
  if (isLoading) {
    return <PaymentSkeleton theme={theme} language={language} />;
  }

  // Renderizar mensaje de error si hay un error (del fetch inicial)
  if (fetchError) {
    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-green-100 text-gray-900'} py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-center`}>
            <div className={`text-center p-6 rounded-lg shadow-xl ${theme === 'dark' ? 'bg-gray-800 text-red-400' : 'bg-white text-red-600'}`}>
                 <h3 className="text-xl font-semibold mb-4">{language === 'es' ? 'Error al cargar el carrito' : 'Error loading cart'}</h3>
                <p>{fetchError}</p> {/* Usamos fetchError, el estado local */}
                 {/* Opcional: botón para reintentar o ir a la página principal */}
            </div>
        </div>
    );
  }
  // --- Fin Lógica de Renderizado Condicional ---


  return (
    <div className={`mt-10 pt-20 min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-green-100 text-gray-900'} py-10 px-4 sm:px-6 lg:px-8 flex justify-center`}>
      <div className='relative right-8'>
      <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition"
        >
          {language === 'en' ? 'Back' : 'Regresar'}
        </button>
      </div>
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">


        <h2 className={`text-3xl font-extrabold text-center mb-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {language === 'es' ? 'Confirmar Pago' : 'Confirm Payment'}
        </h2>

        {/* Resumen del pedido */}
        <div className={`mb-8 border-b ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'} pb-6`}>
          <h3 className={`text-xl font-semibold text-center mb-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            {language === 'es' ? 'Resumen del Pedido' : 'Order Summary'}
          </h3>

          {cartItems.length === 0 ? (
            <p className={`text-center text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {language === 'es' ? 'No hay productos en el carrito.' : 'No products in the cart.'}
            </p>
          ) : (
            // Añadido max-h-72 y overflow-y-auto para limitar la altura y añadir scroll
            <ul className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {cartItems.map((item: CartItem) => {
                // Calcular total del ítem
                const itemTotal = item.product.Price * item.Quantity;

                return (
                  <li
                    key={item.IdCart}
                    className={`flex flex-col sm:flex-row items-center justify-between border rounded-md p-4 shadow-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} transition duration-150 ease-in-out`}
                  >
                    <div className="flex flex-grow items-center space-x-4 mb-3 sm:mb-0">
                      <img
                        src={item.product.Image || 'placeholder-image.jpg'} // Placeholder si falta imagen
                        alt={item.product.ProductName}
                        className="w-20 h-20 object-cover rounded-md shadow flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <p className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.product.ProductName}</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                           {language === 'es' ? 'Cantidad' : 'Quantity'}: {item.Quantity}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                           {language === 'es' ? 'Precio Unitario' : 'Unit Price'}: ${item.product.Price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 pl-4 sm:pl-0 flex-shrink-0">
                      <span className={`font-bold text-xl ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>${itemTotal.toFixed(2)}</span>
                      <button
                        onClick={() => removeItemFromCart(item.IdCart)}
                        className="text-red-500 hover:text-red-700 transition duration-150 ease-in-out"
                        title={language === 'es' ? 'Eliminar producto' : 'Remove product'}
                        aria-label={language === 'es' ? `Eliminar ${item.product.ProductName} del carrito` : `Remove ${item.product.ProductName} from cart`}
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Total del pedido */}
        <div className={`mb-8 text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <span>{language === 'es' ? 'Total del Pedido' : 'Order Total'}:</span>
          <span className={`ml-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>${totalPrice.toFixed(2)}</span>
        </div>

        {/* Iconos de métodos de pago aceptados */}
        <div className="mb-8 text-center">
            <h3 className={`text-lg font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              {language === 'es' ? 'Métodos de Pago Aceptados' : 'Accepted Payment Methods'}
            </h3>
            <div className="flex justify-center space-x-4">
                {/* Usamos aria-label para accesibilidad en lugar de title */}
                <CreditCard className={`w-10 h-10 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`} aria-label="Visa" />
                <CreditCard className={`w-10 h-10 ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`} aria-label="Mastercard" />
                <CreditCard className={`w-10 h-10 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-700'}`} aria-label="American Express" />
                <Banknote className={`w-10 h-10 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`} aria-label={language === 'es' ? 'Efectivo en entrega (simulado)' : 'Cash on delivery (simulated)'} />
                {/* Añade más iconos según necesites */}
            </div>
        </div>

        {/* Formulario de pago */}
        <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className={`text-xl font-semibold mb-4 text-center ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              {language === 'es' ? 'Datos de Pago' : 'Payment Details'}
            </h3>
          <div>
            <label htmlFor="cardholder" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'es' ? 'Nombre del titular' : 'Cardholder Name'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cardholder"
              placeholder={language === 'es' ? 'Como aparece en la tarjeta' : 'As it appears on the card'}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 sm:text-sm ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-green-600 focus:border-green-600' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500 focus:border-green-500'}`}
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="cardNumber" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {language === 'es' ? 'Número de Tarjeta' : 'Card Number'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="cardNumber"
              placeholder="XXXX XXXX XXXX XXXX"
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 sm:text-sm ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-green-600 focus:border-green-600' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500 focus:border-green-500'}`}
              required
              pattern="\d{13,19}"
              title={language === 'es' ? 'Debe ser un número de tarjeta válido (13-19 dígitos)' : 'Must be a valid card number (13-19 digits)'}
              aria-required="true"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {language === 'es' ? 'Expiración' : 'Expiry'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="expiry"
                placeholder="MM/AA"
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 sm:text-sm ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-green-600 focus:border-green-600' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500 focus:border-green-500'}`}
                required
                pattern="(0[1-9]|1[0-2])\/?([0-9]{2})"
                title={language === 'es' ? 'Formato debe ser MM/AA' : 'Format must be MM/YY'}
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="cvv" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                CVV <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cvv"
                placeholder="XXX"
                className={`mt-1 block w-full border rounded-md shadow-sm p-2 sm:text-sm ${theme === 'dark' ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:ring-green-600 focus:border-green-600' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-green-500 focus:border-green-500'}`}
                required
                pattern="\d{3,4}"
                title={language === 'es' ? 'Debe ser 3 o 4 dígitos' : 'Must be 3 or 4 digits'}
                aria-required="true"
              />
            </div>
          </div>
           <div className={`flex items-center justify-center space-x-2 text-sm mt-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <CreditCard className="w-5 h-5" aria-hidden="true" />
                <span>{language === 'es' ? 'Tu información de pago es segura y confidencial.' : 'Your payment information is safe and confidential.'}</span>
            </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition duration-200 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cartItems.length === 0 || paymentStatus === 'processing' || !isLoggedIn || isLoading || !!fetchError} // Deshabilitar si no hay ítems, procesando, NO logeado, cargando O con error de fetch
          >
           {paymentStatus === 'processing' ? (language === 'es' ? 'Procesando...' : 'Processing...') : (language === 'es' ? 'Pagar Ahora' : 'Pay Now')}
          </button>
           {!isLoggedIn && (
             <p className="text-center text-red-500 text-sm mt-4">
                 {language === 'es' ? 'Debes iniciar sesión para pagar.' : 'You must log in to pay.'}
             </p>
           )}
           {/* Mensaje de error del carrito si existe */}
             {fetchError && ( // Mostrar fetchError, el estado local
                 <p className={`text-center text-sm mt-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                     {language === 'es' ? 'Error del carrito:' : 'Cart error:'} {fetchError}
                 </p>
             )}
        </form>

        {/* Modal de procesamiento de pago */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg shadow-xl p-6 w-full max-w-sm text-center ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
              {paymentStatus === 'processing' && (
                <>
                  <h3 className={`text-xl font-semibold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {language === 'es' ? 'Procesando tu Pago...' : 'Processing Your Payment...'}
                  </h3>
                  {/* Animación de camión */}
                  <div className="relative w-full mb-6">
                      {/* Icono de camión (pulsando) */}
                       <Truck className={`w-12 h-12 mx-auto mb-3 animate-pulse ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} aria-hidden="true" />
                       {/* Barra de progreso */}
                       <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                           <div
                               className="h-full bg-green-500 rounded-full transition-all duration-300 ease-linear"
                               style={{ width: `${progress}%` }}
                           ></div>
                       </div>
                       <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{Math.round(progress)}% {language === 'es' ? 'completado' : 'completed'}</p>
                   </div>

                </>
              )}

              {paymentStatus === 'success' && (
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mb-4 animate-bounce" aria-hidden="true" />
                  <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {language === 'es' ? '¡Pago Exitoso!' : 'Payment Successful!'}
                  </h3>
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                     {language === 'es' ? 'Tu pedido ha sido procesado correctamente.' : 'Your order has been processed correctly.'}
                  </p>
                  <button
                    onClick={handleCloseModal}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
                  >
                    {language === 'es' ? 'Cerrar' : 'Close'}
                  </button>
                </div>
              )}

               {/* Estado básico de error (si implementaras manejo de errores reales) */}
               {paymentStatus === 'error' && (
                <div className="flex flex-col items-center">
                   {/* <XCircle className="w-16 h-16 text-red-600 mb-4" aria-hidden="true" /> */}
                  <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                    {language === 'es' ? 'Error en el Pago' : 'Payment Error'}
                  </h3>
                  <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {language === 'es' ? 'Hubo un problema al procesar tu pago. Inténtalo de nuevo.' : 'There was a problem processing your payment. Please try again.'}
                  </p>
                   <button
                    onClick={handleCloseModal} // O proveer una opción para reintentar
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
                  >
                    {language === 'es' ? 'Cerrar' : 'Close'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}