'use client';

import React, { useState, useEffect } from 'react';
import { TempleVisitWithDetails } from '@/types';
import { SafeImage } from '@/components/ui/SafeImage';
import { PhotoLightbox } from '@/components/memories/PhotoLightbox';
import { Calendar, Users, Tag, Camera, Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';

interface TempleJourneyTimelineProps {
  templeId: string;
  templeName: string;
  visits: TempleVisitWithDetails[];
}

export const TempleJourneyTimeline: React.FC<TempleJourneyTimelineProps> = ({
  templeId,
  templeName,
  visits,
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState<string[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // Scroll to anchor on load if hash exists
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-amber-500', 'ring-offset-2');
          setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500', 'ring-offset-2'), 3000);
        }, 300);
      }
    }
  }, []);

  const openPhotosLightbox = (photos: string[], index: number) => {
    setLightboxPhotos(photos);
    setLightboxIdx(index);
    setLightboxOpen(true);
  };

  if (visits.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl bg-amber-50/50 dark:bg-stone-900/50 border border-dashed border-amber-300 dark:border-amber-900 p-8 space-y-3">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto text-xl font-serif">
          🛕
        </div>
        <h4 className="font-serif font-bold text-xl text-stone-800 dark:text-amber-200">
          No visits recorded for {templeName} yet
        </h4>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Add your first visit to start building your personal sacred journey for this temple.
        </p>
        <Link
          href={`/add-visit?templeId=${templeId}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow hover:bg-amber-700 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Visit Here
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-amber-100">
            Journey Timeline
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            All your Recorded Darshans at {templeName} (Newest First)
          </p>
        </div>
        <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/70 px-3 py-1 rounded-full border border-amber-300/40">
          {visits.length} {visits.length === 1 ? 'Visit Record' : 'Visit Records'}
        </span>
      </div>

      <div className="relative pl-6 sm:pl-10 space-y-8 border-l-2 border-amber-300/60 dark:border-amber-900/50">
        {visits.map((visit) => {
          const visitPhotos = visit.photos.length > 0 ? visit.photos : [visit.temple.imageUrl];

          return (
            <div
              key={visit.id}
              id={`visit-${visit.id}`}
              className="relative group rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Timeline marker node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-4 h-4 rounded-full bg-amber-500 border-4 border-stone-100 dark:border-stone-950 shadow"></div>

              {/* Visit Date Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="font-serif font-bold text-lg text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    {visit.visitDate}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                    <Users className="w-3.5 h-3.5" /> {visit.companions}
                  </span>
                </div>
              </div>

              {/* Memory / Reflection Text */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border-l-4 border-amber-500 text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed italic">
                &ldquo;{visit.memory}&rdquo;
              </div>

              {/* Photo Gallery */}
              {visitPhotos.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1 font-semibold">
                      <Camera className="w-3.5 h-3.5 text-amber-600" /> Photos ({visitPhotos.length})
                    </span>
                    <span>Tap to expand</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {visitPhotos.map((photoUrl, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => openPhotosLightbox(visitPhotos, pIdx)}
                        className="relative h-28 rounded-xl overflow-hidden cursor-pointer group/img border border-stone-200 dark:border-stone-800"
                      >
                        <SafeImage
                          src={photoUrl}
                          alt={`Visit photo ${pIdx + 1}`}
                          category={visit.temple.category}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {visit.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100/60 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/30"
                  >
                    #{t}
                  </span>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {lightboxOpen && (
        <PhotoLightbox
          photos={lightboxPhotos}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};
