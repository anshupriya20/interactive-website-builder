// // "use client";
// // import { useState, useEffect } from "react";
// // import {
// //     DndContext,
// //     PointerSensor,
// //     useSensor,
// //     useSensors,
// //     closestCenter,
// // } from "@dnd-kit/core";
// // import { arrayMove } from "@dnd-kit/sortable";

// // import BuilderNavbar from "./BuilderNavbar";
// // import BuilderSidebar from "./BuilderSidebar";
// // import BuilderCanvas from "./BuilderCanvas";
// // import PropertiesPanel from "./PropertiesPanel";
// // import PageSidebar from "./PageSidebar";

// // export default function BuilderLayout() {
// //     // const [canvasItems, setCanvasItems] = useState([]);
// //     const [selectedId, setSelectedId] = useState(null);
// //     const [isLoaded, setIsLoaded] = useState(false);
// //     const [pages, setPages] = useState([
// //         {
// //             id: "home",
// //             name: "Home",
// //             canvasItems: [],
// //         },
// //     ]);

// //     const [activePageId, setActivePageId] = useState("home");
// //     const [previewMode, setPreviewMode] = useState(false);

// //     useEffect(() => {
// //         const saved = localStorage.getItem(
// //             "craftsite-builder"
// //         );

// //         if (saved) {
// //             const data = JSON.parse(saved);

// //             setPages(data.pages || []);
// //             setActivePageId(
// //                 data.activePageId || "home"
// //             );
// //         }

// //         setIsLoaded(true);
// //     }, []);

// //     useEffect(() => {
// //         if (!isLoaded) return;

// //         localStorage.setItem(
// //             "craftsite-builder",
// //             JSON.stringify({
// //                 pages,
// //                 activePageId,
// //             })
// //         );
// //     }, [pages, activePageId, isLoaded]);

// //     useEffect(() => {
// //         localStorage.setItem("craftsite-selected", JSON.stringify(selectedId));
// //     }, [selectedId]);

// //     const sensors = useSensors(
// //         useSensor(PointerSensor, {
// //             activationConstraint: { distance: 8 },
// //         })
// //     );

// //     const activePage = pages.find((page) => page.id === activePageId);

// //     if (!isLoaded) {
// //         return (
// //             <div className="h-screen bg-black flex items-center justify-center text-zinc-500">
// //                 Loading Builder...
// //             </div>
// //         );
// //     }

// //     // const handleDragEnd = (event) => {
// //     //     console.log("DRAG END", event);
// //     //     const { active, over } = event;

// //     //     console.log("ACTIVE:", active?.id);
// //     //     console.log("OVER:", over?.id);

// //     //     if (!over) {
// //     //         console.log("NO OVER");
// //     //         return;
// //     //     }

// //     //     const currentItems = activePage?.canvasItems || [];

// //     //     const oldIndex = currentItems.findIndex(
// //     //         (item) => item.id === active.id
// //     //     );

// //     //     const newIndex = currentItems.findIndex(
// //     //         (item) => item.id === over.id
// //     //     );

// //     //     console.log({
// //     //         oldIndex,
// //     //         newIndex,
// //     //     });

// //     //     if (oldIndex === -1) return;

// //     //     if (newIndex === -1) return;

// //     //     if (oldIndex === newIndex) {
// //     //         console.log("SAME INDEX");
// //     //         return;
// //     //     }

// //     //     const reordered = arrayMove(
// //     //         currentItems,
// //     //         oldIndex,
// //     //         newIndex
// //     //     );

// //     //     console.log("REORDERED", reordered);

// //     //     setPages((prev) =>
// //     //         prev.map((page) =>
// //     //             page.id === activePageId
// //     //                 ? {
// //     //                     ...page,
// //     //                     canvasItems: reordered,
// //     //                 }
// //     //                 : page
// //     //         )
// //     //     );
// //     // };

// //     const handleDragEnd = (event) => {
// //         const { active, over } = event;
// //         if (!over) return;

// //         const isFromSidebar = active.data.current?.source === "sidebar";

