import { useCallback, useRef, useState } from 'react';
import { clampStickerPosition } from '../../data/shelfTheme';

export default function DraggableShelfSticker({
  sticker,
  editable = false,
  onMove,
  className = 'book-shelf__sticker',
}) {
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ pointerId: null, moved: false });

  const stickerId = sticker?.id || sticker?.emoji || '';
  const posX = Number(sticker?.x) || 50;
  const posY = Number(sticker?.y) || 50;

  const updatePosition = useCallback(
    (clientX, clientY, container) => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      const pos = clampStickerPosition(x, y);
      onMove?.(stickerId, pos.x, pos.y);
    },
    [onMove, stickerId],
  );

  const handlePointerDown = (event) => {
    if (!editable) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current = { pointerId: event.pointerId, moved: false };
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!editable || dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.moved = true;
    const container = event.currentTarget.closest('[data-sticker-dropzone]');
    if (container instanceof HTMLElement) {
      updatePosition(event.clientX, event.clientY, container);
    }
  };

  const handlePointerUp = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.pointerId = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handlePointerCancel = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) return;
    dragRef.current.pointerId = null;
    setDragging(false);
  };

  if (!sticker?.emoji) return null;

  return (
    <span
      className={
        className +
        (editable ? ' book-shelf__sticker--draggable' : '') +
        (dragging ? ' book-shelf__sticker--dragging' : '')
      }
      style={{ left: `${posX}%`, top: `${posY}%` }}
      aria-hidden={editable ? undefined : true}
      role={editable ? 'button' : undefined}
      tabIndex={editable ? 0 : undefined}
      aria-label={editable ? `Stiker ${sticker.emoji}, sürükləyib yerləşdir` : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {sticker.emoji}
    </span>
  );
}
