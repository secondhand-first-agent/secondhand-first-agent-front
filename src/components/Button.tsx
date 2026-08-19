import { LoaderCircle } from 'lucide-react';
import type { ComponentPropsWithRef } from 'react';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  isLoading?: boolean;
}

export function Button({ isLoading = false, disabled, children, className = '', ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={[
        'relative inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2.5',
        'text-sm font-medium text-white transition-colors',
        'hover:bg-gray-700 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none',
        'disabled:cursor-not-allowed disabled:bg-gray-300',
        className,
      ].join(' ')}
      {...props}
    >
      {/* 스피너를 흐름에서 빼서 라벨 위치가 고정되게 합니다 */}
      {isLoading ? <LoaderCircle className="absolute left-4 size-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
