import { z } from 'zod';

import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { unwrap } from '../response';

import { coordinateSchema, locationCandidateSchema, type Coordinate, type LocationCandidate } from './location.schema';

export async function searchLocations(query: string): Promise<LocationCandidate[]> {
  const { data } = await apiClient.get(ENDPOINTS.locations.search, { params: { query } });
  return unwrap(z.array(locationCandidateSchema), data);
}

export async function updateLocation(region: string): Promise<Coordinate> {
  const { data } = await apiClient.patch(ENDPOINTS.users.location, { region });
  return unwrap(coordinateSchema, data);
}
