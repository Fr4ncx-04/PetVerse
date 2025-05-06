import React, { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Eye, EyeOff } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [UserName, setUserName] = useState('');
  const [Password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { theme, language } = useThemeLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos antes de enviar
    if (!UserName || !Password) {
      alert(language === 'en' ? 'Please fill in all fields.' : 'Por favor, completa todos los campos.');
      return;
    }
    
    try {
      // Llamada a la API de inicio de sesión
      const response = await fetch('http://localhost:3000/api/users/loginUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserName, Password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
      
        // Actualizar el contexto con la información del usuario
        login({
          IdUser: data.IdUser,
          UserName: data.UserName,
        });
        setShowSuccessModal(true);
        // después de 1.5s cerramos y navegamos
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      alert(language === 'en' ? 'Login failed. Please try again.' : 'Error al iniciar sesión. Inténtalo nuevamente.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-100'}`}>
      <div className={`w-full max-w-md p-6 rounded shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          {language === 'en' ? 'Login' : 'Iniciar sesión'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <FloatingInput 
              id="username" 
              type="text" 
              value={UserName} 
              onChange={(e) => setUserName(e.target.value)}  
              label={language === 'en' ? 'Username' : 'Nombre de usuario'} 
            />
          </div>
          <div className="relative">
            <FloatingInput 
              id="password" 
              type={passwordVisible ? 'text' : 'password'} 
              value={Password} 
              onChange={(e) => setPassword(e.target.value)}  
              label={language === 'en' ? 'Password' : 'Contraseña'} 
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-0 top-4 text-gray-500 hover:text-green-700"
            >
              {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                {language === 'en' ? 'Forgot your password?' : '¿Olvidaste tu contraseña?'}
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            {language === 'en' ? 'Login' : 'Iniciar sesión'}
          </button>
          <div className="mt-6 text-center">
            <span>
              {language === 'en' ? "Don't have an account?" : '¿No tienes una cuenta?'}{' '}
            </span>
            <Link to="/register" className="text-green-600 hover:text-green-800 text-sm font-medium">
              {language === 'en' ? 'Sign up' : 'Regístrate'}
            </Link>
          </div>
        </form>
        {/* Modal de éxito */}
      <Transition appear show={showSuccessModal} as={Fragment}>
        <Dialog 
          as="div" 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" 
          onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300"
            enterFrom="opacity-0 scale-75"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-75"
          >
            <Dialog.Panel className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
              <Dialog.Title className="text-lg font-medium">
                {language === 'en' ? 'Login successful!' : 'Inicio de sesión exitoso'}
              </Dialog.Title>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
      </div>
    </div>
  );
};

function FloatingInput({ id, type, value, label, onChange }: { 
  id: string;
  type: string;
  value: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const { theme } = useThemeLanguage(); // Obtenemos el tema actual
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isActive = isFocused || value.length > 0;

  // Clases condicionales según el tema
  const inputTextClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBorderClass = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const inputFocusBorder = theme === 'dark' ? 'focus:border-green-500' : 'focus:border-green-600';
  const labelInactiveClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const labelActiveClass = theme === 'dark' ? 'text-green-400' : 'text-green-600';

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        className={`block w-full px-0 pt-6 pb-1 ${inputTextClass} bg-transparent border-0 border-b-2 ${inputBorderClass} appearance-none focus:outline-none ${inputFocusBorder} peer`}
        placeholder=" "
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
        value={value}
      />
      <label
        htmlFor={id}
        className={`absolute pointer-events-none font-medium duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-0 ${
          isActive ? labelActiveClass : labelInactiveClass
        } text-lg`}
      >
        {label}
      </label>
    </div>
  );
}

export default Login;
