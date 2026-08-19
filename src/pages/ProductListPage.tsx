import { useQuery } from '@tanstack/react-query';

import { queryFactory } from '@/queryFactory';
import { getErrorMessage } from '@/api/response';
import { ProductCard } from '@/features/products/components/ProductCard';

export function ProductListPage() {
  const { data, isPending, isError, error } = useQuery(queryFactory.products.list());

  if (isPending) return <p className="font-ds text-ds-text-subtle text-ds-body">불러오는 중…</p>;
  if (isError) return <p className="font-ds text-ds-danger-text text-ds-body">{getErrorMessage(error)}</p>;

  return (
    <section className="font-ds mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-ds-text text-ds-h-md font-ds-bold">매물</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
