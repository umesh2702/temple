'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Temple, CompanionType } from '@/types';
import {
  getTemplesService,
  addVisitService,
  addCustomTempleService,
  uploadVisitPhotoService,
} from '@/lib/services/journeyService';
import { SafeImage } from '@/components/ui/SafeImage';
import {
  Search,
  Calendar,
  Users,
  MapPin,
  Camera,
  Plus,
  Sparkles,
  ArrowLeft,
  X,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const COMPANIONS_OPTIONS: CompanionType[] = ['Alone', 'Family', 'Friends', 'Partner', 'Other'];
const SUGGESTED_TAGS = [
  'First Visit',
  'Family Trip',
  'Pilgrimage',
  'Festival',
  'Special Occasion',
  'Solo Journey',
  'Annual Tradition',
];

export const AddVisitForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTempleId = searchParams.get('templeId');

  const [step, setStep] = useState<1 | 2 | 3>(preselectedTempleId ? 2 : 1);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);

  // Custom temple modal state
  const [isCreatingCustomTemple, setIsCreatingCustomTemple] = useState(false);
  const [customTempleName, setCustomTempleName] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customState, setCustomState] = useState('');

  // Visit form fields
  const [visitDate, setVisitDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [companions, setCompanions] = useState<CompanionType>('Family');
  const [memoryText, setMemoryText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Pilgrimage']);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [savingVisit, setSavingVisit] = useState(false);
  const [createdVisitId, setCreatedVisitId] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemples() {
      const list = await getTemplesService();
      setTemples(list);
      if (preselectedTempleId) {
        const found = list.find((t) => t.id === preselectedTempleId);
        if (found) {
          setSelectedTemple(found);
        }
      }
    }
    loadTemples();
  }, [preselectedTempleId]);

  const filteredTemples = temples.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTemple = (t: Temple) => {
    setSelectedTemple(t);
    setStep(2);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddPhotoUrl = () => {
    if (photoUrlInput.trim()) {
      setPhotos((prev) => [...prev, photoUrlInput.trim()]);
      setPhotoUrlInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    const uploadedUrl = await uploadVisitPhotoService(file);
    if (uploadedUrl) {
      setPhotos((prev) => [...prev, uploadedUrl]);
    } else {
      // Fallback base64 preview if Supabase storage is unconfigured
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotos((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
    setUploadingPhoto(false);
  };

  const handleCreateCustomTemple = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTempleName || !customCity || !customState) return;

    const newT = await addCustomTempleService({
      name: customTempleName,
      city: customCity,
      state: customState,
      country: 'India',
      latitude: 20.5937,
      longitude: 78.9629,
      description: `Sacred shrine located in ${customCity}, ${customState}.`,
      imageUrl: 'https://images.unsplash.com/photo-1621831815065-9aea03178475?q=80&w=1200&auto=format&fit=crop',
      category: 'Other',
    });

    const updatedList = await getTemplesService();
    setTemples(updatedList);
    setSelectedTemple(newT);
    setIsCreatingCustomTemple(false);
    setStep(2);
  };

  const handleSubmitVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemple) return;

    setSavingVisit(true);
    const defaultPhoto = selectedTemple.imageUrl;
    const finalPhotos = photos.length > 0 ? photos : [defaultPhoto];

    const newVisit = await addVisitService({
      userId: 'user-umesh',
      templeId: selectedTemple.id,
      visitDate,
      companions,
      memory:
        memoryText.trim() ||
        `Visited ${selectedTemple.name} on ${visitDate} with ${companions.toLowerCase()}. A divine experience preserved forever.`,
      tags: selectedTags,
      photos: finalPhotos,
    });

    setCreatedVisitId(newVisit.id);
    setSavingVisit(false);
    setStep(3);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F59E0B', '#C85A32', '#FFF'],
      });
    } catch {
      // safe fallback
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Wizard Progress Indicator */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 1
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-600'
            }`}
          >
            1
          </span>
          <span className={step === 1 ? 'text-amber-800 dark:text-amber-200 font-bold' : ''}>
            Select Temple
          </span>
        </div>

        <div className="h-0.5 w-12 bg-amber-200 dark:bg-amber-900"></div>

        <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step >= 2
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-600'
            }`}
          >
            2
          </span>
          <span className={step === 2 ? 'text-amber-800 dark:text-amber-200 font-bold' : ''}>
            Visit Details
          </span>
        </div>

        <div className="h-0.5 w-12 bg-amber-200 dark:bg-amber-900"></div>

        <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 3
                ? 'bg-amber-600 text-white shadow'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-600'
            }`}
          >
            3
          </span>
          <span className={step === 3 ? 'text-amber-800 dark:text-amber-200 font-bold' : ''}>
            Saved!
          </span>
        </div>
      </div>

      {/* STEP 1: SELECT TEMPLE */}
      {step === 1 && (
        <div className="rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 shadow-xl space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-amber-100">
              Where did your journey take you?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Search for a temple from our sacred Indian shrine collection.
            </p>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-amber-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search temple name (e.g. Tirupati, Arunachaleswarar, Kedarnath)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {searchQuery ? 'Search Results' : 'Suggested Sacred Shrines'}
              </h4>
              <button
                type="button"
                onClick={() => setIsCreatingCustomTemple(true)}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Can&apos;t find temple? Add Custom
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {filteredTemples.map((temple) => (
                <button
                  key={temple.id}
                  onClick={() => handleSelectTemple(temple)}
                  className="w-full p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200/60 dark:border-stone-700/60 hover:border-amber-400 text-left flex items-center gap-3 transition-all group"
                >
                  <SafeImage
                    src={temple.imageUrl}
                    alt={temple.name}
                    category={temple.category}
                    className="w-12 h-12 rounded-xl shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif font-bold text-sm text-stone-900 dark:text-amber-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                      {temple.name}
                    </h5>
                    <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500" /> {temple.city}, {temple.state}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/70 px-2.5 py-1 rounded-lg shrink-0">
                    {temple.category}
                  </span>
                </button>
              ))}

              {filteredTemples.length === 0 && (
                <div className="text-center py-8 space-y-3">
                  <p className="text-xs text-stone-500">No temples found matching &ldquo;{searchQuery}&rdquo;</p>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomTempleName(searchQuery);
                      setIsCreatingCustomTemple(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow"
                  >
                    Add &ldquo;{searchQuery}&rdquo; as a New Temple
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: VISIT DETAILS FORM */}
      {step === 2 && selectedTemple && (
        <form
          onSubmit={handleSubmitVisit}
          className="rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/70 dark:border-amber-900/40 p-6 shadow-xl space-y-6"
        >
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SafeImage
                src={selectedTemple.imageUrl}
                alt={selectedTemple.name}
                category={selectedTemple.category}
                className="w-12 h-12 rounded-xl shrink-0"
              />
              <div>
                <h4 className="font-serif font-bold text-base text-stone-900 dark:text-amber-100">
                  {selectedTemple.name}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" /> {selectedTemple.city}, {selectedTemple.state}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" /> Visit Date
              </label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-amber-600" /> Who did you visit with?
              </label>
              <select
                value={companions}
                onChange={(e) => setCompanions(e.target.value as CompanionType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {COMPANIONS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Memory / Reflections
            </label>
            <textarea
              rows={4}
              placeholder="What do you remember about this visit? (e.g. peaceful atmosphere, early morning suprabhatam, girivalam experience, family feelings...)"
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Select Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-amber-100/50'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Photo Attachment (URL or Supabase Storage Upload) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-600" /> Photos (Upload or Paste URL)
            </label>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                placeholder="Paste image URL (e.g. https://...)"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border text-xs"
              />
              <button
                type="button"
                onClick={handleAddPhotoUrl}
                className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-bold hover:bg-stone-900"
              >
                Add Link
              </button>

              <label className="cursor-pointer px-4 py-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-amber-300/40 hover:bg-amber-200">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingPhoto ? 'Uploading...' : 'Upload File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden group border">
                    <SafeImage src={p} alt="Visit photo" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-stone-900/80 text-white hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <button
              type="submit"
              disabled={savingVisit}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-white text-sm font-bold shadow-lg shadow-amber-500/30 hover:scale-105 transition-all"
            >
              <span>{savingVisit ? 'Saving to Journey...' : 'Save Temple Visit'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

      {/* STEP 3: CONFIRMATION CELEBRATION */}
      {step === 3 && selectedTemple && (
        <div className="rounded-3xl bg-gradient-to-b from-amber-900 via-stone-900 to-stone-950 text-white p-8 text-center shadow-2xl border border-amber-500/40 space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 flex items-center justify-center text-4xl mx-auto shadow-xl shadow-amber-500/30 animate-bounce">
            🛕
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-serif text-3xl font-extrabold text-amber-200">
              Added to your journey!
            </h3>
            <p className="text-stone-300 text-sm">
              Your visit to <strong className="text-white">{selectedTemple.name}</strong> on{' '}
              <span className="text-amber-300">{visitDate}</span> is now recorded in your sacred footprint map.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/80 border border-amber-500/30 max-w-sm mx-auto text-left flex items-center gap-3">
            <SafeImage
              src={photos[0] || selectedTemple.imageUrl}
              alt={selectedTemple.name}
              category={selectedTemple.category}
              className="w-14 h-14 rounded-xl shrink-0"
            />
            <div>
              <h5 className="font-serif font-bold text-sm text-amber-100">{selectedTemple.name}</h5>
              <p className="text-xs text-stone-400">{selectedTemple.city}, {selectedTemple.state}</p>
              <p className="text-[11px] text-amber-400 mt-0.5">Visited with {companions}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {createdVisitId && (
              <button
                onClick={() => router.push(`/visit/${createdVisitId}`)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/30 transition-all"
              >
                View Memory Page
              </button>
            )}

            <button
              onClick={() => router.push('/map')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm border border-amber-500/30 transition-all"
            >
              Explore Full Map →
            </button>
          </div>
        </div>
      )}

      {/* Custom Temple Modal */}
      {isCreatingCustomTemple && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-amber-200 dark:border-amber-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-amber-100">
                Add Custom Temple
              </h3>
              <button
                onClick={() => setIsCreatingCustomTemple(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomTemple} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Temple Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kapaleeshwarar Temple"
                  value={customTempleName}
                  onChange={(e) => setCustomTempleName(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    City / Town
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tamil Nadu"
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCustomTemple(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow"
                >
                  Create & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
