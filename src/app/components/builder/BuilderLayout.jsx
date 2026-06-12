"use client";
import { useState, useEffect } from "react";

import BuilderNavbar from "./BuilderNavbar";
import BuilderSidebar from "./BuilderSidebar";
import BuilderCanvas from "./BuilderCanvas";
import PropertiesPanel from "./PropertiesPanel";
import PageSidebar from "./PageSidebar";

export default function BuilderLayout() {
    const [canvasItems, setCanvasItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pages, setPages] = useState([
        {
            id: "home",
            name: "Home",
            canvasItems: [],
        },
    ]);

    const [activePageId, setActivePageId] = useState("home");

    useEffect(() => {
        const saved = localStorage.getItem(
            "craftsite-builder"
        );

        if (saved) {
            const data = JSON.parse(saved);

            setPages(data.pages || []);
            setActivePageId(
                data.activePageId || "home"
            );
        }

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        localStorage.setItem(
            "craftsite-builder",
            JSON.stringify({
                pages,
                activePageId,
            })
        );
    }, [pages, activePageId, isLoaded]);

    useEffect(() => {
        localStorage.setItem("craftsite-selected", JSON.stringify(selectedId));
    }, [selectedId]);



    const activePage = pages.find((page) => page.id === activePageId);

    if (!isLoaded) {
        return (
            <div className="h-screen bg-black flex items-center justify-center text-zinc-500">
                Loading Builder...
            </div>
        );
    }

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <BuilderNavbar setCanvasItems={setCanvasItems} setPages={setPages}
    setActivePageId={setActivePageId}
    setSelectedId={setSelectedId}/>

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <PageSidebar
                    pages={pages}
                    activePageId={activePageId}
                    setActivePageId={setActivePageId}
                    setPages={setPages}
                />
                {/* <BuilderSidebar
                    canvasItems={canvasItems}
                    setCanvasItems={setCanvasItems}
                /> */}
                <BuilderSidebar
                    pages={pages}
                    setPages={setPages}
                    activePageId={activePageId}
                />
                {/* <BuilderCanvas
          // canvasItems={canvasItems}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          canvasItems={activePage.canvasItems}
        /> */}
                <BuilderCanvas
                    canvasItems={activePage?.canvasItems || []}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    activePage={activePage}
                />
                {/* <PropertiesPanel
                    canvasItems={canvasItems}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    setCanvasItems={setCanvasItems}
                /> */}
                <PropertiesPanel
                    activePage={activePage}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    pages={pages}
                    setPages={setPages}
                    activePageId={activePageId}
                                        setCanvasItems={setCanvasItems}

                />
            </div>
        </div>
    );
}
