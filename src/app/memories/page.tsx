'use client';

import React, { useState, useEffect } from 'react';
import { getVisitsService } from '@/lib/services/journeyService';
import { TempleVisitWithDetails } from '@/types';
import { MemoryTimeline } from '@/components/memories/MemoryTimeline';
import { Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';

export default function MemoriesPage() {
  const [visits, setVisits] = useState<TempleVisitWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getVisitsService();
      setVisits(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold mb-1 border border-amber-300/40">
            <Sparkles className="w-3.5 h-3.5" /> Chronological Timeline
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-amber-100">
            Sacred Memories Journal
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Trace your spiritual path chronologically through years of pilgrimage and darshan.
          </p>
        </div>

        <Link
          href="/add-visit"
          className="self-start sm:self-center flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Visit</span>
        </Link>
      </div>

      {/* Main Timeline View */}
      <MemoryTimeline visits={visits} />

    </div>
  );
}
