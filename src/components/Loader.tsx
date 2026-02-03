
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;
