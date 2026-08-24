'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTemplesService, getVisitsService } from '@/lib/services/journeyService';
import { Temple, TempleVisitWithDetails } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';
import { MapPin, Calendar, Plus, ArrowLeft, Compass, History } from 'lucide-react';

export default function TempleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templeId = params.id as string;

  const [temple, setTemple] = useState<Temple | null>(null);
  const [visits, setVisits] = useState<TempleVisitWithDetails[]>([]);

  useEffect(() => {
    async function load() {
      if (templeId) {
        const temples = await getTemplesService();
        const found = temples.find((t) => t.id === templeId);
        if (found) {
          setTemple(found);
          const allVisits = await getVisitsService();
          setVisits(allVisits.filter((v) => v.templeId === found.id));
        }
      }
    }
    load();
  }, [templeId]);

  if (!temple) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Compass className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
        <h2 className="font-serif font-bold text-2xl">Loading Temple Details...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Back Link */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Journey Map
      </button>

      {/* Temple Header Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-2xl border border-amber-500/30">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <SafeImage
            src={temple.imageUrl}
            alt={temple.name}
            category={temple.category}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>

          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30">
            {temple.category}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-3 relative -mt-20 z-10">
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-100 leading-tight">
            {temple.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-300 font-medium">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <MapPin className="w-4 h-4" /> {temple.city}, {temple.state}, {temple.country}
            </span>
            <span className="text-stone-500">•</span>
            <span>GPS: {temple.latitude.toFixed(4)} N, {temple.longitude.toFixed(4)} E</span>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href={`/add-visit?templeId=${temple.id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/30 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Log Visit to this Temple</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Description & Overview */}
      <section className="rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 sm:p-8 shadow-sm space-y-3">
        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-amber-100">
          About Sacred Shrine
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
          {temple.description}
        </p>
      </section>

      {/* Visited History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-amber-100 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <span>Your Visits ({visits.length})</span>
          </h3>
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300/40">
            {visits.length === 0 ? 'Not visited yet' : `Visited ${visits.length} times`}
          </span>
        </div>

        {visits.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-amber-50/50 dark:bg-stone-900/50 border border-dashed border-amber-300 dark:border-amber-900 space-y-3">
            <p className="text-xs text-stone-500">You haven&apos;t recorded a visit to this temple yet.</p>
            <Link
              href={`/add-visit?templeId=${temple.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow"
            >
              <Plus className="w-4 h-4" /> Record First Visit
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((v) => (
              <div
                key={v.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                    <Calendar className="w-4 h-4" /> Visited on {v.visitDate}
                    <span className="text-stone-400">•</span>
                    <span>With {v.companions}</span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 italic line-clamp-2">
                    &ldquo;{v.memory}&rdquo;
                  </p>
                </div>

                <Link
                  href={`/visit/${v.id}`}
                  className="shrink-0 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-800 text-white text-xs font-semibold hover:bg-amber-600 transition-colors"
                >
                  Read Memory →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
