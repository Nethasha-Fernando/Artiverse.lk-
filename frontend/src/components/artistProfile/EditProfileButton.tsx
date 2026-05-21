import React from "react";
import { Link } from "react-router-dom";

export default function EditProfileButton() {
  return (
    <Link
      to="/edit-profile"
      className="mt-6 flex w-full items-center justify-center rounded-full bg-primary py-2.5 font-heading text-[15px] font-medium text-white transition hover:brightness-95 active:brightness-90"
    >
      Edit Profile
    </Link>
  );
}
