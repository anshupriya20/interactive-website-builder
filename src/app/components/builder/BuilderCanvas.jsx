"use client";

// ============================================ICONS==================================
import { HiOutlineSparkles } from "react-icons/hi2";
import { ImImage } from "react-icons/im";


// =============================================COMPONENTS============================
import CanvasBlock from "./CanvasBlock";

export default function BuilderCanvas({
  canvasItems,
  selectedId,
  setSelectedId,
  // activePage,
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
            {canvasItems?.length === 0 ? (
              <div className="flex items-center justify-center min-h-[80vh] px-6">
                <div className="text-center max-w-lg">
                  <div className="flex justify-center mb-6">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 shadow-sm">
                      <HiOutlineSparkles size={42} className="text-blue-600" />
                    </div>
                  </div>

                  <h2 className="text-4xl font-bold text-blue-800 mb-3">
                    Start Building
                  </h2>

                  <p className="text-slate-500 text-base leading-relaxed mb-6">
                    Select a component from the left panel and start designing
                    your form visually using drag and drop.
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm">
                    ✨ Drag components into the canvas
                  </div>
                </div>
              </div>
            ) : (
              canvasItems?.map((item) => {
                if (!item) return null;

                const onClick = () => setSelectedId(item.id);
                const sel = selectedClass(item.id);

                switch (item.type) {
                  case "section":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Section"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

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
                      </CanvasBlock>
                    );

                  case "container":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Container"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

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
                      </CanvasBlock>
                    );

                  case "grid":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Grid"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

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
                      </CanvasBlock>
                    );
                  case "heading": {
                    const HeadingTag = item.level || "h1";

                    const fontSizeMap = {
                      h1: 48,
                      h2: 36,
                      h3: 28,
                      h4: 22,
                    };

                    const resolvedSize =
                      item.fontSize ??
                      fontSizeMap[HeadingTag] ??
                      48;

                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Heading"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >
                        <HeadingTag
                          style={{
                            fontSize: `${resolvedSize}px`,
                            color: item.color || "#ffffff",
                            lineHeight: 1.2,
                          }}
                          className="font-bold"
                        >
                          {item.text}
                        </HeadingTag>
                      </CanvasBlock>
                    );
                  }

                  case "text":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Text"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >
                        <p
                          key={item.id}
                          onClick={onClick}
                          style={{
                            fontSize: item.fontSize
                              ? `${item.fontSize}px`
                              : undefined,
                            color: item.color || undefined,
                          }}
                          className={`mb-4 text-zinc-300 break-all p-2 cursor-pointer rounded-lg transition-all ${sel}`}
                        >
                          {item.content}
                        </p>
                      </CanvasBlock>
                    );

                  case "button": {
                    console.log("BUTTON ITEM:", item);
                    const variantClass = {
                      primary:
                        "bg-indigo-600 hover:bg-indigo-500 text-white",

                      secondary:
                        "bg-zinc-800 hover:bg-zinc-700 text-white",

                      outline:
                        "bg-transparent text-white",

                      ghost:
                        "bg-transparent text-zinc-300 hover:bg-zinc-800",

                      danger:
                        "bg-red-600 hover:bg-red-500 text-white",

                      success:
                        "bg-emerald-600 hover:bg-emerald-500 text-white",

                      warning:
                        "bg-amber-500 hover:bg-amber-400 text-black",

                      link:
                        "bg-transparent text-indigo-400 underline",
                    };

                    const sizeClass = {
                      sm: "px-3 py-1 text-sm",
                      md: "px-5 py-2",
                      lg: "px-7 py-3 text-lg",
                    };

                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Button"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >
                        <button
                          style={{
                            fontSize: item.fontSize
                              ? `${item.fontSize}px`
                              : undefined,

                            fontWeight:
                              item.fontWeight || "500",

                            textTransform:
                              item.textTransform || "none",

                            letterSpacing:
                              item.letterSpacing
                                ? `${item.letterSpacing}px`
                                : undefined,

                            color:
                              ["outline", "ghost", "link"].includes(
                                item.variant?.trim()
                              )
                                ? item.color
                                : undefined,
                            backgroundColor:
                              item.variant?.trim() === "primary"
                                ? item.bgColor
                                : undefined,

                            borderColor:
                              item.borderColor ||
                              undefined,

                            borderWidth:
                              item.borderWidth
                                ? `${item.borderWidth}px`
                                : undefined,

                            borderStyle:
                              item.borderStyle ||
                              undefined,

                            borderRadius:
                              item.radius
                                ? `${item.radius}px`
                                : "8px",
                          }}
                          className={`
          pointer-events-none
          transition-all
          font-medium

          ${variantClass[
                            item.variant || "primary"
                            ]
                            }

          ${sizeClass[
                            item.size || "md"
                            ]
                            }
        `}
                        >
                          {item.label}
                        </button>
                      </CanvasBlock>
                    );
                  }

                  // case "image":
                  //   return (
                  //     <CanvasBlock
                  //       key={item.id}
                  //       title="Image"
                  //       selected={selectedId === item.id}
                  //       onClick={onClick}
                  //     >

                  //       <div
                  //         key={item.id}
                  //         onClick={onClick}
                  //         style={{
                  //           width: item.width ? `${item.width}px` : "500px",

                  //           height: item.height ? `${item.height}px` : "200px",
                  //         }}
                  //         className={` border border-zinc-800 rounded-xl overflow-hidden  bg-zinc-900  cursor-pointer transition-all ${sel} `}
                  //       >
                  //         {item.src ? (
                  //           <img
                  //             src={item.src}
                  //             alt={item.alt}
                  //             className="w-full h-full object-cover"
                  //           />
                  //         ) : (
                  //           <div className="flex items-center justify-center gap-5 w-full h-full text-zinc-500">
                  //             <ImImage size={20} className="text-blue-800"/>  <span>No Image — paste a URL in Properties</span> 
                  //           </div>
                  //         )}
                  //       </div>
                  //     </CanvasBlock>
                  //   );

                  case "image":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Image"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >
                        {item.src ? (
                          <img
                            src={item.src}
                            alt={item.alt}
                            style={{
                              width: item.width
                                ? `${item.width}px`
                                : "100%",
                              height: item.height
                                ? `${item.height}px`
                                : "auto",
                            }}
                            className="
            rounded-xl
            object-cover
            max-w-full
          "
                          />
                        ) : (
                          <div
                            className="
            flex
            items-center
            justify-center
            h-40
            rounded-xl
            bg-zinc-900
            text-zinc-500
          "
                          >
                            🖼 No Image
                          </div>
                        )}
                      </CanvasBlock>
                    );

                  case "input":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Input Field"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

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
                      </CanvasBlock>
                    );

                  case "textarea":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="TextArea"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

                        <div
                          key={item.id}
                          onClick={onClick}
                          className={`mb-4 p-2 cursor-pointer rounded-lg transition-all ${sel}`}
                        >
                          <label className="block text-sm mb-2 text-zinc-400 break-all">
                            {item.label}
                          </label>
                          <textarea
                            readOnly
                            placeholder={item.placeholder}
                            rows={4}
                            className="w-full h-auto overflow-y-scroll p-3 rounded-lg bg-zinc-900 border border-zinc-800 outline-none  break-all"
                          />
                        </div>
                      </CanvasBlock>
                    );

                  case "checkbox":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Checkbox"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

                        <label
                          key={item.id}
                          onClick={onClick}
                          className={` flex items-center gap-3 mb-4 p-3 rounded-lg cursor-pointer  ${sel} `}
                        >
                          <input type="checkbox" />
                          <span>{item.label}</span>
                        </label>
                      </CanvasBlock>
                    );

                  case "radiobutton":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Radio Button"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

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
                      </CanvasBlock>
                    );

                  case "section":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Section"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

                        <div
                          key={item.id}
                          onClick={onClick}
                          className={`border-2 border-dashed border-indigo-500/30 rounded-xl p-10 mb-4 cursor-pointer transition-all ${sel}`}
                        >
                          <span className="text-xs text-zinc-600 uppercase tracking-widest">
                            Section
                          </span>
                        </div>
                      </CanvasBlock>
                    );

                  case "container":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Container"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

                        <div
                          key={item.id}
                          onClick={onClick}
                          className={`max-w-5xl mx-auto border border-zinc-700 rounded-xl p-8 mb-4 cursor-pointer transition-all ${sel}`}
                        >
                          <span className="text-xs text-zinc-600 uppercase tracking-widest">
                            Container
                          </span>
                        </div>
                      </CanvasBlock>
                    );

                  case "grid":
                    return (
                      <CanvasBlock
                        key={item.id}
                        title="Grid"
                        selected={selectedId === item.id}
                        onClick={onClick}
                      >

                        <div
                          key={item.id}
                          onClick={onClick}
                          className={`grid grid-cols-2 gap-4 mb-4 p-2 cursor-pointer rounded-lg transition-all ${sel}`}
                        >
                          <div className="h-24 rounded-lg bg-zinc-800" />
                          <div className="h-24 rounded-lg bg-zinc-800" />
                        </div>
                      </CanvasBlock>
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


