import { useLogsLayoutStore } from "@/stores/useLogsLayoutStore";
import { useState, type PropsWithChildren, type RefObject } from "react";

type Props = {
  containerRef: RefObject<HTMLElement | null>;
};

const MIN_SIZE_PX = 500;
const MAX_SIZE_PERCENT = 0.9;

export default function DraggableSidebar({
  containerRef,
  children,
}: PropsWithChildren<Props>) {
  const { setSidebarSizePx } = useLogsLayoutStore();

  const [isDragging, setIsDragging] = useState(false);

  const getCurrentSidebarSize = (e: React.PointerEvent<HTMLDivElement>) => {
    const newSize = window.innerWidth - e.clientX;

    // Add a minimum / maximum size to the sidebar
    const maxSize = window.innerWidth * MAX_SIZE_PERCENT;
    return Math.min(Math.max(newSize, MIN_SIZE_PX), maxSize);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    document.body.style.userSelect = "none";
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (!containerRef?.current) return;

    containerRef.current.style.gridTemplateColumns = `1fr ${getCurrentSidebarSize(e)}px`;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    document.body.style.userSelect = "";

    // Save the sidebar state so it loads this
    // size the next time the user opens it again.
    setSidebarSizePx(getCurrentSidebarSize(e));
  };

  return (
    <>
      {/*
        HACK:
        Makes the user cursor stay as "e-resize" while dragging.
        `document.body.style.cursor` does not work since it gets overwritten by scrollbars
      */}
      {isDragging && <div className="fixed inset-0 z-9999 cursor-e-resize" />}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-e-resize z-10 hover:bg-input-highlight"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      ></div>
      {children}
    </>
  );
}
