import { z } from 'zod';

export const locationCandidateSchema = z.object({
  address: z.string(),
  regionCode: z.string(),
  region: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const coordinateSchema = z.object({
  region: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export type LocationCandidate = z.infer<typeof locationCandidateSchema>;
export type Coordinate = z.infer<typeof coordinateSchema>;
