"use client";
import { useState, useEffect, useRef } from "react";

// ── Sub-components defined OUTSIDE to prevent remount on render ──

const Field = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-xs text-zinc-500 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder }) => (
  <input
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
  />
);

const NumberInput = ({ value, onChange, min, max, unit }) => (
  <div className="flex items-center gap-2">
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
    />
    {unit && <span className="text-xs text-zinc-500 shrink-0">{unit}</span>}
  </div>
);

const PRESETS = [
  "#ffffff",
  "#a1a1aa",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#0a0a0a",
];

const isValidHex = (h) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(h);

// ColorInput keeps local hex string so user can type freely.
// Only calls onChange when hex is valid — this updates canvasItems.
const ColorInput = ({ value, onChange }) => {
  const [hex, setHex] = useState(value || "#ffffff");
  const swatchRef = useRef(null);

  // When selected item changes, sync local hex from parent value
  useEffect(() => {
    setHex(value || "#ffffff");
  }, [value]);

  const handleTextChange = (raw) => {
    const val = raw.startsWith("#") ? raw : "#" + raw;
    setHex(val);
    if (isValidHex(val)) onChange(val); // push to canvasItems
  };

  const handleSwatchChange = (e) => {
    setHex(e.target.value);
    onChange(e.target.value); // always valid from native picker
  };

  const handlePreset = (preset) => {
    setHex(preset);
    onChange(preset);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* Clickable color swatch that opens native picker */}
        <div
          className="relative h-9 w-9 shrink-0 rounded-lg border border-zinc-600 cursor-pointer overflow-hidden"
          style={{ backgroundColor: isValidHex(hex) ? hex : "#ffffff" }}
          onClick={() => swatchRef.current?.click()}
        >
          <input
            ref={swatchRef}
            type="color"
            value={isValidHex(hex) ? hex : "#ffffff"}
            onChange={handleSwatchChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>

        {/* Hex text field */}
        <input
          value={hex}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="#ffffff"
          maxLength={7}
          spellCheck={false}
          className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 font-mono outline-none focus:border-indigo-500 transition-colors"
        />

        {/* Live preview */}
        <div
          className="h-9 w-9 shrink-0 rounded-lg border border-zinc-700"
          style={{ backgroundColor: isValidHex(hex) ? hex : "transparent" }}
        />
      </div>

      {/* Preset swatches */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            title={preset}
            onClick={() => handlePreset(preset)}
            className="h-5 w-5 rounded-md border border-zinc-700 hover:scale-110 transition-transform"
            style={{ backgroundColor: preset }}
          />
        ))}
      </div>
    </div>
  );
};

