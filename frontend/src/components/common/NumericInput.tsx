import type { InputHTMLAttributes } from "react";

type NumericInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

/** Text-based numeric field — avoids scroll-wheel and float drift from type="number". */
export default function NumericInput({
  value,
  onChange,
  error,
  className,
  onWheel,
  ...rest
}: NumericInputProps) {
  const handleChange = (raw: string) => {
    if (raw === "") {
      onChange("");
      return;
    }
    const cleaned = raw.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    const normalized =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
    onChange(normalized);
  };

  return (
    <input
      {...rest}
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      onWheel={(e) => {
        e.currentTarget.blur();
        onWheel?.(e);
      }}
      className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-gray-800 outline-none transition
        focus:ring-1 focus:ring-red-300
        ${error ? "border-red-400" : "border-gray-200"}
        ${className ?? ""}`}
    />
  );
}

/** Parse stored string to integer LKR (rounded). */
export function parsePriceLkr(value: string): number {
  const n = parseFloat(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n);
}
