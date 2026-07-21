import { generateId } from "./componentTemplates";

export const sectionTemplates = {
  Hero: {
    type: "section",
    padding: 80,
    children: [
      { type: "heading", text: "Build Websites That Feel Crafted", level: "h1", fontSize: 48, color: "#ffffff" },
      { type: "text", content: "Design stunning websites with drag-and-drop simplicity.", fontSize: 18, color: "#a1a1aa" },
      {
        type: "grid",
        columns: 2,
        rows: 1,
        gap: 20,
        children: [
          { type: "gridcell", children: [{ type: "button", label: "Get Started", variant: "primary" }] },
          { type: "gridcell", children: [{ type: "button", label: "Watch Demo", variant: "outline" }] },
        ],
      },
    ],
  },

  Features: {
    type: "section",
    padding: 64,
    children: [
      { type: "heading", text: "Everything You Need", level: "h2", fontSize: 36, color: "#ffffff" },
      {
        type: "grid",
        columns: 3,
        rows: 1,
        gap: 24,
        children: [
          { type: "gridcell", children: [
            { type: "heading", text: "Fast", level: "h4", fontSize: 22, color: "#ffffff" },
            { type: "text", content: "Ship pages in minutes, not days.", fontSize: 16, color: "#a1a1aa" },
          ]},
          { type: "gridcell", children: [
            { type: "heading", text: "Flexible", level: "h4", fontSize: 22, color: "#ffffff" },
            { type: "text", content: "Every block is fully customizable.", fontSize: 16, color: "#a1a1aa" },
          ]},
          { type: "gridcell", children: [
            { type: "heading", text: "Reliable", level: "h4", fontSize: 22, color: "#ffffff" },
            { type: "text", content: "Built on a solid component tree.", fontSize: 16, color: "#a1a1aa" },
          ]},
        ],
      },
    ],
  },

  Footer: {
    type: "section",
    padding: 40,
    children: [
      { type: "text", content: "© 2026 Your Company. All rights reserved.", fontSize: 14, color: "#71717a" },
    ],
  },
};

// Recursively assigns fresh unique ids + a display name every time a section is inserted
function hydrateNode(node) {
  const { children, ...rest } = node;
  return {
    id: generateId(),
    name: rest.type.charAt(0).toUpperCase() + rest.type.slice(1),
    ...rest,
    ...(children ? { children: children.map(hydrateNode) } : {}),
  };
}

export function instantiateSection(key) {
  const blueprint = sectionTemplates[key];
  if (!blueprint) return null;
  return hydrateNode(blueprint);
}