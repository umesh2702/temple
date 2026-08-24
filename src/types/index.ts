export type TempleCategory =
  | 'Jyotirlingam'
  | 'Divya Desam'
  | 'Shakti Peetha'
  | 'Shiva Temple'
  | 'Vishnu Temple'
  | 'Devi Temple'
  | 'Heritage'
  | 'Other';

export type CompanionType = 'Alone' | 'Family' | 'Friends' | 'Partner' | 'Other';

export interface Temple {
  id: string;
  name: string;
  alternateNames?: string[];
  city: string;
  district?: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
  category: TempleCategory;
  createdAt?: string;
}

export interface TempleVisit {
  id: string;
  userId: string;
  templeId: string;
  visitDate: string; // YYYY-MM-DD
  companions: CompanionType;
  memory: string;
  tags: string[];
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'check_in' | 'on_this_day' | 'milestone';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  visitId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  homeState: string;
  joinedDate: string;
}

export interface TempleVisitWithDetails extends TempleVisit {
  temple: Temple;
}

export interface JourneyStats {
  totalVisits: number;
  uniqueTemplesCount: number;
  statesExploredCount: number;
  memoriesCount: number;
  yearsOfJourney: number;
  mostVisitedState: { name: string; count: number } | null;
  firstTempleVisit: TempleVisitWithDetails | null;
  latestTempleVisit: TempleVisitWithDetails | null;
  circuits: {
    jyotirlingas: { visited: number; total: number };
    divyaDesams: { visited: number; total: number };
    shaktiPeethas: { visited: number; total: number };
  };
}
