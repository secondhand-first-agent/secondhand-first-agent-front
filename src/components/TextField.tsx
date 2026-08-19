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
    <div className="font-ds">
      <label htmlFor={fieldId} className="text-ds-text text-ds-body font-ds-medium block">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={[
            'bg-ds-surface text-ds-text rounded-ds-sm text-ds-body block h-8 w-full border px-2 transition-colors outline-none',
            'placeholder:text-ds-text-subtlest',
            'disabled:bg-ds-neutral disabled:text-ds-text-disabled',
            error
              ? 'border-ds-danger-border focus:border-ds-danger-border focus:ring-ds-danger-border focus:ring-1'
              : 'border-ds-border-input focus:border-ds-border-focused focus:ring-ds-border-focused focus:ring-1',
            trailing ? 'pr-9' : '',
          ].join(' ')}
          {...props}
        />
        {trailing ? <div className="absolute inset-y-0 right-0 flex items-center pr-1">{trailing}</div> : null}
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
