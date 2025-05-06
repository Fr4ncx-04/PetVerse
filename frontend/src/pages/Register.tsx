import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useThemeLanguage } from '../contexts/ThemeLanguageContext';
import { Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
  const { theme, language } = useThemeLanguage();
  const [roles, setRoles] = useState<{ IdRole: number; RolName: string }[]>([]);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phonenumber: '',
    address: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/getRoles');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    if (roles.length > 0 && formData.role === '') {
      setFormData((prevState) => ({
        ...prevState,
        role: roles[0].IdRole.toString(),
      }));
    }
  }, [roles, formData.role]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert(language === 'en' ? 'Passwords do not match.' : 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4001/api/users/registerUsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Role: formData.role,
          Name: formData.name,
          LastName: formData.lastname,
          UserName: formData.username,
          Email: formData.email,
          Password: formData.password,
          ConfirmPassword: formData.confirmPassword,
          PhoneNumber: formData.phonenumber,
          Address: formData.address,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(language === 'en' ? 'An error occurred during registration.' : 'Ocurrió un error durante el registro.');
    }
  };

  const text = {
    en: {
      register: 'Register',
      name: 'First Name',
      lastName: 'Last Name',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phoneNumber: 'Phone Number',
      address: 'Address',
      role: 'Role',
      submit: 'Register',
      alreadyHaveAccount: 'Already have an account?',
      loginHere: 'Log in here',
      selectRole: 'Select a role'
    },
    es: {
      register: 'Registro',
      name: 'Nombre',
      lastName: 'Apellido',
      username: 'Nombre de usuario',
      email: 'Correo',
      password: 'Contraseña',
      confirmPassword: 'Confirma tu contraseña',
      phoneNumber: 'Número de Teléfono',
      address: 'Dirección',
      role: 'Rol',
      submit: 'Registrar',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      loginHere: 'Inicia sesión aquí',
      selectRole: 'Selecciona un rol'
    },
  };

  const t = text[language] || text.es;

  return (
    <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-green-100'} mt-10`}>
      <div className={`w-full max-w-4xl h-4/5 p-6 rounded shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`} style={{ maxHeight: '800px' }}>
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">{t.register}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <CompactInput id="name" name="name" type="text" value={formData.name} onChange={handleChange} label={t.name} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <CompactInput id="lastname" name="lastname" type="text" value={formData.lastname} onChange={handleChange} label={t.lastName} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <CompactInput id="username" name="username" type="text" value={formData.username} onChange={handleChange} label={t.username} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <CompactInput id="email" name="email" type="email" value={formData.email} onChange={handleChange} label={t.email} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <CompactInput id="phonenumber" name="phonenumber" type="text" value={formData.phonenumber} onChange={handleChange} label={t.phoneNumber} />
          </div>
          <div className="col-span-2 md:col-span-1">
            <CompactInput id="address" name="address" type="text" value={formData.address} onChange={handleChange} label={t.address} />
          </div>
          
          {/* Password */}
          <div className="col-span-2 md:col-span-1 relative">
            <CompactInput id="password" name="password" type={passwordVisible ? 'text' : 'password'} value={formData.password} onChange={handleChange} label={t.password} />
            <button 
              type="button" 
              onClick={togglePasswordVisibility} 
              className="absolute right-2 top-3 text-gray-500 hover:text-green-700"
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Confirm Password */}
          <div className="col-span-2 md:col-span-1 relative">
            <CompactInput id="confirmPassword" name="confirmPassword" type={confirmPasswordVisible ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} label={t.confirmPassword} />
            <button 
              type="button" 
              onClick={toggleConfirmPasswordVisibility} 
              className="absolute right-2 top-3 text-gray-500 hover:text-green-700"
            >
              {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {/* Select de Rol */}
          <div className="col-span-2">
            <label 
              htmlFor="role" 
              className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {t.role}
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm border rounded ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600 text-white focus:border-green-500' 
                  : 'bg-white border-gray-300 text-black focus:border-green-600'
              } focus:outline-none`}
            >
              {roles.length === 0 ? (
                <option value="">{t.selectRole}</option>
              ) : (
                roles.map((role) => (
                  <option key={role.IdRole} value={role.IdRole}>
                    {role.RolName}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              {t.submit}
            </button>
          </div>
          
          <div className="col-span-2 mt-2 text-center text-sm">
            <span>
              {t.alreadyHaveAccount}{' '}
            </span>
            <Link to="/login" className="text-green-600 hover:text-green-800 font-medium">
              {t.loginHere}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de input compacto para ahorrar espacio
function CompactInput({
  id,
  type,
  value,
  label,
  onChange,
  name,
}: {
  id: string;
  type: string;
  value: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}) {
  const { theme } = useThemeLanguage();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isActive = isFocused || value.length > 0;

  const inputTextClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inputBorderClass = theme === 'dark' ? 'border-gray-600' : 'border-gray-300';
  const inputFocusBorder = theme === 'dark' ? 'focus:border-green-500' : 'focus:border-green-600';
  const labelInactiveClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const labelActiveClass = theme === 'dark' ? 'text-green-400' : 'text-green-600';

  return (
    <div className="relative h-12">
      <input
        id={id}
        name={name ? name : id}
        type={type}
        className={`block w-full px-2 pt-4 pb-1 text-sm ${inputTextClass} bg-transparent border-0 border-b-2 ${inputBorderClass} appearance-none focus:outline-none ${inputFocusBorder} peer`}
        placeholder=" "
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
        value={value}
      />
      <label
        htmlFor={id}
        className={`absolute pointer-events-none font-medium duration-300 transform -translate-y-2 scale-75 top-3 z-10 origin-[0] left-2 ${
          isActive ? labelActiveClass : labelInactiveClass
        } text-sm`}
      >
        {label}
      </label>
    </div>
  );
}

export default Register;