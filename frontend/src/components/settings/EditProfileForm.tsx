import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ART_CATEGORIES } from "../../Constants/artCategories";
import { icons } from "../../Constants/icons";
import { useAuth } from "../../context/AuthContext";
import {
  fetchArtistProfile,
  updateArtistProfile,
  uploadBackgroundImage,
  uploadProfileImage,
} from "../../services/artistService";
import type { ArtistProfile } from "../../types/artistProfile";
import ImageUploadCard from "./ImageUploadCard";
import SocialAccountRow from "./SocialAccountRow";

interface FormState {
  firstName: string;
  lastName: string;
  country: string;
  district: string;
  address: string;
  postalCode: string;
  artCategories: string[];
  aboutArtist: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
    website: string;
  };
}

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  country: "",
  district: "",
  address: "",
  postalCode: "",
  artCategories: [],
  aboutArtist: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    website: "",
  },
};

function profileToForm(profile: ArtistProfile): FormState {
  return {
    firstName: profile.firstName || profile.name.split(" ")[0] || "",
    lastName:
      profile.lastName || profile.name.split(" ").slice(1).join(" ") || "",
    country: profile.country || "",
    district: profile.city || profile.district || "",
    address: profile.address || "",
    postalCode: profile.postalCode || "",
    artCategories: profile.artCategories || profile.tags || [],
    aboutArtist: profile.aboutArtist || profile.about || "",
    socialLinks: {
      facebook: profile.socialLinks?.facebook || "",
      instagram: profile.socialLinks?.instagram || "",
      linkedin: profile.socialLinks?.linkedin || "",
      twitter: profile.socialLinks?.twitter || "",
      website:
        profile.socialLinks?.website || profile.website || "",
    },
  };
}

