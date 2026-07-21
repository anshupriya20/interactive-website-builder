// export default function CanvasBlock({
//   title,
//   selected,
//   children,
//   onClick,
//   previewMode,

// }) {
//   if (previewMode) {
//     return children;
//   }
//   return (
//     <div
//       onClick={onClick}
//       className={`
//         mb-5
//         overflow-hidden
//         rounded-2xl
//         transition-all

//         ${selected
//           ? "border border-indigo-500 shadow-lg shadow-indigo-500/10"
//           : "border border-zinc-800"
//         }
//       `}
//     >
//       <div
//         className="
//           px-4
//           py-2
//           border-b
//           border-zinc-800
//           bg-zinc-900/50
//         "
//       >
//         <span
//           className="
//             text-[10px]
//             uppercase
//             tracking-[0.2em]
//             text-zinc-500
//           "
//         >
//           {title}
//         </span>
//       </div>

//       <div className="p-4 ">
//         {children}
//       </div>
//     </div>
//   );
// }

"use client";
import { useRef } from "react";

export default function CanvasBlock({
  selected,
  children,
  onClick,
  previewMode,
  height,
  onResize,      
  onResizeEnd,   
}) {
  if (previewMode) {
    return children;
  }

  const startYRef = useRef(null);

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    startYRef.current = e.clientY;

    const handleMove = (moveEvent) => {
      const dy = moveEvent.clientY - startYRef.current;
      startYRef.current = moveEvent.clientY;
      onResize?.(dy);
    };
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      onResizeEnd?.();
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  return (
    <div
      onClick={onClick}
      className={`
        relative mb-5 rounded-xl transition-all
        ${selected
          ? "outline outline-2 outline-indigo-500 outline-offset-2"
          : "outline outline-1 outline-transparent outline-zinc-700 outline-offset-2"
        }
      `}
    >
      <div style={{ minHeight: height ? `${height}px` : undefined }}     >
        {children}
      </div>

      {selected && onResize && (
        <div
          onPointerDown={handleResizeStart}
          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-indigo-500 rounded-sm cursor-ns-resize z-20 hover:scale-125 transition-transform"
        />
      )}
    </div>
  );
}