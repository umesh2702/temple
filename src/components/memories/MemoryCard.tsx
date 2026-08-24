'use client';

import React from 'react';
import Link from 'next/link';
import { TempleVisitWithDetails } from '@/types';
import { MapPin, Calendar, Users, ChevronRight, Camera } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

interface MemoryCardProps {
  visit: TempleVisitWithDetails;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ visit }) => {
  const primaryPhoto = visit.photos[0] || visit.temple.imageUrl;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">
      
      {/* Image Container */}
      <div className="relative sm:w-2/5 h-48 sm:h-auto overflow-hidden shrink-0">
        <SafeImage
          src={primaryPhoto}
          alt={visit.temple.name}
          category={visit.temple.category}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent sm:hidden"></div>
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold tracking-wide border border-amber-500/30">
          {visit.temple.category}
        </div>

        {visit.photos.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-stone-900/80 text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-sm">
            <Camera className="w-3 h-3" /> +{visit.photos.length - 1}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 sm:w-3/5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
              <Calendar className="w-3.5 h-3.5" /> {visit.visitDate}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-semibold text-[11px]">
              <Users className="w-3 h-3 text-amber-600" /> {visit.companions}
            </span>
          </div>

          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-amber-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
            {visit.temple.name}
          </h3>

          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{visit.temple.city}, {visit.temple.state}</span>
          </p>

          <p className="text-xs text-stone-600 dark:text-stone-300 italic mt-3 line-clamp-2 leading-relaxed">
            &ldquo;{visit.memory}&rdquo;
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {visit.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100/60 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/30"
              >
                #{tag}
              </span>
            ))}
          </div>

          <Link
            href={`/visit/${visit.id}`}
            className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <span>Read Memory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};
