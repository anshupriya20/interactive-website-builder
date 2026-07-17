"use client";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { DragOverlay } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";

// ============================================ICONS==================================
import { HiOutlineSparkles } from "react-icons/hi2";
import { ImImage } from "react-icons/im";


// =============================================COMPONENTS============================
import CanvasBlock from "./CanvasBlock";
import SortableItem from "./SortableItem";
import { updateItemById } from "../utils/treeUtils";


function Droppable({ id, data, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id, data });
  return (
    <div
      ref={setNodeRef}
      // className={`${className || ""} ${isOver ? "ring-2 ring-indigo-500 bg-indigo-500/5" : ""}`}
      className="min-h-[100px] min-w-0 overflow-hidden rounded-lg   p-2"
    >
      {children}
    </div>
  );
}


// export default function BuilderCanvas({
//   canvasItems,
//   selectedId,
//   setSelectedId,
//   previewMode,
// }) {

export default function BuilderCanvas({
  canvasItems,
  selectedId,
  setSelectedId,
  previewMode,
  setPages,
  activePageId,
}) {

  const resizeHeight = (item, dy) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id !== activePageId
          ? page
          : {
            ...page,
            canvasItems: updateItemById(page.canvasItems, item.id, (it) => ({
              ...it,
              height: Math.max(40, (it.height || 100) + dy),
            })),
          }
      )
    );
  };


  const selectedClass = (id) => {
    if (previewMode) return "";

    return selectedId === id
      ? "outline outline-2 outline-indigo-500 outline-offset-2"
      : "outline outline-1 outline-transparent hover:outline-zinc-600 outline-offset-2";
  };

  const renderComponent = (item) => {
    if (!item) return null;
    const onClick = (e) => {
      if (previewMode) return;
      e.stopPropagation();
      setSelectedId(item.id);
    };
    const sel = selectedClass(item.id);
    switch (item.type) {
      case "section":
        return (
          <SortableItem key={item.id} id={item.id}>


            <CanvasBlock
              key={item.id}
              title="Section"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
            >
              {/* <div className="border-2 border-dashed border-indigo-500/30 rounded-xl p-6 mb-4"> */}
              <div
                // style={{ minHeight: item.height ? `${item.height}px` : undefined }}
                // className="border-2 border-dashed border-indigo-500/30 rounded-xl p-6 mb-4"

                style={{ minHeight: item.height ? `${item.height}px` : undefined }}
                className="p-6 mb-4"
              >

                <Droppable
                  id={`dropzone-${item.id}`}
                  data={{ type: "container-dropzone", containerId: item.id }}
                >
                  {item.children?.length ? (
                    <SortableContext
                      items={item.children.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {item.children.map(renderComponent)}
                    </SortableContext>
                  ) : (
                    <div className="text-zinc-500 text-sm min-h-[60px] flex items-center justify-center">
                      Drop components here
                    </div>
                  )}
                </Droppable>
              </div>
            </CanvasBlock>
          </SortableItem>
        );
      case "container":
        return (
          <SortableItem key={item.id} id={item.id}>
            <CanvasBlock
              key={item.id}
              title="Container"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
            >
              {/* <div className="mb-4 border border-zinc-700 rounded-xl p-6"> */}
              <div
                style={{
                  maxWidth: item.maxWidth ? `${item.maxWidth}px` : undefined,
                  minHeight: item.height ? `${item.height}px` : undefined,
                  marginLeft: item.maxWidth ? "auto" : undefined,
                  marginRight: item.maxWidth ? "auto" : undefined,
                }}
                className="mb-4 p-6"
              >
                <Droppable
                  id={`dropzone-${item.id}`}
                  data={{ type: "container-dropzone", containerId: item.id }}
                >
                  {item.children?.length ? (
                    <SortableContext
                      items={item.children.map((c) => c.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {item.children.map(renderComponent)}
                    </SortableContext>
                  ) : (
                    <div className="text-zinc-500 text-sm min-h-[60px] flex items-center justify-center">
                      Drop components here
                    </div>
                  )}
                </Droppable>
              </div>
            </CanvasBlock>
          </SortableItem>
        );

      case "grid": {
        const cells = item.children || [];
        return (
          <SortableItem key={item.id} id={item.id}>
            <CanvasBlock
              title="Grid"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
            >
              {/* <div
                style={{ gridTemplateColumns: `repeat(${item.columns}, 1fr)`, gap: `${item.gap}px` }}
                className="grid mb-4"
              > */}
              <div
                style={{
                  gridTemplateColumns: `repeat(${item.columns}, 1fr)`,
                  gap: `${item.gap}px`,
                  minHeight: item.height ? `${item.height}px` : undefined,
                }}
                className="grid mb-4"
              >
                {cells.map((cell) => (
                  <Droppable
                    key={cell.id}
                    id={`dropzone-${cell.id}`}
                    data={{ type: "container-dropzone", containerId: cell.id }}
                    className="min-h-[100px] rounded-lg bg-zinc-800/50 border border-dashed border-zinc-700 p-2"
                  >
                    {cell.children?.length ? (
                      <SortableContext items={cell.children.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                        {cell.children.map(renderComponent)}
                      </SortableContext>
                    ) : (
                      <div className="text-zinc-600 text-xs flex items-center justify-center h-full min-h-[80px]">
                        Drop here
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </CanvasBlock>
          </SortableItem>
        );
      }

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
          <SortableItem
            key={item.id}
            id={item.id}          >
            <CanvasBlock
              key={item.id}
              title="Heading"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
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
          </SortableItem>
        );
      }

      case "text":
        return (
          <SortableItem
            key={item.id}
            id={item.id}          >
            <CanvasBlock
              key={item.id}
              title="Text"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
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
          </SortableItem>
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
          <SortableItem
            key={item.id}
            id={item.id}          >
            <CanvasBlock
              key={item.id}
              title="Button"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
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
                className={`pointer-events-none transition-all font-medium m-5

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
          </SortableItem>
        );

      }

      case "image":
        return (
          <SortableItem
            key={item.id}
            id={item.id}          >
            <CanvasBlock
              key={item.id}
              title="Image"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
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
                  <ImImage size={32} className="text-blue-500" /> No Image
                </div>
              )}
            </CanvasBlock>
          </SortableItem>

        );

      case "input":
        return (
          <SortableItem
            key={item.id}
            id={item.id}          >
            <CanvasBlock
              key={item.id}
              title="Input Field"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
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
          </SortableItem>
        );

      case "textarea":
        return (
          <SortableItem
            key={item.id}
            id={item.id}          >
            <CanvasBlock
              key={item.id}
              title="TextArea"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
            >
              <div
                key={item.id}
                onClick={onClick}
                className={`mb-4 p-2 cursor-pointer rounded-lg transition-all ${selectedClass(item.id)}`}
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
          </SortableItem>
        );

      case "checkbox":
        return (
          <SortableItem
            key={item.id}
            id={item.id}          >
            <CanvasBlock
              key={item.id}
              title="Checkbox"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
            >

              <label
                key={item.id}
                onClick={onClick}
                className={` flex items-center gap-3 mb-4 p-3 rounded-lg cursor-pointer  ${selectedClass(item.id)} `}
              >
                <input type="checkbox" />
                <span>{item.label}</span>
              </label>
            </CanvasBlock>
          </SortableItem>
        );

      case "radiobutton":
        return (
          <SortableItem
            key={item.id}
            id={item.id}          >
            <CanvasBlock
              key={item.id}
              title="Radio Button"
              selected={selectedId === item.id}
              onClick={onClick}
              previewMode={previewMode}
              height={item.height}
              onResize={(dy) => resizeHeight(item, dy)}
            >

              <div
                key={item.id}
                onClick={onClick}
                className={`  mb-4 p-3  rounded-lg cursor-pointer ${selectedClass(item.id)}  `}
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
          </SortableItem>
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
  }


  // console.log(
  //   "Canvas Items",
  //   canvasItems.length,
  //   canvasItems.map(i => i.id)
  // );


  return (
    <main className="flex-1 bg-[#0A0A0A] min-h-0 overflow-auto p-8">
      <div
        className={
          previewMode
            ? "w-full"
            : "mx-auto max-w-5xl"
        }
      >
        <div className="min-h-[1200px] rounded-2xl border border-zinc-800 bg-[#111111] shadow-2xl">
          {/* Browser Bar */}
          {!previewMode && (
            <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          )}


          {/* Canvas Content */}
          <div className="p-8">
            <Droppable id="canvas-root" data={{ type: "canvas-root" }}>
              {canvasItems?.length === 0 ? (
                <div className="flex items-center justify-center min-h-screen px-6">
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
                      Drag a component from the left panel and drop it here.
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm">
                      ✨ Drag components into the canvas
                    </div>
                  </div>
                </div>
              ) : (
                <SortableContext
                  items={canvasItems.map((item) => item.id.toString())}
                  strategy={verticalListSortingStrategy}
                >
                  {canvasItems.map(renderComponent)}
                </SortableContext>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </main>
  );
}


