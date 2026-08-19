import type { Product } from '../api/product.schema';

const statusLabel: Record<Product['status'], string> = {
  selling: '판매중',
  reserved: '예약중',
  sold: '판매완료',
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-400">
      <h3 className="truncate font-medium">{product.title}</h3>
      <p className="mt-1 text-lg font-semibold">{product.price.toLocaleString('ko-KR')}원</p>
      <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
        {statusLabel[product.status]}
      </span>
    </article>
  );
}
