"use client";
import { useState } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";

function LayerRow({ item, depth, selectedId, setSelectedId }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.children?.length > 0;
  const isSelected = selectedId === item.id;

  return (
    <div>
      <div
        onClick={() => setSelectedId(item.id)}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        className={`flex items-center gap-1.5 py-1.5 pr-2 rounded-md cursor-pointer text-sm
          ${isSelected ? "bg-indigo-500/20 text-indigo-300" : "text-zinc-400 hover:bg-zinc-800"}`}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="shrink-0 text-zinc-500 hover:text-zinc-300"
          >
            {expanded ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
          </button>
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <span className="truncate">{item.name || item.type}</span>
      </div>

      {hasChildren && expanded && (
        <div>
          {item.children.map((child) => (
            <LayerRow
              key={child.id}
              item={child}
              depth={depth + 1}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LayersPanel({ canvasItems, selectedId, setSelectedId }) {
  return (
     <div className="mt-4">
            <h2 className="text-sm font-semibold text-zinc-300 mb-4">
                Layers
            </h2>

            {canvasItems.length === 0 ? (
                <p className="text-xs text-zinc-600">
                    No elements yet
                </p>
            ) : (
                canvasItems.map((item) => (
                    <LayerRow
                        key={item.id}
                        item={item}
                        depth={0}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                    />
                ))
            )}
        </div>
  );
}