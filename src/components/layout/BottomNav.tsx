'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Plus, BookOpen, User } from 'lucide-react';

export const BottomNav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/map', label: 'Map', icon: MapPin },
    { href: '/add-visit', label: 'Add Visit', icon: Plus, isProminent: true },
    { href: '/memories', label: 'Memories', icon: BookOpen },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-900/95 backdrop-blur-lg border-t border-amber-900/40 text-stone-300 px-3 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isProminent) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-5 flex flex-col items-center group"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-lg shadow-amber-500/40 border-4 border-stone-900 group-active:scale-95 transition-transform">
                  <Plus className="w-7 h-7 stroke-[3]" />
                </div>
                <span className="text-[10px] font-bold text-amber-400 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl text-[11px] font-medium transition-all ${
                isActive
                  ? 'text-amber-400 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400 scale-110' : ''}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
