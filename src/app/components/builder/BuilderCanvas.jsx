"use client";

export default function BuilderCanvas({
    canvasItems,
    selectedId,
    setSelectedId,
}) {
    const selectedClass = (id) =>
        selectedId === id
            ? "outline outline-2 outline-indigo-500 outline-offset-2"
            : "outline outline-1 outline-transparent hover:outline-zinc-600 outline-offset-2";

    return (
        <main className="flex-1 bg-[#0A0A0A] min-h-0 overflow-auto p-8">
            <div className="mx-auto max-w-5xl">
                <div className="min-h-[1200px] rounded-2xl border border-zinc-800 bg-[#111111] shadow-2xl">
                    {/* Browser Bar */}
                    <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>

                    {/* Canvas Content */}
                    <div className="p-8">
                        {canvasItems.length === 0 ? (
                            <div className="flex items-center justify-center min-h-[800px]">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">✨</div>
                                    <h2 className="text-3xl font-bold mb-3">Start Building</h2>
                                    <p className="text-zinc-500 max-w-md">
                                        Select a component from the left panel and begin designing
                                        your website visually.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            canvasItems.map((item) => {
                                if (!item) return null;

                                const onClick = () => setSelectedId(item.id);
                                const sel = selectedClass(item.id);

                                switch (item.type) {
                                    case "section":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                style={{
                                                    padding: `${item.padding}px`,
                                                }}
                                                className={`  border-2  border-dashed  border-indigo-500/30  rounded-xl  mb-4 cursor-pointer ${sel} `}
                                            >
                                                Section
                                            </div>
                                        );

                                    case "container":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                style={{
                                                    maxWidth: `${item.maxWidth}px`,
                                                }}
                                                className={`  mx-auto border  border-zinc-700  rounded-xl  p-8 mb-4  cursor-pointer  ${sel}  `}
                                            >
                                                Container
                                            </div>
                                        );

                                    case "grid":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                style={{
                                                    gridTemplateColumns: `repeat(${item.columns},1fr)`,
                                                    gap: `${item.gap}px`,
                                                }}
                                                className={` grid  mb-4 cursor-pointer  ${sel} `}
                                            >
                                                {Array.from({
                                                    length: item.columns,
                                                }).map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className=" h-24 rounded-lg bg-zinc-800"
                                                    />
                                                ))}
                                            </div>
                                        );
                                    case "heading": {
                                        const HeadingTag = item.level || "h1";
                                        const fontSizeMap = { h1: 48, h2: 36, h3: 28, h4: 22 };
                                        const resolvedSize =
                                            item.fontSize ?? fontSizeMap[HeadingTag] ?? 48;
                                        return (
                                            <HeadingTag
                                                key={`${item.id}-${item.level}`}
                                                onClick={onClick}
                                                style={{
                                                    fontSize: `${resolvedSize}px`,
                                                    color: item.color || "#ffffff",
                                                    lineHeight: 1.2,
                                                }}
                                                className={`font-bold mb-6 p-2 cursor-pointer rounded-lg transition-all ${sel}`}
                                            >
                                                {item.text}
                                            </HeadingTag>
                                        );
                                    }

                                    case "text":
                                        return (
                                            <p
                                                key={item.id}
                                                onClick={onClick}
                                                style={{
                                                    fontSize: item.fontSize
                                                        ? `${item.fontSize}px`
                                                        : undefined,
                                                    color: item.color || undefined,
                                                }}
                                                className={`mb-4 text-zinc-300 p-2 cursor-pointer rounded-lg transition-all ${sel}`}
                                            >
                                                {item.content}
                                            </p>
                                        );

                                    case "button": {
                                        const variantClass =
                                            {
                                                primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
                                                secondary: "bg-zinc-700 hover:bg-zinc-600 text-white",
                                                outline:
                                                    "border border-zinc-500 hover:border-white text-white bg-transparent",
                                                ghost: "hover:bg-zinc-800 text-zinc-300 bg-transparent",
                                            }[item.variant] || "bg-indigo-600 text-white";

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                className={`inline-block mb-4 p-1 cursor-pointer rounded-lg transition-all ${sel}`}
                                            >
                                                <button
                                                    style={{
                                                        fontSize: item.fontSize
                                                            ? `${item.fontSize}px`
                                                            : undefined,
                                                        color: item.color || undefined,
                                                        backgroundColor: item.bgColor || undefined,
                                                    }}
                                                    className={`px-5 py-2 rounded-lg font-medium pointer-events-none ${!item.bgColor && !item.color ? variantClass : ""}`}
                                                >
                                                    {item.label}
                                                </button>
                                            </div>
                                        );
                                    }

                                    case "image":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                style={{
                                                    width: item.width ? `${item.width}px` : "300px",

                                                    height: item.height ? `${item.height}px` : "200px",
                                                }}
                                                className={` border border-zinc-800 rounded-xl overflow-hidden  bg-zinc-900  cursor-pointer transition-all ${sel} `}
                                            >
                                                {item.src ? (
                                                    <img
                                                        src={item.src}
                                                        alt={item.alt}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full text-zinc-500">
                                                        🖼 No Image — paste a URL in Properties
                                                    </div>
                                                )}
                                            </div>
                                        );

                                    case "input":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                className={`mb-4 p-2 cursor-pointer rounded-lg transition-all ${sel}`}
                                            >
                                                <label className="block text-sm mb-2 text-zinc-400">
                                                    {item.label}
                                                </label>
                                                <input
                                                    readOnly
                                                    placeholder={item.placeholder}
                                                    className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 outline-none pointer-events-none"
                                                />
                                            </div>
                                        );

                                    case "textarea":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                className={`mb-4 p-2 cursor-pointer rounded-lg transition-all ${sel}`}
                                            >
                                                <label className="block text-sm mb-2 text-zinc-400">
                                                    {item.label}
                                                </label>
                                                <textarea
                                                    readOnly
                                                    placeholder={item.placeholder}
                                                    rows={4}
                                                    className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 outline-none pointer-events-none"
                                                />
                                            </div>
                                        );

                                    case "checkbox":
                                        return (
                                            <label
                                                key={item.id}
                                                onClick={onClick}
                                                className={` flex items-center gap-3 mb-4 p-3 rounded-lg cursor-pointer  ${sel} `}
                                            >
                                                <input type="checkbox" />
                                                <span>{item.label}</span>
                                            </label>
                                        );

                                    case "radiobutton":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                className={`  mb-4 p-3  rounded-lg cursor-pointer ${sel}  `}
                                            >
                                                {item.options.map((option, index) => (
                                                    <label
                                                        key={index}
                                                        className="  flex items-center gap-3 mb-2"
                                                    >
                                                        <input type="radio" name={item.id} />

                                                        <span>{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        );

                                    case "section":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                className={`border-2 border-dashed border-indigo-500/30 rounded-xl p-10 mb-4 cursor-pointer transition-all ${sel}`}
                                            >
                                                <span className="text-xs text-zinc-600 uppercase tracking-widest">
                                                    Section
                                                </span>
                                            </div>
                                        );

                                    case "container":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                className={`max-w-5xl mx-auto border border-zinc-700 rounded-xl p-8 mb-4 cursor-pointer transition-all ${sel}`}
                                            >
                                                <span className="text-xs text-zinc-600 uppercase tracking-widest">
                                                    Container
                                                </span>
                                            </div>
                                        );

                                    case "grid":
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={onClick}
                                                className={`grid grid-cols-2 gap-4 mb-4 p-2 cursor-pointer rounded-lg transition-all ${sel}`}
                                            >
                                                <div className="h-24 rounded-lg bg-zinc-800" />
                                                <div className="h-24 rounded-lg bg-zinc-800" />
                                            </div>
                                        );

                                    default:
                                        return (
                                            <div
                                                key={item.id}
                                                className="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 mb-4"
                                            >
                                                Unsupported: {item.type}
                                            </div>
                                        );
                                }
                            })
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
