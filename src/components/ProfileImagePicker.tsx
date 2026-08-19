import { Camera, X } from 'lucide-react';
import { useId, useState, type ChangeEvent } from 'react';

import { Avatar } from '@/components/Avatar';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

interface ProfileImagePickerProps {
  name: string;
  value: string | null;
  onChange: (imageUrl: string | null) => void;
  disabled?: boolean;
}

export function ProfileImagePicker({ name, value, onChange, disabled = false }: ProfileImagePickerProps) {
  const inputId = useId();
  const [error, setError] = useState<string | null>(null);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 선택할 수 있어요.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('이미지는 2MB 이하로 선택해주세요.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    });
    reader.readAsDataURL(file);
  };

  return (
    <div className="font-ds flex items-center gap-4">
      <label
        htmlFor={inputId}
        className={`group relative block shrink-0 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <Avatar name={name} imageUrl={value} className="text-ds-h-md size-16" />
        <span className="border-ds-surface bg-ds-neutral-bold text-ds-text-inverse group-hover:bg-ds-neutral-bold-hovered absolute right-0 bottom-0 flex size-6 items-center justify-center rounded-full border-2 transition-colors">
          <Camera className="size-3.5" aria-hidden />
        </span>
        <span className="sr-only">프로필 이미지 선택</span>
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        disabled={disabled}
        className="sr-only"
      />

      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <label
            htmlFor={inputId}
            className={`text-ds-text-subtle text-ds-body font-ds-medium ${disabled ? 'cursor-not-allowed' : 'hover:text-ds-text cursor-pointer'}`}
          >
            {value ? '사진 변경' : '사진 선택'}
          </label>
          {value ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                onChange(null);
              }}
              disabled={disabled}
              className="text-ds-text-subtlest hover:text-ds-danger-text text-ds-body-sm inline-flex items-center gap-1 transition-colors disabled:cursor-not-allowed"
            >
              <X className="size-3" aria-hidden />
              기본 이미지로
            </button>
          ) : null}
        </div>
        <p className="text-ds-text-subtlest text-ds-body-sm mt-1">선택 사항 · JPG, PNG · 최대 2MB</p>
        {error ? <p className="text-ds-danger-text text-ds-body-sm mt-1">{error}</p> : null}
      </div>
    </div>
  );
}
