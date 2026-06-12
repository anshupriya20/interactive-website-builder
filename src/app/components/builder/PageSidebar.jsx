"use client";

export default function PageSidebar({
    pages,
    activePageId,
    setActivePageId,
    setPages,
}) {

    const addPage = () => {
        const pageId = Date.now().toString();

        setPages((prev) => [
            ...prev,
            {
                id: pageId,
                name: `Page ${prev.length}`,
                canvasItems: [],
            },
        ]);
    };
    console.log(activePageId);
    return (
        <aside className="w-60 border-r border-zinc-800 bg-[#0D0D0D] p-4">
            <h2 className="text-sm font-semibold text-zinc-400 mb-6">Pages</h2>

            <div className="space-y-2">
                {pages.map((page) => (
                    <button
                        key={page.id}
                        onClick={() => setActivePageId(page.id)}
                        className={` w-full text-left px-4 py-3 rounded-xl transition-all
            ${activePageId === page.id
                                ? "bg-indigo-600 text-white"
                                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                            }
          `}
                    >
                        {page.name}
                    </button>
                ))}
            </div>
            <div className="mt-6">
                <button
                    onClick={addPage}
                    className="w-full rounded-xl bg-indigo-600 py-3 font-medium hover:bg-indigo-500 transition-all"
                >
                    + Add Page
                </button>
            </div>
        </aside>
    );
}
