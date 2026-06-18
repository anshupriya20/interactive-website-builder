export default function CanvasBlock({
  title,
  selected,
  children,
  onClick,
  previewMode,

}) {
  if (previewMode) {
    return children;
  }
  return (
    <div
      onClick={onClick}
      className={`
        mb-5
        overflow-hidden
        rounded-2xl
        transition-all

        ${selected
          ? "border border-indigo-500 shadow-lg shadow-indigo-500/10"
          : "border border-zinc-800"
        }
      `}
    >
      <div
        className="
          px-4
          py-2
          border-b
          border-zinc-800
          bg-zinc-900/50
        "
      >
        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            text-zinc-500
          "
        >
          {title}
        </span>
      </div>

      <div className="p-4 ">
        {children}
      </div>
    </div>
  );
}