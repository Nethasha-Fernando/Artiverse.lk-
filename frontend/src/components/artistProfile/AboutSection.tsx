import { icons } from "../../Constants/icons";
import type { ArtistProfile } from "../../types/artistProfile";
interface AboutSectionProps {
  artist: ArtistProfile;
}

export default function AboutSection({ artist }: AboutSectionProps) {
  return (
    <section className="min-w-0 flex-1 lg:pt-4">
      <div className="mb-6 flex items-start justify-end">
        <button
          type="button"
          className="flex items-center gap-1.5 font-body text-sm text-text-footnote transition hover:text-text-body"
        >
          <img src={icons.report} alt="" className="h-4 w-4 opacity-70" />
          Report
        </button>
      </div>

      <p className="font-heading text-lg font-medium uppercase tracking-wide text-text-footnote">
        A BIT
      </p>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <h2 className="font-heading text-[30px] font-medium uppercase text-text-sub-body">
          ABOUT ME
        </h2>
        <p className="flex items-center gap-2 font-body text-base font-medium text-text-footnote">
          <span className="hidden h-1.5 w-1.5 rounded-full bg-text-footnote sm:inline-block" />
          Active since: {artist.activeSince}
        </p>
      </div>

      <p className="mt-6 font-body text-lg font-normal leading-relaxed text-text-body">
        {artist.about}
      </p>

      <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
        {artist.tags.map((tag) => (
          <li
            key={tag}
            className="font-body text-[15px] font-normal text-text-body"
          >
            #{tag}
          </li>
        ))}
      </ul>

    </section>
  );
}
