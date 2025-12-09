import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="h-24 w-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
        <FileQuestion className="h-12 w-12 text-slate-500" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
      <p className="text-slate-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/dashboard">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};