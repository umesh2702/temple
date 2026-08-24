'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  getVisitsService,
  getTemplesService,
  computeJourneyStatsFromVisits,
} from '@/lib/services/journeyService';
import { TempleVisitWithDetails, Temple, JourneyStats } from '@/types';
import { Filter, Sparkles, Compass, Plus } from 'lucide-react';
import Link from 'next/link';

const IndiaJourneyMap = dynamic(
  () => import('@/components/map/IndiaJourneyMap').then((mod) => mod.IndiaJourneyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[650px] rounded-3xl bg-amber-100/40 dark:bg-stone-900/60 animate-pulse flex flex-col items-center justify-center gap-2 text-stone-500">
        <Compass className="w-10 h-10 animate-spin text-amber-600" />
        <span className="text-sm font-semibold">Loading Interactive Sacred Map...</span>
      </div>
    ),
  }
);

export default function JourneyMapPage() {
  const [visits, setVisits] = useState<TempleVisitWithDetails[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [stats, setStats] = useState<JourneyStats | null>(null);

  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    async function load() {
      const loadedTemples = await getTemplesService();
      const loadedVisits = await getVisitsService();
      setTemples(loadedTemples);
      setVisits(loadedVisits);
      setStats(computeJourneyStatsFromVisits(loadedVisits));
    }
    load();
  }, []);

  const uniqueStates = useMemo(() => {
    const states = new Set(temples.map((t) => t.state));
    return Array.from(states).sort();
  }, [temples]);

  const categories = [
    'Jyotirlingam',
    'Divya Desam',
    'Shakti Peetha',
    'Shiva Temple',
    'Vishnu Temple',
    'Devi Temple',
    'Heritage',
    'Other',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold mb-1 border border-amber-300/40">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Footprint
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-amber-100">
            My Journey Map
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Explore your spiritual travels across India. Click any marker to view visit memories.
          </p>
        </div>

        {stats && (
          <div className="flex items-center gap-4 bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900 shadow-sm shrink-0">
            <div className="text-center px-3 border-r border-stone-200 dark:border-stone-800">
              <span className="font-serif text-xl font-bold text-amber-600 dark:text-amber-400">
                {stats.totalVisits}
              </span>
              <p className="text-[10px] font-semibold text-stone-500 uppercase">Temples Visited</p>
            </div>
            <div className="text-center px-3">
              <span className="font-serif text-xl font-bold text-amber-600 dark:text-amber-400">
                {stats.statesExploredCount}
              </span>
              <p className="text-[10px] font-semibold text-stone-500 uppercase">States Explored</p>
            </div>
          </div>
        )}
      </div>

      {/* Filter Control Bar */}
      <div className="rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300">
            <Filter className="w-4 h-4 text-amber-600" /> Filter Map:
          </div>

          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All States ({uniqueStates.length})</option>
            {uniqueStates.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Sacred Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {(stateFilter !== 'ALL' || categoryFilter !== 'ALL') && (
            <button
              onClick={() => {
                setStateFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        <Link
          href="/add-visit"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow"
        >
          <Plus className="w-4 h-4" /> Add Temple Visit
        </Link>

      </div>

      {/* Main Leaflet Map View */}
      <section>
        <IndiaJourneyMap
          allTemples={temples}
          userVisits={visits}
          selectedStateFilter={stateFilter}
          selectedCategoryFilter={categoryFilter}
        />
      </section>

    </div>
  );
}
