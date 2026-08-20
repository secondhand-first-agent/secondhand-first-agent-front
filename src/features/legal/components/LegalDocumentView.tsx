import type { LegalDocument } from '@/features/legal/legal.content';

/**
 * 약관 본문을 그립니다. 제목은 부르는 쪽(페이지의 h1, 모달의 헤더)이 이미
 * 보여주고 있으므로 여기서는 시행일부터 그립니다.
 */
export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <div className="font-ds">
      <p className="text-ds-body-sm text-ds-text-subtlest">시행일: {document.effectiveDate}</p>
      <p className="text-ds-body text-ds-text-subtle mt-3">{document.intro}</p>

      <div className="mt-8 space-y-7">
        {document.sections.map((section) => (
          <section key={section.heading}>
            <h3 className="text-ds-body font-ds-semibold text-ds-text">{section.heading}</h3>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="text-ds-body text-ds-text-subtle mt-2 leading-relaxed">
                {paragraph}
              </p>
            ))}

            {section.list ? (
              <ul className="mt-2 space-y-1.5">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className="text-ds-body text-ds-text-subtle relative pl-4 leading-relaxed before:absolute before:top-2 before:left-0 before:size-1 before:rounded-full before:bg-current before:opacity-40"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
