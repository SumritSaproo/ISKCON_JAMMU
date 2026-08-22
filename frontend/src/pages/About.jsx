import { useSettings } from '../api/content';

export default function About() {
  const { data: settings } = useSettings();

  return (
    <div className="px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
      <span className="text-[10.5px] tracking-widest uppercase text-vermilion font-semibold block mb-2">
        Our Story
      </span>
      <h1 className="font-display font-semibold text-2xl text-indigo mb-1">About ISKCON Jammu</h1>
      <div className="h-[3px] w-14 bg-marigold rounded mb-5" />

      <div className="flex gap-10 flex-wrap">
        <div className="flex-1 min-w-[280px]">
          <p className="text-sm text-indigo/70 leading-relaxed mb-4">
            ISKCON Jammu, situated in Dream City, Muthi, serves as a spiritual home for devotees
            across the region — offering daily worship, scriptural study and community festivals
            rooted in the Gaudiya Vaishnava tradition founded by Srila Prabhupada.
          </p>
          <p className="text-sm text-indigo/70 leading-relaxed mb-6">
            The temple welcomes visitors of every background for darshan, kirtan, and prasadam —
            with a growing congregation active in seva, youth programs and outreach across Jammu.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border-l-[3px] border-marigold pl-3.5">
              <div className="font-display font-semibold text-sm text-indigo">Presiding Deities</div>
              <div className="text-xs text-indigo/60 mt-1">Sri Sri Radha Krishna</div>
            </div>
            <div className="border-l-[3px] border-teal pl-3.5">
              <div className="font-display font-semibold text-sm text-indigo">Founder-Acharya</div>
              <div className="text-xs text-indigo/60 mt-1">
                His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs h-64 sm:h-80 rounded-t-full bg-gradient-to-br from-indigo to-indigo-deep flex-shrink-0 mx-auto" />
      </div>

      {settings && (
        <div className="bg-ivory-dim mt-10 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-8 grid sm:grid-cols-2 gap-6">
          <div>
            <div className="font-display font-semibold text-sm text-indigo mb-1">Darshan Timings</div>
            <div className="text-xs text-indigo/60">
              Morning: {settings.darshanTimings?.morning} <br />
              Evening: {settings.darshanTimings?.evening}
            </div>
          </div>
          {settings.announcementBanner && (
            <div>
              <div className="font-display font-semibold text-sm text-indigo mb-1">Announcement</div>
              <div className="text-xs text-indigo/60">{settings.announcementBanner}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
