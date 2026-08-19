import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: z.number().int().nonnegative(),
  status: z.enum(['selling', 'reserved', 'sold']),
  thumbnailUrl: z.string().url().nullable(),
  createdAt: z.iso.datetime(),
});

export const productListSchema = z.object({
  items: z.array(productSchema),
  nextCursor: z.string().nullable(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductList = z.infer<typeof productListSchema>;
