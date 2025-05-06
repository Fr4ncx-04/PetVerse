import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import axios from 'axios';

interface ImageUploadModalProps {
  /** Controla la visibilidad del modal */
  isOpen: boolean;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** URL de la imagen actual para previsualizar */
  currentImage?: string | null;
  /** Si se pasa, modo actualización: endpoint base + petId */
  updateEndpoint?: string;
  petId?: number;
  /** Callback post-actualización */
  onUpdateSuccess?: (newImageUrl?: string) => void;
  /** Callback modo registro: devuelve el archivo seleccionado */
  onImageSelected?: (file: File) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  currentImage = null,
  updateEndpoint,
  petId,
  onUpdateSuccess,
  onImageSelected,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage);
  const isUpdateMode = Boolean(updateEndpoint && petId);

  useEffect(() => {
    setPreviewUrl(currentImage);
    setSelectedFile(null);
  }, [currentImage, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAction = async () => {
    if (!selectedFile) return;
    if (isUpdateMode && updateEndpoint && petId) {
      // Modo actualización: PUT al endpoint
      const form = new FormData();
      form.append('image', selectedFile);
      try {
        const resp = await axios.put(
          `${updateEndpoint}/${petId}`,
          form,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        // se asume que devuelve newImageUrl en data
        if (resp.status < 300) {
          onUpdateSuccess?.(resp.data.newImageUrl);
          onClose();
        }
      } catch (err) {
        console.error('Error updating image:', err);
      }
    } else {
      // Modo registro: delegar la file al padre
      onImageSelected?.(selectedFile);
      onClose();
    }
  };

  // Limpieza de URLs temporales
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="fixed inset-0" onClick={onClose} />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-sm p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {isUpdateMode ? 'Cambiar Imagen de Mascota' : 'Seleccionar Imagen'}
          </h2>
          <button onClick={onClose} disabled={false} aria-label="Cerrar">
            <X />
          </button>
        </header>

        <div className="flex flex-col items-center space-y-4">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-40 object-contain border rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600 cursor-pointer"
          />
        </div>

        <footer className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 border rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleAction}
            disabled={!selectedFile}
            className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {isUpdateMode ? 'Subir Imagen' : 'Seleccionar'}
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default ImageUploadModal;
