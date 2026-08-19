import type { ReactNode } from 'react';

interface SettingRowProps {
  label: string;
  /** 라벨 아래 보조 설명이나 현재 값 */
  description?: ReactNode;
  leading?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

/** 설정 화면의 한 줄. 오른쪽 동작 버튼과 펼쳐지는 편집 영역을 함께 담습니다. */
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
