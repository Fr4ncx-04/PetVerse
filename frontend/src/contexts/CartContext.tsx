import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  IdCart: number;
  IdUser: number;
  product: {
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

  const addToCart = (item: CartItem) => {
    if (!item || !item.IdUser || !item.product.IdProduct || item.Quantity <= 0) {
      console.error('Invalid item data:', item);
      return;
    }

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

  const removeItemFromCart = (idCart: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter(item => item.IdCart !== idCart);
      const removedItem = prevItems.find(item => item.IdCart === idCart);
      const removedQuantity = removedItem ? removedItem.Quantity : 0;
      setCartCount(prevCount => prevCount - removedQuantity);
      return updatedItems;
    });
  };

  const clearCart = async () => {
    if (!user?.IdUser) return;
    try {
      const res = await fetch('http://localhost:3000/api/products/deleteCart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.IdUser }),
      });
      if (!res.ok) throw new Error('Error al vaciar el carrito');
      setCartItems([]);
      setCartCount(0);
    } catch (err) {
      console.error('clearCart error:', err);
    }
  };

  const fetchCartCount = async () => {
    if (isLoggedIn && user?.IdUser) {
      try {
        const token = localStorage.getItem('token');
        const userId = user.IdUser;

        const response = await fetch(`http://localhost:3000/api/products/cartCount/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
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
        setCartCount(0);
      }
    } else if (!isLoggedIn) {
        setCartItems([]);
        setCartCount(0);
    }
  };

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
          const normalized: CartItem[] = raw.map(ci => ({
            IdCart: ci.IdCart,
            IdUser: ci.IdUser,
            product: {
              IdProduct: ci.producto?.IdProduct || ci.product?.IdProduct,
              ProductName: ci.producto?.ProductName || ci.product?.ProductName || 'Unknown Product',
              Price: parseFloat(ci.producto?.Price || ci.product?.Price || '0'),
              Image: ci.producto?.Image || ci.product?.Image || '',
            },
            Quantity: ci.Quantity,
          }));
          setCartItems(normalized);
          const totalQuantity = normalized.reduce((sum, item) => sum + item.Quantity, 0);
          setCartCount(totalQuantity);

        } catch (error) {
          console.error('Error fetching cart items:', error);
          setCartItems([]);
          setCartCount(0);
        }
      } else {
          setCartItems([]);
          setCartCount(0);
      }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
      fetchCartCount();
    } else {
      setCartItems([]);
      setCartCount(0);
    }
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