'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, MapPin, BookOpen, BarChart3, Plus, Bell, User, Sparkles, LogIn, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AuthModal } from '@/components/auth/AuthModal';

export const Navbar = () => {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const navLinks = [
    { href: '/', label: 'Home', icon: Compass },
    { href: '/map', label: 'My Journey Map', icon: MapPin },
    { href: '/memories', label: 'Memories', icon: BookOpen },
    { href: '/stats', label: 'Stats', icon: BarChart3 },
  ];

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Umesh';

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-amber-50/80 dark:bg-slate-950/80 border-b border-amber-200/50 dark:border-amber-900/30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-serif">🛕</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-bold tracking-tight text-amber-950 dark:text-amber-100">
                  Temple Journey
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              </div>
              <p className="text-[10px] uppercase tracking-widest text-amber-700/80 dark:text-amber-400 font-medium">
                Sacred Map & Journal
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 shadow-sm border border-amber-300/40 dark:border-amber-800/40'
                      : 'text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Notifications Button */}
            <Link
              href="/profile"
              className="relative p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-slate-900/60 transition-colors"
              title="Notifications & Profile"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Auth Button or User Profile Avatar */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-amber-100/50 dark:bg-slate-900/50 border border-amber-200 dark:border-amber-900/40 hover:border-amber-400 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-white font-bold text-xs flex items-center justify-center">
                    {userName[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-200 truncate max-w-[100px]">
                    {userName}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full text-stone-500 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold hover:bg-amber-100/60 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Primary CTA: Add Visit Button */}
            <Link
              href="/add-visit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white text-sm font-semibold shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Visit</span>
            </Link>
          </div>

        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
