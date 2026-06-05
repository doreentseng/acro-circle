import type { LocationViewModel } from '@/lib/types/location';
import { MapPinIcon } from '@heroicons/react/24/solid';
import SectionTitle from '@/components/ui/SectionTitle';
import { SectionSkeleton } from './ui/Skeleton';
import LocationLink from './LocationLink';
import { cardClass } from '@/lib/styles/card';

export default function LocationSection({
  locations,
  onClickLocationLink,
}: {
  locations: LocationViewModel[];
  onClickLocationLink: (v: LocationViewModel) => void;
}) {
  return (
    <div className={cardClass}>
      <SectionTitle
        icon={<MapPinIcon className="w-5 h-5" />}
        title="地點清單"
      />
      {locations.length === 0 ? (
        <SectionSkeleton size="sm" />
      ) : (
        <div className="mt-3 space-y-2 text-sm text-[var(--foreground)]">
          {locations.map((l) => (
            <LocationLink
              key={l.id}
              location={l}
              onClick={onClickLocationLink}
            />
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
