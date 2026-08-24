'use client';

import React from 'react';
import { JourneyStats } from '@/types';
import { MapPin, Calendar, Camera, Sparkles, LucideIcon } from 'lucide-react';

interface StatsSummaryProps {
  stats: JourneyStats;
}

interface StatItem {
  label: string;
  value: number;
  emoji?: string;
  IconComponent?: LucideIcon;
  textColor: string;
  subtext: string;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  const items: StatItem[] = [
    {
      label: 'Temples Visited',
      value: stats.totalVisits,
      emoji: '🛕',
      textColor: 'text-amber-600 dark:text-amber-400',
      subtext: `${stats.uniqueTemplesCount} unique shrines`,
    },
    {
      label: 'States Explored',
      value: stats.statesExploredCount,
      IconComponent: MapPin,
      textColor: 'text-orange-600 dark:text-orange-400',
      subtext: stats.mostVisitedState ? `Top: ${stats.mostVisitedState.name}` : 'Across India',
    },
    {
      label: 'Memories Recorded',
      value: stats.memoriesCount,
      IconComponent: Camera,
      textColor: 'text-yellow-600 dark:text-yellow-400',
      subtext: 'Photos & reflections',
    },
    {
      label: 'Years of Journey',
      value: stats.yearsOfJourney,
      IconComponent: Calendar,
      textColor: 'text-stone-700 dark:text-amber-200',
      subtext: 'Spiritual footstep',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item, idx) => {
        const Icon = item.IconComponent;

        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-5 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 flex items-center justify-center text-lg font-serif">
                {item.emoji ? (
                  <span>{item.emoji}</span>
                ) : (
                  Icon && <Icon className={`w-5 h-5 ${item.textColor}`} />
                )}
              </div>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <p className="font-serif text-3xl font-extrabold text-stone-900 dark:text-amber-100">
              {item.value}
            </p>
            <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 mt-0.5">
              {item.label}
            </p>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">
              {item.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
