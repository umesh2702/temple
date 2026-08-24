export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  Jyotirlingam:
    'https://images.unsplash.com/photo-1609137144813-7d9921338f24?q=80&w=1200&auto=format&fit=crop',
  'Divya Desam':
    'https://images.unsplash.com/photo-1621831815065-9aea03178475?q=80&w=1200&auto=format&fit=crop',
  'Shakti Peetha':
    'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
  'Shiva Temple':
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop',
  'Vishnu Temple':
    'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?q=80&w=1200&auto=format&fit=crop',
  'Devi Temple':
    'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?q=80&w=1200&auto=format&fit=crop',
  Heritage:
    'https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=1200&auto=format&fit=crop',
  Other:
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop',
};

export const GLOBAL_TEMPLE_FALLBACK =
  'https://images.unsplash.com/photo-1621831815065-9aea03178475?q=80&w=1200&auto=format&fit=crop';

export function getFallbackImageForCategory(category?: string): string {
  if (category && CATEGORY_FALLBACK_IMAGES[category]) {
    return CATEGORY_FALLBACK_IMAGES[category];
  }
  return GLOBAL_TEMPLE_FALLBACK;
}
