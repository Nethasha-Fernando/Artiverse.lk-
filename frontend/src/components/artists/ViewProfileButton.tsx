import React, { type MouseEventHandler } from "react";

interface ViewProfileButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function ViewProfileButton({ onClick }: ViewProfileButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-5 flex w-full items-center justify-center rounded-full border-[1.5px] border-sec-button-stroke bg-white px-4 py-2 font-heading text-[13px] font-semibold text-icon transition hover:bg-accent"
    >
      View profile
    </button>
  );
}
