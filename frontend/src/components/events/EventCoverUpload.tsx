import React, { useRef, useState } from "react";
import { icons } from "../../Constants/icons";

interface EventCoverUploadProps {
  imageUrl: string;
  onFileSelect: (file: File) => void;
  uploading?: boolean;
}

export default function EventCoverUpload({
  imageUrl,
  onFileSelect,
  uploading = false,
}: EventCoverUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative flex min-h-[200px] flex-col items-center justify-center overflow-hidden rounded-[18px] border-2 border-dashed bg-page-background transition ${
        dragOver ? "border-primary bg-accent/30" : "border-[#C4C4C4]"
      }`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="Cover preview" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="relative z-10 flex flex-col items-center gap-2 p-6 text-center">
          <img src={icons.upload} alt="" className="h-8 w-8 opacity-50" />
          <p className="font-body text-sm text-text-footnote">
            Drag & drop cover image here
          </p>
          <p className="font-body text-xs text-text-footnote">or click to browse</p>
        </div>
      )}

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="absolute inset-0 z-20 cursor-pointer disabled:cursor-wait"
        aria-label="Upload cover"
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = "";
        }}
      />
      {uploading && (
        <span className="absolute bottom-3 right-3 z-30 rounded-full bg-black/60 px-3 py-1 font-body text-xs text-white">
          Uploading…
        </span>
      )}
    </div>
  );
}
