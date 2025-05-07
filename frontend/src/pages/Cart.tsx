import React, { useState, useEffect } from 'react';
import { Trash2, Trash } from 'lucide-react';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import type { CartItem } from "../contexts/CartContext";

// Skeleton component
const CartSkeleton = ({ theme }: { theme: string }) => {
  const skeletonClasses = "animate-pulse bg-gray-300 dark:bg-gray-700 rounded";
  return (
    <div className={`min-h-screen mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">


        <div className="overflow-x-auto rounded shadow-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-center">Quantity</th>
                <th className="p-4 text-center">Price</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((_, idx) => (
                <tr key={idx} className="border-b border-gray-300 dark:border-gray-700">
                  <td className="p-4"><div className={`${skeletonClasses} h-4 w-24`} /></td>
                  <td className="p-4">
                    <div className={`${skeletonClasses} w-16 h-16`} />
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`${skeletonClasses} w-6 h-6`} />
                      <div className={`${skeletonClasses} w-6 h-6`} />
                      <div className={`${skeletonClasses} w-6 h-6`} />
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className={`${skeletonClasses} h-4 w-12 mx-auto`} />
                  </td>
                  <td className="p-4 text-center">
                    <div className={`${skeletonClasses} h-6 w-6 mx-auto`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={`flex justify-between items-center p-6 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className={`${skeletonClasses} h-6 w-32`} />
          <div className={`${skeletonClasses} h-10 w-48`} />
        </div>
      </div>
    </div>
  );
};

const Cart: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const { user } = useAuth();
  const userId = user?.IdUser;
  const { fetchCartCount, clearCart } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`http://localhost:3000/api/products/getCart/${userId}`);
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to fetch cart items: ${errorMessage}`);
        }
        const raw: any[] = await response.json();
        const normalized: CartItem[] = raw.map(ci => ({
          IdCart: ci.IdCart,
          IdUser: ci.IdUser,
          product: {
            IdProduct: ci.producto.IdProduct,
            ProductName: ci.producto.ProductName,
            Price: parseFloat(ci.producto.Price),
            Image: ci.producto.Image,
          },
          Quantity: ci.Quantity,
        }));
        setCartItems(normalized);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError(
          language === 'en'
            ? 'Your cart is empty, please add products.'
            : 'Su carrito está vacío, por favor agregue productos.'
        );
        setCartItems([]);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    };
    fetchCartItems();
  }, [userId, language]);

  const handleQuantityChange = async (IdCart: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    try {
      const response = await fetch(`http://localhost:3000/api/products/updateCartItem/${IdCart}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Quantity: newQuantity }),
      });
      if (!response.ok) throw new Error('Failed to update item quantity');

      setCartItems((prev) =>
        prev.map((item) => (item.IdCart === IdCart ? { ...item, Quantity: newQuantity } : item))
      );
      await fetchCartCount();
    } catch (error) {
      console.error('Error updating item quantity:', error);
      setError(
        language === 'en'
          ? 'Failed to update product quantity.'
          : 'No se pudo actualizar la cantidad del producto.'
      );
    }
  };

  const handleRemoveItem = async (IdCart: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/deleteCartItem/${IdCart}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');

      setCartItems((prev) => prev.filter((item) => item.IdCart !== IdCart));
      await fetchCartCount();
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(
        language === 'en'
          ? 'Failed to remove product from cart.'
          : 'No se pudo eliminar el producto del carrito.'
      );
    }
  };

  const handleEmptyCart = async () => {
    try {
      await clearCart();             
      setCartItems([]);              
      await fetchCartCount();        
    } catch (err) {
      console.error('Error vaciando carrito:', err);
      alert(language === 'en'
        ? 'Could not empty the cart.'
        : 'No se pudo vaciar el carrito.');
    }
  };

  if (loading) {
    return <CartSkeleton theme={theme} />;
  }

  if (error) {
    return (
      <div className={`p-8 text-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        {error}
      </div>
    );
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.Price * item.Quantity, 0);
  const handleProceedPayment = () => navigate('/PaymentPage');

  return (
    <div className={`min-h-screen mt-10 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition"
        >
          {language === 'en' ? 'Back' : 'Regresar'}
        </button>

        <h1 className="text-4xl font-bold mb-8 text-center">
        {language === 'en'
          ? `${user?.UserName}'s Cart`
          : `Carrito de ${user?.UserName}`}
      </h1>

        {cartItems.length === 0 ? (
  <>
    <p className="text-center text-lg">
      {language === 'en' ? 'Your Cart is empty' : 'Tu carrito está vacío'}
    </p>
    <div className='flex justify-center items-center'>
    <Link
      to="/shop"
      className="mt-4 inline-block px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
    >
      {language === 'en' ? 'Continue Shopping' : 'Continuar comprando'}
    </Link>
    </div>
    
  </>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto rounded shadow-md">
              <table className="w-full text-sm">
                <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white">
                  <tr>
                    <th className="p-4 text-left">{language === 'en' ? 'Product' : 'Producto'}</th>
                    <th className="p-4 text-left">{language === 'en' ? 'Image' : 'Imagen'}</th>
                    <th className="p-4 text-center">{language === 'en' ? 'Quantity' : 'Cantidad'}</th>
                    <th className="p-4 text-center">{language === 'en' ? 'Price' : 'Precio'}</th>
                    <th className="p-4 text-center">{language === 'en' ? 'Actions' : 'Acciones'}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => {
                    const itemTotal = item.product.Price * item.Quantity;
                    return (
                      <tr key={item.IdCart} className="border-b border-gray-300 dark:border-gray-700">
                        <td className="p-4">{item.product.ProductName}</td>
                        <td className="p-4">
                          <img
                            src={item.product.Image}
                            alt={item.product.ProductName}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.IdCart, item.Quantity - 1)}
                              className="bg-gray-300 text-black dark:bg-gray-700 dark:text-white px-2 py-1 rounded disabled:opacity-50"
                              disabled={item.Quantity <= 1}
                            >
                              -
                            </button>
                            <span>{item.Quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.IdCart, item.Quantity + 1)}
                              className="bg-gray-300 text-black dark:bg-gray-700 dark:text-white px-2 py-1 rounded"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-center">${itemTotal.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleRemoveItem(item.IdCart)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

        {cartItems.length > 0 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleEmptyCart}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800"
            >
              <Trash size={18} />
              <span>{language === 'en' ? 'Empty Cart' : 'Vaciar Carrito'}</span>
            </button>
          </div>
        )}

            <div
              className={`flex justify-between items-center p-6 rounded ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}
            >
              <h2 className="text-lg font-semibold">
                {language === 'en' ? 'Total Price' : 'Total'}: ${totalPrice.toFixed(2)}
              </h2>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition duration-300"
                onClick={handleProceedPayment}
              >
                {language === 'en' ? 'Proceed To Payment' : 'Proceder al Pago'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
