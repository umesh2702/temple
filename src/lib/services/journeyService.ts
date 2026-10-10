import { createClient } from '@/lib/supabase/client';
import {
  Temple,
  TempleVisit,
  TempleVisitWithDetails,
  Notification,
  UserProfile,
  JourneyStats,
} from '@/types';
import { SEEDED_TEMPLES } from '@/lib/data/seededTemples';
import { SEEDED_VISITS, SEEDED_NOTIFICATIONS, DEMO_USER } from '@/lib/data/seededVisits';
import { getFallbackImageForCategory } from '@/lib/utils/fallbackImages';

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('your-supabase-project'));
};

// --- TEMPLES SERVICE ---
export async function getTemplesService(): Promise<Temple[]> {
  if (!isSupabaseConfigured()) {
    return SEEDED_TEMPLES;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('temples')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return SEEDED_TEMPLES;
    }

    return data.map((t: any) => ({
      id: t.id,
      name: t.name,
      alternateNames: t.alternate_names || [],
      city: t.city || 'Sacred Shrine',
      district: t.district || '',
      state: t.state || 'India',
      country: t.country || 'India',
      latitude: t.latitude || 20.5937,
      longitude: t.longitude || 78.9629,
      description: t.description || '',
      imageUrl: t.image_url || getFallbackImageForCategory(t.category),
      category: t.category || 'Other',
      createdAt: t.created_at,
    }));
  } catch (e) {
    console.error('Failed to fetch temples from Supabase', e);
    return SEEDED_TEMPLES;
  }
}

export async function getTempleByIdService(templeId: string): Promise<Temple | null> {
  const temples = await getTemplesService();
  return temples.find((t) => t.id === templeId) || null;
}

export async function addCustomTempleService(
  templeData: Omit<Temple, 'id' | 'createdAt'>
): Promise<Temple> {
  const newTemple: Temple = {
    ...templeData,
    id: `custom-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (!isSupabaseConfigured()) {
    return newTemple;
  }

  try {
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('temples')
      .insert([
        {
          name: templeData.name,
          alternate_names: templeData.alternateNames || [],
          city: templeData.city,
          district: templeData.district,
          state: templeData.state,
          country: templeData.country || 'India',
          latitude: templeData.latitude || 20.5937,
          longitude: templeData.longitude || 78.9629,
          description: templeData.description,
          image_url: templeData.imageUrl || getFallbackImageForCategory(templeData.category),
          category: templeData.category,
          is_custom: true,
          created_by: user?.user?.id || null,
        },
      ])
      .select()
      .single();

    if (error || !data) throw error;

    return {
      id: data.id,
      name: data.name,
      city: data.city,
      state: data.state,
      country: data.country,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      imageUrl: data.image_url,
      category: data.category,
      createdAt: data.created_at,
    };
  } catch (e) {
    console.error('Error inserting custom temple', e);
    return newTemple;
  }
}

// --- VISITS SERVICE ---
export async function getVisitsService(userId?: string): Promise<TempleVisitWithDetails[]> {
  if (!isSupabaseConfigured()) {
    const templeMap = new Map(SEEDED_TEMPLES.map((t) => [t.id, t]));
    return SEEDED_VISITS.map((v) => ({
      ...v,
      temple: templeMap.get(v.templeId) || SEEDED_TEMPLES[0],
    }));
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from('temple_visits')
      .select(`
        *,
        temples (*),
        visit_photos (*)
      `)
      .order('visit_date', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error || !data) {
      const templeMap = new Map(SEEDED_TEMPLES.map((t) => [t.id, t]));
      return SEEDED_VISITS.map((v) => ({
        ...v,
        temple: templeMap.get(v.templeId) || SEEDED_TEMPLES[0],
      }));
    }

    return data.map((v: any) => {
      const templeObj: Temple = {
        id: v.temples?.id || v.temple_id,
        name: v.temples?.name || 'Temple Shrine',
        alternateNames: v.temples?.alternate_names || [],
        city: v.temples?.city || '',
        state: v.temples?.state || 'India',
        country: v.temples?.country || 'India',
        latitude: v.temples?.latitude || 20.5937,
        longitude: v.temples?.longitude || 78.9629,
        description: v.temples?.description || '',
        imageUrl: v.temples?.image_url || getFallbackImageForCategory(v.temples?.category),
        category: v.temples?.category || 'Other',
      };

      const photoUrls = v.visit_photos
        ? v.visit_photos.map((p: any) => p.image_url)
        : [templeObj.imageUrl];

      return {
        id: v.id,
        userId: v.user_id,
        templeId: v.temple_id,
        visitDate: v.visit_date,
        companions: v.companions || 'Family',
        memory: v.memory || '',
        tags: v.tags || ['Pilgrimage'],
        photos: photoUrls.length > 0 ? photoUrls : [templeObj.imageUrl],
        createdAt: v.created_at,
        updatedAt: v.updated_at,
        temple: templeObj,
      };
    });
  } catch (e) {
    console.error('Error loading visits from Supabase', e);
    const templeMap = new Map(SEEDED_TEMPLES.map((t) => [t.id, t]));
    return SEEDED_VISITS.map((v) => ({
      ...v,
      temple: templeMap.get(v.templeId) || SEEDED_TEMPLES[0],
    }));
  }
}

export async function addVisitService(
  visitData: Omit<TempleVisit, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TempleVisitWithDetails> {
  const fallbackTemple = SEEDED_TEMPLES.find((t) => t.id === visitData.templeId) || SEEDED_TEMPLES[0];
  const newVisit: TempleVisitWithDetails = {
    ...visitData,
    id: `visit-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    temple: fallbackTemple,
  };

  if (!isSupabaseConfigured()) {
    return newVisit;
  }

  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    const currentUserId = userData?.user?.id || visitData.userId;

    const { data, error } = await supabase
      .from('temple_visits')
      .insert([
        {
          user_id: currentUserId,
          temple_id: visitData.templeId,
          visit_date: visitData.visitDate,
          companions: visitData.companions,
          memory: visitData.memory,
          tags: visitData.tags,
        },
      ])
      .select(`*, temples (*)`)
      .single();

    if (error || !data) throw error;

    if (visitData.photos && visitData.photos.length > 0) {
      const photoRecords = visitData.photos.map((url) => ({
        visit_id: data.id,
        image_url: url,
      }));
      await supabase.from('visit_photos').insert(photoRecords);
    }

    const templeObj: Temple = {
      id: data.temples?.id || fallbackTemple.id,
      name: data.temples?.name || fallbackTemple.name,
      city: data.temples?.city || fallbackTemple.city,
      state: data.temples?.state || fallbackTemple.state,
      country: data.temples?.country || 'India',
      latitude: data.temples?.latitude || 20.5937,
      longitude: data.temples?.longitude || 78.9629,
      description: data.temples?.description || '',
      imageUrl: data.temples?.image_url || fallbackTemple.imageUrl,
      category: data.temples?.category || fallbackTemple.category,
    };

    return {
      id: data.id,
      userId: data.user_id,
      templeId: data.temple_id,
      visitDate: data.visit_date,
      companions: data.companions,
      memory: data.memory,
      tags: data.tags || [],
      photos: visitData.photos.length > 0 ? visitData.photos : [templeObj.imageUrl],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      temple: templeObj,
    };
  } catch (e) {
    console.error('Error inserting visit into Supabase', e);
    return newVisit;
  }
}

