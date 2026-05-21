import FrameCard from "./FrameCard";
import type { Frame } from "../../../shared/types/artworkDetail";

interface FrameSelectorProps {
  frames:        Frame[];
  addFrame:      boolean;
  selectedFrame: Frame | null;
  onAddFrame:    (val: boolean) => void;
  onSelectFrame: (frame: Frame) => void;
  getFramePrice: (frame: Frame | null) => number;
}

export default function FrameSelector({
  frames,
  addFrame,
  selectedFrame,
  onAddFrame,
  onSelectFrame,
  getFramePrice,
}: FrameSelectorProps) {
  const hasFrames = frames.length > 0;

  return (
    <div className="space-y-2.5">
      <p className="text-sm text-gray-700">
        Would you like to purchase this art with a frame?{" "}
        <span className="text-gray-400 font-normal">Additional charges will apply.</span>
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onAddFrame(true)}
          disabled={!hasFrames}
          className={`px-4 py-1.5 rounded-full border text-xs font-medium transition ${
            addFrame && hasFrames
              ? "bg-rose-400 text-white border-rose-400"
              : !hasFrames
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-300 text-gray-600 hover:border-rose-300 hover:text-rose-400"
          }`}
        >
          Yes, add a frame
        </button>
        <button
          onClick={() => onAddFrame(false)}
          className={`px-4 py-1.5 rounded-full border text-xs font-medium transition ${
            !addFrame
              ? "bg-rose-400 text-white border-rose-400"
              : "border-gray-300 text-gray-600 hover:border-rose-300 hover:text-rose-400"
          }`}
        >
          No, just the art
        </button>
      </div>

      {addFrame && (
        hasFrames ? (
          <div className="grid grid-cols-2 gap-2">
            {frames.map((frame) => (
              <FrameCard
                key={frame.id}
                frame={frame}
                isSelected={selectedFrame?.id === frame.id}
                onSelect={() => onSelectFrame(frame)}
                framePrice={getFramePrice(frame)}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No frame options available for this artwork.</p>
        )
      )}
    </div>
  );
}