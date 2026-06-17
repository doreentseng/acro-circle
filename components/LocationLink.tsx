'use client';

import { linkClass } from '@/lib/styles/button';
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
      <button
        key={location.id}
        className={`flex justify-between ` + linkClass}
        onClick={(e) => {
          e.preventDefault();
          onClick(location);
        }}
      >
        {location.name}
      </button>
    </>
  );
}
