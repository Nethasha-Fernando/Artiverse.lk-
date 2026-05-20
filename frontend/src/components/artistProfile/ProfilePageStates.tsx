import React from "react";
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
    <main className="min-h-screen bg-page-background pb-10">
      <div className="h-[200px] w-full animate-pulse bg-gray-200 sm:h-[240px] lg:h-[280px]" />
      <div className="w-full px-4 sm:px-6 lg:pl-6 lg:pr-12 xl:pl-8 xl:pr-16">
        <div className="mx-auto grid w-full max-w-[1800px] animate-pulse grid-cols-1 gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-x-10">
          <div className="w-full max-w-[260px] justify-self-start space-y-4">
            <div className="mt-4 h-[130px] w-[130px] rounded-full bg-gray-200" />
            <div className="h-[280px] rounded-[18px] bg-gray-200" />
            <div className="h-[140px] rounded-[18px] bg-gray-200" />
            <div className="h-[120px] rounded-[18px] bg-gray-200" />
          </div>
          <div className="space-y-4 lg:pt-[4.5rem]">
            <div className="h-10 w-64 rounded bg-gray-200" />
            <div className="h-48 w-full rounded bg-gray-200" />
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
