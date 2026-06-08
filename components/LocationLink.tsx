'use client';

import { LocationViewModel } from '@/lib/types/location';

export default function LocationLink({
  location,
  onClick,
}: {
  location: LocationViewModel;
  onClick: (v: LocationViewModel) => void;
}) {
  return (
    <>
      <a
        href="#"
        key={location.id}
        className="flex justify-between underline hover:underline hover:text-pink-600 transition group"
        onClick={(e) => {
          e.preventDefault();
          onClick(location);
        }}
      >
        {location.name}
      </a>
    </>
  );
}