// //         if (isFromSidebar) {
// //             const componentName = active.data.current.component;
// //             const template = componentTemplates[componentName]; 
// //             if (!template) return;

// //             const newComponent = { id: Date.now().toString(), name: componentName, ...template };

// //             setPages((prev) =>
// //                 prev.map((page) => {
// //                     if (page.id !== activePageId) return page;
// //                     const items = [...page.canvasItems];
// //                     const overIndex = items.findIndex((i) => i.id === over.id);
// //                     const insertAt = overIndex === -1 ? items.length : overIndex;
// //                     items.splice(insertAt, 0, newComponent);
// //                     return { ...page, canvasItems: items };
// //                 })
// //             );
// //             return;
// //         }
// //         const reordered = arrayMove(
// //             currentItems,
// //             oldIndex,
// //             newIndex
// //         );
// //     };
// //     return (
// //         <div className="h-screen bg-black text-white flex flex-col">
// //             <BuilderNavbar
// //                 pages={pages}
// //                 setPages={setPages}
// //                 // setCanvasItems={setCanvasItems}
// //                 setActivePageId={setActivePageId}
// //                 setSelectedId={setSelectedId}
// //                 previewMode={previewMode}
// //                 setPreviewMode={setPreviewMode}
// //             />

// //             <div className="flex flex-1 min-h-0 overflow-hidden">
// //                 {previewMode ? (
// //                     <BuilderCanvas
// //                         canvasItems={activePage?.canvasItems || []}
// //                         selectedId={selectedId}
// //                         setSelectedId={setSelectedId}
// //                         activePage={activePage}
// //                         previewMode={previewMode}
// //                         setPages={setPages}
// //                         activePageId={activePageId}
// //                     />
// //                 ) : (
// //                     <>
// //                         <DndContext
// //                             sensors={sensors}
// //                             collisionDetection={closestCenter}
// //                             onDragEnd={handleDragEnd}
// //                         >
// //                             <PageSidebar
// //                                 pages={pages}
// //                                 activePageId={activePageId}
// //                                 setActivePageId={setActivePageId}
// //                                 setPages={setPages}
// //                             />

// //                             <BuilderSidebar
// //                                 pages={pages}
// //                                 setPages={setPages}
// //                                 activePageId={activePageId}
// //                             />

// //                             <BuilderCanvas
// //                                 canvasItems={activePage?.canvasItems || []}
// //                                 selectedId={selectedId}
// //                                 setSelectedId={setSelectedId}
// //                                 activePage={activePage}
// //                                 previewMode={previewMode}
// //                                 setPages={setPages}
// //                                 activePageId={activePageId}
// //                             />

// //                             <PropertiesPanel
// //                                 activePage={activePage}
// //                                 selectedId={selectedId}
// //                                 setSelectedId={setSelectedId}
// //                                 pages={pages}
// //                                 setPages={setPages}
// //                                 activePageId={activePageId}
// //                             // setCanvasItems={setCanvasItems}
// //                             />
// //                         </DndContext>
// //                     </>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }

// "use client";
// import { useState, useEffect } from "react";
// import {
//     DndContext,
//     PointerSensor,
//     useSensor,
//     useSensors,
//     DragOverlay,
//     pointerWithin,
//     rectIntersection,
// } from "@dnd-kit/core";

// import BuilderNavbar from "./BuilderNavbar";
// import BuilderSidebar from "./BuilderSidebar";
// import BuilderCanvas from "./BuilderCanvas";
// import PropertiesPanel from "./PropertiesPanel";
// import PageSidebar from "./PageSidebar";
// import { componentTemplates } from "./componentTemplates";
// import { removeItemById, insertAtTarget, findLocation, findItemById } from "../utils/treeUtils";



// const EDGE_THRESHOLD = 24;

// function collisionDetectionStrategy(args) {
//     const { pointerCoordinates } = args;
//     let collisions = pointerWithin(args);
//     if (collisions.length === 0) collisions = rectIntersection(args);
//     if (collisions.length <= 1) return collisions;

