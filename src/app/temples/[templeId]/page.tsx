'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTempleJourneyDataService, TempleJourneyData } from '@/lib/services/journeyService';
import { TempleJourneyHero } from '@/components/temples/TempleJourneyHero';
import { TempleJourneySummary } from '@/components/temples/TempleJourneySummary';
import { TempleJourneyTimeline } from '@/components/temples/TempleJourneyTimeline';
import { ArrowLeft, Compass, Plus, Sparkles } from 'lucide-react';

export default function ParentTempleJourneyPage() {
  const params = useParams();
  const router = useRouter();
  const templeId = params.templeId as string;

  const [journeyData, setJourneyData] = useState<TempleJourneyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (templeId) {
        setLoading(true);
        const data = await getTempleJourneyDataService(templeId);
        setJourneyData(data);
        setLoading(false);
      }
    }
    load();
  }, [templeId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center space-y-4">
        <Compass className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
        <h2 className="font-serif font-bold text-2xl text-stone-800 dark:text-amber-100">
          Loading Sacred Temple Journey...
        </h2>
      </div>
    );
  }

  if (!journeyData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto text-3xl font-serif">
          🛕
        </div>
        <h2 className="font-serif font-bold text-3xl text-stone-900 dark:text-amber-100">
          Temple Not Found
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          The temple journey page you requested could not be found or has been moved.
        </p>
        <button
          onClick={() => router.push('/map')}
          className="px-6 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow"
        >
          Return to Journey Map
        </button>
      </div>
    );
  }

  const { temple, visits, stats } = journeyData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Journey
        </button>

        <Link
          href="/map"
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          <span>Explore Journey Map →</span>
        </Link>
      </div>

      {/* 1. TEMPLE HERO */}
      <TempleJourneyHero
        temple={temple}
        totalVisits={stats.totalVisits}
        firstVisitDate={stats.firstVisitDate}
        latestVisitDate={stats.latestVisitDate}
      />

      {/* 2. JOURNEY SUMMARY */}
      {stats.totalVisits > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-serif font-bold text-lg">
            <Sparkles className="w-4 h-4 text-amber-600" /> Temple Journey Analytics
          </div>
          <TempleJourneySummary
            totalVisits={stats.totalVisits}
            totalMemories={stats.totalMemories}
            firstVisitDate={stats.firstVisitDate}
            latestVisitDate={stats.latestVisitDate}
            yearsOfJourney={stats.yearsOfJourney}
          />
        </section>
      )}

      {/* 3. JOURNEY TIMELINE */}
      <TempleJourneyTimeline
        templeId={temple.id}
        templeName={temple.name}
        visits={visits}
      />

    </div>
  );
}
