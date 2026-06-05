export default function BuilderNavbar() {
  return (
    <header className="h-16 border-b border-zinc-800 bg-[#111111] px-6 flex items-center justify-between">

      <div className="flex items-center gap-3">
        <h1 className="font-bold text-xl">
          Craft<span className="text-indigo-400">Site</span>
        </h1>

        <span className="text-zinc-600">
          /
        </span>

        <span className="text-zinc-400 text-sm">
          Untitled Project
        </span>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600">
          Preview
        </button>

        <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">
          Publish
        </button>
      </div>

    </header>
  );
}