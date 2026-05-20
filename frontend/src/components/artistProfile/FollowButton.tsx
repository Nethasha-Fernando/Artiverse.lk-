interface FollowButtonProps {
  onClick?: () => void;
}

export default function FollowButton({ onClick }: FollowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 flex w-full items-center justify-center rounded-full bg-primary py-2.5 font-heading text-[15px] font-medium text-white transition hover:brightness-95 active:brightness-90"
    >
      Follow
    </button>
  );
}
