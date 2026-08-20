import { activityQueries, activityQueryKeys } from './activityQueries';
import { locationQueries, locationQueryKeys } from './locationQueries';

export { MIN_LOCATION_QUERY_LENGTH } from './locationQueries';
import { productQueries, productQueryKeys } from './productQueries';
import { userQueries, userQueryKeys } from './userQueries';

export const queryKeys = {
  products: productQueryKeys,
  users: userQueryKeys,
  activities: activityQueryKeys,
  locations: locationQueryKeys,
} as const;

export const queryFactory = {
  products: productQueries,
  users: userQueries,
  activities: activityQueries,
  locations: locationQueries,
} as const;

export {
  activityQueries,
  activityQueryKeys,
  locationQueries,
  locationQueryKeys,
  productQueries,
  productQueryKeys,
  userQueries,
  userQueryKeys,
};
