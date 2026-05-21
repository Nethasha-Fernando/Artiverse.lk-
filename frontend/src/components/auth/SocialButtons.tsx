import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";

const SOCIAL_BUTTONS = [
  { Icon: FaGoogle,    label: "Google"   },
  { Icon: FaApple,     label: "Apple"    },
  { Icon: FaFacebookF, label: "Facebook" },
];

interface SocialButtonsProps {
  action: "Sign in" | "Sign up";
}

export default function SocialButtons({ action }: SocialButtonsProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/20" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-white/20" />
      </div>

      <div className="flex justify-center gap-4">
        {SOCIAL_BUTTONS.map(({ Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={`${action} with ${label}`}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
    </>
  );
}