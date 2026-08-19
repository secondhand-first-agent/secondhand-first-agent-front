import type { Product } from '@/api/products/product.schema';

const statusLabel: Record<Product['status'], string> = {
  selling: '판매중',
  reserved: '예약중',
  sold: '판매완료',
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="font-ds border-ds-border bg-ds-surface rounded-ds-lg hover:bg-ds-surface-hovered border p-4 transition-colors">
      <h3 className="text-ds-text text-ds-body font-ds-medium truncate">{product.title}</h3>
      <p className="text-ds-text text-ds-h-sm font-ds-bold mt-1">{product.price.toLocaleString('ko-KR')}원</p>
      <span className="bg-ds-accent-gray-bg text-ds-accent-gray-text rounded-ds-xs text-ds-body-sm font-ds-bold mt-2 inline-block px-1.5 py-0.5">
        {statusLabel[product.status]}
      </span>
    </article>
  );
}
