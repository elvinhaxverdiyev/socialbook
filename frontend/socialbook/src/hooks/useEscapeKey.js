import { useEffect } from 'react';

/** Calls `onEscape` when Escape is pressed. */
export default function useEscapeKey(onEscape, enabled = true) {
  useEffect(() => {
    if (!enabled || typeof onEscape !== 'function') return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, enabled]);
}
