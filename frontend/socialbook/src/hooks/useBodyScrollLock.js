import { useEffect } from 'react';

let lockCount = 0;
let savedHtmlOverflow = '';
let savedBodyOverflow = '';

/** Locks document scroll while `locked` is true; supports nested modals safely. */
export default function useBodyScrollLock(locked = true) {
  useEffect(() => {
    if (!locked) return undefined;

    if (lockCount === 0) {
      savedHtmlOverflow = document.documentElement.style.overflow;
      savedBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.documentElement.style.overflow = savedHtmlOverflow;
        document.body.style.overflow = savedBodyOverflow;
      }
    };
  }, [locked]);
}
