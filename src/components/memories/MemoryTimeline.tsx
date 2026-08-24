'use client';

import React, { useState, useMemo } from 'react';
import { TempleVisitWithDetails, CompanionType } from '@/types';
import { MemoryCard } from './MemoryCard';
import { Search, Filter, Calendar, MapPin, Sparkles, BookOpen } from 'lucide-react';

interface MemoryTimelineProps {
  visits: TempleVisitWithDetails[];
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ visits }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [companionFilter, setCompanionFilter] = useState<string>('ALL');

  // Extract unique states from visits
  const uniqueStates = useMemo(() => {
    const states = new Set(visits.map((v) => v.temple.state));
    return Array.from(states).sort();
  }, [visits]);

  // Filter visits
  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const matchesSearch =
        v.temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.temple.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.memory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesState = stateFilter === 'ALL' || v.temple.state === stateFilter;
      const matchesCompanion = companionFilter === 'ALL' || v.companions === companionFilter;

      return matchesSearch && matchesState && matchesCompanion;
    });
  }, [visits, searchTerm, stateFilter, companionFilter]);

  // Group visits by Year -> Month
  const groupedVisits = useMemo(() => {
    const yearsMap = new Map<number, TempleVisitWithDetails[]>();
    filteredVisits.forEach((v) => {
      const year = new Date(v.visitDate).getFullYear();
      const existing = yearsMap.get(year) || [];
      yearsMap.set(year, [...existing, v]);
    });

    const sortedYears = Array.from(yearsMap.keys()).sort((a, b) => b - a);

    return sortedYears.map((year) => ({
      year,
      visits: yearsMap.get(year) || [],
    }));
  }, [filteredVisits]);

  return (
    <div className="space-y-8">
      
      {/* Search & Filter Control Bar */}
      <div className="rounded-2xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-4 sm:p-5 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search temple name, city, memory or #tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="ALL">All States ({uniqueStates.length})</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* Companion Filter Dropdown */}
            <select
              value={companionFilter}
              onChange={(e) => setCompanionFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="ALL">All Companions</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="Alone">Alone (Solo)</option>
              <option value="Partner">Partner</option>
              <option value="Other">Other</option>
            </select>
          </div>

        </div>

        {/* Results summary count */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
          <span>Showing {filteredVisits.length} of {visits.length} spiritual memories</span>
          {(searchTerm || stateFilter !== 'ALL' || companionFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStateFilter('ALL');
                setCompanionFilter('ALL');
              }}
              className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* Timeline Section */}
      {groupedVisits.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-amber-50/50 dark:bg-stone-900/50 border border-dashed border-amber-300 dark:border-amber-900 p-8 space-y-3">
          <BookOpen className="w-12 h-12 text-amber-500 mx-auto opacity-60" />
          <h4 className="font-serif font-bold text-lg text-stone-800 dark:text-amber-200">
            No memories match your search
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keywords or state filters to view your recorded temple journeys.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-12 border-l-2 border-amber-300/60 dark:border-amber-900/50">
          
          {groupedVisits.map(({ year, visits: yearVisits }) => (
            <div key={year} className="relative space-y-6">
              
              {/* Year Marker Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-0 flex items-center gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-500 border-4 border-stone-100 dark:border-stone-950 text-stone-950 flex items-center justify-center font-bold text-xs shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                </div>
                <span className="font-serif text-2xl font-extrabold text-stone-900 dark:text-amber-100 bg-amber-100/80 dark:bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-300/50 dark:border-amber-800/40">
                  {year}
                </span>
              </div>

              {/* Year Visits List */}
              <div className="pt-10 space-y-6">
                {yearVisits.map((visit) => (
                  <div key={visit.id} className="relative group">
                    {/* Small timeline dot */}
                    <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-3 h-3 rounded-full bg-amber-400 border-2 border-white dark:border-stone-950 group-hover:scale-125 transition-transform"></div>
                    <MemoryCard visit={visit} />
                  </div>
                ))}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
};
