import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center p-8 text-slate-400">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const FullPageLoading = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
       <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium animate-pulse">Loading Application...</p>
       </div>
    </div>
  );
};