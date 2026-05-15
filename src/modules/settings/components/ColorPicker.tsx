"use client";

import { Icon } from "@iconify/react";
import { Input } from "@/components/ui/input";
import { PRESET_COLORS } from "@/modules/settings/utils/constants";
import type { ColorPickerProps } from "@/modules/settings/types";

export function ColorPicker({
  value,
  onChange,
  takenColors,
}: ColorPickerProps) {
  // console.log("🫨 ~ ColorPicker ~ value:", value)
  // console.log("🫨 ~ ColorPicker ~ takenColors:", takenColors)
  const isTaken = (color: string) => {
    // console.log("🫨 ~ isTaken ~ color:", color)
    return takenColors.some(
      (c) => c.toLowerCase() === color.toLowerCase() && color.toLowerCase() !== value.toLowerCase()
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div
          className="size-10 rounded-lg border-2 border-border shadow-sm shrink-0"
          style={{ backgroundColor: value }}
        />
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 cursor-pointer p-1"
        />
        <Input
          type="text"
          value={value.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
              onChange(v);
            }
          }}
          className="h-10 w-28 font-mono text-sm uppercase"
          placeholder="#000000"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => {
          const taken = isTaken(color);
          const isSelected = value.toLowerCase() === color.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              onClick={() => !taken && onChange(color)}
              disabled={taken}
              className="relative size-8 rounded-lg border-2 transition-all duration-150 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: color,
                borderColor: isSelected ? color : "transparent",
                boxShadow: isSelected ? `0 0 0 2px white, 0 0 0 4px ${color}` : undefined,
              }}
              title={taken ? "Color already in use" : color}
            >
              {isSelected && (
                <Icon
                  icon="lucide:check"
                  className="absolute inset-0 m-auto size-4 text-white drop-shadow-md"
                />
              )}
              {taken && (
                <Icon
                  icon="lucide:x"
                  className="absolute inset-0 m-auto size-3 text-white drop-shadow-md"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
