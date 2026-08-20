import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import { passwordChangeSchema, type PasswordChangeFormValues } from '@/api/auth/auth.schema';
import { getErrorMessage } from '@/api/response';
import { FormAlert } from '@/components/FormAlert';
import { PasswordField } from '@/components/PasswordField';
import { PasswordRules } from '@/features/auth/components/PasswordRules';
import { useChangePasswordMutation } from '@/hooks/useAuthMutations';

export function PasswordChangeForm({ onClose }: { onClose: () => void }) {
  const changePassword = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    mode: 'onBlur',
  });

  const newPassword = useWatch({ control, name: 'newPassword' }) ?? '';

  const onSubmit = handleSubmit(({ currentPassword, newPassword: nextPassword }) => {
    changePassword.mutate({ currentPassword, newPassword: nextPassword }, { onSuccess: onClose });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-3">
      <FormAlert message={changePassword.isError ? getErrorMessage(changePassword.error) : undefined} />

      <PasswordField
        label="현재 비밀번호"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />

      <div>
        <PasswordField
          label="새 비밀번호"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <PasswordRules value={newPassword} />
      </div>

      <PasswordField
        label="새 비밀번호 확인"
        autoComplete="new-password"
        error={errors.newPasswordConfirm?.message}
        {...register('newPasswordConfirm')}
      />

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="text-ds-body text-ds-text-subtle hover:text-ds-text px-3 py-1.5"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={changePassword.isPending}
          className="bg-ds-brand hover:bg-ds-brand-hovered rounded-ds-sm text-ds-body font-ds-medium text-ds-text-inverse disabled:bg-ds-neutral-hovered px-4 py-1.5 transition-colors"
        >
          변경
        </button>
      </div>
    </form>
  );
}
