import { LegalDocumentView } from '@/features/legal/components/LegalDocumentView';
import { TERMS_OF_SERVICE } from '@/features/legal/legal.content';

export function TermsPage() {
  return (
    <div className="font-ds mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-ds-h-lg font-ds-bold text-ds-text mb-4">{TERMS_OF_SERVICE.title}</h1>
      <LegalDocumentView document={TERMS_OF_SERVICE} />
    </div>
  );
}
