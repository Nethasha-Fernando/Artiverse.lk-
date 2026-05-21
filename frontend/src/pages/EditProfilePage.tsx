import React from "react";
import SettingsSidebar from "../components/settings/SettingsSidebar";
import EditProfileForm from "../components/settings/EditProfileForm";

export default function EditProfilePage() {
  return (
    <main className="min-h-screen bg-page-background px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:gap-12">
        <SettingsSidebar />
        <EditProfileForm />
      </div>
    </main>
  );
}
