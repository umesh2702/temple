'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getVisitsService } from '@/lib/services/journeyService';
import { TempleVisitWithDetails } from '@/types';
import { PhotoLightbox } from '@/components/memories/PhotoLightbox';
import { SafeImage } from '@/components/ui/SafeImage';
import {
  MapPin,
  Calendar,
  Users,
  Tag,
  ArrowLeft,
  Sparkles,
  Camera,
  Compass,
  History,
} from 'lucide-react';

export default function VisitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const visitId = params.id as string;

  const [visit, setVisit] = useState<TempleVisitWithDetails | null>(null);
  const [allVisits, setAllVisits] = useState<TempleVisitWithDetails[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    async function load() {
      if (visitId) {
        const visits = await getVisitsService();
        setAllVisits(visits);
        const found = visits.find((v) => v.id === visitId);
        if (found) setVisit(found);
      }
    }
    load();
  }, [visitId]);

  const journeyContext = useMemo(() => {
    if (!visit || allVisits.length === 0) return null;

    const sortedAsc = [...allVisits].sort(
      (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
    );

    const visitIndex = sortedAsc.findIndex((v) => v.id === visit.id);
    if (visitIndex === -1) return null;

    const visitNumber = visitIndex + 1;
    const previousVisit = visitIndex > 0 ? sortedAsc[visitIndex - 1] : null;

    let daysDiff = 0;
    if (previousVisit) {
      const currentDate = new Date(visit.visitDate).getTime();
      const prevDate = new Date(previousVisit.visitDate).getTime();
      daysDiff = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
    }

    return {
      visitNumber,
      totalVisitsCount: sortedAsc.length,
      previousVisit,
      daysDiff: Math.max(0, daysDiff),
    };
  }, [visit, allVisits]);

  const otherVisitsToSameTemple = useMemo(() => {
    if (!visit) return [];
    return allVisits.filter((v) => v.templeId === visit.templeId && v.id !== visit.id);
  }, [visit, allVisits]);

  if (!visit) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Compass className="w-12 h-12 text-amber-600 animate-spin mx-auto" />
        <h2 className="font-serif font-bold text-2xl">Loading Memory...</h2>
      </div>
    );
  }

  const allPhotos = visit.photos.length > 0 ? visit.photos : [visit.temple.imageUrl];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Journey
        </button>

        <Link
          href={`/temple/${visit.templeId}`}
          className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
        >
          View Temple Overview →
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-2xl border border-amber-500/30">
        <div className="relative h-72 sm:h-96 w-full overflow-hidden">
          <SafeImage
            src={allPhotos[0]}
            alt={visit.temple.name}
            category={visit.temple.category}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>

          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30">
            {visit.temple.category}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-3 relative -mt-20 z-10">
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-100 leading-tight">
            {visit.temple.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-300 font-medium">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <MapPin className="w-4 h-4" /> {visit.temple.city}, {visit.temple.state}
            </span>
            <span className="text-stone-500">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" /> {visit.visitDate}
            </span>
            <span className="text-stone-500">•</span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5" /> Visited with {visit.companions}
            </span>
          </div>
        </div>
      </div>

      {/* JOURNEY CONTEXT CARD */}
      {journeyContext && (
        <section className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-yellow-500/10 border border-amber-400/30 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-serif font-bold text-base">
            <Sparkles className="w-4 h-4 text-amber-600" /> Journey Context
          </div>
          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
            This was your <strong className="text-amber-700 dark:text-amber-400 font-bold">#{journeyContext.visitNumber} temple visit</strong> on your sacred journey.
            {journeyContext.previousVisit ? (
              <>
                {' '}You had previously visited{' '}
                <Link
                  href={`/visit/${journeyContext.previousVisit.id}`}
                  className="font-bold text-amber-600 dark:text-amber-300 hover:underline"
                >
                  {journeyContext.previousVisit.temple.name}
                </Link>{' '}
                {journeyContext.daysDiff} days earlier on {journeyContext.previousVisit.visitDate}.
              </>
            ) : (
              <> This was where your recorded spiritual travel journey officially began!</>
            )}
          </p>
        </section>
      )}

      {/* MEMORY TEXT NARRATIVE */}
      <section className="rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-amber-100 flex items-center gap-2">
          <span>Personal Reflection</span>
        </h3>

        <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border-l-4 border-amber-500 text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed italic">
          &ldquo;{visit.memory}&rdquo;
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-stone-500 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-amber-600" /> Tags:
          </span>
          {visit.tags.map((t, idx) => (
            <span
              key={idx}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100/70 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/40"
            >
              #{t}
            </span>
          ))}
        </div>
      </section>

      {/* PHOTO GALLERY */}
      {allPhotos.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-amber-100 flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-600" /> Photo Memories ({allPhotos.length})
            </h3>
            <span className="text-xs text-stone-500">Tap photo for full view</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {allPhotos.map((photoUrl, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActivePhotoIdx(idx);
                  setLightboxOpen(true);
                }}
                className="relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-stone-200 dark:border-stone-800"
              >
                <SafeImage
                  src={photoUrl}
                  alt={`Photo ${idx + 1}`}
                  category={visit.temple.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/30 transition-colors flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* OTHER VISITS TO THIS TEMPLE */}
      {otherVisitsToSameTemple.length > 0 && (
        <section className="rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-serif font-bold text-lg text-stone-900 dark:text-amber-100">
            <History className="w-5 h-5 text-amber-600" />
            <span>Other Visits to {visit.temple.name}</span>
          </div>
          <p className="text-xs text-stone-500">
            You have visited this temple {otherVisitsToSameTemple.length + 1} times in total!
          </p>

          <div className="space-y-2 pt-2">
            {otherVisitsToSameTemple.map((otherV) => (
              <Link
                key={otherV.id}
                href={`/visit/${otherV.id}`}
                className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-200 transition-colors"
              >
                <span>Visited on {otherV.visitDate} with {otherV.companions}</span>
                <span className="text-amber-600 dark:text-amber-400">View Memory →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {lightboxOpen && (
        <PhotoLightbox
          photos={allPhotos}
          initialIndex={activePhotoIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}

    </div>
  );
}
