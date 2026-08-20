import { LegalDocumentView } from '@/features/legal/components/LegalDocumentView';
import { PRIVACY_POLICY } from '@/features/legal/legal.content';

export function PrivacyPage() {
  return (
    <div className="font-ds mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-ds-h-lg font-ds-bold text-ds-text mb-4">{PRIVACY_POLICY.title}</h1>
      <LegalDocumentView document={PRIVACY_POLICY} />
    </div>
  );
}
