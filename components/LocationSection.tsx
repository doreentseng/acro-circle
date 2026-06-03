import type { LocationViewModel } from '@/lib/types/location';
import { MapPinIcon } from '@heroicons/react/24/solid';
import SectionTitle from '@/components/ui/SectionTitle';
import { useState } from 'react';
import LocationModal from './LocationModel';
import { SectionSkeleton } from './ui/Skeleton';

export default function LocationSection({
  locations,
}: {
  locations: LocationViewModel[];
}) {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationViewModel | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-md p-5">
      <LocationModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
      <SectionTitle
        icon={<MapPinIcon className="w-5 h-5" />}
        title="地點清單"
      />
      {locations.length === 0 ? (
        <SectionSkeleton size="sm" />
      ) : (
        <div className="mt-3 space-y-2 text-sm text-zinc-600">
          {locations.map((l) => (
            <a
              href="#"
              key={l.id}
              className="flex justify-between hover:underline text-zinc-700 hover:text-pink-600 transition group"
              onClick={() => setSelectedLocation(l)}
            >
              {l.name}
            </a>
          ))}
        </div>
      )}
      {/* <div className="flex gap-2">
        <input className="flex-1 border rounded-md px-2 py-1" />
        <button className="bg-black text-white px-3 rounded-md">
          <PlusIcon className="w-3 h-3" />
        </button>
      </div> */}
    </div>
  );
}
