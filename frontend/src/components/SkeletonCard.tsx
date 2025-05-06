const SkeletonCard = () => (
  <div className="animate-pulse flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
    {/* Imagen */}
    <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded-md mb-4" />

    {/* Título */}
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />

    {/* Descripción corta */}
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />

    {/* Precio y botón */}
    <div className="mt-auto flex items-center justify-between">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
    </div>
  </div>
);

export default SkeletonCard;
