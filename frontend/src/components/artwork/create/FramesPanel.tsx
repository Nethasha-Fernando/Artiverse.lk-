import NumericInput from "../../common/NumericInput";
import SurfaceMaterialSelect from "../../common/SurfaceMaterialSelect";
import Input from "../../common/Input";
import type { FrameOption } from "../../../shared/types/types";

interface FramesPanelProps {
  frames:   FrameOption[];
  onUpdate: (id: number, key: keyof FrameOption, value: string) => void;
  onAdd:    () => void;
  onRemove: (id: number) => void;
}

export default function FramesPanel({ frames, onUpdate, onAdd, onRemove }: FramesPanelProps) {
  return (
    <div className="rounded-2xl bg-red-50 border border-red-100 p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
        Frame Options
      </p>

      {frames.map((frame) => (
        <div key={frame.id} className="border border-red-100 rounded-2xl p-3 space-y-2 bg-white">
          <div className="grid grid-cols-4 gap-2 text-xs text-red-300 font-medium">
            <span>Material</span>
            <span>Color</span>
            <span>Width (cm)</span>
            <span>Price (LKR)</span>
          </div>

          <div className="grid grid-cols-4 gap-2 items-start">
            <SurfaceMaterialSelect
              selected={frame.surfaceMaterial}
              onChange={(val) => onUpdate(frame.id, "surfaceMaterial", val)}
            />
            <Input
              placeholder="e.g. black"
              value={frame.color}
              onChange={(e) => onUpdate(frame.id, "color", e.target.value)}
            />
            <NumericInput
              placeholder="0"
              value={frame.widthCm}
              onChange={(v) => onUpdate(frame.id, "widthCm", v)}
            />
            <NumericInput
              placeholder="Price"
              value={frame.extraPriceLkr}
              onChange={(v) => onUpdate(frame.id, "extraPriceLkr", v)}
            />
          </div>

          {frames.length > 1 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onRemove(frame.id)}
                className="text-xs text-red-400 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="text-xs text-red-400 border border-dashed border-red-300 rounded-2xl w-full py-2 hover:bg-red-100 transition bg-white"
      >
        + Add frame option
      </button>
    </div>
  );
}