export const componentTemplates = {
  Section: { type: "section", children: [] },
  Container: { type: "container", maxWidth: "1200px", children: [] },
   Grid: { type: "grid", columns: 2, rows: 1, gap: 20 },
  Heading: { type: "heading", text: "New Heading", level: "h1", fontSize: 48 },
  Text: { type: "text", content: "Lorem ipsum dolor sit amet." },
  Image: { type: "image", src: "", alt: "Image" },
  Button: { type: "button", label: "Click Me", variant: "primary" },
  Input: { type: "input", label: "Input Label", placeholder: "Enter text" },
  Textarea: { type: "textarea", label: "Message", placeholder: "Type here..." },
  Checkbox: { type: "checkbox", label: "Accept Terms" },
  RadioButton: { type: "radiobutton", options: ["Option 1", "Option 2"] },
};

export const CONTAINER_TYPES = ["section", "container", "grid",];

export function createGridCells(columns, rows) {
  const count = Math.max(1, columns) * Math.max(1, rows);
  return Array.from({ length: count }, (_, i) => ({
    id: `${Date.now()}-cell-${i}-${Math.random().toString(36).slice(2, 6)}`,
    type: "gridcell",
    children: [],
  }));
}