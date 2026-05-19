import type { MouseEventHandler } from "react";

interface ViewProfileButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ViewProfileButton({ onClick }: ViewProfileButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 inline-flex items-center justify-center rounded-full border-[1.5px] border-secButtonStroke bg-white px-6 py-2.5 text-sm font-semibold text-icon transition hover:bg-accent/70 hover:text-icon font-['Roboto']"
    >
      View profile
    </button>
  );
}
