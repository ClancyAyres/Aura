"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ResumeData } from "@/schemas/resume";
import { ICON_OPTIONS } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Trash2, Plus, ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

function IconPicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = ICON_OPTIONS.find(o => o.key === value) || ICON_OPTIONS[ICON_OPTIONS.length - 1];
  const Icon = selectedOption.Component;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-2 p-2 border rounded text-sm focus:border-blue-500 outline-none transition-all h-[38px] bg-white hover:bg-gray-50 border-gray-200"
      >
        <Icon size={16} className="text-blue-600" />
        <ChevronDown size={12} className={cn("text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 left-0 right-0 bg-white border rounded-lg shadow-xl p-2 grid grid-cols-5 gap-1 border-gray-100 min-w-[150px]">
          {ICON_OPTIONS.map((opt) => {
            const OptIcon = opt.Component;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  onChange(opt.key);
                  setIsOpen(false);
                }}
                className={cn(
                  "p-2 rounded flex items-center justify-center transition-all",
                  value === opt.key 
                    ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                )}
                title={opt.label}
              >
                <OptIcon size={16} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ContactManager({
  form,
}: {
  form: UseFormReturn<ResumeData>;
}) {
  const { control, register, setValue, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "profile.contact_fields",
  });
  const addEmpty = () =>
    append({
      id: `${Date.now()}`,
      label: "Label",
      value: "",
      icon_key: "link",
      is_icon_visible: true,
    });

  const data = watch("profile.contact_fields") || [];
  const PRESET_IDS = ["email", "phone", "location", "github", "linkedin"];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-xl font-semibold">Contact Manager</h2>
        <button
          type="button"
          onClick={addEmpty}
          className="px-2 py-1 border rounded text-xs flex items-center gap-1 hover:bg-gray-50 transition-colors"
        >
          <Plus size={12} />
          Add Field
        </button>
      </div>
      <div className="space-y-3">
        {fields.map((f, i) => {
          const isPreset = PRESET_IDS.includes(f.id);
          return (
            <div
              key={f.id}
              className="p-3 border rounded-lg grid grid-cols-12 gap-3 items-end bg-white hover:border-blue-200 transition-all shadow-sm"
            >
              <div className="col-span-3">
                <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block tracking-wider">
                  Label
                </label>
                <input
                  {...register(`profile.contact_fields.${i}.label`)}
                  disabled={isPreset}
                  className={cn(
                    "w-full p-2 border rounded text-sm outline-none transition-all",
                    isPreset ? "bg-gray-50 text-gray-500 cursor-not-allowed border-gray-100" : "focus:border-blue-500"
                  )}
                />
              </div>
              <div className="col-span-4">
                <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block tracking-wider">
                  Value
                </label>
                <input
                  {...register(`profile.contact_fields.${i}.value`)}
                  className="w-full p-2 border rounded text-sm focus:border-blue-500 outline-none transition-all"
                  placeholder={`Enter ${f.label.toLowerCase()}...`}
                />
              </div>
              <div className="col-span-3">
                <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block tracking-wider">
                  Icon
                </label>
                {isPreset ? (
                  <div className="flex items-center justify-center p-2 border rounded bg-gray-50 border-gray-100 text-gray-400 h-[38px]">
                    {(() => {
                      const opt = ICON_OPTIONS.find(o => o.key === data?.[i]?.icon_key);
                      const Icon = opt?.Component;
                      return Icon ? <Icon size={14} /> : null;
                    })()}
                  </div>
                ) : (
                  <IconPicker
                     value={data?.[i]?.icon_key || "link"}
                     onChange={(val) => setValue(`profile.contact_fields.${i}.icon_key`, val, { shouldDirty: true })}
                   />
                )}
              </div>
              <div className="col-span-1 flex flex-col items-center justify-center gap-1 h-[38px]">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  Show
                </label>
                <input
                  type="checkbox"
                  {...register(`profile.contact_fields.${i}.is_icon_visible`)}
                  className="h-4 w-4 cursor-pointer accent-blue-600"
                />
              </div>
              <div className="col-span-1 flex justify-end h-[38px] items-center">
                {!isPreset && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove field"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {fields.length === 0 && (
          <div className="text-xs text-gray-500">
            No contact fields. Click Add Field to create one.
          </div>
        )}
      </div>
    </section>
  );
}
