'use client';

import React from 'react';
import Link from 'next/link';
import { Temple } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';
import { MapPin, Calendar, Plus, Sparkles, Compass } from 'lucide-react';

interface TempleJourneyHeroProps {
  temple: Temple;
  totalVisits: number;
  firstVisitDate: string | null;
  latestVisitDate: string | null;
}

export const TempleJourneyHero: React.FC<TempleJourneyHeroProps> = ({
  temple,
  totalVisits,
  firstVisitDate,
  latestVisitDate,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-white shadow-2xl border border-amber-500/30">
      
      {/* Background Cover Image */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden">
        <SafeImage
          src={temple.imageUrl}
          alt={temple.name}
          category={temple.category}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent"></div>

        {/* Category Pill */}
        <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30">
          {temple.category}
        </div>
      </div>

      {/* Hero Content Overlay */}
      <div className="p-6 sm:p-8 space-y-4 relative -mt-24 z-10">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Your Sacred Journey Here
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-100 leading-tight">
          {temple.name}
        </h1>

        <p className="text-xs sm:text-sm text-stone-300 flex items-center gap-2 font-medium">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{temple.city}, {temple.state}, {temple.country}</span>
        </p>

        {/* Journey Quick Highlights */}
        <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-stone-200">
          
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold flex items-center gap-1.5">
            <span>🛕 {totalVisits} {totalVisits === 1 ? 'Visit' : 'Visits'}</span>
          </div>

          {firstVisitDate && (
            <div className="flex items-center gap-1.5 text-stone-300 font-medium">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>First Visit: <strong className="text-white">{firstVisitDate}</strong></span>
            </div>
          )}

          {latestVisitDate && (
            <div className="flex items-center gap-1.5 text-stone-300 font-medium">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Latest Visit: <strong className="text-white">{latestVisitDate}</strong></span>
            </div>
          )}

        </div>

        {/* CTA Button */}
        <div className="pt-3">
          <Link
            href={`/add-visit?templeId=${temple.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/30 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Visit to this Temple</span>
          </Link>
        </div>

      </div>

    </div>
  );
};
