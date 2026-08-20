import { CircleAlert } from 'lucide-react';
import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';

interface CheckboxFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label: ReactNode;
  error?: string;
}

export function CheckboxField({ label, error, id, ...props }: CheckboxFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const errorId = `${fieldId}-error`;

  return (
    <div className="font-ds">
      <div className="flex items-center gap-2">
        <input
          id={fieldId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={[
            'accent-ds-brand size-4 shrink-0 rounded-sm border transition-colors outline-none',
            'focus-visible:ring-ds-border-focused focus-visible:ring-2',
            error ? 'border-ds-danger-border' : 'border-ds-border-input',
          ].join(' ')}
          {...props}
        />
        <label htmlFor={fieldId} className="text-ds-text text-ds-body select-none">
          {label}
        </label>
      </div>
      <p id={errorId} role="alert" className="text-ds-danger-text text-ds-body-sm mt-1 flex min-h-4 items-center gap-1">
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
