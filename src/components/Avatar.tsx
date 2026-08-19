interface AvatarProps {
  name?: string;
  imageUrl?: string | null;
  /** tailwind size 유틸 (예: 'size-9') */
  className?: string;
}

/** 프로필 이미지가 없으면 이름 첫 글자를 보여줍니다. */
export function Avatar({ name = '', imageUrl, className = 'size-9 text-sm' }: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 font-medium text-white ${className}`}
    >
      {imageUrl ? <img src={imageUrl} alt="" className="size-full object-cover" /> : name.charAt(0)}
    </span>
  );
}
