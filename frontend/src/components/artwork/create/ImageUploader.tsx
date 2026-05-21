import uploadIcon from "../../../assets/icons/upload.svg";

interface ImageUploaderProps {
  mainImageUrl:        string | null;
  supportingImageUrls: string[];
  mainInputRef:        React.RefObject<HTMLInputElement | null>;  // ← add | null
  suppInputRef:        React.RefObject<HTMLInputElement | null>;  // ← add | null
  onMainFile:          (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMain:        (e: React.MouseEvent) => void;
  onDrop:              (e: React.DragEvent) => void;
  onSuppFiles:         (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveSupp:        (idx: number) => void;
}

export default function ImageUploader({
  mainImageUrl,
  supportingImageUrls,
  mainInputRef,
  suppInputRef,
  onMainFile,
  onRemoveMain,
  onDrop,
  onSuppFiles,
  onRemoveSupp,
}: ImageUploaderProps) {
  return (
    <div className="grid grid-cols-2 gap-4">

      {/* ── Main image ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Main artwork image
        </label>

        <div
          className="relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2
            border-dashed border-gray-200 bg-gray-50 transition cursor-pointer overflow-hidden mt-1
            hover:border-red-300 hover:bg-red-50"
          style={{ height: 140 }}
          onClick={() => !mainImageUrl && mainInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
        >
          {mainImageUrl ? (
            <>
              <img src={mainImageUrl} alt="Main" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={onRemoveMain}
                className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white
                  rounded-full w-6 h-6 flex items-center justify-center text-xs transition"
              >
                ✕
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <img src={uploadIcon} alt="Upload" className="w-8 h-8 opacity-30" />
              <p className="text-xs text-gray-400">Click or drop image here</p>
            </div>
          )}
        </div>

        <input
          ref={mainInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onMainFile}
        />
      </div>

      {/* ── Supporting images ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Supporting images
        </label>

        <div
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
            border-gray-200 bg-gray-50 cursor-pointer hover:border-red-300 hover:bg-red-50 transition py-4 mt-1"
          onClick={() => suppInputRef.current?.click()}
        >
          <img src={uploadIcon} alt="Upload" className="w-6 h-6 opacity-30 mb-1" />
          <p className="text-xs text-red-400 font-medium">Click or drop images here</p>
        </div>

        {supportingImageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {supportingImageUrls.map((url, i) => (
              <div
                key={i}
                className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0"
              >
                <img src={url} alt={`Supporting ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveSupp(i)}
                  className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-4 h-4
                    flex items-center justify-center text-[9px]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          ref={suppInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onSuppFiles}
        />
      </div>
    </div>
  );
}