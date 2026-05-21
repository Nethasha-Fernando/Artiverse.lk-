import {
  ART_CATEGORIES,
} from "../../../shared/constants/artCategories";
import NumericInput from "../../common/NumericInput";
import Input from "../../common/Input";
import FramingOptIn from "./FramingOptIn";
import FramesPanel from "./FramesPanel";
import type { OriginalArt, FrameOption } from "../../../shared/types/types";

interface OriginalArtSectionProps {
  category:           string;
  originalArt:        OriginalArt;
  orientationPreview: string | null;
  offerFraming:       boolean | null;
  frames:             FrameOption[];
  onCategoryChange:   (val: string) => void;
  onOAChange:         <K extends keyof OriginalArt>(key: K, value: OriginalArt[K]) => void;
  onFramingChange:    (val: boolean) => void;
  onUpdateFrame:      (id: number, key: keyof FrameOption, value: string) => void;
  onAddFrame:         () => void;
  onRemoveFrame:      (id: number) => void;
}

export default function OriginalArtSection({
  category,
  originalArt,
  orientationPreview,
  offerFraming,
  frames,
  onCategoryChange,
  onOAChange,
  onFramingChange,
  onUpdateFrame,
  onAddFrame,
  onRemoveFrame,
}: OriginalArtSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Original Art
      </p>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2
              text-sm text-gray-800 outline-none transition focus:ring-1 focus:ring-red-300 pr-8"
          >
            <option value="">Select category</option>

            {ART_CATEGORIES.map((cat) => (
              <option
                key={cat.label}
                value={cat.label}
              >
                {cat.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ▾
          </span>
        </div>
      </div>

      {/* Surface / Size / Price */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Surface material</label>
          <Input
            type="text"
            placeholder="e.g. canvas, paper"
            value={originalArt.surfaceMaterial}
            onChange={(e) => onOAChange("surfaceMaterial", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Size (cm)</label>
          <div className="flex gap-2 items-center">
            <NumericInput
              placeholder="Width"
              value={originalArt.widthCm}
              onChange={(v) => onOAChange("widthCm", v)}
              className="flex-1"
            />
            <span className="text-gray-300 text-xs flex-shrink-0">×</span>
            <NumericInput
              placeholder="Height"
              value={originalArt.heightCm}
              onChange={(v) => onOAChange("heightCm", v)}
              className="flex-1"
            />
          </div>
          {orientationPreview && (
            <p className="text-xs text-red-400 font-medium mt-1">
              Orientation: {orientationPreview}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Price (LKR)</label>
          <NumericInput
            placeholder="Enter price"
            value={originalArt.priceLkr}
            onChange={(v) => onOAChange("priceLkr", v)}
          />
        </div>
      </div>

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