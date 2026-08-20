import type { LocationCandidate } from '@/api/locations/location.schema';

const DONG_LEVEL_SUFFIXES = ['동', '읍', '면'] as const;

export function isDongLevel(region: string) {
  const lastToken = region.trim().split(/\s+/).at(-1) ?? '';
  return DONG_LEVEL_SUFFIXES.some((suffix) => lastToken.endsWith(suffix));
}

export function toSelectableRegions(candidates: LocationCandidate[]) {
  const seen = new Set<string>();

  return candidates.filter((candidate) => {
    if (!isDongLevel(candidate.region) || seen.has(candidate.regionCode)) return false;
    seen.add(candidate.regionCode);
    return true;
  });
}
