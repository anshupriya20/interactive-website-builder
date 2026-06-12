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

const componentTemplates = {
  // Layout
  Section: {
    type: "section",
    children: [],
    icons: ""
  },

  Container: {
    type: "container",
    maxWidth: "1200px",
  },

  Grid: {
    type: "grid",
    columns: 2,
    gap: 20,
  },

  // Typography
  Heading: {
    type: "heading",
    text: "New Heading",
    level: "h1",
    fontSize: 48,
  },

  Text: {
    type: "text",
    content: "Lorem ipsum dolor sit amet.",
  },


  // Media
  Image: {
    type: "image",
    src: "",
    alt: "Image",
  },

  // Actions
  Button: {
    type: "button",
    label: "Click Me",
    variant: "primary",
  },

  // Forms
  Input: {
    type: "input",
    label: "Input Label",
    placeholder: "Enter text",
  },

  Textarea: {
    type: "textarea",
    label: "Message",
    placeholder: "Type here...",
  },

  Checkbox: {
    type: "checkbox",
    label: "Accept Terms",
  },

  RadioButton: {
    type: "radiobutton",
    options: [
      "Option 1",
      "Option 2",
    ],
  },
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
  setCanvasItems,
  setPages,
  activePageId
}) {
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
      id: Date.now(),
      name: componentName,
      ...template,
    };

    // setCanvasItems((prev) => [
    //   ...prev,
    //   component,
    // ]);
    setPages(prev =>
      prev.map(page =>
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

  const [search, setSearch] = useState("");

  return (
    <aside
      className="
      w-72
      border-r
      border-zinc-800
      bg-[#111111]
      overflow-y-auto
      p-4
      "
    >
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
          className="
      absolute
      left-3
      top-1/2
      -translate-y-1/2
      text-zinc-500
      pointer-events-none
    "
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search components..."
          className="
      w-full
      rounded-xl
      border border-zinc-800
      bg-zinc-900
      py-2.5
      pl-10
      pr-3
      text-sm
      text-white
      placeholder:text-zinc-500
      outline-none
      transition-all

      focus:border-indigo-500/50
      focus:ring-2
      focus:ring-indigo-500/20
    "
        />
        {search && (
  <button
    onClick={() => setSearch("")}
    className="
      absolute
      right-3
      top-1/2
      -translate-y-1/2
      text-zinc-500
      hover:text-white
    "
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
                    <button
                      key={item}
                      onClick={() =>
                        addComponent(item)
                      }
                      disabled={!implemented}
                      className={`
            w-full
            text-left
            p-3
            rounded-xl
            border
            transition-all
            duration-200
            hover:-translate-y-0.5

            ${implemented
                          ? `
                  border-zinc-800
                  bg-zinc-900
                  hover:border-indigo-500/40
                  hover:bg-zinc-800/50
                  cursor-pointer
                `
                          : `
                  border-zinc-900
                  bg-zinc-950
                  text-zinc-600
                  cursor-not-allowed
                `
                        }
          `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {componentIcons[item] &&
                            React.createElement(
                              componentIcons[item],
                              {
                                className: implemented
                                  ? "text-zinc-400"
                                  : "text-zinc-700",
                                size: 18,
                              }
                            )}

                          <span>{item}</span>
                        </div>

                        {!implemented && (
                          <span
                            className="
                  text-[10px]
                  px-2
                  py-1
                  rounded-full
                  bg-zinc-800
                  text-zinc-400
                "
                          >
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        )
      )}
    </aside>
  );
}