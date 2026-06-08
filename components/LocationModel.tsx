'use client';

import { iconClass } from '@/lib/styles/icon';
import type { LocationViewModel } from '@/lib/types/location';
import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/solid';

type Props = {
  location: LocationViewModel | null;
  onClose: () => void;
};

export default function LocationModal({ location, onClose }: Props) {
  if (!location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl space-y-3 animate-modalIn">
        <div className="text-lg font-semibold text-zinc-900">
          {location.name}
        </div>

        {/* divider */}
        <div className="h-px bg-zinc-100" />

        <div className="space-y-3 text-sm">
          <a
            href={location.mapUrl}
            target="_blank"
            className="flex items-center gap-2 text-zinc-700 hover:text-pink-600 transition group"
          >
            <MapPinIcon
              className={iconClass + ' group-hover:text-pink-600 transition'}
            />
            <span className="hover:underline cursor-pointer">查看地圖</span>
          </a>

          <a
            href={location.officialUrl}
            target="_blank"
            className="flex items-center gap-2 text-zinc-700 hover:text-pink-600 transition group"
          >
            <GlobeAltIcon
              className={iconClass + ' group-hover:text-pink-600 transition'}
            />
            <span className="hover:underline cursor-pointer">官方網站</span>
          </a>
        </div>
      </div>
    </div>
  );
}
