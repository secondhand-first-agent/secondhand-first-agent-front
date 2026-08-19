import { TriangleAlert } from 'lucide-react';

export function FormAlert({ message }: { message?: string }) {
  return (
    <div
      aria-live="polite"
      className={[
        'font-ds grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
        message ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      ].join(' ')}
    >
      <div className="overflow-hidden">
        <div className="bg-ds-danger-bg rounded-ds-sm mb-4 flex items-start gap-2 px-3 py-2">
          <TriangleAlert className="text-ds-danger-bold mt-0.5 size-4 shrink-0" aria-hidden />
          <p className="text-ds-danger-text text-ds-body">{message}</p>
        </div>
      </div>
    </div>
  );
}
