'use client';

import React from 'react';
import { Compass, Flame, ShieldCheck, Sparkles } from 'lucide-react';

interface CircuitProgressProps {
  circuits: {
    jyotirlingas: { visited: number; total: number };
    divyaDesams: { visited: number; total: number };
    shaktiPeethas: { visited: number; total: number };
  };
}

export const CircuitProgress: React.FC<CircuitProgressProps> = ({ circuits }) => {
  const items = [
    {
      title: '12 Jyotirlingas',
      subtitle: 'Holy Shiva Shrines',
      visited: circuits.jyotirlingas.visited,
      total: circuits.jyotirlingas.total,
      icon: Flame,
      color: 'from-amber-600 to-yellow-600',
      bgLight: 'bg-amber-100/60 dark:bg-amber-950/60',
      borderColor: 'border-amber-300/40 dark:border-amber-800/40',
    },
    {
      title: '108 Divya Desams',
      subtitle: 'Sacred Vishnu Temples',
      visited: circuits.divyaDesams.visited,
      total: circuits.divyaDesams.total,
      icon: Compass,
      color: 'from-amber-500 to-orange-600',
      bgLight: 'bg-orange-100/60 dark:bg-orange-950/60',
      borderColor: 'border-orange-300/40 dark:border-orange-800/40',
    },
    {
      title: '51 Shakti Peethas',
      subtitle: 'Devi Energy Seats',
      visited: circuits.shaktiPeethas.visited,
      total: circuits.shaktiPeethas.total,
      icon: ShieldCheck,
      color: 'from-red-500 to-amber-600',
      bgLight: 'bg-red-100/60 dark:bg-red-950/60',
      borderColor: 'border-red-300/40 dark:border-red-800/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        const percentage = Math.min(100, Math.round((item.visited / item.total) * 100));

        return (
          <div
            key={idx}
            className={`rounded-2xl p-5 border ${item.borderColor} ${item.bgLight} backdrop-blur-sm relative overflow-hidden transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900 dark:text-amber-100 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">{item.subtitle}</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 bg-white/80 dark:bg-stone-900/80 px-2.5 py-1 rounded-full border border-amber-300/30">
                {item.visited} / {item.total}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-stone-200 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000 rounded-full`}
                style={{ width: `${Math.max(5, percentage)}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-2 text-[10px] text-stone-500 dark:text-stone-400 font-medium">
              <span>{percentage}% Completed</span>
              <span>{item.total - item.visited} Remaining</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
