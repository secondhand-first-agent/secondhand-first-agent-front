import { UserRound } from 'lucide-react';

interface AvatarProps {
  name?: string;
  imageUrl?: string | null;
  className?: string;
}

export function Avatar({ name = '', imageUrl, className = 'size-8 text-ds-body' }: AvatarProps) {
  return (
    <span
      aria-label={imageUrl ? undefined : `${name || '사용자'} 기본 프로필 이미지`}
      className={`bg-ds-brand text-ds-text-inverse font-ds font-ds-medium inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="size-full object-cover" />
      ) : (
        <UserRound className="size-1/2" aria-hidden />
      )}
    </span>
  );
}
