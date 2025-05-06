import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface WishlistItemRaw {
  IdProduct:   number;
  ProductName: string;
  Price:       string;
  Image:       string;
}

export interface WishlistItem {
  IdProduct:   number;
  ProductName: string;
  Price:       number;
  Image:       string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  count: number;
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const count = wishlist.length;
  const refreshWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const resp = await axios.get<WishlistItemRaw[]>(`http://localhost:3000/api/products/getWishlist/${user.IdUser}`);
      const normalized = resp.data.map(item => ({
        IdProduct:   item.IdProduct,
        ProductName: item.ProductName,
        Price:       parseFloat(item.Price),
        Image:       `http://localhost:3000/images/products/${item.Image}`,
      }));
      console.log('Wishlist loaded:', normalized);
      setWishlist(normalized);
    } catch (err) {
      console.error('Error loading wishlist:', err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user]);

  const toggleWishlist = async (productId: number) => {
    if (!user) return;
    try {
      const resp = await axios.post(`http://localhost:3000/api/products/toggleWishlist`, {
        userId:     user.IdUser,
        productId,
      });
      console.log('toggleWishlist response:', resp.data);
      await refreshWishlist();
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const isInWishlist = (productId: number) =>
    wishlist.some(item => item.IdProduct === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, count, isInWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
};
