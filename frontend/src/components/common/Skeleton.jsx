import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col space-y-4">
      <div className="w-full h-48 bg-slate-200 rounded-xl"></div>
      <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded w-full"></div>
        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
      </div>
      <div className="pt-4 flex justify-between items-center border-t border-slate-100">
        <div className="h-5 bg-slate-200 rounded w-1/4"></div>
        <div className="h-9 bg-slate-200 rounded-lg w-28"></div>
      </div>
    </div>
  );
};

export const DoctorSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="h-64 bg-slate-200 w-full"></div>
      <div className="p-6 space-y-3">
        <div className="h-6 bg-slate-200 rounded w-2/3"></div>
        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 bg-slate-100 rounded-full w-20"></div>
          <div className="h-6 bg-slate-100 rounded-full w-24"></div>
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded w-16"></div>
          <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
        </div>
      </div>
    </div>
  );
};