//     const withRects = collisions
//         .map((c) => ({ ...c, rect: args.droppableRects.get(c.id) }))
//         .filter((c) => c.rect);

//     withRects.sort((a, b) => a.rect.width * a.rect.height - b.rect.width * b.rect.height);

//     const innermost = withRects[0];
//     if (pointerCoordinates && innermost) {
//         const distFromTop = pointerCoordinates.y - innermost.rect.top;
//         const distFromBottom = innermost.rect.top + innermost.rect.height - pointerCoordinates.y;
//         const nearEdge = distFromTop < EDGE_THRESHOLD || distFromBottom < EDGE_THRESHOLD;

//         if (nearEdge && withRects.length > 1) {
//             return [withRects[1], ...withRects.slice(0, 1), ...withRects.slice(2)];
//         }
//     }

//     return withRects;
// }

// export default function BuilderLayout() {
//     const [selectedId, setSelectedId] = useState(null);
//     const [isLoaded, setIsLoaded] = useState(false);
//     const [pages, setPages] = useState([{ id: "home", name: "Home", canvasItems: [] }]);
//     const [activePageId, setActivePageId] = useState("home");
//     const [previewMode, setPreviewMode] = useState(false);
//     const [activeDragData, setActiveDragData] = useState(null);

//     useEffect(() => {
//         const saved = localStorage.getItem("craftsite-builder");
//         if (saved) {
//             const data = JSON.parse(saved);
//             setPages(data.pages || []);
//             setActivePageId(data.activePageId || "home");
//         }
//         setIsLoaded(true);
//     }, []);

//     useEffect(() => {
//         if (!isLoaded) return;
//         localStorage.setItem("craftsite-builder", JSON.stringify({ pages, activePageId }));
//     }, [pages, activePageId, isLoaded]);

//     useEffect(() => {
//         localStorage.setItem("craftsite-selected", JSON.stringify(selectedId));
//     }, [selectedId]);


//     const sensors = useSensors(
//         useSensor(PointerSensor, {
//             activationConstraint: { distance: 8 },
//         })
//     );

//     const activePage = pages.find((page) => page.id === activePageId);

//     if (!isLoaded) {
//         return (
//             <div className="h-screen bg-black flex items-center justify-center text-zinc-500">
//                 Loading Builder...
//             </div>
//         );
//     }

//     const handleDragStart = (event) => {
//         setActiveDragData(event.active.data.current);
//     };

//     const handleDragEnd = (event) => {
//         const { active, over } = event;
//         console.log("DRAG END — active:", active.id, active.data.current);
//         console.log("DRAG END — over:", over?.id, over?.data.current);
//         setActiveDragData(null);
//         if (!over) return;

//         const activeData = active.data.current;
//         const overData = over.data.current;
//         const isFromSidebar = activeData?.source === "sidebar";

//         setPages((prev) =>
//             prev.map((page) => {
//                 if (page.id !== activePageId) return page;

//                 let items = page.canvasItems;

//                 // ---- 1. Figure out WHERE we're dropping: containerId (null = root) + index ----
//                 let targetContainerId = null;
//                 let targetIndex = items.length;

//                 if (overData?.type === "container-dropzone") {
//                     // Dropped directly into a Section/Container's empty area
//                     targetContainerId = overData.containerId;
//                     const containerItem = findItemById(items, targetContainerId);
//                     targetIndex = containerItem?.children?.length || 0;
//                 } else if (overData?.type === "canvas-root") {
//                     // Dropped on empty canvas / below everything
//                     targetContainerId = null;
//                     targetIndex = items.length;
//                 } else {
//                     // Dropped on/near an existing item — insert as its sibling, at its position
//                     const loc = findLocation(items, over.id);
//                     if (!loc) return page;
//                     targetContainerId = loc.parentId;
//                     targetIndex = loc.index;
//                 }

//                 // ---- 2a. Sidebar -> Canvas: create a brand new component ----
//                 if (isFromSidebar) {
//                     const componentName = activeData.component;
//                     const template = componentTemplates[componentName];
//                     if (!template) return page;

