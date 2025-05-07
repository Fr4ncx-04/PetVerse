import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  date: string;
  username?: string;
}

interface ReviewContextType {
  reviews: Review[];
  reviewsByProduct: { [key: number]: Review[] };
  addReview: (
    productId: number,
    review: Omit<Review, 'id' | 'date' | 'productId'>
  ) => Promise<void>;
  getProductReviews: (productId: number) => Promise<Review[]>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

export const ReviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsByProduct, setReviewsByProduct] = useState<{ [key: number]: Review[] }>({});

  const addReview = async (
    productId: number,
    review: Omit<Review, 'id' | 'date' | 'productId'>
  ) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/sendReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          IdUser: review.userId,
          IdProduct: productId,
          comment: review.comment,
          rating: review.rating,
        }),
      });
  
      if (response.ok) {
        const newReview = await response.json();
        const createdReview: Review = {
          ...review,
          id: newReview.IdReview,
          productId,
          date: newReview.CreatedAt || new Date().toISOString(),
        };
  
        setReviews((prev) => [...prev, createdReview]);
        setReviewsByProduct((prev) => ({
          ...prev,
          [productId]: [...(prev[productId] || []), createdReview],
        }));
      } else {
        console.error('Error adding review:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const getProductReviews = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/getReviews/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedReviews: Review[] = data.map((review: any) => ({
        id: review.IdReview,
        userId: review.IdUser,
        productId: Number(review.IdProduct),
        rating: review.Rating,
        comment: review.Review,
        date: review.CreatedAt,
        username: review.username,
      }));

      setReviewsByProduct((prev) => ({
        ...prev,
        [productId]: formattedReviews,
      }));

      return formattedReviews;
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      return [];
    }
  };

  return (
    <ReviewContext.Provider value={{ reviews, reviewsByProduct, addReview, getProductReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};
