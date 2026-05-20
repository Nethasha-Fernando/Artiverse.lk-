import { Link } from "react-router-dom";

interface ProfilePageStateProps {
  title: string;
  message: string;
}

function ProfilePageState({ title, message }: ProfilePageStateProps) {
  return (
    <main className="flex min-h-[50vh] items-center justify-center bg-page-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-heading text-2xl font-bold text-text-main-heading">
          {title}
        </h1>
        <p className="mt-3 font-body text-text-body">{message}</p>
        <Link
          to="/artists"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-2.5 font-heading text-sm font-medium text-white transition hover:brightness-95"
        >
          Back to artists
        </Link>
      </div>
    </main>
  );
}

export function ProfileLoadingState() {
  return (
    <main className="min-h-screen bg-page-background px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="h-[200px] rounded-[18px] bg-gray-200 sm:h-[240px] lg:h-[280px]" />
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <div className="mx-auto h-[420px] w-full max-w-[270px] rounded-[18px] bg-gray-200" />
          <div className="flex-1 space-y-4">
            <div className="h-6 w-24 rounded bg-gray-200" />
            <div className="h-10 w-48 rounded bg-gray-200" />
            <div className="h-32 w-full rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function ProfileNotFoundState() {
  return (
    <ProfilePageState
      title="Artist not found"
      message="We couldn't find an artist matching this profile. They may have been removed or the link is incorrect."
    />
  );
}

export function ProfileErrorState({ message }: { message: string }) {
  return (
    <ProfilePageState
      title="Unable to load profile"
      message={message}
    />
  );
}