//                     const newComponent = {
//                         id: Date.now().toString(),
//                         name: componentName,
//                         ...template,
//                         ...(template.children !== undefined ? { children: [] } : {}),
//                     };

//                     const newItems = insertAtTarget(items, targetContainerId, targetIndex, newComponent);
//                     return { ...page, canvasItems: newItems };
//                 }

//                 // ---- 2b. Canvas -> Canvas: moving/reordering an existing item ----
//                 if (active.id === over.id) return page;

//                 const { items: itemsAfterRemoval, removed } = removeItemById(items, active.id);
//                 if (!removed) return page;

//                 // Guard: don't let a container be dropped inside its own descendant
//                 if (removed.children?.length) {
//                     const draggedIntoOwnChild = findItemById(removed.children ? [removed] : [], targetContainerId);
//                     if (draggedIntoOwnChild) return page;
//                 }

//                 const finalItems = insertAtTarget(itemsAfterRemoval, targetContainerId, targetIndex, removed);
//                 return { ...page, canvasItems: finalItems };
//             })
//         );
//     };

//     return (
//         <div className="h-screen bg-black text-white flex flex-col">
//             <BuilderNavbar
//                 pages={pages}
//                 setPages={setPages}
//                 setActivePageId={setActivePageId}
//                 setSelectedId={setSelectedId}
//                 previewMode={previewMode}
//                 setPreviewMode={setPreviewMode}
//             />

//             <div className="flex flex-1 min-h-0 overflow-hidden">
//                 {previewMode ? (
//                     <BuilderCanvas
//                         canvasItems={activePage?.canvasItems || []}
//                         selectedId={selectedId}
//                         setSelectedId={setSelectedId}
//                         activePage={activePage}
//                         previewMode={previewMode}
//                         setPages={setPages}
//                         activePageId={activePageId}
//                     />
//                 ) : (
//                     <DndContext
//                         sensors={sensors}
//                         collisionDetection={collisionDetectionStrategy}
//                         onDragStart={handleDragStart}
//                         onDragEnd={handleDragEnd}
//                     >
//                         <PageSidebar
//                             pages={pages}
//                             activePageId={activePageId}
//                             setActivePageId={setActivePageId}
//                             setPages={setPages}
//                         />

//                         <BuilderSidebar pages={pages} setPages={setPages} activePageId={activePageId} />

//                         <BuilderCanvas
//                             canvasItems={activePage?.canvasItems || []}
//                             selectedId={selectedId}
//                             setSelectedId={setSelectedId}
//                             activePage={activePage}
//                             previewMode={previewMode}
//                             setPages={setPages}
//                             activePageId={activePageId}
//                         />

//                         <PropertiesPanel
//                             activePage={activePage}
//                             selectedId={selectedId}
//                             setSelectedId={setSelectedId}
//                             pages={pages}
//                             setPages={setPages}
//                             activePageId={activePageId}
//                         />

//                         {/* Visual feedback while dragging */}
//                         <DragOverlay>
//                             {activeDragData?.source === "sidebar" && (
//                                 <div className="px-4 py-3 rounded-xl border border-indigo-500 bg-zinc-900 text-sm text-indigo-300 shadow-xl">
//                                     {activeDragData.component}
//                                 </div>
//                             )}
//                         </DragOverlay>
//                     </DndContext>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";
import { useState, useEffect } from "react";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    pointerWithin,
    rectIntersection,
    MeasuringStrategy,
} from "@dnd-kit/core";

import BuilderNavbar from "./BuilderNavbar";
import BuilderSidebar from "../sidebar/BuilderSidebar";
import BuilderCanvas from "../canvas/BuilderCanvas";
import PropertiesPanel from "../PropertiesPanel";
import PageSidebar from "../sidebar/PageSidebar";
import {
    removeItemById,
    insertAtTarget,
    findLocation,
    findItemById,
} from "../../utils/treeUtils";
import { componentTemplates, createGridCells } from "../componentTemplates";

