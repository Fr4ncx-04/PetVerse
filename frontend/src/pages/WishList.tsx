import React, { useEffect, useState } from 'react';
import { useWishlist } from '../contexts/WishListContext';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart, CartItem } from '../contexts/CartContext';
import { BaggageClaim, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, refreshWishlist } = useWishlist();
  const { theme, language } = useThemeLanguage();
  const { user, isLoggedIn } = useAuth();
  const { addToCart, fetchCartCount } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    const loadData = async () => {
      setLoading(true);
      const start = Date.now();
      await refreshWishlist();
      const elapsed = Date.now() - start;
      const remaining = 2000 - elapsed;
      setTimeout(() => setLoading(false), remaining > 0 ? remaining : 0);
    };
    loadData();
  }, [isLoggedIn]);

  // Handler para añadir al carrito desde wishlist
  const handleAddToCartFromWishlist = async (item: any) => {
    if (!user || !user.IdUser) {
      setShowLoginModal(true);
      return;
    }
    const uiCartItem: CartItem = {
      IdCart: 0,
      IdUser: user.IdUser,
      product: {
        IdProduct: item.IdProduct,
        ProductName: item.ProductName,
        Price: item.Price,
        Image: item.Image,
      },
      Quantity: 1,
    };
    try {
      const resp = await fetch('http://localhost:3000/api/products/addCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          IdUser: user.IdUser,
          IdProduct: item.IdProduct,
          Quantity: 1,
        }),
      });
      if (!resp.ok) throw new Error('Error agregando al carrito');
      addToCart(uiCartItem);
      fetchCartCount();
    } catch (error) {
      console.error('Error adding to cart from wishlist:', error);
    }
  };

  // Skeleton loader cards
  const skeletons = Array.from({ length: 6 }, (_, i) => (
    <div key={i} className="mt-10 max-w-screen-xl mx-auto px-4 py-12">
      {/* Header con skeleton de título + botón compartir */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse" />
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-transparent rounded animate-pulse"
        >
          📤 Compartir
        </button>
      </div>
  
      {/* Tarjeta skeleton */}
      <div className={`animate-pulse border rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
        <div className="h-48 w-full bg-gray-300 mb-4 rounded" />
        <div className="h-6 w-3/4 bg-gray-300 mb-2 rounded" />
        <div className="h-6 w-1/2 bg-gray-300 mb-4 rounded" />
        <div className="flex justify-between items-center mt-4">
          <div className="h-8 w-20 bg-gray-300 rounded" />
          <div className="h-8 w-28 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  ));

  // Not logged in view
  if (!isLoggedIn) {
    return (
      <div className="mt-10 flex items-center justify-center h-screen px-4">
        <div className="max-w-md w-full text-center">
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
            {language === 'en'
              ? 'Please log in to view your wishlist.'
              : 'Por favor inicia sesión para ver tu lista de deseos.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-6 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {language === 'en' ? 'Go to Login' : 'Ir a Iniciar Sesión'}
          </button>
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="mt-10 max-w-screen-xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {language === 'en' ? 'Your Wishlist' : 'Tu Lista de Deseos'}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skeletons}
        </div>
      </div>
    );
  }

  // Empty wishlist view (logged in)
  if (wishlist.length === 0) {
    return (
      <div className="mt-10 flex items-center justify-center h-screen px-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'en' ? 'Your wishlist is empty.' : 'Tu lista de deseos está vacía.'}
          </h2>
          <Link
            to="/"
            className="mt-4 inline-block px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {language === 'en' ? 'Continue Shopping' : 'Continuar comprando'}
          </Link>
        </div>
      </div>
    );
  }

  const shareWishlist = async () => {
    const shareData = {
      title: language === 'en' ? 'My Wishlist' : 'Mi Lista de Deseos',
      text:  language === 'en' ? 'Check out my wishlist!' : '¡Mira mi lista de deseos!',
      url:   window.location.href,
    };
  
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copiar enlace
      try {
        await navigator.clipboard.writeText(shareData.url);
        alert(language === 'en' ? 'Link copied to clipboard' : 'Enlace copiado al portapapeles');
      } catch {
        alert(language === 'en' ? 'Could not copy link' : 'No se pudo copiar el enlace');
      }
    }
  };

  // Render wishlist items
  return (
    <div className="mt-10 max-w-screen-xl mx-auto px-4 py-12">
      
      <h1 className="text-4xl font-bold mb-8 text-center">
        {language === 'en'
          ? `${user?.UserName}'s Wishlist`
          : `Lista de ${user?.UserName}`}
      </h1>
      <button
    onClick={shareWishlist}
    className="mb-10 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
  >
    📤 {language === 'en' ? 'Share my wishlist' : 'Compartir mi lista de deseos'}
  </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map(item => (
          <div
            key={item.IdProduct}
            className={`border rounded-lg p-6 flex flex-col justify-between ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <Link to={`/product/${item.IdProduct}`} className="flex-1">
              <img
                src={item.Image}
                alt={item.ProductName}
                className="h-48 w-full object-contain mb-4 bg-white"
              />
              <h2 className="text-xl font-medium mb-2">{item.ProductName}</h2>
              <p className="witdh-20% text-sm font-semibold text-green-700 px-2 py-0.5 rounded mr-3 dark:text-green-200">${item.Price.toFixed(2)}</p>
            </Link>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => toggleWishlist(item.IdProduct)}
                className="flex items-center gap-1 text-red-500 hover:underline"
              >
                <Trash2 size={20} />
                {language === 'en' ? 'Remove' : 'Eliminar'}
              </button>
              <button
                onClick={() => handleAddToCartFromWishlist(item)}
                className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <BaggageClaim size={20} />
                {language === 'en' ? 'Add to Cart' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        ))}
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
      </div>
    </div>
  );
};

export default WishlistPage;