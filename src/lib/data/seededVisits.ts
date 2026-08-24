import { TempleVisit, UserProfile, Notification } from '@/types';

export const DEMO_USER: UserProfile = {
  id: 'user-umesh',
  name: 'Umesh',
  email: 'umesh@templejourney.app',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  homeState: 'Andhra Pradesh',
  joinedDate: '2024-01-10',
};

export const SEEDED_VISITS: TempleVisit[] = [
  {
    id: 'visit-1',
    userId: 'user-umesh',
    templeId: 'temple-1', // Tirumala Venkateswara
    visitDate: '2024-01-14',
    companions: 'Family',
    memory: 'Our annual Sankranti pilgrimage to Tirumala. Stepping through the Vaikuntam queue complex at 4 AM into the glowing golden Garbhagriha was deeply overwhelming. The suprabhatam chanting resonated in our hearts.',
    tags: ['First Visit', 'Family Trip', 'Pilgrimage', 'Festival'],
    photos: [
      'https://images.unsplash.com/photo-1621831815065-9aea03178475?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
  {
    id: 'visit-2',
    userId: 'user-umesh',
    templeId: 'temple-2', // Arunachaleswarar Temple
    visitDate: '2024-08-23', // Matches current date (Aug 23) for "On This Day" feature demonstration!
    companions: 'Partner',
    memory: 'The Girivalam experience around the holy Annamalai hill on full moon night was unforgettable. Walking 14 km under the starlit sky while absorbing the serene energy of Agni Lingam left a profound calm.',
    tags: ['Pilgrimage', 'Special Occasion'],
    photos: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2024-08-23T20:30:00Z',
    updatedAt: '2024-08-23T20:30:00Z',
  },
  {
    id: 'visit-3',
    userId: 'user-umesh',
    templeId: 'temple-3', // Meenakshi Amman Temple
    visitDate: '2024-10-12',
    companions: 'Family',
    memory: 'Standing under the thousand-pillared hall in Madurai. The intricate stone carvings of Goddess Meenakshi and the vibrant colors of the gopurams left the entire family spellbound.',
    tags: ['Family Trip', 'Heritage'],
    photos: [
      'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2024-10-12T14:00:00Z',
    updatedAt: '2024-10-12T14:00:00Z',
  },
  {
    id: 'visit-4',
    userId: 'user-umesh',
    templeId: 'temple-4', // Brihadeeswarar Temple
    visitDate: '2024-10-14',
    companions: 'Family',
    memory: 'Visited Thanjavur Big Temple at sunset. The shadow of the massive Vimana towers was breathtaking, and the monolithic Nandi statue carved out of a single rock was awe-inspiring.',
    tags: ['Heritage', 'Family Trip'],
    photos: [
      'https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2024-10-14T17:30:00Z',
    updatedAt: '2024-10-14T17:30:00Z',
  },
  {
    id: 'visit-5',
    userId: 'user-umesh',
    templeId: 'temple-11', // Srisailam Mallikarjuna Temple
    visitDate: '2024-12-05',
    companions: 'Friends',
    memory: 'Road trip with college friends through the Nallamala forest to Srisailam. Offering prayers at both the Jyotirlinga and Bhramaramba Shakti Peetha in one place was deeply spiritual.',
    tags: ['Pilgrimage', 'Friends'],
    photos: [
      'https://images.unsplash.com/photo-1621831815065-9aea03178475?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2024-12-05T11:00:00Z',
    updatedAt: '2024-12-05T11:00:00Z',
  },
  {
    id: 'visit-6',
    userId: 'user-umesh',
    templeId: 'temple-12', // Kanaka Durga Temple Vijayawada
    visitDate: '2025-01-15',
    companions: 'Family',
    memory: 'Climbing the Indrakeeladri hill on Kanaka Durga hill route. The breeze off the Krishna River and the evening Aarti divine vibes were unforgettable.',
    tags: ['Family Trip', 'Festival'],
    photos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2025-01-15T18:00:00Z',
    updatedAt: '2025-01-15T18:00:00Z',
  },
  {
    id: 'visit-7',
    userId: 'user-umesh',
    templeId: 'temple-14', // Yadadri Temple
    visitDate: '2025-03-20',
    companions: 'Alone',
    memory: 'A peaceful solitary trip to Yadadri. The newly constructed black granite stone architecture looked majestic under the afternoon sun.',
    tags: ['Pilgrimage', 'First Visit'],
    photos: [
      'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2025-03-20T12:00:00Z',
    updatedAt: '2025-03-20T12:00:00Z',
  },
  {
    id: 'visit-8',
    userId: 'user-umesh',
    templeId: 'temple-13', // Virupaksha Temple Hampi
    visitDate: '2025-06-18',
    companions: 'Friends',
    memory: 'Explored Hampi ruins at dawn. Watching the morning sun hit the 160-foot gopuram of Virupaksha temple while hearing temple chimes across the Tungabhadra River.',
    tags: ['Heritage', 'Friends'],
    photos: [
      'https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2025-06-18T07:00:00Z',
    updatedAt: '2025-06-18T07:00:00Z',
  },
  {
    id: 'visit-9',
    userId: 'user-umesh',
    templeId: 'temple-7', // Kashi Vishwanath Temple
    visitDate: '2025-09-08',
    companions: 'Alone',
    memory: 'Solo journey to Kashi. Walking through the Vishwanath Dham corridor straight to the holy Ganga Ghats after early morning Darshan. The energy of Varanasi is unmatched.',
    tags: ['Pilgrimage', 'Special Occasion'],
    photos: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2025-09-08T08:30:00Z',
    updatedAt: '2025-09-08T08:30:00Z',
  },
  {
    id: 'visit-10',
    userId: 'user-umesh',
    templeId: 'temple-1', // Tirumala Venkateswara - 2nd Visit!
    visitDate: '2025-11-20',
    companions: 'Family',
    memory: 'Returned to Tirupati with parents to thank Balaji after achieving our family milestone. The laddu prasadam and blissful darshan made the long walk worth every step.',
    tags: ['Family Trip', 'Pilgrimage'],
    photos: [
      'https://images.unsplash.com/photo-1621831815065-9aea03178475?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2025-11-20T16:00:00Z',
    updatedAt: '2025-11-20T16:00:00Z',
  },
  {
    id: 'visit-11',
    userId: 'user-umesh',
    templeId: 'temple-5', // Somnath Temple
    visitDate: '2026-01-26',
    companions: 'Partner',
    memory: 'Watching the light and sound show at Somnath with the waves of the Arabian Sea crashing against the temple wall behind us. A moment of pure divine peace.',
    tags: ['Pilgrimage', 'Special Occasion'],
    photos: [
      'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2026-01-26T19:00:00Z',
    updatedAt: '2026-01-26T19:00:00Z',
  },
  {
    id: 'visit-12',
    userId: 'user-umesh',
    templeId: 'temple-6', // Kedarnath Temple
    visitDate: '2026-05-15',
    companions: 'Friends',
    memory: 'Trekking up 16 km from Gaurikund to Kedarnath surrounded by snow-capped peaks. Seeing the temple emerging through the Himalayan mist was a spiritual high point of my life.',
    tags: ['Pilgrimage', 'Friends'],
    photos: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop',
    ],
    createdAt: '2026-05-15T15:00:00Z',
    updatedAt: '2026-05-15T15:00:00Z',
  }
];

export const SEEDED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-umesh',
    title: '🛕 Have you visited a temple recently?',
    message: 'Preserve your spiritual memory! Tap to log your recent darshan and keep your journey updated.',
    type: 'check_in',
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/add-visit',
  },
  {
    id: 'notif-2',
    userId: 'user-umesh',
    title: '✨ On this day in 2024',
    message: 'You visited Arunachaleswarar Temple in Tiruvannamalai. Relive the sacred Girivalam memory.',
    type: 'on_this_day',
    isRead: false,
    createdAt: new Date().toISOString(),
    actionUrl: '/visit/visit-2',
    visitId: 'visit-2',
  },
  {
    id: 'notif-3',
    userId: 'user-umesh',
    title: '🚩 Spiritual Milestone Achieved',
    message: 'You have explored temples across 5 states of India! Explore your journey map now.',
    type: 'milestone',
    isRead: true,
    createdAt: '2026-01-26T20:00:00Z',
    actionUrl: '/map',
  }
];
