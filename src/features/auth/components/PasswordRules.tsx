import { Check } from 'lucide-react';

import { PASSWORD_RULES } from '@/api/auth/auth.schema';

export function PasswordRules({ value }: { value: string }) {
  return (
    <ul className="font-ds flex flex-wrap gap-x-4 gap-y-1">
      {PASSWORD_RULES.map((rule) => {
        const satisfied = rule.test(value);
        return (
          <li
            key={rule.label}
            className={[
              'text-ds-body-sm flex items-center gap-1 transition-colors',
              satisfied ? 'text-ds-success-text' : 'text-ds-text-subtlest',
            ].join(' ')}
          >
            <Check className="size-3 shrink-0" aria-hidden />
            {rule.label}
            <span className="sr-only">{satisfied ? '충족' : '미충족'}</span>
          </li>
        );
      })}
    </ul>
  );
}