export default function EditProfileForm() {
  const { token, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [profileImage, setProfileImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [slug, setSlug] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!token) return;

    fetchArtistProfile("me", token)
      .then((profile) => {
        setProfileImage(profile.profileImage);
        setBackgroundImage(profile.coverImage);
        setSlug(profile.slug);
        setForm(profileToForm(profile));
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Failed to load profile.",
        );
      })
      .finally(() => setLoading(false));
  }, [token]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "firstName" && fieldErrors.firstName) {
      setFieldErrors((prev) => ({ ...prev, firstName: "" }));
    }
  }

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!form.firstName.trim()) errors.firstName = "This field is required";
    if (!form.lastName.trim()) errors.lastName = "This field is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !validate()) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateArtistProfile(token, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        country: form.country.trim(),
        district: form.district.trim(),
        address: form.address.trim(),
        postalCode: form.postalCode.trim(),
        artCategories: form.artCategories,
        aboutArtist: form.aboutArtist.trim(),
        socialLinks: form.socialLinks,
      });
      await refreshProfile();
      setSuccess("Profile saved successfully.");
      setTimeout(() => navigate(slug ? `/artists/${slug}` : "/profile"), 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleProfileImage(file: File) {
    if (!token) return;
    setUploadingProfile(true);
    try {
      const url = await uploadProfileImage(token, file);
      setProfileImage(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Profile upload failed.");
    } finally {
      setUploadingProfile(false);
    }
  }

  async function handleBackgroundImage(file: File) {
    if (!token) return;
    setUploadingBackground(true);
    try {
      const url = await uploadBackgroundImage(token, file);
      setBackgroundImage(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Background upload failed.");
    } finally {
      setUploadingBackground(false);
    }
  }

  if (loading) {
    return (
      <p className="font-body text-text-footnote">Loading profile information…</p>
    );
  }

  return (
    <form onSubmit={handleSave} className="min-w-0 flex-1">
      {error && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-body text-sm text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 font-body text-sm text-green-700">
          {success}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ImageUploadCard
          label="Profile Photo"
          imageUrl={profileImage}
          variant="profile"
          onFileSelect={handleProfileImage}
          uploading={uploadingProfile}
        />
        <ImageUploadCard
          label="Background Image"
          imageUrl={backgroundImage}
          variant="background"
          onFileSelect={handleBackgroundImage}
          uploading={uploadingBackground}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-body text-sm text-text-sub-body">
            First Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className={`w-full rounded-xl border bg-card-background px-4 py-3 font-body text-sm outline-none ${
                fieldErrors.firstName
                  ? "border-red-500 pr-10"
                  : "border-border focus:border-sec-button-stroke"
              }`}
            />
            {fieldErrors.firstName && (
              <img
                src={icons.warning}
                alt=""
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
              />
            )}
          </div>
          {fieldErrors.firstName && (
            <p className="mt-1 font-body text-xs text-red-500">
              {fieldErrors.firstName}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-body text-sm text-text-sub-body">
            Last Name
          </label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            placeholder="Your last name"
            className="w-full rounded-xl border border-border bg-card-background px-4 py-3 font-body text-sm outline-none focus:border-sec-button-stroke"
          />
          {fieldErrors.lastName && (
            <p className="mt-1 font-body text-xs text-red-500">
              {fieldErrors.lastName}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-body text-sm text-text-sub-body">
            Country
          </label>
          <input
            type="text"
            value={form.country}
            onChange={(e) => updateField("country", e.target.value)}
            placeholder="e.g: Sri Lanka"
            className="w-full rounded-xl border border-border bg-card-background px-4 py-3 font-body text-sm outline-none focus:border-sec-button-stroke"
          />
        </div>

        <div>
          <label className="mb-1 block font-body text-sm text-text-sub-body">
            District
          </label>
          <input
            type="text"
            value={form.district}
            onChange={(e) => updateField("district", e.target.value)}
            placeholder="Colombo"
            className="w-full rounded-xl border border-border bg-card-background px-4 py-3 font-body text-sm outline-none focus:border-sec-button-stroke"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1 block font-body text-sm text-text-sub-body">
          Delivery address
        </label>
        <textarea
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          placeholder="123, Main Street, Any town"
          rows={3}
          className="w-full resize-none rounded-xl border border-border bg-card-background px-4 py-3 font-body text-sm outline-none focus:border-sec-button-stroke"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block font-body text-sm text-text-sub-body">
          Postal code
        </label>
        <input
          type="text"
          value={form.postalCode}
          onChange={(e) => updateField("postalCode", e.target.value)}
          className="w-full rounded-xl border border-border bg-card-background px-4 py-3 font-body text-sm outline-none focus:border-sec-button-stroke"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block font-body text-sm text-text-sub-body">
          Art Categories
        </label>
        <select
          multiple
          value={form.artCategories}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(
              (o) => o.value,
            );
            updateField("artCategories", selected);
          }}
          className="min-h-[100px] w-full rounded-xl border border-border bg-card-background px-4 py-3 font-body text-sm outline-none focus:border-sec-button-stroke"
        >
          {ART_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <p className="mt-1 font-body text-xs text-text-footnote">
          Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories.
        </p>
      </div>

      <div className="mt-4">
        <label className="mb-1 block font-body text-sm text-text-sub-body">
          About Artist
        </label>
        <textarea
          value={form.aboutArtist}
          onChange={(e) => updateField("aboutArtist", e.target.value)}
          placeholder="A few words about you"
          rows={5}
          className="w-full resize-none rounded-xl border border-border bg-card-background px-4 py-3 font-body text-sm outline-none focus:border-sec-button-stroke"
        />
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-medium text-text-sub-body">
          Social Accounts
        </h2>
        <div className="mt-4 space-y-3">
          <SocialAccountRow
            platform="Facebook"
            icon={icons.facebook_logo}
            value={form.socialLinks.facebook}
            placeholder="Add Link"
            onChange={(v) =>
              setForm((prev) => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, facebook: v },
              }))
            }
          />
          <SocialAccountRow
            platform="Instagram"
            icon={icons.instagram_logo}
            value={form.socialLinks.instagram}
            placeholder="Add Link"
            onChange={(v) =>
              setForm((prev) => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, instagram: v },
              }))
            }
          />
          <SocialAccountRow
            platform="LinkedIn"
            icon={icons.link}
            value={form.socialLinks.linkedin}
            placeholder="Add Link"
            onChange={(v) =>
              setForm((prev) => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, linkedin: v },
              }))
            }
          />
          <SocialAccountRow
            platform="Twitter"
            icon={icons.link}
            value={form.socialLinks.twitter}
            placeholder="Add Link"
            onChange={(v) =>
              setForm((prev) => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, twitter: v },
              }))
            }
          />
          <SocialAccountRow
            platform="Website"
            icon={icons.link}
            value={form.socialLinks.website}
            placeholder="Add Link"
            onChange={(v) =>
              setForm((prev) => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, website: v },
              }))
            }
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-10 py-2.5 font-heading text-sm font-medium text-white transition hover:brightness-95 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
