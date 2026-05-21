import NumericInput from "../../common/NumericInput";
import Input from "../../common/Input";
import FramingOptIn from "./FramingOptIn";
import FramesPanel from "./FramesPanel";
import type { Print, FrameOption } from "../../../shared/types/types";

interface PrintsSectionProps {
  prints:          Print[];
  offerFraming:    boolean | null;
  frames:          FrameOption[];
  onUpdatePrint:   (id: number, key: keyof Print, value: unknown) => void;
  onAddPrint:      () => void;
  onRemovePrint:   (id: number) => void;
  onAddSize:       (id: number) => void;
  onRemoveSize:    (pid: number, idx: number) => void;
  onFramingChange: (val: boolean) => void;
  onUpdateFrame:   (id: number, key: keyof FrameOption, value: string) => void;
  onAddFrame:      () => void;
  onRemoveFrame:   (id: number) => void;
}

export default function PrintsSection({
  prints,
  offerFraming,
  frames,
  onUpdatePrint,
  onAddPrint,
  onRemovePrint,
  onAddSize,
  onRemoveSize,
  onFramingChange,
  onUpdateFrame,
  onAddFrame,
  onRemoveFrame,
}: PrintsSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Prints
      </p>

      {prints.map((print) => (
        <div key={print.id} className="border border-gray-100 rounded-2xl p-3 space-y-2 bg-gray-50">
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 font-medium">
            <span>Surface material</span>
            <span>Size (cm)</span>
            <span>Price (LKR)</span>
          </div>

          {print.sizes.map((size, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 items-center">
              {idx === 0 ? (
                <Input
                  placeholder="e.g. Canvas"
                  value={print.surfaceMaterial}
                  onChange={(e) => onUpdatePrint(print.id, "surfaceMaterial", e.target.value)}
                />
              ) : (
                <div />
              )}

              <div className="flex gap-1 items-center">
                <NumericInput
                  placeholder="W"
                  value={size.width}
                  className="flex-1"
                  onChange={(v) => {
                    const updated = [...print.sizes];
                    updated[idx] = { ...updated[idx], width: v };
                    onUpdatePrint(print.id, "sizes", updated);
                  }}
                />
                <span className="text-gray-300 text-xs flex-shrink-0">×</span>
                <NumericInput
                  placeholder="H"
                  value={size.height}
                  className="flex-1"
                  onChange={(v) => {
                    const updated = [...print.sizes];
                    updated[idx] = { ...updated[idx], height: v };
                    onUpdatePrint(print.id, "sizes", updated);
                  }}
                />
              </div>

              <div className="flex items-center gap-1">
                <NumericInput
                  placeholder="Price"
                  value={size.price}
                  className="flex-1"
                  onChange={(v) => {
                    const updated = [...print.sizes];
                    updated[idx] = { ...updated[idx], price: v };
                    onUpdatePrint(print.id, "sizes", updated);
                  }}
                />
                {print.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveSize(print.id, idx)}
                    className="text-red-400 hover:text-red-600 text-xs ml-1 flex-shrink-0"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => onAddSize(print.id)}
              className="text-xs text-red-400 hover:underline"
            >
              + Add size
            </button>
            {prints.length > 1 && (
              <button
                type="button"
                onClick={() => onRemovePrint(print.id)}
                className="text-xs text-gray-400 hover:text-red-400"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAddPrint}
        className="text-xs text-red-400 border border-dashed border-red-200 rounded-2xl w-full py-2 hover:bg-red-50 transition"
      >
        + Add surface material
      </button>

      <FramingOptIn value={offerFraming} onChange={onFramingChange} />

      {offerFraming === true && (
        <FramesPanel
          frames={frames}
          onUpdate={onUpdateFrame}
          onAdd={onAddFrame}
          onRemove={onRemoveFrame}
        />
      )}
    </div>
  );
}