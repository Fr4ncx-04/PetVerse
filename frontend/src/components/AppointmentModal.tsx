import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

//interfaz appointment
export interface Appointment {
  date: string;
  reason: string;
  vet: string;
}

export interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[]; //Se espera un array con la estructura { date, reason, vet }
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  appointments,
}) => {
  if (!isOpen) return null;

  //Citas ordenadas por fecha descendente
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-h-[80vh] w-full max-w-md mx-4 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-green-800">
            Historial de Citas
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {sortedAppointments.length > 0 ? (
            sortedAppointments.map((appointment, index) => (
              <div
                key={index}
                className="p-4 bg-green-50 dark:bg-green-900 rounded-md"
              >
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                  {appointment.reason}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Fecha: {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Veterinario: {appointment.vet}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-2">
              No hay citas registradas
            </p>
          )}
        </div>

        {/* Footer */}
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

export default AppointmentModal;