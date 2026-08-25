'use client';

import React from 'react';
import { Calendar, Camera, Sparkles, History, LucideIcon } from 'lucide-react';

interface TempleJourneySummaryProps {
  totalVisits: number;
  totalMemories: number;
  firstVisitDate: string | null;
  latestVisitDate: string | null;
  yearsOfJourney: number;
}

interface SummaryItem {
  label: string;
  value: number | string;
  subtext: string;
  emoji?: string;
  IconComponent?: LucideIcon;
  isDate?: boolean;
}

export const TempleJourneySummary: React.FC<TempleJourneySummaryProps> = ({
  totalVisits,
  totalMemories,
  firstVisitDate,
  latestVisitDate,
  yearsOfJourney,
}) => {
  const items: SummaryItem[] = [
    {
      label: 'Total Visits',
      value: totalVisits,
      subtext: totalVisits === 1 ? '1 Darshan' : `${totalVisits} Darshans`,
      emoji: '🛕',
    },
    {
      label: 'Memories Recorded',
      value: totalMemories,
      subtext: 'Photos & reflections',
      IconComponent: Camera,
    },
    {
      label: 'First Visit',
      value: firstVisitDate || 'N/A',
      subtext: 'Journey started',
      IconComponent: Calendar,
      isDate: true,
    },
    {
      label: 'Latest Visit',
      value: latestVisitDate || 'N/A',
      subtext: 'Most recent Darshan',
      IconComponent: History,
      isDate: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => {
        const IconComponent = item.IconComponent;

        return (
          <div
            key={idx}
            className="rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-5 shadow-sm space-y-1 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 flex items-center justify-center text-base font-serif">
                {item.emoji ? (
                  <span>{item.emoji}</span>
                ) : (
                  IconComponent && <IconComponent className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-60" />
            </div>

            <p className={`font-serif font-extrabold text-stone-900 dark:text-amber-100 ${item.isDate ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'}`}>
              {item.value}
            </p>

            <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
              {item.label}
            </p>

            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80">
              {item.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
