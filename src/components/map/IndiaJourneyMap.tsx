'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Temple, TempleVisitWithDetails } from '@/types';
import { MapPin, ChevronRight, Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';

interface IndiaJourneyMapProps {
  allTemples: Temple[];
  userVisits: TempleVisitWithDetails[];
  onSelectTemple?: (temple: Temple) => void;
  selectedStateFilter?: string;
  selectedCategoryFilter?: string;
}

const createCustomIcon = (isVisited: boolean, visitCount: number) => {
  if (typeof window === 'undefined') return undefined;

  if (isVisited) {
    return L.divIcon({
      className: 'custom-visited-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-2 bg-amber-500/30 rounded-full blur-sm group-hover:bg-amber-500/60 transition-all"></div>
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-400 border-2 border-white dark:border-stone-900 shadow-lg flex items-center justify-center text-white text-base marker-glow transform group-hover:scale-110 transition-transform">
            🛕
          </div>
          ${
            visitCount > 1
              ? `<div class="absolute -top-1 -right-1 bg-stone-900 text-amber-300 text-[10px] font-extrabold w-4 h-4 rounded-full border border-amber-400 flex items-center justify-center shadow">
                  ${visitCount}
                </div>`
              : ''
          }
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
    });
  }

  return L.divIcon({
    className: 'custom-unvisited-marker',
    html: `
      <div class="w-6 h-6 rounded-full bg-stone-300 dark:bg-stone-700 border-2 border-stone-100 dark:border-stone-800 shadow flex items-center justify-center text-[10px] text-stone-600 dark:text-stone-300 hover:scale-110 transition-transform cursor-pointer">
        🛕
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

export const IndiaJourneyMap: React.FC<IndiaJourneyMapProps> = ({
  allTemples,
  userVisits,
  onSelectTemple,
  selectedStateFilter = 'ALL',
  selectedCategoryFilter = 'ALL',
}) => {
  const visitsByTempleId = useMemo(() => {
    const map = new Map<string, TempleVisitWithDetails[]>();
    userVisits.forEach((visit) => {
      const existing = map.get(visit.templeId) || [];
      map.set(visit.templeId, [...existing, visit]);
    });
    return map;
  }, [userVisits]);

  const filteredTemples = useMemo(() => {
    return allTemples.filter((t) => {
      const matchesState = selectedStateFilter === 'ALL' || t.state === selectedStateFilter;
      const matchesCategory = selectedCategoryFilter === 'ALL' || t.category === selectedCategoryFilter;
      return matchesState && matchesCategory;
    });
  }, [allTemples, selectedStateFilter, selectedCategoryFilter]);

  const defaultCenter: [number, number] = [20.5937, 78.9629];

  return (
    <div className="relative w-full h-[600px] md:h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-amber-200/60 dark:border-amber-900/40">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {filteredTemples.map((temple) => {
          const visits = visitsByTempleId.get(temple.id) || [];
          const isVisited = visits.length > 0;
          const icon = createCustomIcon(isVisited, visits.length);

          return (
            <Marker
              key={temple.id}
              position={[temple.latitude, temple.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onSelectTemple) onSelectTemple(temple);
                },
              }}
            >
              <Popup>
                <div className="p-1 min-w-[220px]">
                  <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                    <img
                      src={temple.imageUrl}
                      alt={temple.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-amber-900/80 backdrop-blur-md text-amber-200 text-[10px] font-semibold">
                      {temple.category}
                    </div>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-amber-100 leading-tight">
                    {temple.name}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-600" /> {temple.city}, {temple.state}
                  </p>

                  {isVisited ? (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/50 dark:border-amber-900/40">
                      <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-medium">
                        <span>Visited {visits.length} {visits.length === 1 ? 'time' : 'times'}</span>
                        <span className="text-[10px] text-stone-400">{visits[0]?.visitDate}</span>
                      </div>
                      <Link
                        href={`/temples/${temple.id}`}
                        className="mt-2 w-full py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1 hover:bg-amber-700 transition-colors"
                      >
                        View Temple Journey <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-stone-800">
                      <p className="text-[11px] text-stone-500 italic mb-2">Not visited yet</p>
                      <Link
                        href={`/add-visit?templeId=${temple.id}`}
                        className="w-full py-1.5 rounded-lg bg-stone-900 dark:bg-amber-500 dark:text-stone-950 text-white text-xs font-semibold flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Visit Here
                      </Link>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-stone-900/90 backdrop-blur-md border border-amber-500/30 text-white p-3.5 rounded-2xl shadow-xl max-w-xs text-xs">
        <div className="flex items-center gap-2 mb-1.5 font-serif font-bold text-amber-400 text-sm">
          <Sparkles className="w-4 h-4" /> Sacred Journey Footprint
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-yellow-300 shadow"></span>
            <span className="text-stone-300">Visited Shrine</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-500"></span>
            <span className="text-stone-400">Sacred Site</span>
          </div>
        </div>
      </div>
    </div>
  );
};
