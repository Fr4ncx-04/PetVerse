import React, { useState, useEffect, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, BaggageClaim, ArrowLeft, PackageIcon, CheckCircleIcon, XCircleIcon, Heart } from 'lucide-react'; // Import ArrowLeft
import { useAuth } from '../contexts/AuthContext';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useReviews } from '../contexts/ReviewContext';
import { useCart } from '../contexts/CartContext';
import type { CartItem } from "../contexts/CartContext"
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { StarIcon } from '@heroicons/react/24/solid';
import { useWishlist } from '../contexts/WishListContext';

interface Product {
  IdProduct: number;
  ProductName: string;
  Description: string;
  Category?: string;
  Price: number;
  Image: string;
  originalPrice?: number;
  discountPercentage?: number;
  Stock: number;
  CreatedAt?: string;
}

// --- Skeleton Loader Component for Product Details ---
const SkeletonProductDetails: React.FC = () => {
    const { theme } = useThemeLanguage();
    const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    const cardBgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
    const pulseColor = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className={`mx-auto px-4 py-8 mt-6 ${bgColor} min-h-screen`}
        >
            {/* Back Button Skeleton */}
            <div className={`h-10 w-32 rounded ${pulseColor} animate-pulse mb-8`}></div>

            {/* Product Info Section Skeleton */}
            <div className="grid md:grid-cols-2 gap-8 items-start p-5 mb-5 max-w-screen-lg mx-auto">
                {/* Image Placeholder */}
                <div className="flex justify-center items-center col-span-1 w-full">
                    <div className={`w-full max-w-sm md:max-w-full h-64 md:h-80 lg:h-96 flex items-center justify-center shadow-lg rounded-lg overflow-hidden ${cardBgColor} animate-pulse`}>
                        {/* Optional: Add a placeholder icon */}
                        <div className={`w-16 h-16 rounded-full ${pulseColor}`}></div>
                    </div>
                </div>

                {/* Details Placeholder */}
                <div className="flex flex-col p-4 space-y-4">
                    {/* Title Placeholder */}
                    <div className={`h-8 w-3/4 rounded ${pulseColor}`}></div>
                    {/* Price Placeholder */}
                    <div className={`h-6 w-1/4 rounded ${pulseColor}`}></div>
                    {/* Rating Placeholder */}
                    <div className={`h-4 w-1/3 rounded ${pulseColor}`}></div>
                    {/* Stock Placeholder */}
                    <div className={`h-4 w-1/4 rounded ${pulseColor}`}></div>
                    {/* Description Placeholder */}
                    <div className={`h-4 w-full rounded ${pulseColor}`}></div>
                    <div className={`h-4 w-5/6 rounded ${pulseColor}`}></div>

                    {/* Quantity and Add to Cart Placeholder */}
                    <div className="flex items-center justify-between gap-4 mt-6">
                        <div className={`h-10 w-24 rounded ${pulseColor}`}></div> {/* Quantity Control */}
                        <div className={`h-10 flex-1 rounded ${pulseColor}`}></div> {/* Add to Cart Button */}
                    </div>
                </div>
            </div>

            {/* Reviews Section Skeleton */}
            <div className={`content p-5 rounded-lg shadow-md ${cardBgColor} animate-pulse max-w-screen-lg mx-auto mt-8`}>
                 {/* Reviews Title Placeholder */}
                 <div className={`h-7 w-40 rounded ${pulseColor} mb-6`}></div>

                 {/* Leave a Review Form Skeleton */}
                 <div className={`rounded-lg p-6 mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} space-y-4`}>
                     <div className={`h-6 w-32 rounded ${pulseColor}`}></div> {/* Form Title */}
                     <div className={`h-20 w-full rounded ${pulseColor}`}></div> {/* Textarea */}
                     <div className="flex items-center mt-4">
                         <div className={`h-5 w-24 rounded ${pulseColor} mr-2`}></div> {/* Rating Label */}
                         {/* Star Placeholders */}
                         {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-6 w-6 rounded-full ${pulseColor} mr-1`}></div>
                         ))}
                     </div>
                     <div className={`h-10 w-40 rounded ${pulseColor} mt-6`}></div> {/* Submit Button */}
                 </div>

                 {/* Review List Placeholder (show a couple of items) */}
                 <div className="mt-8 space-y-4">
                     {[...Array(2)].map((_, i) => (
                         <div key={i} className={`border p-4 rounded ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'} space-y-2`}>
                             <div className={`h-4 w-20 rounded ${pulseColor}`}></div> {/* Rating */}
                             <div className={`h-4 w-full rounded ${pulseColor}`}></div> {/* Comment line 1 */}
                             <div className={`h-4 w-5/6 rounded ${pulseColor}`}></div> {/* Comment line 2 */}
                             <div className={`h-3 w-1/4 rounded ${pulseColor} mt-2`}></div> {/* Date/User */}
                         </div>
                     ))}
                 </div>
            </div>
        </motion.div>
    );
};


