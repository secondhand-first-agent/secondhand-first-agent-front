import { Check } from 'lucide-react';

import { PASSWORD_RULES } from '@/api/auth/auth.schema';

export function PasswordRules({ value }: { value: string }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {PASSWORD_RULES.map((rule) => {
        const satisfied = rule.test(value);
        return (
          <li
            key={rule.label}
            className={[
              'flex items-center gap-1 text-xs transition-colors',
              satisfied ? 'text-green-600' : 'text-gray-400',
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
