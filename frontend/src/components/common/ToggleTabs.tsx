import { useState } from "react";

type Option = { value: string; label: string };

type ToggleTabsProps = {
  options:       Option[];
  value?:        string;
  defaultValue?: string;
  onChange?:     (value: string) => void;
  className?:    string;
};

export default function ToggleTabs({
  options,
  value,
  defaultValue,
  onChange,
  className = "",
}: ToggleTabsProps) {
  const [internal, setInternal] = useState(
    value ?? defaultValue ?? (options[0]?.value || "")
  );
  const selected = value ?? internal;

  const handleSelect = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  return (
    <div className={`w-full flex justify-start my-4 ${className}`}>
      <div className="inline-flex gap-1 p-1 border border-[#ff4d4d] rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
        {options.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`px-6 py-2 text-sm font-[Rubik] font-medium rounded-full transition
                ${isActive
                  ? "bg-[#ff4d4d] text-white shadow-[0_2px_10px_rgba(255,77,77,0.3)]"
                  : "text-[#3f3f3f] hover:bg-[#fff5f5] hover:text-[#ff4d4d]"
                }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}