import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  IdCart: number;
  IdUser: number;
  product: { // Asegúrate de que este nombre 'product' coincide con cómo recibes los datos
    IdProduct: number;
    ProductName: string;
    Price: number;
    Image: string;
  };
  Quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeItemFromCart: (idCart: number) => void;
  fetchCartCount: () => Promise<void>;
  fetchCartItems: () => Promise<void>;
  clearCart: () => Promise<void>; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const { isLoggedIn, user } = useAuth();

  // Función para añadir un ítem al carrito (simulada aquí, normalmente interactuaría con la API)
  const addToCart = (item: CartItem) => {
    if (!item || !item.IdUser || !item.product.IdProduct || item.Quantity <= 0) {
      console.error('Invalid item data:', item);
      return;
    }

    // Lógica de simulación: si el producto ya existe, actualiza la cantidad; si no, añádelo
    setCartItems(prev => {
      const idx = prev.findIndex(ci => ci.product.IdProduct === item.product.IdProduct);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].Quantity += item.Quantity;
        return updated;
      }
      return [...prev, { ...item, IdCart: Date.now() }];
    });
  };


  // Función para eliminar un ítem del carrito (simulada aquí, normalmente interactuaría con la API)
  const removeItemFromCart = (idCart: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(item => item.IdCart !== idCart);
      const removedItem = prevItems.find(item => item.IdCart === idCart);
      const removedQuantity = removedItem ? removedItem.Quantity : 0;
      setCartCount(prevCount => prevCount - removedQuantity);
      return updatedItems;
    });
     // Nota: En una aplicación real, removeItemFromCart haría una llamada a la API
     // y luego refrescaría fetchCartCount y/o fetchCartItems.
  };

  // Función para vaciar completamente el carrito
  const clearCart = async () => {
    if (!user?.IdUser) return;
    try {
      const res = await fetch('http://localhost:3000/api/products/deleteCart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.IdUser }),
      });
      if (!res.ok) throw new Error('Error al vaciar el carrito');
      // Si todo OK, vaciamos el estado local
      setCartItems([]);
      setCartCount(0);
    } catch (err) {
      console.error('clearCart error:', err);
      // opcional: notificar al usuario
    }
  };


  // Función para obtener el conteo del carrito (interactúa con la API)
  const fetchCartCount = async () => {
    if (isLoggedIn && user?.IdUser) { // Asegúrate de que el usuario y su Id existan
      try {
        const token = localStorage.getItem('token');
        const userId = user.IdUser; // Usar user.IdUser directamente

        const response = await fetch(`http://localhost:3000/api/products/cartCount/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
             // No es común enviar IdUser en un header si ya está en la URL,
             // pero mantenemos tu estructura si es necesaria en tu backend
            'IdUser': userId.toString(),
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
           throw new Error(`Failed to fetch cart count: ${response.status}`);
        }

        const data: { cartCount: number } = await response.json();
        setCartCount(data.cartCount);
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
        setCartCount(0); // Reset count on error
      }
    } else if (!isLoggedIn) {
       // Si no está logeado, el carrito está vacío
       setCartItems([]);
       setCartCount(0);
    }
  };

  // Función para obtener todos los items del carrito (interactúa con la API)
  // Esta función es la que mencionaste en tu primera solicitud para obtener los items
  // y deberías llamarla para popular `cartItems` cuando el usuario esté logeado.
   const fetchCartItems = async () => {
      if (isLoggedIn && user?.IdUser) {
        try {
          const token = localStorage.getItem('token');
          const userId = user.IdUser;

          const response = await fetch(`http://localhost:3000/api/products/getCart/${userId}`, {
              method: 'GET',
               headers: {
                Authorization: `Bearer ${token}`,
                'IdUser': userId.toString(),
                'Content-Type': 'application/json',
              },
          });

          if (!response.ok) {
              const errorMessage = await response.text().catch(() => 'Failed to fetch cart items');
              console.error(`Failed to fetch cart items: ${response.status} - ${errorMessage}`);
              throw new Error(`Failed to fetch cart items: ${response.status}`);
          }

          const raw: any[] = await response.json();
          // Asegúrate de que la estructura de 'raw' coincide con tu interfaz CartItem
          const normalized: CartItem[] = raw.map(ci => ({
            IdCart: ci.IdCart,
            IdUser: ci.IdUser,
            product: { // Asegúrate de que la API devuelve un objeto 'product'
              IdProduct: ci.producto?.IdProduct || ci.product?.IdProduct, // Manejar posible diferencia API vs Interfaz
              ProductName: ci.producto?.ProductName || ci.product?.ProductName || 'Unknown Product',
              Price: parseFloat(ci.producto?.Price || ci.product?.Price || '0'),
              Image: ci.producto?.Image || ci.product?.Image || '',
              // Considera añadir Description si es necesaria
            },
            Quantity: ci.Quantity,
          }));
          setCartItems(normalized);
          // Opcional: Actualizar el conteo basado en los items cargados
          const totalQuantity = normalized.reduce((sum, item) => sum + item.Quantity, 0);
          setCartCount(totalQuantity);

        } catch (error) {
          console.error('Error fetching cart items:', error);
          setCartItems([]);
          setCartCount(0); // Reset count on error
        }
      } else {
         // Si no está logeado, el carrito está vacío
         setCartItems([]);
         setCartCount(0);
      }
   };


  // Efecto para cargar el carrito cuando el usuario inicia sesión o al montar
  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems(); // Llama a fetchCartItems para cargar los detalles
      fetchCartCount(); // fetchCartItems ya puede actualizar el conteo
    } else {
      // Limpiar carrito si el usuario cierra sesión
      setCartItems([]);
      setCartCount(0);
    }
    // Dependencias: isLoggedIn y user?.IdUser para recargar si el usuario cambia
  }, [isLoggedIn, user?.IdUser]);


  return (
    <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeItemFromCart, fetchCartCount, fetchCartItems, clearCart }}> {/* <--- clearCart añadida aquí */}
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};