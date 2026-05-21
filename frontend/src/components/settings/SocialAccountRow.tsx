import React from "react";
import { icons } from "../../Constants/icons";

interface SocialAccountRowProps {
  platform: string;
  icon: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function SocialAccountRow({
  platform,
  icon,
  value,
  placeholder,
  onChange,
}: SocialAccountRowProps) {
  const connected = Boolean(value.trim());

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card-background px-4 py-3">
      <img src={icon} alt="" className="h-5 w-5 shrink-0 opacity-70" />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-xs font-medium uppercase text-text-footnote">
          {platform}
        </p>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`mt-0.5 w-full bg-transparent font-body text-sm outline-none ${
            connected ? "text-primary" : "text-text-body"
          } placeholder:text-text-footnote`}
        />
      </div>
      <img
        src={connected ? icons.unlink : icons.link}
        alt=""
        className="h-4 w-4 shrink-0 opacity-50"
      />
    </div>
  );
}
