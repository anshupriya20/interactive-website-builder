"use client";
import { useState } from "react";

import BuilderNavbar from "./BuilderNavbar";
import BuilderSidebar from "./BuilderSidebar";
import BuilderCanvas from "./BuilderCanvas";
import PropertiesPanel from "./PropertiesPanel";

export default function BuilderLayout() {
    const [canvasItems, setCanvasItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    return (
        <div className="h-screen bg-black text-white flex flex-col">
            <BuilderNavbar />

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <BuilderSidebar
                    canvasItems={canvasItems}
                    setCanvasItems={setCanvasItems}
                />
                <BuilderCanvas
                    canvasItems={canvasItems}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                />
                <PropertiesPanel
                    canvasItems={canvasItems}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    setCanvasItems={setCanvasItems}
                />
            </div>
        </div>
    );
}