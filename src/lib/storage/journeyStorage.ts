import {
  Temple,
  TempleVisit,
  TempleVisitWithDetails,
  Notification,
  UserProfile,
  JourneyStats,
} from '@/types';
import { SEEDED_TEMPLES } from '../data/seededTemples';
import { SEEDED_VISITS, SEEDED_NOTIFICATIONS, DEMO_USER } from '../data/seededVisits';

const STORAGE_KEYS = {
  TEMPLES: 'temple_journey_temples_v1',
  VISITS: 'temple_journey_visits_v1',
  NOTIFICATIONS: 'temple_journey_notifs_v1',
  PROFILE: 'temple_journey_profile_v1',
};

// SSR safety check
const isClient = typeof window !== 'undefined';

export function initializeStorageIfNeeded(): void {
  if (!isClient) return;

  if (!localStorage.getItem(STORAGE_KEYS.TEMPLES)) {
    localStorage.setItem(STORAGE_KEYS.TEMPLES, JSON.stringify(SEEDED_TEMPLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VISITS)) {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(SEEDED_VISITS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEEDED_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEMO_USER));
  }
}

export function resetToDemoData(): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEYS.TEMPLES, JSON.stringify(SEEDED_TEMPLES));
  localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(SEEDED_VISITS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEEDED_NOTIFICATIONS));
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEMO_USER));
}

// --- TEMPLES ---
export function getTemples(): Temple[] {
  if (!isClient) return SEEDED_TEMPLES;
  initializeStorageIfNeeded();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLES);
    return raw ? JSON.parse(raw) : SEEDED_TEMPLES;
  } catch (e) {
    console.error('Failed to parse temples from localStorage', e);
    return SEEDED_TEMPLES;
  }
}

export function getTempleById(id: string): Temple | undefined {
  const temples = getTemples();
  return temples.find((t) => t.id === id);
}

export function addCustomTemple(temple: Omit<Temple, 'id'>): Temple {
  const temples = getTemples();
  const newTemple: Temple = {
    ...temple,
    id: `custom-temple-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newTemple, ...temples];
  if (isClient) {
    localStorage.setItem(STORAGE_KEYS.TEMPLES, JSON.stringify(updated));
  }
  return newTemple;
}

// --- VISITS ---
export function getVisits(): TempleVisitWithDetails[] {
  if (!isClient) {
    const templeMap = new Map(SEEDED_TEMPLES.map((t) => [t.id, t]));
    return SEEDED_VISITS.map((v) => ({
      ...v,
      temple: templeMap.get(v.templeId) || SEEDED_TEMPLES[0],
    }));
  }

  initializeStorageIfNeeded();
  try {
    const rawVisits = localStorage.getItem(STORAGE_KEYS.VISITS);
    const visits: TempleVisit[] = rawVisits ? JSON.parse(rawVisits) : SEEDED_VISITS;
    const temples = getTemples();
    const templeMap = new Map(temples.map((t) => [t.id, t]));

    return visits
      .map((v) => {
        const temple = templeMap.get(v.templeId);
        if (!temple) return null;
        return {
          ...v,
          temple,
        };
      })
      .filter((v): v is TempleVisitWithDetails => v !== null)
      .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
  } catch (e) {
    console.error('Failed to get visits', e);
    return [];
  }
}

export function getVisitById(id: string): TempleVisitWithDetails | undefined {
  const visits = getVisits();
  return visits.find((v) => v.id === id);
}

export function getVisitsForTemple(templeId: string): TempleVisitWithDetails[] {
  return getVisits().filter((v) => v.templeId === templeId);
}

export function addVisit(visitData: Omit<TempleVisit, 'id' | 'createdAt' | 'updatedAt'>): TempleVisitWithDetails {
  const rawVisits: TempleVisit[] = isClient
    ? JSON.parse(localStorage.getItem(STORAGE_KEYS.VISITS) || JSON.stringify(SEEDED_VISITS))
    : SEEDED_VISITS;

  const newVisit: TempleVisit = {
    ...visitData,
    id: `visit-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated = [newVisit, ...rawVisits];
  if (isClient) {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(updated));
  }

  const temple = getTempleById(visitData.templeId) || SEEDED_TEMPLES[0];
  return {
    ...newVisit,
    temple,
  };
}

export function deleteVisit(visitId: string): void {
  if (!isClient) return;
  const rawVisits: TempleVisit[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.VISITS) || JSON.stringify(SEEDED_VISITS)
  );
  const filtered = rawVisits.filter((v) => v.id !== visitId);
  localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(filtered));
}

