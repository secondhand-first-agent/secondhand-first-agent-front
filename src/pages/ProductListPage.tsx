import { useQuery } from '@tanstack/react-query';

import { ProductCard } from '@/features/products/components/ProductCard';
import { productListQuery } from '@/features/products/hooks/product.queries';

export function ProductListPage() {
  const { data, isPending, isError, error } = useQuery(productListQuery());

  if (isPending) return <p className="text-gray-500">불러오는 중…</p>;
  if (isError) return <p className="text-red-600">{error.message}</p>;

  return (
    <section>
      <h1 className="text-xl font-bold">매물</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
