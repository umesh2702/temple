'use client';

import React from 'react';
import Link from 'next/link';
import { TempleVisitWithDetails } from '@/types';
import { Sparkles, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface OnThisDayCardProps {
  data: {
    visit: TempleVisitWithDetails;
    yearsAgo: number;
  } | null;
}

export const OnThisDayCard: React.FC<OnThisDayCardProps> = ({ data }) => {
  if (!data) return null;

  const { visit, yearsAgo } = data;
  const targetUrl = `/temples/${visit.templeId}#visit-${visit.id}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900 via-stone-900 to-amber-950 text-white p-6 sm:p-7 shadow-xl border border-amber-500/30">
      
      {/* Background Decorative Temple Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> On this day, {yearsAgo} {yearsAgo === 1 ? 'year' : 'years'} ago 🛕
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-amber-100">
            {visit.temple.name}
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{visit.temple.city}, {visit.temple.state}</span>
            <span className="text-stone-500">•</span>
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{visit.visitDate}</span>
          </p>

          <p className="text-xs sm:text-sm text-stone-300 italic line-clamp-2 pt-1 border-t border-amber-900/60">
            &ldquo;{visit.memory}&rdquo;
          </p>
        </div>

        {/* Action Button */}
        <Link
          href={targetUrl}
          className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
        >
          <span>Relive this memory</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>
    </div>
  );
};
