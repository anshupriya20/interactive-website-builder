"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";

export default function SidebarItem({
  componentName,
  implemented,
  onAdd,
  icon: Icon,
  children,
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `sidebar-${componentName}`,
    data: {
      source: "sidebar",
      component: componentName,
    },
    disabled: !implemented,
  });

  console.log("SidebarItem:", componentName, listeners);
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onAdd(componentName)}
      disabled={!implemented}
      className={`
        w-full
        text-left
        p-3
        rounded-xl
        border
        transition-all
        duration-200
        hover:-translate-y-0.5
        ${
          implemented
            ? `
              border-zinc-800
              bg-zinc-900
              hover:border-indigo-500/40
              hover:bg-zinc-800/50
              cursor-grab
              active:cursor-grabbing
            `
            : `
              border-zinc-900
              bg-zinc-950
              text-zinc-600
              cursor-not-allowed
            `
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon
              size={18}
              className={
                implemented
                  ? "text-zinc-400"
                  : "text-zinc-700"
              }
            />

          )}

          <span>{componentName}</span>
        </div>

        {!implemented ? (
          <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">
            Coming Soon
          </span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-zinc-600"
          >
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        )}
      </div>

      {children}
    </button>
  );
}