const ProductDetails: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const { id } = useParams<{ id: string }>();
  const numericId = id ? Number(id) : undefined;
const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const { reviewsByProduct, addReview, getProductReviews } = useReviews();
  const { user } = useAuth();
  const { addToCart, fetchCartCount } = useCart();
  const navigate = useNavigate();
        const [showAddModal, setShowAddModal] = useState(false);
        const [addStage, setAddStage] = useState<'enter'|'check'>('enter');
        const [showErrorModal, setShowErrorModal] = useState(false);
        const [showReviewSuccess, setShowReviewSuccess] = useState(false);
  const [showReviewError, setShowReviewError]     = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(true); // Initialize loading as true
  const [averageRating, setAverageRating] = useState(0);
  const [errorLoading, setErrorLoading] = useState(false);

 // --- Nuevo estado para controlar la visibilidad del modal ---
  const [showLoginModal, setShowLoginModal] = useState(false);


  // --- useEffects (mantienen la misma lógica que antes) ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!numericId) {
          setErrorLoading(true);
          setLoading(false);
          return;
      }

      setLoading(true); // Set loading true before fetch
      setErrorLoading(false);
      setProduct(null); // Clear previous product data

      try {
        const response = await fetch(`http://localhost:3000/api/products/details/${numericId}`);

        if (!response.ok) {
            if (response.status === 404) {
                 console.warn(`Producto con ID ${numericId} no encontrado.`);
            } else {
                 console.error(`Error HTTP ${response.status} al obtener el producto ${numericId}`);
            }
            throw new Error('Producto no encontrado o error al cargar');
        }

        const data: any = await response.json();

        const formattedProduct: Product = {
             IdProduct: data.IdProduct,
             ProductName: data.ProductName,
             Description: data.Description,
             Category: data.Category,
             Price: parseFloat(data.Price),
             Stock: parseInt(data.Stock, 10),
             originalPrice: data.OriginalPrice !== null && data.OriginalPrice !== undefined ? parseFloat(data.OriginalPrice) : undefined,
             discountPercentage: data.DiscountPercentage !== null && data.DiscountPercentage !== undefined ? parseFloat(data.DiscountPercentage) : undefined,
             Image: data.Image, // Usar directamente la URL completa
             CreatedAt: data.CreatedAt,
        };

        setProduct(formattedProduct);
         // Si usas el promedio de la API, pársalo aquí:
         // setAverageRating(parseFloat(data.averageRating as any) || 0);

      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
        setErrorLoading(true);
      } finally {
        // --- Introduce artificial delay for skeleton ---
        const delayDuration = 1500; // 1.5 seconds delay
        const timer = setTimeout(() => {
            setLoading(false); // Set loading to false after delay
        }, delayDuration);
        // Cleanup the timer
        return () => clearTimeout(timer);
      }
    };

    fetchProductDetails();
  }, [numericId]); // Depend on numericId to refetch if the ID changes

  useEffect(() => {
    const productReviews = reviewsByProduct[numericId || 0] || [];
    if (productReviews.length > 0) {
      const total = productReviews.reduce((sum: number, r: any) => {
        return sum + (typeof r.rating === 'number' ? r.rating : 0);
      }, 0);
      setAverageRating(total / productReviews.length);
    } else {
      setAverageRating(0);
    }
  }, [reviewsByProduct, numericId]); // Depend on reviewsByProduct and numericId

  useEffect(() => {
    const fetchProductReviews = async () => {
      if (numericId) {
        await getProductReviews(numericId);
      }
    };
    fetchProductReviews();
  }, [numericId, getProductReviews]); // Depend on numericId and getProductReviews


  // --- Renderizado de Reseñas (mantiene la misma lógica) ---
  const renderReviews = () => {
    const productReviews = reviewsByProduct[numericId || 0] || [];
    if (productReviews.length === 0)
      return <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'en' ? 'No reviews yet.' : 'Aún no hay reseñas para este producto.'}</p>; // Adjusted color and centered text

    return (
      <div>
        {productReviews.map((review: any) => (
          <div key={review.id} className={`border p-4 mb-4 rounded ${theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-100'}`}>
            <div className="flex items-center mb-2">
              {Array(5).fill(null).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${typeof review.rating === 'number' && review.rating > i ? 'text-yellow-500' : `${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}`} // Adjusted color for dark mode
                  fill="currentColor"
                />
              ))}
               <span className={`ml-2 text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : ''}`}> {/* Adjusted color */}
                 {typeof review.rating === 'number' ? `${review.rating}/5` : 'N/A'}
               </span>
            </div>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{review.comment}</p>
            {review.date && (
               <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> {/* Adjusted color */}
                 {language === 'en' ? 'Date:' : 'Fecha:'} {new Date(review.date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES')}
               </p>
            )}
             {review.username && (
               <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> {/* Adjusted color */}
                 {language === 'en' ? 'By:' : 'Por:'} {review.username}
               </p>
             )}
               {!review.username && review.userId && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> {/* Adjusted color */}
                    {language === 'en' ? 'User ID:' : 'Usuario ID:'} {review.userId}
                  </p>
               )}

          </div>
        ))}
        {/* Modal de Éxito */}
        <Transition appear show={showReviewSuccess} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClose={() => {}}>
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 scale-75"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-75"
            >
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
                {/* Estrella animada */}
                <StarIcon className="w-12 h-12 text-yellow-500 animate-star-pop" />
                {/* Texto */}
                <Dialog.Title className="text-lg font-semibold">
                  {language === 'es' ? '¡Reseña enviada!' : 'Review submitted!'}
                </Dialog.Title>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>

        {/* Modal de Error */}
        <Transition appear show={showReviewError} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClose={() => {}}>
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 scale-75"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-75"
            >
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
                <XCircleIcon className="w-12 h-12 text-red-500 animate-pulse" />
                <Dialog.Title className="text-lg font-semibold">
                  {language === 'es' ? 'Error al enviar' : 'Submission failed'}
                </Dialog.Title>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>
      </div>
    );
  };

  // --- Handlers (mantienen la misma lógica) ---
  const handleBack = () => {
    navigate(-1);
  };

  const handleQuantityChange = (amount: number) => {
      const currentStock = product && typeof product.Stock === 'number' ? product.Stock : 0;
      const newCantidad = cantidad + amount;

      if (newCantidad >= 1 && (currentStock <= 0 || newCantidad <= currentStock)) {
          setCantidad(newCantidad);
      } else if (newCantidad >= 1 && currentStock > 0 && newCantidad > currentStock) {
          setCantidad(currentStock);
          // Replaced alert with a more integrated message if possible, or keep for simplicity
          alert(language === 'en' ? `Maximum quantity available is ${currentStock}.` : `La cantidad máxima disponible es ${currentStock}.`);
      } else if (newCantidad < 1) {
          setCantidad(1);
      }
  };

  // --- Modificado: Muestra modal en lugar de alert/redirect ---
  const handleSubmitReview = async () => {
    // Verificar si el usuario está logueado y tiene ID
    if (!user || !user.IdUser) {
      // Mostrar el modal de login requerido
      setShowLoginModal(true);
      return; // Detener la función aquí
    }

    // ... (El resto de las validaciones y la lógica de envío si el usuario está logueado) ...

    if (userRating === 0) {
      alert(language === 'en' ? 'Please select a rating (1-5 stars).' : 'Por favor, seleccione una calificación (1-5 estrellas).');
      return;
    }

    if (!userReview.trim()) {
      alert(language === 'en' ? 'Please write your review comment.' : 'Por favor, escriba el comentario de su reseña.');
      return;
    }

    if (!product || !product.IdProduct) {
        alert(language === 'en' ? 'Cannot submit review for an invalid product.' : 'No se puede enviar reseña para un producto inválido.');
        console.error("Intentando enviar reseña sin un producto válido cargado.");
        return;
    }

    try {
      await addReview(product.IdProduct, {
        userId: user.IdUser,
        rating: userRating,
        comment: userReview,
        // Include username if available in the user object
        username: user.UserName || `User ${user.IdUser}` // Assuming user object has a Name property
      });
      setUserReview('');
      setUserRating(0);
      setShowReviewSuccess(true);
      // Tras 0.8s cambiar a check
      setTimeout(() => {
        // cerramos éxito 1 s después
        setShowReviewSuccess(false);
      }, 1800);
    } catch (error) {
      setShowReviewError(true);
      setTimeout(() => {
        setShowReviewError(false);
      }, 1800);
    }
  };

  // Función para manejar "Añadir al Carrito" (mantiene la misma lógica)
  const handleAddToCart = async () => {
    if (!product) {
       console.error("Intentando añadir un producto null al carrito.");
       alert(language === 'en' ? 'Cannot add an invalid product to cart.' : 'No se puede agregar un producto inválido al carrito.');
       return;
    }
    if (!user || !user.IdUser) {
      // Mostrar el modal de login requerido
      setShowLoginModal(true);
      return;
    }
    if (typeof product.Stock !== 'number' || product.Stock <= 0 || cantidad > product.Stock) {
       alert(language === 'en' ? 'Product is out of stock or selected quantity exceeds available stock.' : 'Producto sin stock o la cantidad seleccionada supera el stock disponible.');
       return;
    }
    if (cantidad < 1) {
        alert(language === 'en' ? 'Quantity must be at least 1.' : 'La cantidad debe ser al menos 1.');
        setCantidad(1);
        return;
    }

    const uiCartItem: CartItem = {
      IdCart: 0, // This will be assigned by the backend/context
      IdUser: user.IdUser,
      product: {
        IdProduct: product.IdProduct,
        ProductName: product.ProductName,
        Price: product.Price,
        Image: product.Image,
      },
      Quantity: cantidad,
    };

    // Add to local cart state first for immediate UI update


    try {
      const response = await fetch('http://localhost:3000/api/products/addCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IdUser: user.IdUser,
          IdProduct: product.IdProduct,
          Quantity: cantidad,
        }),
      });

      if (!response.ok) {
           // If backend fails, you might want to remove the item from local state
           // This depends on desired UX (optimistic vs pessimistic updates)
           throw new Error(`Error al agregar el producto al carrito en el backend: ${response.statusText || response.status}`);
      }

      addToCart(uiCartItem);
        fetchCartCount()

      setAddStage('enter');
        setShowAddModal(true);

        // Tras 0.8s pasamos al check
        setTimeout(() => setAddStage('check'), 800);
        // Y 1 s después de ese cambio, cerramos totalmente
        setTimeout(() => setShowAddModal(false), 1800);
      } catch (error) {
                 console.error("Error adding to cart:", error);

        // **Error**: mostramos modal de error
        setShowErrorModal(true);
        // Opcional: revertir update optimista aquí...
        setTimeout(() => setShowErrorModal(false), 1800);
      }
  };

  const isAddToCartDisabled = loading || !product || typeof product.Stock !== 'number' || product.Stock <= 0 || cantidad <= 0 || cantidad > product.Stock;


  // --- Conditional Rendering: Loading, Error, or Data Not Found ---
  if (loading) {
    return <SkeletonProductDetails />; // Render skeleton while loading
  }

   if (errorLoading || !product) {
       return (
           <div className={`mx-auto px-4 py-8 mt-6 text-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} min-h-screen`}> {/* Added min-h-screen */}
               <p className="text-xl text-red-500">{language === 'en' ? 'Error loading product or product not found.' : 'Error al cargar el producto o producto no encontrado.'}</p>
               <button
                  onClick={handleBack}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
               >
                 {language === 'en' ? 'Go Back' : 'Regresar'}
               </button>
           </div>
       );
   }


  // --- Renderizado Principal (mantiene la misma estructura) ---
  return (
    <div className={` mx-auto px-4 py-8 mt-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} min-h-screen`}> {/* Adjusted background color, added min-h-screen */}

      {/* Botón de Regresar */}
       <button
         onClick={handleBack}
         type="button"
         className={`mt-4 mb-8 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''}`} // Added flex items-center gap-2
       >
           <ArrowLeft className="h-4 w-4" /> {/* Added back arrow icon */}
           {language === 'en' ? 'Back to Products' : 'Regresar a Productos'}
       </button>


      {/* Sección principal: Imagen y Detalles */}
      <div className="grid md:grid-cols-2 gap-8 items-start p-5 mb-5 max-w-screen-lg mx-auto">

        {/* Contenedor de imagen */}
        <div className="flex justify-center items-center col-span-1 w-full">
          <div className={`w-full max-w-sm md:max-w-full h-64 md:h-80 lg:h-96 flex items-center justify-center shadow-lg rounded-lg overflow-hidden border-2 border-green-500 ${theme === 'dark' ? 'bg-white' : 'bg-white'}`}> {/* Adjusted background color */}
            <img
              src={product.Image}
              alt={product.ProductName}
              className="w-full h-full object-contain rounded-lg p-2 "
               onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                 const target = e.target as HTMLImageElement;
                 target.onerror = null;
                 target.src = 'https://via.placeholder.com/400x300.png?text=No+Image+Available';
                 target.style.objectFit = 'cover';
               }}
            />
          </div>
        </div>

        {/* Contenido de texto y controles */}
        <div className="flex flex-col p-4">
          {/* Detalles del producto */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{product.ProductName}</h1>

              {/* Mostrar precios (Original y con descuento) - Usa lógica anterior */}
              {product.originalPrice !== undefined && product.originalPrice !== null &&
              product.Price !== undefined && product.Price !== null &&
              typeof product.originalPrice === 'number' && typeof product.Price === 'number' &&
              product.originalPrice > product.Price ? (
                <div className="flex items-baseline mb-2">
                  <p className={`line-through text-lg mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> {/* Adjusted color */}
                      ${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : 'N/A'}
                  </p>
                  {product.discountPercentage !== undefined && product.discountPercentage !== null && typeof product.discountPercentage === 'number' && (
                    <span className="text-sm font-semibold text-green-700 bg-green-200 px-2 py-0.5 rounded mr-3 dark:text-green-200 dark:bg-green-700">
                      -{product.discountPercentage}% OFF
                    </span>
                  )}
                  <p className="text-2xl md:text-3xl font-bold text-green-600">
                      ${typeof product.Price === 'number' ? product.Price.toFixed(2) : 'N/A'}
                  </p>
                </div>
              ) : (
                <p className="text-2xl md:text-3xl font-bold mb-2">
                    ${typeof product.Price === 'number' ? product.Price.toFixed(2) : 'N/A'}
                </p>
              )}

            {/* Reseñas Promedio */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${averageRating > 0 && index < averageRating ? 'text-yellow-400' : `${theme === 'dark' ? 'text-gray-500' : 'text-gray-300'}`}`} // Adjusted color for dark mode
                    fill={averageRating > 0 && index < averageRating ? 'currentColor' : 'none'}
                    stroke="currentColor"
                  />
                ))}
              </div>
              <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}> {/* Adjusted color */}
                {reviewsByProduct[numericId || 0]?.length > 0 ? (
                    <>({averageRating.toFixed(1)}) ({reviewsByProduct[numericId || 0].length} {language === 'en' ? 'reviews' : 'reseñas'})</>
                ) : (
                    language === 'en' ? 'No ratings yet' : 'Sin calificaciones aún'
                )}
              </span>
            </div>

            {/* Mostrar Stock */}
            <p className={`text-sm mb-4 ${product.Stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {typeof product.Stock === 'number' ?
                 (product.Stock > 0 ? `${language === 'en' ? 'In Stock:' : 'En Stock:'} ${product.Stock}` : (language === 'en' ? 'Out of Stock' : 'Agotado'))
                 : (language === 'en' ? 'Stock Info N/A' : 'Info de Stock N/D')}
            </p>

            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-6`}>{product.Description}</p>
          </div>

          {/* Controles de cantidad y Añadir al Carrito - Mantiene la misma lógica */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className={`flex items-center border rounded ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
              <button
                onClick={() => handleQuantityChange(-1)}
                className={`p-2 ${cantidad === 1 ? 'text-gray-400 cursor-not-allowed' : ''} ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`} // Adjusted colors
                disabled={cantidad === 1}
              >
                -
              </button>
              <span className={`px-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{cantidad}</span> {/* Adjusted color */}
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={typeof product.Stock === 'number' && product.Stock > 0 && cantidad >= product.Stock}
                className={`p-2 ${typeof product.Stock === 'number' && product.Stock > 0 && cantidad >= product.Stock ? 'text-gray-400 cursor-not-allowed' : ''} ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-800 hover:bg-gray-200'}`} // Adjusted colors
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
              className={`flex-1 w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center ${
                 isAddToCartDisabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''}`} // Adjusted colors
            >
              {language === 'en' ? 'Add to Cart' : 'Agregar al Carrito'}
              <BaggageClaim size={20} color="white" className="ml-2 inline-block" />
            </button>
            <button
              onClick={() => setShowWishlistModal(true)}
              aria-label={
                isInWishlist(product.IdProduct)
                  ? language === 'en'
                    ? 'Remove from wishlist'
                    : 'Eliminar de favoritos'
                  : language === 'en'
                    ? 'Add to wishlist'
                    : 'Agregar a favoritos'
              }
              className={`ml-4 h-6 w-6 transition-colors ${
                isInWishlist(product.IdProduct) ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Heart fill={isInWishlist(product.IdProduct) ? 'currentColor' : 'none'} stroke="currentColor" />
            </button>
          </div>
          {product.Stock !== undefined && product.Stock !== null && typeof product.Stock === 'number' && product.Stock <= 0 && (
             <p className={`text-center text-red-600 text-sm mt-2 ${theme === 'dark' ? 'text-red-400' : ''}`}>{language === 'en' ? 'This product is currently out of stock.' : 'Este producto está actualmente agotado.'}</p> // Adjusted color
          )}
        </div>
      </div>

      {/* Sección de Reseñas (Formulario y Lista) - Mantiene la misma estructura */}
      <div className={`content p-5 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} max-w-screen-lg mx-auto`}>
          <h2 className="text-2xl font-semibold mb-6">
            {language === 'en' ? 'Reviews' : 'Reseñas'}
          </h2>
          <div className={`rounded-lg p-6 mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
             <h3 className="text-xl font-semibold mb-4">{language === 'en' ? 'Leave a Review' : 'Deja una Reseña'}</h3>
             <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder={language === 'en' ? 'Write your review comment here...' : 'Escribe tu comentario de reseña aquí...'}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500
                ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
              rows={4}
            />
            <div className="flex items-center mt-4 mb-6">
              <label className={`mr-2 font-semibold ${theme === 'dark' ? 'text-gray-300' : ''}`}> {/* Adjusted color */}
                {language === 'en' ? 'Your Rating:' : 'Tu Calificación:'}
              </label>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`cursor-pointer h-6 w-6 ${userRating >= star ? 'text-yellow-500' : `${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} transition-colors`} // Adjusted color for dark mode
                  fill={userRating >= star ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  onClick={() => setUserRating(star)}
                />
              ))}
               {userRating > 0 && <span className={`ml-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{userRating}/5</span>} {/* Adjusted color */}
            </div>
            <button
              onClick={handleSubmitReview}
              className={`px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : ''}`} // Adjusted colors
            >
              {language === 'en' ? 'Submit Review' : 'Enviar Reseña'}
            </button>
          </div>
          <div className="mt-8">{renderReviews()}</div>
        </div>

    {/* --- Modal de Login Requerido --- */}
    {showLoginModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        {/* Contenido del Modal */}
        <div className={`p-6 rounded-lg shadow-xl max-w-sm mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
          <h3 className="text-xl font-semibold mb-4">
            {language === 'en' ? 'Login Required' : 'Iniciar Sesión Requerido'}
          </h3>
          <p className="mb-6">
            {language === 'en' ? 'You must be logged in to perform this action' : 'Debes iniciar sesión para realizar esta accion.'}
          </p>
          <div className="flex justify-end gap-4">
            {/* Botón para cerrar el modal */}
            <button
              onClick={() => setShowLoginModal(false)}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
            >
              {language === 'en' ? 'Cancel' : 'Cancelar'}
            </button>
            {/* Botón para ir a Iniciar Sesión */}
            <button
              onClick={() => {
                setShowLoginModal(false); // Cerrar modal
                navigate('/login'); // Redirigir
              }}
              className={`px-4 py-2 rounded text-white ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {language === 'en' ? 'Go to Login' : 'Ir a Iniciar Sesión'}
            </button>
          </div>
        </div>
      </div>
    )}
{/* — Modal de “Añadido al carrito” — */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex flex-col items-center">
                <span>{language === 'en' ? 'Product added correctly to cart' : 'Producto añadido correctamente al carrito'}</span>
            {addStage === 'enter' ? (
              <PackageIcon className="w-12 h-12 text-blue-500 animate-enterCart" />
            ) : (
              <CheckCircleIcon className="w-16 h-16 text-green-500 animate-pulse" />
            )}
          </div>
        </div>
      )}
      {/* — Modal de Error — */}
    {showErrorModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg flex flex-col items-center space-y-2">
          <XCircleIcon className="w-16 h-16 text-red-500 animate-pulse" />
          <p className="text-lg font-medium text-center">
            {language === 'en'
              ? 'Failed to add product to cart.'
              : 'Error al agregar el producto al carrito.'}
          </p>
        </div>
      </div>
    )}
    <Transition appear show={showWishlistModal} as={Fragment}>
  <Dialog as="div" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClose={() => setShowWishlistModal(false)}>
    <Transition.Child
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <Dialog.Panel className={`bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm text-center`}>
        <Dialog.Title className="text-lg font-semibold mb-4">
          {language === 'en'
            ? 'Add to your wishlist?'
            : '¿Deseas agregar este producto a tu lista de deseos?'}
        </Dialog.Title>
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setShowWishlistModal(false)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            {language === 'en' ? 'Cancel' : 'Cancelar'}
          </button>
          <button
            onClick={async () => {
              await toggleWishlist(product.IdProduct);
              setShowWishlistModal(false);
            }}
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          >
            {language === 'en' ? 'Confirm' : 'Aceptar'}
          </button>
        </div>
      </Dialog.Panel>
    </Transition.Child>
  </Dialog>
</Transition>

  </div>
  );
};

export default ProductDetails;
