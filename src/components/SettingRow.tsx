import type { ReactNode } from 'react';

interface SettingRowProps {
  label: string;
  description?: ReactNode;
  leading?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

export function SettingRow({ label, description, leading, action, children }: SettingRowProps) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-4">
        {leading}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          {description ? <div className="mt-0.5 truncate text-xs text-gray-500">{description}</div> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