const SelectInput = ({ value, onChange, options }) => (
  <select
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

// ── Main component ───────────────────────────────────────────

export default function PropertiesPanel({
  canvasItems,
  selectedId,
  setSelectedId,
  setCanvasItems,
}) {
  const selectedItem = canvasItems.find((item) => item.id === selectedId);

  // Directly patches one key on the selected item in canvasItems
  const update = (key, value) => {
    setCanvasItems((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, [key]: value } : item,
      ),
    );
  };

  if (!selectedItem) {
    return (
      <aside className="w-80 border-l border-zinc-800 bg-[#111111] p-4 overflow-y-auto">
        <h2 className="text-sm font-semibold text-zinc-400 mb-6">Properties</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-medium mb-1 text-sm">No Selection</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Click any component on the canvas to edit its properties.
          </p>
        </div>
      </aside>
    );
  }

  const renderFields = () => {
    switch (selectedItem.type) {
      case "section":
        return (
          <Field label="Padding">
            <NumberInput
              value={selectedItem.padding}
              onChange={(val) => update("padding", val)}
              min={0}
              max={200}
              unit="px"
            />
          </Field>
        );

      case "container":
        return (
          <Field label="Max Width">
            <NumberInput
              value={selectedItem.maxWidth}
              onChange={(val) => update("maxWidth", val)}
              min={300}
              max={2000}
              unit="px"
            />
          </Field>
        );

      case "grid":
        return (
          <>
            <Field label="Columns">
              <NumberInput
                value={selectedItem.columns}
                onChange={(val) => update("columns", val)}
                min={1}
                max={6}
              />
            </Field>

            <Field label="Gap">
              <NumberInput
                value={selectedItem.gap}
                onChange={(val) => update("gap", val)}
                min={0}
                max={100}
                unit="px"
              />
            </Field>
          </>
        );

      case "heading":
        return (
          <>
            <Field label="Text">
              <TextInput
                value={selectedItem.text}
                onChange={(val) => update("text", val)}
                placeholder="Heading text"
              />
            </Field>
            <Field label="Level">
              <SelectInput
                value={selectedItem.level}
                onChange={(val) => {
                  const fontSizeMap = { h1: 48, h2: 36, h3: 28, h4: 22 };

                  setCanvasItems((prev) =>
                    prev.map((item) =>
                      item.id === selectedId
                        ? { ...item, level: val, fontSize: fontSizeMap[val] }
                        : item,
                    ),
                  );
                }}
                options={[
                  { value: "h1", label: "H1 — Heading 1" },
                  { value: "h2", label: "H2 — Heading 2" },
                  { value: "h3", label: "H3 — Heading 3" },
                  { value: "h4", label: "H4 — Heading 4" },
                ]}
              />
            </Field>
            <Field label="Font Size">
              <NumberInput
                value={selectedItem.fontSize}
                onChange={(val) => update("fontSize", val)}
                min={8}
                max={120}
                unit="px"
              />
            </Field>
            <Field label="Color">
              <ColorInput
                value={selectedItem.color}
                onChange={(val) => update("color", val)}
              />
            </Field>
          </>
        );

      case "text":
        return (
          <>
            <Field label="Content">
              <textarea
                value={selectedItem.content || ""}
                onChange={(e) => update("content", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-100 outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </Field>
            <Field label="Font Size">
              <NumberInput
                value={selectedItem.fontSize}
                onChange={(val) => update("fontSize", val)}
                min={8}
                max={72}
                unit="px"
              />
            </Field>
            <Field label="Color">
              <ColorInput
                value={selectedItem.color}
                onChange={(val) => update("color", val)}
              />
            </Field>
          </>
        );

      case "button":
        return (
          <>
            <Field label="Label">
              <TextInput
                value={selectedItem.label}
                onChange={(val) => update("label", val)}
                placeholder="Button label"
              />
            </Field>
            <Field label="Variant">
              <SelectInput
                value={selectedItem.variant}
                onChange={(val) => update("variant", val)}
                options={[
                  { value: "primary", label: "Primary" },
                  { value: "secondary", label: "Secondary" },
                  { value: "outline", label: "Outline" },
                  { value: "ghost", label: "Ghost" },
                ]}
              />
            </Field>
            <Field label="Font Size">
              <NumberInput
                value={selectedItem.fontSize}
                onChange={(val) => update("fontSize", val)}
                min={8}
                max={32}
                unit="px"
              />
            </Field>
            <Field label="Text Color">
              <ColorInput
                value={selectedItem.color}
                onChange={(val) => update("color", val)}
              />
            </Field>
            <Field label="Background Color">
              <ColorInput
                value={selectedItem.bgColor}
                onChange={(val) => update("bgColor", val)}
              />
            </Field>
          </>
        );

      case "image":
        return (
          <>
            <Field label="Image URL">
              <TextInput
                value={selectedItem.src}
                onChange={(val) => update("src", val)}
                placeholder="https://..."
              />
            </Field>
            <Field label="Alt Text">
              <TextInput
                value={selectedItem.alt}
                onChange={(val) => update("alt", val)}
                placeholder="Image description"
              />
            </Field>
            <Field label="Width">
              <NumberInput
                value={selectedItem.width}
                onChange={(val) => update("width", val)}
                min={10}
                max={2000}
                unit="px"
              />
            </Field>

            <Field label="Height">
              <NumberInput
                value={selectedItem.height}
                onChange={(val) => update("height", val)}
                min={10}
                max={2000}
                unit="px"
              />
            </Field>
          </>
        );

      case "input":
      case "textarea":
        return (
          <>
            <Field label="Label">
              <TextInput
                value={selectedItem.label}
                onChange={(val) => update("label", val)}
                placeholder="Field label"
              />
            </Field>
            <Field label="Placeholder">
              <TextInput
                value={selectedItem.placeholder}
                onChange={(val) => update("placeholder", val)}
                placeholder="Placeholder text"
              />
            </Field>
          </>
        );
      case "checkbox":
        return (
          <>
            <Field label="Label">
              <TextInput
                value={selectedItem.label}
                onChange={(val) => update("label", val)}
              />
            </Field>
          </>
        );

      case "radiobutton":
        return (
          <>
            <Field label="Option 1">
              <TextInput
                value={selectedItem.options[0]}
                onChange={(val) => {
                  const updated = [...selectedItem.options];

                  updated[0] = val;

                  update("options", updated);
                }}
              />
            </Field>

            <Field label="Option 2">
              <TextInput
                value={selectedItem.options[1]}
                onChange={(val) => {
                  const updated = [...selectedItem.options];

                  updated[1] = val;

                  update("options", updated);
                }}
              />
            </Field>
          </>
        );

      default:
        return (
          <p className="text-xs text-zinc-500">
            No editable properties for this component.
          </p>
        );
    }
  };

  return (
    <aside className="w-80 border-l border-zinc-800 bg-[#111111] p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-semibold text-zinc-400">Properties</h2>
        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {selectedItem.type}
        </span>
      </div>
      <div>{renderFields()}</div>
      <button
        onClick={() => {
          setCanvasItems(prev =>
            prev.filter(
              item =>
                item.id !== selectedId
            )
          );

          setSelectedId(null);
        }}
        className="
    w-full
    mt-6
    bg-red-600
    hover:bg-red-500
    rounded-lg
    py-3
  "
      >
        Delete Component
      </button>
    </aside>
  );
}