export async function uploadVisitPhotoService(file: File): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `user-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('visit-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('visit-photos').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (e) {
    console.error('Error uploading photo to Supabase storage', e);
    return null;
  }
}

// --- TEMPLE JOURNEY SPECIFIC DATA SERVICE ---
export interface TempleJourneyData {
  temple: Temple;
  visits: TempleVisitWithDetails[];
  stats: {
    totalVisits: number;
    totalMemories: number;
    firstVisitDate: string | null;
    latestVisitDate: string | null;
    yearsOfJourney: number;
  };
}

export async function getTempleJourneyDataService(
  templeId: string
): Promise<TempleJourneyData | null> {
  const temple = await getTempleByIdService(templeId);
  if (!temple) return null;

  const allVisits = await getVisitsService();
  const templeVisits = allVisits
    .filter((v) => v.templeId === templeId)
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  const totalVisits = templeVisits.length;
  const totalMemories = templeVisits.length;

  let firstVisitDate: string | null = null;
  let latestVisitDate: string | null = null;
  let yearsOfJourney = 0;

  if (totalVisits > 0) {
    latestVisitDate = templeVisits[0].visitDate;
    firstVisitDate = templeVisits[totalVisits - 1].visitDate;

    const firstYear = new Date(firstVisitDate).getFullYear();
    const latestYear = new Date(latestVisitDate).getFullYear();
    yearsOfJourney = Math.max(1, latestYear - firstYear + 1);
  }

  return {
    temple,
    visits: templeVisits,
    stats: {
      totalVisits,
      totalMemories,
      firstVisitDate,
      latestVisitDate,
      yearsOfJourney,
    },
  };
}

// --- STATS CALCULATION HELPER ---
export function computeJourneyStatsFromVisits(visits: TempleVisitWithDetails[]): JourneyStats {
  const totalVisits = visits.length;
  const uniqueTemples = new Set(visits.map((v) => v.templeId));
  const uniqueStates = new Set(visits.map((v) => v.temple.state));

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

  const dates = visits.map((v) => new Date(v.visitDate).getFullYear());
  const minYear = dates.length ? Math.min(...dates) : new Date().getFullYear();
  const maxYear = new Date().getFullYear();
  const yearsOfJourney = Math.max(1, maxYear - minYear + 1);

  const sortedAsc = [...visits].sort(
    (a, b) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime()
  );

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
    firstTempleVisit: sortedAsc.length > 0 ? sortedAsc[0] : null,
    latestTempleVisit: visits.length > 0 ? visits[0] : null,
    circuits: {
      jyotirlingas: { visited: jyotirlingaVisitedCount, total: 12 },
      divyaDesams: { visited: divyaDesamVisitedCount, total: 108 },
      shaktiPeethas: { visited: shaktiPeethaVisitedCount, total: 51 },
    },
  };
}

// --- ON THIS DAY COMPUTATION ---
export function computeOnThisDayFromVisits(
  visits: TempleVisitWithDetails[]
): { visit: TempleVisitWithDetails; yearsAgo: number } | null {
  if (!visits || visits.length === 0) return null;

  const today = new Date();
  const currentMonth = today.getMonth();
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

  return null;
}

