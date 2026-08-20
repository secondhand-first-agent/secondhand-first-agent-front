import { X } from 'lucide-react';
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * 네이티브 `<dialog>` 를 씁니다. `showModal()` 이 포커스 가두기, Esc 로 닫기,
 * 배경 요소 비활성화(inert)를 브라우저 기본 동작으로 처리해 주기 때문입니다.
 *
 * 브라우저가 해주지 않는 두 가지는 직접 처리합니다.
 * - 배경 스크롤 잠금
 * - 배경(백드롭) 클릭으로 닫기
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.style.overflow = 'hidden';
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  // 백드롭은 dialog 자신의 영역이다. 내용 위를 클릭하면 target 이 자식이 된다.
  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={onDialogClick}
      onCancel={(event) => {
        // Esc 는 dialog 를 닫지만 부모의 open 상태는 모르므로 직접 맞춰준다.
        event.preventDefault();
        onClose();
      }}
      className="font-ds rounded-ds-lg shadow-ds-overlay m-auto w-[min(42rem,calc(100vw-2rem))] max-w-none p-0 backdrop:bg-black/40 open:flex open:max-h-[min(44rem,calc(100dvh-4rem))] open:flex-col"
    >
      <header className="border-ds-border bg-ds-surface flex shrink-0 items-center justify-between gap-4 border-b px-5 py-4">
        <h2 className="text-ds-h-sm font-ds-bold text-ds-text">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text rounded-ds-sm focus-visible:outline-ds-border-focused -mr-1 inline-flex size-8 shrink-0 items-center justify-center transition-colors focus-visible:outline-2"
        >
          <X className="size-4" aria-hidden />
        </button>
      </header>

      <div className="bg-ds-surface min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
    </dialog>
  );
}
