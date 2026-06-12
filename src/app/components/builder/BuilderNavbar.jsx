"use client";
import toast from "react-hot-toast";

export default function BuilderNavbar({
  setActivePageId,
  setPages,
  setSelectedId,
}) {
  const handleClearProject = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Clear the entire project?</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="
            px-3 py-1 rounded-md
            bg-zinc-700 hover:bg-zinc-600
            text-white text-sm
          "
          >
            Cancel
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("craftsite-builder");

              setPages([
                {
                  id: "home",
                  name: "Home",
                  canvasItems: [],
                },
              ]);

              setActivePageId("home");
              setSelectedId(null);

              toast.dismiss(t.id);

              toast.success("Project cleared successfully");
            }}
            className="
            px-3 py-1 rounded-md
            bg-red-600 hover:bg-red-500
            text-white text-sm
          "
          >
            Clear
          </button>
        </div>
      </div>
    ));
  };
  return (
    <header className="h-16 border-b border-zinc-800 bg-[#111111] px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-xl">
          Craft<span className="text-indigo-400">Site</span>
        </h1>

        <span className="text-zinc-600">/</span>

        <span className="text-zinc-400 text-sm">Untitled Project</span>
      </div>

      <div className="flex gap-3">
        <button className="px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600">
          Preview
        </button>

        <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">
          Publish
        </button>
        <button
          onClick={handleClearProject}
          className=" p-2 border border-red-500 text-white font-medium rounded-lg bg-red-500 hover:bg-red-600 transition"
        >
          Clear
        </button>
      </div>
    </header>
  );
}
