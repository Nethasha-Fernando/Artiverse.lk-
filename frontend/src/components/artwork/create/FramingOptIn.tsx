interface FramingOptInProps {
  value:    boolean | null;
  onChange: (val: boolean) => void;
}

export default function FramingOptIn({ value, onChange }: FramingOptInProps) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <span className="text-xs text-gray-500 font-medium">
        Offer framing for this artwork?
      </span>
      <div className="flex gap-2">
        {([true, false] as const).map((opt) => (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-4 py-1 rounded-full text-xs font-semibold border transition
              ${value === opt
                ? opt
                  ? "bg-red-500 border-red-500 text-white shadow-sm"
                  : "bg-gray-700 border-gray-700 text-white shadow-sm"
                : "border-gray-300 text-gray-500 hover:bg-gray-50"}`}
          >
            {opt ? "Yes" : "No"}
          </button>
        ))}
      </div>
    </div>
  );
}