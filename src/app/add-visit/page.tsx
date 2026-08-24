'use client';

import React, { Suspense } from 'react';
import { AddVisitForm } from '@/components/visits/AddVisitForm';
import { Sparkles, Compass } from 'lucide-react';

export default function AddVisitPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-300/40">
          <Sparkles className="w-3.5 h-3.5" /> Preserve Your Sacred Footprint
        </div>
        <h1 className="font-serif text-3xl font-extrabold text-stone-900 dark:text-amber-100">
          Record a Temple Visit
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Log your visit details, attach memories and photos to add a new marker to your journey map.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="p-12 text-center text-stone-500">
            <Compass className="w-8 h-8 animate-spin mx-auto text-amber-600 mb-2" />
            <span className="text-xs font-semibold">Loading visit wizard...</span>
          </div>
        }
      >
        <AddVisitForm />
      </Suspense>
    </div>
  );
}
