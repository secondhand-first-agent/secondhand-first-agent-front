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
    <div className="font-ds px-4 py-3">
      <div className="flex items-center gap-4">
        {leading}
        <div className="min-w-0 flex-1">
          <p className="text-ds-text text-ds-body font-ds-semibold">{label}</p>
          {description ? (
            <div className="text-ds-text-subtle text-ds-body-sm mt-0.5 truncate">{description}</div>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
