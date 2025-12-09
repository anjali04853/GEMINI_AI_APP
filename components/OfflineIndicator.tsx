import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '../lib/utils';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium animate-in slide-in-from-bottom duration-300",
        isOnline 
          ? "bg-green-500 text-white" 
          : "bg-red-500 text-white"
      )}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Back online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 animate-pulse" />
          <span>You're offline</span>
        </>
      )}
    </div>
  );
};
