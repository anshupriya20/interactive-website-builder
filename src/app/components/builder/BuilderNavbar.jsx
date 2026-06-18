"use client";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

import { FiUpload } from "react-icons/fi";
import { FaFileAlt } from "react-icons/fa";


export default function BuilderNavbar({
  setActivePageId,
  pages,
  setPages,
  setSelectedId,
  previewMode,
  setPreviewMode,
}) {
  const handleClearProject = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Clear the entire project?</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="
            px-3 py-1 rounded-md
            bg-zinc-700 hover:bg-zinc-600
            text-white text-sm
          "
          >
            Cancel
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("craftsite-builder");

              setPages([
                {
                  id: "home",
                  name: "Home",
                  canvasItems: [],
                },
              ]);

              setActivePageId("home");
              setSelectedId(null);

              toast.dismiss(t.id);

              toast.success("Project cleared successfully");
            }}
            className="
            px-3 py-1 rounded-md
            bg-red-600 hover:bg-red-500
            text-white text-sm
          "
          >
            Clear
          </button>
        </div>
      </div>
    ));
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const exportProject = () => {
    const projectData = {
      projectName: "Untitled Project",

      version: "v3.0",

      exportedAt: new Date().toISOString(),

      pages,
    };

    const jsonString = JSON.stringify(projectData, null, 2);

    const blob = new Blob([jsonString], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    const date = new Date().toISOString().split("T")[0];

    link.download = `craftsite-${date}.json`;

    link.click();
    toast.success("Project exported successfully");

    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.name.endsWith(".json")) {
      toast.error(
        "Please select a JSON file"
      );
      return;
    }

    setSelectedFile(file);
  };

  const importProject = () => {
    if (!selectedFile) {
      toast.error(
        "Select a file first"
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(
          e.target.result
        );

        setPages(data.pages);

        setActivePageId(
          data.pages?.[0]?.id ||
          "home"
        );

        toast.success(
          "Project imported successfully"
        );

        setSelectedFile(null);
      } catch {
        toast.error(
          "Invalid JSON file"
        );
      }
    };

    reader.readAsText(selectedFile);
  };

  return (
    // <header className="h-16 border-b border-zinc-800 bg-[#111111] px-6 flex items-center justify-between">
    //   <div className="flex items-center gap-3">
    //     <h1 className="font-bold text-xl">
    //       Craft<span className="text-indigo-400">Site</span>
    //     </h1>

    //     <span className="text-zinc-600">/</span>

    //     <span className="text-zinc-400 text-sm">Untitled Project</span>
    //   </div>

    //   <div className="flex gap-3">

    //     <label
    //       className=" flex items-center gap-3 w-72 px-4 py-3  rounded-xl  border border-zinc-800 bg-zinc-900 hover:border-indigo-500/40 cursor-pointer transition-all "
    //     >
    //       <span className="text-lg">
    //         <FaFileAlt className="text-blue-400" />
    //       </span>

    //       <span
    //         className=" text-sm text-zinc-300 truncate "
    //       >
    //         {selectedFile
    //           ? selectedFile.name
    //           : "Select project JSON..."}
    //       </span>

    //       <input
    //         type="file"
    //         accept=".json"
    //         onChange={handleFileSelect}
    //         className="hidden"
    //       />
    //     </label>
    //     <button
    //       onClick={importProject}
    //       disabled={!selectedFile}
    //       className={` mt-3 px-4 py-2 rounded-lg font-mediumtransition
    //        ${selectedFile
    //           ? "bg-indigo-600 hover:bg-indigo-500"
    //           : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
    //         }
    //    `}
    //     >
    //       <FiUpload className="inline-block mr-2" />
    //       Import Project
    //     </button>


    //     <button
    //       onClick={exportProject}
    //       className="px-4 py-2 rounded-lg  bg-indigo-600  hover:bg-indigo-500"
    //     >
    //       Export
    //     </button>
    //     <button
    //       className="px-4 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600"
    //       onClick={() => setPreviewMode(!previewMode)}
    //     >
    //       {previewMode ? "Exit Preview" : "Preview"}
    //     </button>

    //     <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500">
    //       Publish
    //     </button>
    //     <button
    //       onClick={handleClearProject}
    //       className=" p-2 border border-red-500 text-white font-medium rounded-lg bg-red-500 hover:bg-red-600 transition"
    //     >
    //       Clear
    //     </button>
    //   </div>
    // </header>

    <header className="h-16 border-b border-zinc-800 bg-[#111111] px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="font-bold text-xl">
          Craft<span className="text-indigo-400">Site</span>
        </h1>

        <span className="text-zinc-600">/</span>

        <span className="text-zinc-400 text-sm">Untitled Project</span>
      </div>

      <div className="flex items-center gap-3">

        {/* Import Section */}
        <div className="flex items-center gap-2">
          <label
            className="
        flex items-center gap-2
        h-10
        px-3

        min-w-[220px]
        max-w-[280px]

        rounded-lg
        border border-zinc-800
        bg-zinc-900

        hover:border-indigo-500/40
        transition-all
        cursor-pointer
      "
          >
            <FaFileAlt
              size={14}
              className="text-blue-400 shrink-0"
            />

            <span
              className="
          text-sm
          text-zinc-400
          truncate
        "
            >
              {selectedFile
                ? selectedFile.name
                : "Select JSON file"}
            </span>

            <input
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          <button
            onClick={importProject}
            disabled={!selectedFile}
            className={`
        h-10
        px-4

        rounded-lg
        flex items-center gap-2

        transition-all

        ${selectedFile
                ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }
      `}
          >
            <FiUpload size={14} />
            Import
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-zinc-800" />

        {/* Project Actions */}
        <div className="flex items-center gap-2">

          <button
            onClick={exportProject}
            className="
        h-10
        px-4

        rounded-lg

        bg-zinc-900
        border border-zinc-800

        hover:border-indigo-500/40
        hover:bg-zinc-800

        transition-all
      "
          >
            Export
          </button>

          <button
            onClick={() =>
              setPreviewMode(!previewMode)
            }
            className="
        h-10
        px-4

        rounded-lg

        bg-zinc-900
        border border-zinc-800

        hover:border-indigo-500/40
        hover:bg-zinc-800

        transition-all
      "
          >
            {previewMode
              ? "Exit Preview"
              : "Preview"}
          </button>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-zinc-800" />

        {/* Publish & Clear */}
        <div className="flex items-center gap-2">

          <button
            className="
        h-10
        px-4

        rounded-lg

        bg-indigo-600
        hover:bg-indigo-500

        transition-all
      "
          >
            Publish
          </button>

          <button
            onClick={handleClearProject}
            className="
        h-10
        px-4

        rounded-lg

        bg-red-600
        hover:bg-red-500

        transition-all
      "
          >
            Clear
          </button>

        </div>

      </div>
    </header>
  );
}
