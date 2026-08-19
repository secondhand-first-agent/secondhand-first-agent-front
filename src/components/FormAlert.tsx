import { TriangleAlert } from 'lucide-react';

export function FormAlert({ message }: { message?: string }) {
  return (
    <div
      aria-live="polite"
      className={[
        'grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none',
        message ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
      ].join(' ')}
    >
      <div className="overflow-hidden">
        <div className="mb-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5">
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red-600" aria-hidden />
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
