import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    LogOut,
    Sun,
    Moon,
    Menu,
    Dog,
    Cat,
    Plus,
    User,
    Globe,
    X,
    ArrowRight,
    Heart,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../contexts/WishListContext';

const UnifiedHeaderNav: React.FC = () => {
    const { isLoggedIn, logout } = useAuth();
    const { theme, language, toggleTheme, setLanguage } = useThemeLanguage();
    const { cartCount } = useCart();
    const { count } = useWishlist();
    const [isMenuOpen, setIsMenuOpen] = useState(false);       // Controla el modal Hamburguesa
    const [isUserModalOpen, setIsUserModalOpen] = useState(false); // Controla el modal de usuario
    const [currentPetIcon, setCurrentPetIcon] = useState<'dog' | 'cat'>('dog');

    const navigate = useNavigate();

      // Cambia entre perro/gato cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPetIcon((prev) => (prev === 'dog' ? 'cat' : 'dog'));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

      // Logout
    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleLanguageFunc = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserModal = () => {
        setIsUserModalOpen(!isUserModalOpen);
    };

    const navItems = [
        { key: '', en: 'Home', es: 'Inicio' },
        { key: 'shop', en: 'Shop', es: 'Tienda' },
        { key: 'servicedetailpage', en: 'Services', es: 'Servicios' },
        { key: 'forums', en: 'Forums', es: 'Foros' },
        { key: 'blog', en: 'Blog', es: 'Blog' },
    ];

    const SwitchTheme = () => (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-200">{language === 'en' ? 'Theme' : 'Tema'}</span> 
            <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={theme === 'dark'}
                onChange={toggleTheme}
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-500" />
                <div className="absolute flex justify-between w-full px-1 top-1 text-xs text-gray-400">
                    <Sun className="w-4 h-4" />
                    <Moon className="w-4 h-4" />
                </div>
            </label>
        </div>
    );

    const SwitchLanguage = () => (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-200">{language === 'en' ? 'Language' : 'Idioma'}</span> 
            <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={language === 'en'}
                onChange={toggleLanguageFunc}
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-500" />
                <div className="absolute flex justify-between w-full px-1 top-[3px] text-[10px] text-gray-600 dark:text-gray-300">
                    <span>ES</span>
                    <span>EN</span>
                </div>
            </label>
        </div>
    );

    return (
        <header
            className={`
            fixed top-0 left-0 right-0 z-50
            bg-white dark:bg-gray-800
            border-b border-gray-200 dark:border-gray-700
            shadow-sm h-16
            transition-colors duration-200
            `}
        >
            <div className="container mx-auto px-4 flex items-center justify-between h-full">
                {/* VISTA DESKTOP */}
                <div className="hidden md:flex items-center justify-between w-full">
                    {/* Izquierda: Logo */}
                    <div className="flex items-center space-x-2">
                        <motion.div
                            className="relative w-8 h-8"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPetIcon}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0 text-primary-500"
                                >
                                    {currentPetIcon === 'dog' ? <Dog size={32} /> : <Cat size={32} />}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                        <Link to="/" className="text-2xl font-bold text-green-600 dark:text-green-400">
                            Pet<span className="text-green-400 dark:text-green-600">Verse</span> 
                        </Link>
                    </div>
                    {/* Centro: Navegación */}
                    <nav className="flex space-x-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.key}
                                to={`/${item.key}`}
                                end
                                className={({ isActive }) =>
                                    `flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-full transition-colors duration-200 hover:bg-green-100 dark:hover:bg-green-900 ${
                                isActive
                                    ? 'border-b-2 border-green-500 text-green-600'
                                    : theme === 'dark'
                                    ? 'text-gray-200'
                                    : 'text-gray-700'
                                }`}>
                                {language === 'en' ? item.en : item.es}
                            </NavLink>
                        ))}
                    </nav>
                    {/* Derecha: Íconos */}
                    <div className="flex items-center space-x-3">
                        {/* Ícono de tema */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                        >
                            {theme === 'dark' ? <Sun className="text-gray-300" /> : <Moon className="text-gray-600" />}
                        </button>
                        {/* Ícono de idioma */}
                        <button
                            onClick={toggleLanguageFunc}
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                        >
                            <Globe className="text-gray-600 dark:text-gray-300" />
                        </button>
                        {/* Si no hay sesión iniciada: Solo ícono de Usuario/Login */}
                        {!isLoggedIn && (
                            <Link
                                to="/login"
                                className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                            >
                                <User className="text-gray-600 dark:text-gray-300" />
                            </Link>
                        )}
                        {/* Si hay sesión iniciada: Íconos de Carrito, Añadir Mascota, Perfil, y Logout */}
                        {isLoggedIn && (
                            <>
                            {/* Ícono de Carrito */}
                            <Link
                                to="/cart"
                                className="relative p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                            >
                                <ShoppingCart className="text-gray-600 dark:text-gray-300" />
                                {cartCount > 0 && (
                                <span className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                                    <span className="text-white text-xs">{cartCount}</span>
                                </span>
                                )}
                            </Link>
                            {/* Lista de deseos */}
                            <Link 
                                to="/wishlistpage"
                                className="relative p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                            >
                                <Heart className="text-gray-600 dark:text-gray-300" />
                                {count > 0 && (
                                <span className="absolute bottom-0 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                                    <span className="text-white text-xs">{count}</span>
                                </span>
                                )}
                            </Link>
                            {/* Ícono de Añadir Mascota */}
                            <Link
                                to="/addpet"
                                className="relative p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                            >
                                <Dog className="text-gray-600 dark:text-gray-300" />
                                <span className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                                    <Plus size={8} className="text-white" />
                                </span>
                            </Link>
                            {/* Ícono de Logout */}
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                            >
                                <LogOut className="text-gray-600 dark:text-gray-300" />
                            </button>
                            </>
                        )}
                    </div>
                </div>
                    {/* VISTA MOBILE */}
                    <div className="flex md:hidden items-center justify-between w-full">
                        {/* Izquierda: Logo*/}
                        <div className="flex items-center space-x-1">
                            <motion.div
                                className="relative w-8 h-8"
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentPetIcon}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="absolute inset-0 text-green-600" 
                                    >
                                        {currentPetIcon === 'dog' ? <Dog size={32} /> : <Cat size={32} />}
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                            {/* Nombre */}
                            <Link to="/" className="text-2xl font-bold text-green-600 dark:text-green-400"> 
                                Pet<span className="text-green-400 dark:text-green-600">Verse</span> 
                            </Link>
                        </div>
                        {/* Derecha: Íconos */}
                        <div className="flex items-center space-x-3">
                            {/* Ícono de usuario o perro */}
                            {!isLoggedIn ? (
                            <>
                                {/* Botón que abre el modal de login/perfil para mobile si no está logeado */}
                                <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                                    onClick={toggleUserModal}>
                                    <User className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </>
                            ) : (
                            <>
                                {/* Ícono de Añadir Mascota para mobile si está logeado */}
                                <Link
                                    to="/addpet"
                                    className="relative p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                                >
                                    <Dog className="text-gray-600 dark:text-gray-300" />
                                    <span className="absolute bottom-0 right-0 bg-green-500 rounded-full p-[2px]">
                                        <Plus size={11} className="text-white" />
                                    </span>
                                </Link>
                                {/* Ícono de Carrito para mobile si está logeado */}
                                <Link
                                    to="/cart"
                                    className="relative p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                                >
                                    <ShoppingCart className="text-gray-600 dark:text-gray-300" />
                                    {cartCount > 0 && (
                                    <span className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                                        <span className="text-white text-xs">{cartCount}</span>
                                    </span>
                                    )}
                                </Link>
                                {/* icono de lista de deseos si esta logueado */}
                                <Link 
                                    to="/wishlistpage"
                                    className="relative p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                                    >
                                    <Heart className="text-gray-600 dark:text-gray-300" />
                                    {count > 0 && (
                                    <span className="absolute bottom-0 right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                                        <span className="text-white text-xs">{count}</span>
                                    </span>
                                    )}
                                </Link>
                                {/* Ícono de Logout para mobile si está logeado */}
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                                >
                                    <LogOut className="text-gray-600 dark:text-gray-300" />
                                </button>
                            </>
                            )}
                            <button
                                onClick={toggleMenu}
                                className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded-full transition-colors duration-200"
                            >
                                <Menu className="text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    </div>
                </div>
                {/** MODAL HAMBURGUESA (mobile) */}
                {isMenuOpen && (
                <div
                    className="fixed inset-0 z-50 bg-white/80 dark:bg-black/50 backdrop-blur-sm flex flex-col"
                >
                    {/* Botón para cerrar */}
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900"
                    >
                        <X className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <div className="mt-20 px-6 space-y-4 overflow-auto">
                        {/* Lista de navegación */}
                        <ul className="space-y-4">
                            {navItems.map((item) => (
                            <li key={item.key} className="text-center">
                                <NavLink
                                    to={`/${item.key}`}
                                    end
                                    onClick={() => setIsMenuOpen(false)}
                                    className={({ isActive }) =>
                                    `text-lg font-medium block py-2 hover:bg-green-100 rounded-md ${
                                    isActive
                                    ? 'border-b-2 border-green-500 text-green-600'
                                    : 'text-gray-700 dark:text-gray-200'
                                    }`
                                    }
                                >
                                    {language === 'en' ? item.en : item.es}
                                </NavLink>
                            </li>
                            ))}
                        </ul>
                        {/* Cambio de tema */}
                        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-md shadow">
                            <p className="text-gray-700 dark:text-gray-200 text-sm">
                                {language === 'en' ? 'Theme change' : 'Cambio de tema'}
                            </p>
                            <SwitchTheme />
                        </div>
                            {/* Cambio de idioma */}
                            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-md shadow">
                                <p className="text-gray-700 dark:text-gray-200 text-sm">
                                    {language === 'en' ? 'Language change' : 'Cambio de idioma'}
                                </p>
                                <SwitchLanguage />
                            </div>
                    </div>
                </div>
                )}
                {/** MODAL USUARIO (mobile) - Solo se usa si no está logeado */}
                {!isLoggedIn && isUserModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setIsUserModalOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 p-6 rounded-md w-80 shadow-lg relative"
                        onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
                    >
                        {/* Botón para cerrar */}
                        <button
                            className="absolute top-2 right-2 p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded-full"
                            onClick={() => setIsUserModalOpen(false)}
                        >
                            <X className="text-gray-600 dark:text-gray-300" />
                        </button>
                        {/** Contenido del modal de usuario (solo si no está logeado) */}
                        <div className="text-center mt-6">
                            <p className="mb-4 text-gray-700 dark:text-gray-200">
                                {language === 'en'
                                    ? 'We recommend you to sign in'
                                    : 'Te recomendamos iniciar sesión'}
                            </p>
                            <Link
                                to="/login"
                                onClick={() => setIsUserModalOpen(false)} // Cerrar modal al navegar
                                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
                            >
                                {language === 'en' ? 'go' : 'ir'}
                                <ArrowRight className="ml-2" size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
                )}
        </header>
    );
};

export default UnifiedHeaderNav;