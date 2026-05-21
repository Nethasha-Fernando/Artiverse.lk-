import React, { useRef } from "react";
import { icons } from "../../Constants/icons";

interface ImageUploadCardProps {
  label: string;
  imageUrl: string;
  variant: "profile" | "background";
  onFileSelect: (file: File) => void;
  uploading?: boolean;
}

export default function ImageUploadCard({
  label,
  imageUrl,
  variant,
  onFileSelect,
  uploading = false,
}: ImageUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-[18px] border border-[#C4C4C4] bg-card-background p-4 shadow-card">
      <p className="mb-3 font-heading text-sm font-medium text-text-sub-body">
        {label}
      </p>
      <div className="relative flex items-center justify-center overflow-hidden rounded-[14px] border border-border bg-page-background">
        {variant === "profile" ? (
          <div className="flex h-[140px] w-full items-center justify-center py-4">
            <img
              src={imageUrl}
              alt={label}
              className="h-24 w-24 rounded-full border-[4px] border-white object-cover shadow-sm"
            />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={label}
            className="h-[120px] w-full object-cover"
          />
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-accent disabled:opacity-50"
          aria-label={`Edit ${label}`}
        >
          <img src={icons.edit_pen} alt="" className="h-4 w-4" />
        </button>
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
      </div>
      {uploading && (
        <p className="mt-2 text-center font-body text-xs text-text-footnote">
          Uploading…
        </p>
      )}
    </div>
  );
}
