"use client";

import React from "react";

export interface PricePreset {
  label: string;
  min: number;
  max: number;
}

interface PriceRangeFilterProps {
  bounds: { min: number; max: number };
  minPrice: number;
  maxPrice: number;
  onMinChange: (n: number) => void;
  onMaxChange: (n: number) => void;
  presets?: PricePreset[];
}

export default function PriceRangeFilter({
  bounds,
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  presets = [],
}: PriceRangeFilterProps) {
  const sliderPercent = ((maxPrice - bounds.min) / Math.max(1, bounds.max - bounds.min)) * 100;

  return (
    <div>
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {presets.map((preset) => {
            const active = minPrice === preset.min && maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  onMinChange(preset.min);
                  onMaxChange(preset.max);
                }}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition cursor-pointer ${
                  active
                    ? "bg-linear-to-r from-doibrand-accent to-doibrand-gold text-white shadow-sm"
                    : "bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-doibrand-gold/40"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}

      <input
        type="range"
        min={bounds.min}
        max={bounds.max}
        step={50}
        value={maxPrice}
        onChange={(e) => onMaxChange(Math.max(Number(e.target.value), minPrice))}
        aria-label="Maximum price"
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-doibrand-accent"
        style={{
          background: `linear-gradient(to right, #A95E35 0%, #C48A4E ${sliderPercent}%, #F0E4D4 ${sliderPercent}%)`,
        }}
      />

      <div className="mt-4 flex items-center gap-2">
        {[
          { label: "সর্বনিম্ন", value: minPrice, onChange: onMinChange },
          { label: "সর্বোচ্চ", value: maxPrice, onChange: onMaxChange },
        ].map((field, i) => (
          <React.Fragment key={field.label}>
            {i > 0 && <span className="mt-5 text-stone-300">—</span>}
            <label className="flex-1">
              <span className="mb-1 block text-[10px] font-semibold text-stone-500">{field.label}</span>
              <span className="flex items-center rounded-xl bg-white px-3 ring-1 ring-stone-200 focus-within:ring-2 focus-within:ring-doibrand-gold/50 transition">
                <span className="text-xs text-stone-400">৳</span>
                <input
                  type="number"
                  min={bounds.min}
                  max={bounds.max}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="w-full bg-transparent px-1.5 py-2 text-xs font-semibold text-doibrand-dark outline-none font-sans"
                />
              </span>
            </label>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
