import { useEffect } from 'react';

/** Locks document scroll while `locked` is true; restores previous overflow on cleanup. */
export default function useBodyScrollLock(locked = true) {
  useEffect(() => {
    if (!locked) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, [locked]);
}
