export interface LocationInput {
  id: number;
  name: string;
  mapUrl: string;
  officialUrl?: string;
}

export interface LocationViewModel {
  id: string;
  name: string;
  mapUrl: string;
  officialUrl?: string;
}

export interface LocationRaw {
  id: number;
  name: string;
  map_url: string;
  official_url?: string;
}
