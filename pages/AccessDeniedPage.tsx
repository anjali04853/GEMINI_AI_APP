import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AccessDeniedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">403</h1>
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Access Denied</h2>
      <p className="text-slate-500 max-w-md mb-8">
        You do not have permission to access this page. This area is restricted to administrators only.
      </p>
      <div className="flex gap-4">
        <Link to="/dashboard">
          <Button variant="primary">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
