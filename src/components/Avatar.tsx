import { UserRound } from 'lucide-react';

interface AvatarProps {
  name?: string;
  imageUrl?: string | null;
  className?: string;
}

export function Avatar({ name = '', imageUrl, className = 'size-9 text-sm' }: AvatarProps) {
  return (
    <span
      aria-label={imageUrl ? undefined : `${name || '사용자'} 기본 프로필 이미지`}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 font-medium text-white ${className}`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="size-full object-cover" />
      ) : (
        <UserRound className="size-1/2 text-gray-300" aria-hidden />
      )}
    </span>
  );
}
