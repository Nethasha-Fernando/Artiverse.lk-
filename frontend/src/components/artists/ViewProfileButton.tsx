import React, { type MouseEventHandler } from "react";
import { Link } from "react-router-dom";

interface ViewProfileButtonProps {
  to?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const buttonStyles =
  "mt-5 flex w-full items-center justify-center rounded-full border-[1.5px] border-sec-button-stroke bg-white px-4 py-2 font-heading text-[13px] font-semibold text-icon transition hover:bg-accent";

export default function ViewProfileButton({ to, onClick }: ViewProfileButtonProps) {
  if (to) {
    return (
      <Link to={to} className={buttonStyles}>
        View profile
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={buttonStyles}>
      View profile
    </button>
  );
}
