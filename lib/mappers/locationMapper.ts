import type { LocationRaw, LocationViewModel } from '@/lib//types/location';

export function mapLocation(raw: LocationRaw): LocationViewModel {
  return {
    id: String(raw.id),
    name: raw.name,
    mapUrl: raw.map_url,
    officialUrl: raw.official_url,
  };
}
