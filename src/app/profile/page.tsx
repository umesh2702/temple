'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getUserProfile,
  getNotifications,
  markNotificationRead,
  resetToDemoData,
} from '@/lib/storage/journeyStorage';
import { UserProfile, Notification } from '@/types';
import { User, Bell, RefreshCw, CheckCircle2, MapPin, Calendar, Sparkles, LogOut, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { AuthModal } from '@/components/auth/AuthModal';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [resetDoneMsg, setResetDoneMsg] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setNotifications(getNotifications());

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setSupabaseUser(data.user);
        setProfile({
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Umesh',
          email: data.user.email || '',
          avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
          homeState: 'Andhra Pradesh',
          joinedDate: data.user.created_at || '2024-01-10',
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        setProfile({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Umesh',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
          homeState: 'Andhra Pradesh',
          joinedDate: session.user.created_at || '2024-01-10',
        });
      } else {
        setSupabaseUser(null);
        setProfile(getUserProfile());
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSupabaseUser(null);
  };

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
    setNotifications(getNotifications());
  };

  const handleResetData = () => {
    if (confirm('Reset to initial demo data with sample temple visits?')) {
      resetToDemoData();
      setNotifications(getNotifications());
      setResetDoneMsg(true);
      setTimeout(() => setResetDoneMsg(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold mb-1 border border-amber-300/40">
            <Sparkles className="w-3.5 h-3.5" /> Pilgrim Profile
          </div>
          <h1 className="font-serif text-3xl font-extrabold text-stone-900 dark:text-amber-100">
            Profile & Notifications
          </h1>
        </div>

        {!supabaseUser && (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow hover:bg-amber-700 transition-all"
          >
            <LogIn className="w-4 h-4" /> Sign In / Create Account
          </button>
        )}
      </div>

      {/* User Card */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 text-white p-6 sm:p-8 shadow-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 font-serif font-extrabold text-3xl flex items-center justify-center shadow-xl shadow-amber-500/30 shrink-0">
          {profile.name[0]}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <h2 className="font-serif text-2xl font-bold text-amber-100">{profile.name}</h2>
          <p className="text-xs text-stone-300">{profile.email || 'guest@templejourney.app'}</p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-amber-400 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Home State: {profile.homeState}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {supabaseUser ? 'Authenticated Account' : 'Guest Traveler'}
            </span>
          </div>
        </div>

        {supabaseUser && (
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        )}
      </div>

      {/* Notifications Inbox */}
      <section className="rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-amber-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" /> Notifications & Check-Ins
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            {notifications.filter((n) => !n.isRead).length} unread
          </span>
        </div>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                notif.isRead
                  ? 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                  : 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300/50 dark:border-amber-800/40 text-stone-900 dark:text-amber-100 font-medium'
              }`}
            >
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-sm">{notif.title}</h4>
                <p className="text-xs">{notif.message}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {notif.actionUrl && (
                  <Link
                    href={notif.actionUrl}
                    onClick={() => handleMarkRead(notif.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                  >
                    Open Action
                  </Link>
                )}
                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkRead(notif.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs"
                    title="Mark as read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Data Manager */}
      <section className="rounded-3xl bg-stone-100 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-base text-stone-900 dark:text-amber-100">
            Demo Data & Storage Manager
          </h4>
          <p className="text-xs text-stone-500">
            Load or reset sample demo temple visits anytime for local testing.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-600 text-white text-xs font-bold hover:opacity-90 shadow"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Load Demo Data</span>
        </button>
      </section>

      {resetDoneMsg && (
        <div className="p-4 rounded-xl bg-green-100 text-green-800 text-xs font-bold text-center">
          ✅ Demo data successfully restored!
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

    </div>
  );
}
