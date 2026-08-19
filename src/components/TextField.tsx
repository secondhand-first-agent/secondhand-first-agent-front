import { CircleAlert } from 'lucide-react';
import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';

interface TextFieldProps extends ComponentPropsWithRef<'input'> {
  label: string;
  error?: string;
  trailing?: ReactNode;
}

export function TextField({ label, error, trailing, id, ...props }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={[
            'block w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900 outline-none',
            'placeholder:text-gray-400',
            'focus:border-gray-900 focus:ring-1 focus:ring-gray-900',
            'disabled:bg-gray-50 disabled:text-gray-500',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300',
            trailing ? 'pr-10' : '',
          ].join(' ')}
          {...props}
        />
        {trailing ? <div className="absolute inset-y-0 right-0 flex items-center pr-2">{trailing}</div> : null}
      </div>
      <p id={errorId} role="alert" className="mt-1 flex min-h-4 items-center gap-1 text-xs text-red-600">
        {error ? (
          <>
            <CircleAlert className="size-3 shrink-0" aria-hidden />
            {error}
          </>
        ) : null}
      </p>
    </div>
  );
}
