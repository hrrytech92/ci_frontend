export interface IPaginatedMeta {
  count: number;
  next: string | null;
  previous: number | null;
}

export interface IPaginated<T> extends IPaginatedMeta {
  results: T;
}

export interface NormalizedResults<T> {
  [key: string]: T;
}