function collisionDetectionStrategy(args) {
    const pointerCollisions = pointerWithin(args);
    const collisions = pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);

    if (collisions.length <= 1) return collisions;

    return [...collisions].sort((a, b) => {
        const rectA = args.droppableRects.get(a.id);
        const rectB = args.droppableRects.get(b.id);
        if (!rectA || !rectB) return 0;
        return rectA.width * rectA.height - rectB.width * rectB.height;
    });
}

export default function BuilderLayout() {
    const [selectedId, setSelectedId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pages, setPages] = useState([
        { id: "home", name: "Home", canvasItems: [] },
    ]);
    const [activePageId, setActivePageId] = useState("home");
    const [previewMode, setPreviewMode] = useState(false);
    const [activeDragData, setActiveDragData] = useState(null);

    // Defines which item types are allowed to be dropped into which container types.
    // const NESTING_RULES = {
    //     null: ["section"],
    //     section: [ "grid", "heading", "text", "button", "image", "input", "textarea", "checkbox", "radiobutton"],
    //     container: [ "section", "grid", "heading", "text", "button", "image", "input", "textarea", "checkbox", "radiobutton"],
    //     gridcell: ["container", "heading", "text", "button", "image", "input", "textarea", "checkbox", "radiobutton"],
    // };
    const NESTING_RULES = {
        null: ["section", "container", "grid", "heading", "text", "button", "image", "input", "textarea", "checkbox", "radiobutton"],

        // Section can hold Container, Grid, and leaf elements — not another Section
        section: ["grid", "heading", "text", "button", "image", "input", "textarea", "checkbox", "radiobutton"],

        // Container can hold Grid and leaf elements — NOT Section, NOT another Container
        container: ["section", "grid", "heading", "text", "button", "image", "input", "textarea", "checkbox", "radiobutton"],

        gridcell: ["container", "heading", "text", "button", "image", "input", "textarea", "checkbox", "radiobutton"],
    };

    function isDropAllowed(childType, targetContainerId, items) {
        if (targetContainerId === null) {
            return NESTING_RULES[null].includes(childType);
        }
        const targetItem = findItemById(items, targetContainerId);
        if (!targetItem) return false;
        const allowed = NESTING_RULES[targetItem.type];
        return allowed ? allowed.includes(childType) : false;
    }

    useEffect(() => {
        const saved = localStorage.getItem("craftsite-builder");
        if (saved) {
            const data = JSON.parse(saved);
            setPages(data.pages || []);
            setActivePageId(data.activePageId || "home");
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem(
            "craftsite-builder",
            JSON.stringify({ pages, activePageId })
        );
    }, [pages, activePageId, isLoaded]);

    useEffect(() => {
        localStorage.setItem("craftsite-selected", JSON.stringify(selectedId));
    }, [selectedId]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const activePage = pages.find((page) => page.id === activePageId);

    if (!isLoaded) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-zinc-500">
                Loading Builder...
            </div>
        );
    }

    const handleDragStart = (event) => {
        setActiveDragData(event.active.data.current);
    };



    const handleDragEnd = (event) => {
        const { active, over } = event;
        console.log("DROP →", { activeId: active.id, overId: over?.id, overData: over?.data.current });

        setActiveDragData(null);
        if (!over) return;

        const activeData = active.data.current;
        const overData = over.data.current;
        const isFromSidebar = activeData?.source === "sidebar";

        setPages((prev) =>
            prev.map((page) => {
                if (page.id !== activePageId) return page;

                const items = page.canvasItems;

                // ---- 1. Figure out WHERE we're dropping: containerId (null = root) + index ----
                let targetContainerId = null;
                let targetIndex = items.length;

                if (overData?.type === "container-dropzone") {
                    // Dropped directly into a Section/Container/Grid-cell's content area
                    targetContainerId = overData.containerId;
                    const containerItem = findItemById(items, targetContainerId);
                    targetIndex = containerItem?.children?.length || 0;
                } else if (overData?.type === "canvas-root") {
                    // Dropped on empty canvas / below everything at top level
                    targetContainerId = null;
                    targetIndex = items.length;
                } else {
                    // Dropped on/near an existing item — insert as its sibling, at its position
                    const loc = findLocation(items, over.id);
                    if (!loc) return page;
                    targetContainerId = loc.parentId;
                    targetIndex = loc.index;
                }

                // ---- 2a. Sidebar -> Canvas: create a brand new component ----
                if (isFromSidebar) {
                    const componentName = activeData.component;
                    const template = componentTemplates[componentName];
                    if (!template) return page;

                    if (!isDropAllowed(template.type, targetContainerId, items)) return page; // NEW

                    const newComponent = {
                        id: Date.now().toString(),
                        name: componentName,
                        ...template,
                        ...(template.children !== undefined ? { children: [] } : {}),
                    };

                    // const newItems = insertAtTarget(
                    //     items,
                    //     targetContainerId,
                    //     targetIndex,
                    //     newComponent
                    // );
                    if (template.type === "grid") {
                        newComponent.children = createGridCells(template.columns, template.rows || 1);
                    }

                    const newItems = insertAtTarget(items, targetContainerId, targetIndex, newComponent);
                    return { ...page, canvasItems: newItems };
                    return { ...page, canvasItems: newItems };
                }

                // ---- 2b. Canvas -> Canvas: moving/reordering an existing item ----
                if (active.id === over.id) return page;

                const { items: itemsAfterRemoval, removed } = removeItemById(
                    items,
                    active.id
                );
                if (!removed) return page;

                if (!isDropAllowed(removed.type, targetContainerId, itemsAfterRemoval)) return page; // NEW

                // Guard: don't let a container be dropped inside its own descendant
                if (removed.children?.length) {
                    const draggedIntoOwnChild = findItemById(
                        [removed],
                        targetContainerId
                    );
                    if (draggedIntoOwnChild) return page;
                }

                const finalItems = insertAtTarget(
                    itemsAfterRemoval,
                    targetContainerId,
                    targetIndex,
                    removed
                );
                return { ...page, canvasItems: finalItems };
            })
        );
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <BuilderNavbar
                pages={pages}
                setPages={setPages}
                setActivePageId={setActivePageId}
                setSelectedId={setSelectedId}
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
            />

            <div className="flex flex-1 min-h-0 overflow-hidden">
                {previewMode ? (
                    <BuilderCanvas
                        canvasItems={activePage?.canvasItems || []}
                        selectedId={selectedId}
                        setSelectedId={setSelectedId}
                        activePage={activePage}
                        previewMode={previewMode}
                        setPages={setPages}
                        activePageId={activePageId}
                    />
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={collisionDetectionStrategy}
                        measuring={{
                            droppable: {
                                strategy: MeasuringStrategy.Always,
                            },
                        }}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        {/* <PageSidebar
                            pages={pages}
                            activePageId={activePageId}
                            setActivePageId={setActivePageId}
                            setPages={setPages}
                        /> */}

                        <BuilderSidebar
                            pages={pages}
                            setPages={setPages}
                            activePageId={activePageId}
                            setActivePageId={setActivePageId}
                            canvasItems={activePage?.canvasItems || []}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                        />

                        <BuilderCanvas
                            canvasItems={activePage?.canvasItems || []}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                            activePage={activePage}
                            previewMode={previewMode}
                            setPages={setPages}
                            activePageId={activePageId}
                        />

                        <PropertiesPanel
                            activePage={activePage}
                            selectedId={selectedId}
                            setSelectedId={setSelectedId}
                            pages={pages}
                            setPages={setPages}
                            activePageId={activePageId}
                        />

                        {/* Visual feedback while dragging */}
                        <DragOverlay>
                            {activeDragData?.source === "sidebar" && (
                                <div className="px-4 py-3 rounded-xl border border-indigo-500 bg-zinc-900 text-sm text-indigo-300 shadow-xl">
                                    {activeDragData.component}
                                </div>
                            )}
                        </DragOverlay>
                    </DndContext>
                )}
            </div>
        </div>
    );
}