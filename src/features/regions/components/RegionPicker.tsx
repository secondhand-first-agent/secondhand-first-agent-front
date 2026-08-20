import { useQuery } from '@tanstack/react-query';
import { Check, MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { LocationCandidate } from '@/api/locations/location.schema';
import { getErrorMessage } from '@/api/response';
import { toSelectableRegions } from '@/features/regions/region';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { MIN_LOCATION_QUERY_LENGTH, queryFactory } from '@/queryFactory';

interface RegionPickerProps {
  currentRegion?: string | null;
  onSave: (region: string) => void;
  onCancel: () => void;
  isSaving?: boolean;
  saveError?: string;
}

const MESSAGE_CLASS = 'text-ds-body text-ds-text-subtlest px-1 py-6 text-center';

export function RegionPicker({ currentRegion, onSave, onCancel, isSaving = false, saveError }: RegionPickerProps) {
  const [keyword, setKeyword] = useState('');
  const [picked, setPicked] = useState<LocationCandidate | null>(null);

  const query = useDebouncedValue(keyword.trim(), 300);
  const { data, isPending, isFetching, isError, error } = useQuery(queryFactory.locations.search(query));

  const candidates = useMemo(() => toSelectableRegions(data ?? []), [data]);
  const isTooShort = query.length < MIN_LOCATION_QUERY_LENGTH;
  const isSearching = !isTooShort && (isPending || isFetching);

  return (
    <div className="mt-3">
      <div className="border-ds-border-input bg-ds-surface rounded-ds-sm focus-within:border-ds-border-focused focus-within:ring-ds-border-focused flex items-center gap-2 border px-2 transition-colors focus-within:ring-1">
        <Search className="text-ds-text-subtlest size-4 shrink-0" aria-hidden />
        <input
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value);
            setPicked(null);
          }}
          autoFocus
          aria-label="동네 검색"
          placeholder="동네 이름을 입력하세요 (예: 판교동)"
          className="text-ds-text placeholder:text-ds-text-subtlest text-ds-body min-w-0 flex-1 bg-transparent py-2 outline-none"
        />
      </div>

      <p className="text-ds-body-sm text-ds-text-subtlest mt-1.5">
        읍·면·동까지 선택해야 저장할 수 있어요. 목록에서 골라 주세요.
      </p>

      <div className="border-ds-border rounded-ds-sm mt-2 max-h-60 overflow-y-auto border">
        {isTooShort ? (
          <p className={MESSAGE_CLASS}>동네 이름을 {MIN_LOCATION_QUERY_LENGTH}글자 이상 입력해 주세요.</p>
        ) : isSearching ? (
          <p className={MESSAGE_CLASS}>찾는 중…</p>
        ) : isError ? (
          <p className={`${MESSAGE_CLASS} text-ds-danger-text`}>{getErrorMessage(error)}</p>
        ) : candidates.length === 0 ? (
          <p className={MESSAGE_CLASS}>‘{query}’ 에 해당하는 읍·면·동이 없어요.</p>
        ) : (
          <ul>
            {candidates.map((candidate) => {
              const isPicked = picked?.regionCode === candidate.regionCode;
              return (
                <li key={candidate.regionCode}>
                  <button
                    type="button"
                    onClick={() => setPicked(candidate)}
                    aria-pressed={isPicked}
                    className={`text-ds-body flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                      isPicked ? 'bg-ds-brand-subtlest text-ds-brand-text' : 'text-ds-text-subtle hover:bg-ds-neutral'
                    }`}
                  >
                    <MapPin className="size-3.5 shrink-0 opacity-60" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="font-ds-medium text-ds-text block truncate">{candidate.region}</span>
                      <span className="text-ds-text-subtlest text-ds-body-sm block truncate">{candidate.address}</span>
                    </span>
                    {isPicked ? <Check className="size-4 shrink-0" strokeWidth={2.5} aria-hidden /> : null}
                    {!isPicked && candidate.region === currentRegion ? (
                      <span className="text-ds-body-sm text-ds-text-subtlest shrink-0">현재</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {saveError ? <p className="text-ds-danger-text text-ds-body-sm mt-2">{saveError}</p> : null}

      <div className="mt-3 flex items-center justify-end gap-2">
        <span className="text-ds-body-sm text-ds-text-subtlest mr-auto truncate">
          {picked ? `선택: ${picked.region}` : '선택된 동네가 없어요'}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-ds-body text-ds-text-subtle hover:text-ds-text px-3 py-1.5"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => picked && onSave(picked.region)}
          disabled={!picked || isSaving}
          className="bg-ds-brand hover:bg-ds-brand-hovered rounded-ds-sm text-ds-body font-ds-medium text-ds-text-inverse disabled:bg-ds-neutral disabled:text-ds-text-disabled px-4 py-1.5 transition-colors"
        >
          저장
        </button>
      </div>
    </div>
  );
}
