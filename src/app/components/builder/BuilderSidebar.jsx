"use client";
import React, { useState } from "react";


// =====================================ICONS================================================
import {
  FiType,
  FiFileText,
  FiImage,
  FiGrid,
  FiColumns,
  FiMinus,
  FiMousePointer,
  FiEdit,
  FiCheckSquare,
  FiCircle,
  FiLayout,
  FiBox,
} from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// ===============================COMPONENTS====================================
import SidebarItem from "./SidebarItem";
import { componentTemplates, createGridCells } from "./componentTemplates";


const sections = {
  Layout: [
    "Section",
    "Container",
    "Grid",
    "Columns",
    "Divider",
    "Spacer",
  ],

  Typography: [
    "Heading",
    "Text",
    "RichText",
    "List",
    "Quote",
  ],

  Media: [
    "Image",
    "Video",
    "Gallery",
    "Carousel",
  ],

  Actions: [
    "Button",
    "IconButton",
    "CTA",
  ],

  Forms: [
    "Input",
    "Textarea",
    "Select",
    "Checkbox",
    "RadioButton",
    "Switch",
    "DatePicker",
  ],

  Commerce: [
    "PricingCard",
    "FeatureCard",
    "Testimonial",
    "FAQ",
  ],

  Advanced: [
    "Tabs",
    "Accordion",
    "Modal",
    "Timeline",
  ],
};

const componentIcons = {
  Section: FiLayout,
  Container: FiBox,
  Grid: FiGrid,
  Columns: FiColumns,
  Divider: FiMinus,

  Heading: FiType,
  Text: FiFileText,

  Image: FiImage,

  Button: FiMousePointer,

  Input: FiEdit,
  Textarea: FiEdit,
  Checkbox: FiCheckSquare,
  RadioButton: FiCircle,
};



export default function BuilderSidebar({
  setPages,
  activePageId
}) {

  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  const addComponent = (componentName) => {
    const template =
      componentTemplates[componentName];

    if (!template) {
      console.warn(
        `${componentName} template not implemented yet`
      );
      return;
    }

    const component = {
      id: Date.now().toString(),
      name: componentName,
      ...template,
    };

    if (template.type === "grid") {
      component.children = createGridCells(template.columns, template.rows || 1);
    }

    setPages((prev) =>
      prev.map((page) =>
        page.id === activePageId
          ? {
            ...page,
            canvasItems: [
              ...page.canvasItems,
              component,
            ],
          }
          : page
      )
    );
  };

  return (
    <aside
      className={`${collapsed ? "w-14" : "w-72"} shrink-0 transition-all duration-200 border-r border-zinc-800 bg-[#111111] overflow-y-auto p-4 relative`}
    >
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute top-4 right-3 z-10 p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
      >
        {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
      </button>

      {collapsed ? (
        <div className="flex flex-col items-center gap-3 mt-12">
          {Object.values(sections).flat().map((name) => {
            const Icon = componentIcons[name];
            const implemented = !!componentTemplates[name];
            return Icon ? (
              <button
                key={name}
                onClick={() => implemented && addComponent(name)}
                disabled={!implemented}
                title={name}
                className={`p-2 rounded-lg ${implemented ? "text-zinc-400 hover:bg-zinc-800 hover:text-white" : "text-zinc-700 cursor-not-allowed"}`}
              >
                <Icon size={18} />
              </button>
            ) : null;
          })}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-zinc-300">
              Components
            </h2>

            <p className="text-xs text-zinc-500 mt-1">
              Drag or click to add elements
            </p>
          </div>
          <div className="relative mb-6">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search components..."
              className=" w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500  outline-none  transition-all  focus:border-indigo-500/50 focus:ring-2  focus:ring-indigo-500/20 "
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className=" absolute right-3 top-1/2  -translate-y-1/2  text-zinc-500  hover:text-white "
              >
                ✕
              </button>
            )}
          </div>

          {Object.entries(sections).map(
            ([group, items]) => (
              <div
                key={group}
                className="mb-8"
              >
                <h3
                  className="
              text-xs
              uppercase
              tracking-widest
              text-zinc-600
              mb-3
              "
                >
                  {group}
                </h3>

                <div className="space-y-2">
                  {items
                    .filter((item) =>
                      item
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    )
                    .map((item) => {
                      const implemented =
                        !!componentTemplates[item];

                      return (
                        <SidebarItem
                          key={item}
                          componentName={item}
                          implemented={implemented}
                          icon={componentIcons[item]}
                          onAdd={addComponent}
                        />
                      );
                    })}
                </div>
              </div>
            )
          )}
        </>)}
    </aside>
  );
}