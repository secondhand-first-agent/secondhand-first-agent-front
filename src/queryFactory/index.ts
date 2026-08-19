import { activityQueries, activityQueryKeys } from './activityQueries';
import { productQueries, productQueryKeys } from './productQueries';
import { userQueries, userQueryKeys } from './userQueries';

export const queryKeys = {
  products: productQueryKeys,
  users: userQueryKeys,
  activities: activityQueryKeys,
} as const;

export const queryFactory = {
  products: productQueries,
  users: userQueries,
  activities: activityQueries,
} as const;

export { activityQueries, activityQueryKeys, productQueries, productQueryKeys, userQueries, userQueryKeys };
