import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface DropdownOption<Value extends string> {
  value: Value;
  label: string;
}

interface DropdownProps<Value extends string> {
  value: Value;
  options: readonly DropdownOption<Value>[];
  onChange: (value: Value) => void;
  ariaLabel: string;
  leading?: ReactNode;
  className?: string;
}

export function Dropdown<Value extends string>({
  value,
  options,
  onChange,
  ariaLabel,
  leading,
  className = '',
}: DropdownProps<Value>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      options.findIndex((option) => option.value === value),
      0
    )
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    const selectedIndex = options.findIndex((option) => option.value === value);
    setActiveIndex(Math.max(selectedIndex, 0));
  }, [options, value]);

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => optionRefs.current[activeIndex]?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [activeIndex, isOpen]);

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setActiveIndex(index);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(true);
    }
    if (event.key === 'Escape') setIsOpen(false);
  };

  const onOptionKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % options.length);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + options.length) % options.length);
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(index);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className={`font-ds relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={onTriggerKeyDown}
        className="border-ds-border bg-ds-surface text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text rounded-ds-sm text-ds-body font-ds-medium focus:border-ds-border-focused focus:ring-ds-border-focused flex h-8 w-full items-center gap-2 border px-3 text-left transition-colors focus:ring-1 focus:outline-none"
      >
        {leading}
        <span className="min-w-0 flex-1 truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`text-ds-text-subtlest size-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className="border-ds-border bg-ds-surface shadow-ds-overlay rounded-ds-sm absolute top-full right-0 z-30 mt-1 w-full min-w-44 overflow-hidden border p-1"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => selectOption(index)}
                onKeyDown={(event) => onOptionKeyDown(event, index)}
                className={`rounded-ds-xs text-ds-body flex w-full items-center gap-2 px-2.5 py-1.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-ds-brand-subtlest text-ds-brand-text font-ds-medium'
                    : 'text-ds-text-subtle hover:bg-ds-neutral hover:text-ds-text'
                }`}
              >
                <span className="min-w-0 flex-1">{option.label}</span>
                {isSelected ? <Check className="text-ds-brand size-4 shrink-0" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