// --- NOTIFICATIONS ---
export function getNotifications(): Notification[] {
  if (!isClient) return SEEDED_NOTIFICATIONS;
  initializeStorageIfNeeded();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : SEEDED_NOTIFICATIONS;
  } catch {
    return SEEDED_NOTIFICATIONS;
  }
}

export function markNotificationRead(id: string): void {
  if (!isClient) return;
  const notifs = getNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
}

// --- PROFILE ---
export function getUserProfile(): UserProfile {
  if (!isClient) return DEMO_USER;
  initializeStorageIfNeeded();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEMO_USER;
  } catch {
    return DEMO_USER;
  }
}

// --- STATS & ON THIS DAY LOGIC ---
export function calculateJourneyStats(): JourneyStats {
  const visits = getVisits();
  const totalVisits = visits.length;

  const uniqueTemples = new Set(visits.map((v) => v.templeId));
  const uniqueStates = new Set(visits.map((v) => v.temple.state));

  // State breakdown
  const stateCounts: Record<string, number> = {};
  visits.forEach((v) => {
    const st = v.temple.state;
    stateCounts[st] = (stateCounts[st] || 0) + 1;
  });

  let mostVisitedState: { name: string; count: number } | null = null;
  Object.entries(stateCounts).forEach(([name, count]) => {
    if (!mostVisitedState || count > mostVisitedState.count) {
      mostVisitedState = { name, count };
    }
  });

  // Timeline years calculation
  const dates = visits.map((v) => new Date(v.visitDate).getFullYear());
  const minYear = dates.length ? Math.min(...dates) : new Date().getFullYear();
  const maxYear = new Date().getFullYear();
  const yearsOfJourney = Math.max(1, maxYear - minYear + 1);

  // Sorted visits ascending
  const sortedAsc = [...visits].sort(
    (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );

  const firstTempleVisit = sortedAsc.length > 0 ? sortedAsc[0] : null;
  const latestTempleVisit = visits.length > 0 ? visits[0] : null;

  // Circuit tracking
  const visitedCategories = visits.map((v) => v.temple.category);
  const jyotirlingaVisitedCount = new Set(
    visits.filter((v) => v.temple.category === 'Jyotirlingam').map((v) => v.templeId)
  ).size;
  const divyaDesamVisitedCount = new Set(
    visits.filter((v) => v.temple.category === 'Divya Desam').map((v) => v.templeId)
  ).size;
  const shaktiPeethaVisitedCount = new Set(
    visits.filter((v) => v.temple.category === 'Shakti Peetha').map((v) => v.templeId)
  ).size;

  return {
    totalVisits,
    uniqueTemplesCount: uniqueTemples.size,
    statesExploredCount: uniqueStates.size,
    memoriesCount: totalVisits,
    yearsOfJourney,
    mostVisitedState,
    firstTempleVisit,
    latestTempleVisit,
    circuits: {
      jyotirlingas: { visited: jyotirlingaVisitedCount, total: 12 },
      divyaDesams: { visited: divyaDesamVisitedCount, total: 108 },
      shaktiPeethas: { visited: shaktiPeethaVisitedCount, total: 51 },
    },
  };
}

export function getOnThisDayMemory(): { visit: TempleVisitWithDetails; yearsAgo: number } | null {
  const visits = getVisits();
  if (visits.length === 0) return null;

  const today = new Date();
  const currentMonth = today.getMonth(); // 0-indexed
  const currentDate = today.getDate();

  for (const v of visits) {
    const vDate = new Date(v.visitDate);
    if (vDate.getMonth() === currentMonth && vDate.getDate() === currentDate) {
      const yearsAgo = today.getFullYear() - vDate.getFullYear();
      if (yearsAgo > 0) {
        return { visit: v, yearsAgo };
      }
    }
  }

  // Fallback: If no exact date match today, return the closest historical visit on same day of month or high emotional visit for demo preview!
  const matchingMonthVisit = visits.find((v) => {
    const d = new Date(v.visitDate);
    return today.getFullYear() - d.getFullYear() > 0;
  });

  if (matchingMonthVisit) {
    const yAgo = today.getFullYear() - new Date(matchingMonthVisit.visitDate).getFullYear();
    return { visit: matchingMonthVisit, yearsAgo: Math.max(1, yAgo) };
  }

  return null;
}
