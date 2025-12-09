import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div 
      className={cn(
        "animate-pulse bg-slate-200 rounded-md",
        className
      )}
      aria-hidden="true"
    />
  );
};

// Card Skeleton for loading states
export const CardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-20 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = () => (
  <tr className="border-b border-slate-100">
    <td className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
    <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
    <td className="px-6 py-4"><Skeleton className="h-8 w-20" /></td>
  </tr>
);

// Stats Card Skeleton
export const StatsCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-100 p-6">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  </div>
);

// List Item Skeleton
export const ListItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-slate-100">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-8 rounded" />
  </div>
);
