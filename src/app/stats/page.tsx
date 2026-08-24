'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getVisitsService, computeJourneyStatsFromVisits } from '@/lib/services/journeyService';
import { JourneyStats } from '@/types';
import { StatsSummary } from '@/components/journey/StatsSummary';
import { CircuitProgress } from '@/components/journey/CircuitProgress';
import { Sparkles, MapPin, Calendar, Compass, ArrowRight } from 'lucide-react';

export default function StatsPage() {
  const [stats, setStats] = useState<JourneyStats | null>(null);

  useEffect(() => {
    async function load() {
      const visits = await getVisitsService();
      setStats(computeJourneyStatsFromVisits(visits));
    }
    load();
  }, []);

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold mb-1 border border-amber-300/40">
          <Sparkles className="w-3.5 h-3.5" /> Journey Analytics
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-amber-100">
          Spiritual Journey Statistics
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          Analytics and insights into your spiritual travels across India.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <StatsSummary stats={stats} />

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Most Visited State */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 shadow-sm space-y-3">
          <span className="text-[10px] font-extrabold tracking-widest text-amber-600 uppercase">
            Most Visited State
          </span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center text-xl font-bold">
              📍
            </div>
            <div>
              <h3 className="font-serif text-2xl font-extrabold text-stone-900 dark:text-amber-100">
                {stats.mostVisitedState ? stats.mostVisitedState.name : 'N/A'}
              </h3>
              <p className="text-xs text-stone-500">
                {stats.mostVisitedState ? `${stats.mostVisitedState.count} temples recorded` : 'Keep exploring!'}
              </p>
            </div>
          </div>
        </div>

        {/* First Temple Recorded */}
        {stats.firstTempleVisit && (
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold tracking-widest text-amber-600 uppercase">
              First Temple Recorded
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-amber-100">
                {stats.firstTempleVisit.temple.name}
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                Your journey began here on {stats.firstTempleVisit.visitDate}
              </p>
              <Link
                href={`/visit/${stats.firstTempleVisit.id}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-amber-600"
              >
                Relive First Memory →
              </Link>
            </div>
          </div>
        )}

        {/* Latest Temple Recorded */}
        {stats.latestTempleVisit && (
          <div className="rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 shadow-sm space-y-3">
            <span className="text-[10px] font-extrabold tracking-widest text-amber-600 uppercase">
              Most Recent Darshan
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-amber-100">
                {stats.latestTempleVisit.temple.name}
              </h3>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                Visited on {stats.latestTempleVisit.visitDate} ({stats.latestTempleVisit.temple.state})
              </p>
              <Link
                href={`/visit/${stats.latestTempleVisit.id}`}
                className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-amber-600"
              >
                View Latest Memory →
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Pilgrimage Circuit Trackers */}
      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-amber-100">
            Sacred Pilgrimage Circuits
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Track your progress across ancient holy circuits in India.
          </p>
        </div>

        <CircuitProgress circuits={stats.circuits} />
      </section>

    </div>
  );
}
