import React from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';

export interface WeightRecord {
  date: string;
  weight: string;
}

export interface WeightHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  weightHistory: WeightRecord[];
}

const WeightHistoryModal: React.FC<WeightHistoryModalProps> = ({
  isOpen,
  onClose,
  weightHistory,
}) => {
  if (!isOpen) return null;

  const sortedHistory = [...weightHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
            Historial de Peso
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {sortedHistory.length > 0 ? (
            <>
              <div className="grid grid-cols-3 font-medium text-green-800 mb-2 px-4">
                <div>Fecha</div>
                <div>Peso</div>
                <div>Cambio</div>
              </div>
              {sortedHistory.map((record, index) => {
                const prevWeight =
                  index < sortedHistory.length - 1
                    ? parseFloat(sortedHistory[index + 1].weight)
                    : parseFloat(record.weight);
                const currentWeight = parseFloat(record.weight);
                const weightChange = currentWeight - prevWeight;

                return (
                  <div
                    key={index}
                    className="grid grid-cols-3 p-3 bg-green-50 dark:bg-green-900 rounded-md"
                  >
                    <div>{new Date(record.date).toLocaleDateString()}</div>
                    <div>{record.weight} kg</div>
                    <div>
                      {index < sortedHistory.length - 1 &&
                      !isNaN(weightChange) ? (
                        <span
                          className={
                            weightChange >= 0
                              ? 'text-green-600'
                              : 'text-amber-600'
                          }
                        >
                          {weightChange > 0 ? '+' : ''}
                          {weightChange.toFixed(1)} kg
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span> 
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="text-gray-500 text-center py-2">
              No hay historial de peso registrado
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

export default WeightHistoryModal;