import { LocationViewModel } from '@/lib/types/location';
import { useState } from 'react';
import LocationModal from './LocationModel';
export default function LocationLink({
  location,
}: {
  location: LocationViewModel;
}) {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationViewModel | null>(null);
  return (
    <>
      <LocationModal
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
      <a
        href="#"
        key={location.id}
        className="flex justify-between hover:underline text-zinc-700 hover:text-pink-600 transition group"
        onClick={() => setSelectedLocation(location)}
      >
        {location.name}
      </a>
    </>
  );
}
