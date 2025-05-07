import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

export interface Vaccine {
  name: string;
  date: string | null;
  nextDate: string | null;
  status: string;
}

export interface VaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaccines: Vaccine[];
}

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <span
    className={`inline-block px-2 py-1 text-xs font-medium rounded ${className}`}
  >
    {children}
  </span>
);

const VaccineModal: React.FC<VaccineModalProps> = ({
  isOpen,
  onClose,
  vaccines,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-[80vh] w-full max-w-md mx-4 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-green-800">
            Historial de Vacunas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {vaccines.map((vaccine, index) => (
            <div
              key={index}
              className="p-4 bg-green-50 dark:bg-green-900 rounded-md flex justify-between items-start"
            >
              <div>
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                  {vaccine.name}
                </h3>
                {vaccine.date && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Aplicada: {new Date(vaccine.date).toLocaleDateString()}
                  </p>
                )}
                {vaccine.nextDate && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Próxima dosis:{' '}
                    {new Date(vaccine.nextDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge
                className={
                  vaccine.status === 'Aplicada'
                    ? 'bg-green-600 text-white'
                    : 'bg-amber-500 text-white'
                }
              >
                {vaccine.status}
              </Badge>
            </div>
          ))}
          {vaccines.length === 0 && (
            <p className="text-gray-500 text-center py-2">
              No hay vacunas registradas
            </p>
          )}
        </div>
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VaccineModal;