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
        'font-ds bg-ds-brand hover:bg-ds-brand-hovered active:bg-ds-brand-pressed relative inline-flex h-8 w-full items-center justify-center px-3',
        'rounded-ds-sm text-ds-body font-ds-medium text-ds-text-inverse transition-colors',
        'focus-visible:outline-ds-border-focused focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:bg-ds-neutral disabled:text-ds-text-disabled disabled:cursor-not-allowed',
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? <LoaderCircle className="absolute left-3 size-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
