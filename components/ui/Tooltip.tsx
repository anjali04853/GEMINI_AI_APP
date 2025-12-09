import React, { ReactNode, useState } from 'react';
import { cn } from '../../lib/utils';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  side?: 'top' | 'bottom';
}

export const Tooltip = ({ content, children, className, side = 'top' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      role="tooltip"
    >
      {children}
      {isVisible && (
        <div 
          className={cn(
            "absolute left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-slate-900 rounded whitespace-nowrap z-50 animate-in fade-in zoom-in duration-200 pointer-events-none",
            side === 'top' ? "bottom-full mb-2" : "top-full mt-2"
          )}
        >
          {content}
          <div 
            className={cn(
              "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
              side === 'top' ? "top-full -mt-1 border-t-slate-900" : "bottom-full -mb-1 border-b-slate-900"
            )} 
          />
        </div>
      )}
    </div>
  );
};