import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import axios from 'axios';

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface ImageUploadModalProps {
  /** Controla la visibilidad del modal */
  isOpen: boolean;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** ID de la mascota */
  petId: number;
  /** URL de la imagen actual para la previsualización */
  currentImage: string;
  /** Callback que se llama cuando la imagen se ha actualizado con éxito */
  onImageUpdated: () => void;
}

/*
 * ImageUploadModal renderiza un modal para subir y cambiar la imagen de la mascota.
 */
const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  petId,
  currentImage,
  onImageUpdated,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Actualizar la previsualización cuando la imagen actual cambie
  useEffect(() => {
    setPreviewUrl(currentImage);
    setUploadSuccess(false); // Reiniciar estado de éxito al abrir con nueva imagen
    setUploadError(null); // Limpiar errores
    setSelectedFile(null); // Limpiar archivo seleccionado
  }, [currentImage, isOpen]); // Reiniciar cuando el modal se abra o la imagen actual cambie

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      // Crear una URL temporal para la previsualización
      setPreviewUrl(URL.createObjectURL(file));
      setUploadError(null); // Limpiar errores previos
      setUploadSuccess(false); // Limpiar estado de éxito
    } else {
      setSelectedFile(null);
      // Volver a la imagen actual si el archivo no es válido
      setPreviewUrl(currentImage);
      setUploadError('Por favor, selecciona un archivo de imagen válido.');
      setUploadSuccess(false); // Limpiar estado de éxito
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Por favor, selecciona una imagen para subir.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('image', selectedFile);
 
    console.log('Form data being sent:', formData);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/pets/updateImage/${petId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          // Opcional: mostrar progreso
          onUploadProgress: (progressEvent) => {
            const percentCompleted = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            console.log(`Subida: ${percentCompleted}%`);
          },
        }
      );

      if (response.data && response.data.newImageUrl) {
        console.log('Imagen actualizada con éxito:', response.data.newImageUrl);
        setUploadSuccess(true);
        // Llama al callback para recargar los datos y actualizar la imagen
        onImageUpdated();
        // El modal se cerrará después de la recarga
      } else if (response.status === 200 || response.status === 201) {
        setUploadSuccess(true);
        // Llama al callback para que recargue los datos
        onImageUpdated();
        // El modal se cerrará después de la recarga
      } else {
        console.error('Error en la respuesta del servidor:', response.data);
        setUploadError(
          'Error al actualizar la imagen. Respuesta inesperada del servidor.'
        );
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      if (axios.isAxiosError(err)) {
        const backendErrorMessage = err.response?.data?.message || err.message;
        setUploadError(
          `Error al subir la imagen: ${backendErrorMessage} (Código: ${
            err.response?.status || 'N/A'
          })`
        );
      } else {
        setUploadError('Error desconocido al subir la imagen.');
      }
    } finally {
      setUploading(false);
    }
  };

  // Limpiar la URL temporal de previsualización cuando el modal se cierre o el componente se desmonte
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]); // Dependencia en previewUrl para limpiar la URL vieja al cambiar

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal container */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-[80vh] w-full max-w-sm mx-4 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // Evitar que el clic dentro cierre el modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-green-800">
            Cambiar Imagen de Mascota
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Cerrar"
            disabled={uploading} // Deshabilitar cerrar mientras se sube
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center space-y-4">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Previsualización de imagen"
              className="max-h-48 max-w-full object-contain rounded-md border border-gray-200"
            />
          )}

          {/* Input de archivo con estilo personalizado */}
          <label className="block w-full text-center">
            <span className="sr-only">Seleccionar imagen</span>
            <input
              type="file"
              accept="image/*" // Aceptar solo archivos de imagen
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100
                      cursor-pointer
                    "
              disabled={uploading} // Deshabilitar selección mientras se sube
            />
          </label>

          {/* Mostrar errores o mensaje de éxito */}
          {uploadError && (
            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
          )}
          {uploadSuccess && (
            <p className="text-green-600 text-sm mt-2">
              ¡Imagen subida con éxito!
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={uploading} // Deshabilitar Cancelar mientras se sube
          >
            Cancelar
          </button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading} // Deshabilitar si no hay archivo seleccionado o se está subiendo
          >
            {uploading ? 'Subiendo...' : 'Subir Imagen'}
            {uploading && (
              <span className="ml-2 animate-spin">&#9696;</span>
            )}{' '}
            {/* Indicador de subida */}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageUploadModal;