import { useEffect } from 'react';

const BASE_TITLE = 'Rəf — Kitab Sosial Şəbəkəsi';

/** Sets `document.title` while mounted; restores the base brand title on cleanup. */
export default function usePageTitle(title) {
  useEffect(() => {
    const next = title?.trim() ? `${title.trim()} · Rəf` : BASE_TITLE;
    document.title = next;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
