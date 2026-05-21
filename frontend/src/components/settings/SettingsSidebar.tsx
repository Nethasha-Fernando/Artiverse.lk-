import React from "react";
import { Link, useLocation } from "react-router-dom";
import { icons } from "../../Constants/icons";

const items = [
  {
    label: "Edit profile information",
    to: "/edit-profile",
    icon: icons.edit_profile_info,
  },
  { label: "Notifications", to: "#", icon: icons.notification },
  { label: "Security", to: "#", icon: icons.security },
  { label: "Delete account", to: "#", icon: icons.trash },
];

export default function SettingsSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-full max-w-[280px] shrink-0">
      <h1 className="font-heading text-2xl font-bold text-primary">Settings</h1>
      <nav className="mt-6 space-y-1">
        {items.map((item) => {
          const active = pathname === item.to;
          const className = `flex items-center gap-3 rounded-xl px-4 py-3 font-body text-sm transition ${
            active
              ? "bg-accent font-medium text-primary"
              : "text-text-body hover:bg-accent/50"
          }`;

          if (item.to === "#") {
            return (
              <span
                key={item.label}
                className={`${className} cursor-not-allowed opacity-60`}
              >
                <img src={item.icon} alt="" className="h-5 w-5 opacity-70" />
                {item.label}
              </span>
            );
          }

          return (
            <Link key={item.label} to={item.to} className={className}>
              <img src={item.icon} alt="" className="h-5 w-5 opacity-70" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
