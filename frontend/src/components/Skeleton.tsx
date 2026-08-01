import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
    <div className="h-6 bg-slate-800 rounded w-1/3"></div>
    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
    <div className="h-4 bg-slate-800 rounded w-1/2"></div>
    <div className="flex gap-2 pt-2">
      <div className="h-8 bg-slate-800 rounded w-16"></div>
      <div className="h-8 bg-slate-800 rounded w-16"></div>
    </div>
  </div>
);

export const SectionSkeleton: React.FC = () => (
  <div className="space-y-4 py-8 animate-pulse">
    <div className="h-8 bg-slate-800 rounded w-48 mx-auto"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);
