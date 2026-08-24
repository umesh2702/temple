'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  getVisitsService,
  getTemplesService,
  computeJourneyStatsFromVisits,
} from '@/lib/services/journeyService';
import { getOnThisDayMemory, getUserProfile } from '@/lib/storage/journeyStorage';
import { TempleVisitWithDetails, Temple, JourneyStats } from '@/types';
import { StatsSummary } from '@/components/journey/StatsSummary';
import { OnThisDayCard } from '@/components/journey/OnThisDayCard';
import { CheckInPrompt } from '@/components/journey/CheckInPrompt';
import { MemoryCard } from '@/components/memories/MemoryCard';
import { Sparkles, ArrowRight, Plus, Compass } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const IndiaJourneyMap = dynamic(
  () => import('@/components/map/IndiaJourneyMap').then((mod) => mod.IndiaJourneyMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] rounded-3xl bg-amber-100/40 dark:bg-stone-900/60 animate-pulse flex flex-col items-center justify-center gap-2 text-stone-500">
        <Compass className="w-8 h-8 animate-spin text-amber-600" />
        <span className="text-xs font-semibold">Loading Sacred Journey Map...</span>
      </div>
    ),
  }
);

export default function DashboardPage() {
  const [visits, setVisits] = useState<TempleVisitWithDetails[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [stats, setStats] = useState<JourneyStats | null>(null);
  const [onThisDayData, setOnThisDayData] = useState<{
    visit: TempleVisitWithDetails;
    yearsAgo: number;
  } | null>(null);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [showCheckInPrompt, setShowCheckInPrompt] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const loadedTemples = await getTemplesService();
      const loadedVisits = await getVisitsService();
      const computedStats = computeJourneyStatsFromVisits(loadedVisits);
      const otd = getOnThisDayMemory();

      setTemples(loadedTemples);
      setVisits(loadedVisits);
      setStats(computedStats);
      setOnThisDayData(otd);
      setLoading(false);
    }

    loadData();

    // Check authenticated user
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserProfile({
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Umesh',
          email: data.user.email || '',
          avatar: data.user.user_metadata?.avatar_url || '',
          homeState: 'Andhra Pradesh',
          joinedDate: data.user.created_at || '2024-01-10',
        });
      }
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* HERO GREETING SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 text-white p-8 sm:p-10 shadow-2xl border border-amber-500/30">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to your personal sanctuary
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight text-amber-100 leading-tight">
            Namaste, {userProfile.name} 👋
          </h1>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-light">
            &ldquo;Your journey is more than the places you&apos;ve visited. Remember every temple, every journey, and every moment along the way.&rdquo;
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4">
            <Link
              href="/add-visit"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/30 hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
              <span>Add a Temple Visit</span>
            </Link>

            <Link
              href="/map"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-amber-200 font-semibold text-sm border border-amber-500/30 transition-all"
            >
              <span>Explore My Journey Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* GENTLE CHECK-IN PROMPT BANNER */}
      {showCheckInPrompt && (
        <section>
          <CheckInPrompt onDismiss={() => setShowCheckInPrompt(false)} />
        </section>
      )}

      {/* STATS SUMMARY METRICS */}
      {stats && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-amber-100">
              Spiritual Summary
            </h2>
            <Link href="/stats" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline">
              View Detailed Analytics →
            </Link>
          </div>
          <StatsSummary stats={stats} />
        </section>
      )}

      {/* ON THIS DAY EMOTIONAL RECALL */}
      {onThisDayData && (
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-amber-100 flex items-center gap-2">
            <span>On This Day</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              Memory Recall
            </span>
          </h2>
          <OnThisDayCard data={onThisDayData} />
        </section>
      )}

      {/* MAP PREVIEW SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-amber-100">
              Your Journey Across India
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Interactive map highlighting your sacred footsteps and visited shrines.
            </p>
          </div>
          <Link
            href="/map"
            className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline bg-amber-100/60 dark:bg-amber-950/60 px-3.5 py-2 rounded-xl border border-amber-300/40"
          >
            <span>Full Map View</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <IndiaJourneyMap allTemples={temples} userVisits={visits} />
      </section>

      {/* RECENT MEMORIES FEED */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-amber-100">
              Recent Memories
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Your most recent temple Darshans and spiritual moments.
            </p>
          </div>
          <Link
            href="/memories"
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            View All Memories ({visits.length}) →
          </Link>
        </div>

        {visits.length === 0 ? (
          <div className="text-center py-12 rounded-3xl bg-amber-50/50 dark:bg-stone-900/50 border border-dashed border-amber-300 dark:border-amber-900 p-8 space-y-3">
            <h4 className="font-serif font-bold text-lg text-stone-800 dark:text-amber-200">
              Your sacred journey is waiting to begin.
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Record your first temple visit to start building your personal digital map and memory journal.
            </p>
            <Link
              href="/add-visit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow"
            >
              <Plus className="w-4 h-4" /> Add Your First Visit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visits.slice(0, 4).map((visit) => (
              <MemoryCard key={visit.id} visit={visit} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
