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
        className="flex justify-between hover:underline text-zinc-700 hover:text-pink-600 transition group"
        onClick={() => onClick(location)}
      >
        {location.name}
      </a>
    </>
  );
}
