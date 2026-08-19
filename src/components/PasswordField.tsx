import { Eye, EyeOff } from 'lucide-react';
import { useState, type ComponentPropsWithRef } from 'react';

import { TextField } from './TextField';

interface PasswordFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label: string;
  error?: string;
}

export function PasswordField({ label, error, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <TextField
      {...props}
      label={label}
      error={error}
      type={visible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
          className="rounded p-1.5 text-gray-400 hover:text-gray-700 focus:ring-1 focus:ring-gray-900 focus:outline-none"
        >
          <Icon className="size-4" aria-hidden />
        </button>
      }
    />
  );
}
