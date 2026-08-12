import { useEffect } from 'react';
import { sanitizeDocumentTitle } from '../utils/security';

const BASE_TITLE = 'Kitabci.com — Kitab İcması';

/** Sets `document.title` while mounted; restores the base brand title on cleanup. */
export default function usePageTitle(title) {
  useEffect(() => {
    const safeTitle = title?.trim() ? sanitizeDocumentTitle(title) : '';
    const next = safeTitle ? `${safeTitle} · Kitabci.com` : BASE_TITLE;
    document.title = next;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
