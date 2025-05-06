import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import SkeletonCard from '../components/SkeletonCard';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import type { CartItem } from "../contexts/CartContext"
import { useCart } from '../contexts/CartContext';
import { BaggageClaim,PackageIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'; // Importar icono

interface Product {
  IdProduct: number;
  ProductName: string;
  Description: string;
  Category: string;
  Price: number;
  Image: string;
  originalPrice?: number;
  discountPercentage?: number;
  Stock?: number;
}

interface Category {
  IdCategory: number;
  Category: string;
  Description: string;
}

const Products: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { addToCart, fetchCartCount } = useCart();
  const cantidad = 1;
    const [showAddModal, setShowAddModal] = useState(false);
        const [addStage, setAddStage] = useState<'enter'|'check'>('enter');
        const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

 // --- Nuevo estado para controlar la visibilidad del modal de login ---
  const [showLoginModal, setShowLoginModal] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setProducts([]);
      try {
        const endpoint =
          selectedCategory === 'all'
            ? 'http://localhost:3000/api/products'
            : `http://localhost:3000/api/products?categoryId=${selectedCategory}`;

        const response = await axios.get<Product[]>(endpoint);

        // --- Introduce artificial delay for skeleton ---
        // Adjust the duration (e.g., 2000 for 2 seconds, 3000 for 3 seconds)
        const delayDuration = 2000; // 2 seconds delay

        const timer = setTimeout(() => {
            setProducts(response.data);
            setLoading(false);
        }, delayDuration);

        // Cleanup the timer if the component unmounts or selectedCategory changes
        return () => clearTimeout(timer);

      } catch (error) {
        console.error('Error al obtener los productos:', error);
        // Still set loading to false even on error
        setLoading(false);
        setProducts([]);
      }
    };

    fetchProducts();
    // Include selectedCategory in the dependency array so it refetches when the category changes
  }, [selectedCategory]); // Dependency array


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>('http://localhost:3000/api/products/getCategories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSearchTerm(''); // Clear search term when category changes
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBack = () => {
    navigate(-1);
  };

 // --- Modificado: Muestra modal en lugar de alert ---
  const handleAddToCart = async (productToAdd: Product) => {
      if (!user || !user.IdUser) {
        // Mostrar el modal de login requerido
        setShowLoginModal(true);
        return; // Detener la función aquí
      }

      // --- El resto de la lógica de añadir al carrito si el usuario está logueado ---
      if (!productToAdd || !productToAdd.IdProduct || productToAdd.Price === undefined || productToAdd.Image === undefined || productToAdd.ProductName === undefined) {
          console.error("Datos incompletos del producto para añadir al carrito:", productToAdd);
          // Mantener alerta para errores de datos, no de login
          alert(language === 'en' ? 'Cannot add this product.' : 'No se puede agregar este producto (datos incompletos).');
          return;
      }

      const uiCartItem: CartItem = {
        IdCart: 0, // This might be assigned by the backend
        IdUser: user.IdUser,
        product: {
          IdProduct: productToAdd.IdProduct,
          ProductName: productToAdd.ProductName,
          Price: productToAdd.Price,
          Image: productToAdd.Image,
        },
        Quantity: cantidad,
      };
      try {
        const response = await fetch('http://localhost:3000/api/products/addCart', { // Endpoint sugerido
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Podrías necesitar un token de autorización aquí (e.g., `Authorization: Bearer ${user.token}`)
          },
          body: JSON.stringify({
            IdUser: user.IdUser,
            IdProduct: productToAdd.IdProduct,
            Quantity: cantidad,
          }),
        });

        if (!response.ok) {
             throw new Error(`Error al agregar el producto al carrito en el backend: ${response.statusText}`);
        }

      // Actualizar el carrito en el contexto (optimista)
        addToCart(uiCartItem);
        fetchCartCount();

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

  const filteredProducts = products.filter(product =>
    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.Description && product.Description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.Category && product.Category.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <div
      className={`p-4 min-h-screen w-full ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
      }`}
    >
      <h1 className="text-3xl font-bold mb-8">
        {language === 'en' ? 'Our Products' : 'Nuestros Productos'}
      </h1>

      {/* Botón de Regresar */}
      <button
        onClick={handleBack}
        className={`mb-8 px-4 py-2 rounded ${
          theme === 'dark'
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {language === 'en' ? 'Go Back' : 'Regresar'}
      </button>

      {/* Controles de Filtrado y Búsqueda */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        {/* Selector de Categorías */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'} border flex-grow sm:flex-grow-0`}
        >
          <option value="all">
            {language === 'en' ? 'All Categories' : 'Todas las Categorías'}
          </option>
          {categories.map((cat) => (
            <option key={cat.IdCategory} value={cat.IdCategory}>
              {cat.Category}
            </option>
          ))}
        </select>

        {/* Campo de Búsqueda */}
        <input
          type="text"
          placeholder={language === 'en' ? 'Search products...' : 'Buscar productos...'}
          value={searchTerm}
          onChange={handleSearchChange}
          className={`p-2 rounded border flex-grow
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}
            focus:outline-none focus:ring-2 focus:ring-green-500
            focus:border-green-500
          `}
        />
      </div>

      {/* Lista de Productos o Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading
          ? // Mostrar Skeletons mientras carga
            Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />) // Render 10 skeleton cards
          : // Mostrar productos filtrados
            (Array.isArray(filteredProducts) ? filteredProducts : []).map((product) => (
              <div
                key={product.IdProduct}
                className={`rounded-lg shadow-lg overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-800 border border-gray-300'
                }`}
              >
                {/* Imagen del producto */}
                <img
                  src={product.Image}
                  alt={product.ProductName}
                  className="w-full h-48 object-contain bg-white p-2"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://via.placeholder.com/192x192.png?text=No+Image';
                    target.style.objectFit = 'cover';
                  }}
                />
                {/* Detalles del producto */}
                <div className="p-4 border-t-2 border-green-500 ">
                  <h3 className="text-lg font-bold truncate">{product.ProductName}</h3>
                  {product.Category && (
                      <p className="text-gray-500 text-sm mb-2">{product.Category}</p>
                  )}

                  {/* Lógica para mostrar descuento */}
                  {product.originalPrice !== undefined && product.originalPrice !== null &&
                   product.Price !== undefined && product.Price !== null &&
                   typeof product.originalPrice === 'number' && typeof product.Price === 'number' &&
                   product.originalPrice > product.Price ? (
                    <div className="flex items-center mb-2">
                      <p className="text-gray-500 line-through text-sm mr-2">${typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : 'N/A'}</p>
                      <p className="text-xl font-bold text-red-600">${typeof product.Price === 'number' ? product.Price.toFixed(2) : 'N/A'}</p>
                      {product.discountPercentage !== undefined && product.discountPercentage !== null && typeof product.discountPercentage === 'number' && (
                        <span className="ml-2 text-xs font-semibold text-green-700 bg-green-200 px-2 py-0.5 rounded dark:text-green-200 dark:bg-green-700">
                          -{product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xl font-bold mb-2">${typeof product.Price === 'number' ? product.Price.toFixed(2) : 'N/A'}</p>
                  )}

                  {/* Enlaces de Acción */}
                  <div className="flex justify-between items-center mt-4 gap-2">
                    {/* Enlace para ver detalles */}
                    <Link
                      to={`/productdetails/${product.IdProduct}`}
                      className={`inline-block px-3 py-1.5 text-sm rounded flex-grow text-center ${
                        theme === 'dark'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {language === 'en' ? 'Details' : 'Ver Detalles'}
                    </Link>

                    {/* Botón Añadir al Carrito con icono */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-2.5 py-2 rounded ${
                        theme === 'dark'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <BaggageClaim size={20} color="white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>
        {!loading && Array.isArray(products) && products.length > 0 && Array.isArray(filteredProducts) && filteredProducts.length === 0 && searchTerm !== '' && (
             <div className="text-center text-gray-500 mt-8">
                 {language === 'en' ? 'No products found matching your search criteria.' : 'No se encontraron productos que coincidan con tu búsqueda.'}
             </div>
         )}
          {!loading && Array.isArray(products) && products.length === 0 && searchTerm === '' && (
             <div className="text-center text-gray-500 mt-8">
                 {language === 'en' ? 'No products available.' : 'No hay productos disponibles.'}
             </div>
         )}

      {/* --- Modal de Login Requerido (Copiado de ProductDetails) --- */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          {/* Contenido del Modal */}
          <div className={`p-6 rounded-lg shadow-xl max-w-sm mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h3 className="text-xl font-semibold mb-4">
              {language === 'en' ? 'Login Required' : 'Iniciar Sesión Requerido'}
            </h3>
            <p className="mb-6">
              {language === 'en' ? 'You must be logged in to perform this action' : 'Debes iniciar sesión para realizar esta accion.'} {/* Mensaje adaptado */}
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

  </div>
  );
};

export default Products;
