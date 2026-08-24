'use client';

import React from 'react';
import Link from 'next/link';
import { BellRing, Plus, X } from 'lucide-react';

interface CheckInPromptProps {
  onDismiss?: () => void;
}

export const CheckInPrompt: React.FC<CheckInPromptProps> = ({ onDismiss }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-yellow-500/10 border border-amber-400/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 shadow-md shadow-amber-500/30">
          🛕
        </div>
        <div>
          <h4 className="font-serif font-bold text-base text-stone-900 dark:text-amber-100">
            Have you visited a temple recently?
          </h4>
          <p className="text-xs text-stone-600 dark:text-stone-300">
            Add it to your journey and preserve the memory while it&apos;s fresh in your heart.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors text-xs"
            title="Dismiss prompt"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <Link
          href="/add-visit"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold shadow transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Visit</span>
        </Link>
      </div>

    </div>
  );
};
