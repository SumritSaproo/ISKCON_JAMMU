import { useState, useEffect } from 'react';
import { defaultSiteContent, useSettings } from '../../api/content';
import { useUpdateSettings, useUploadBackgroundImage, useUploadSiteAudio } from '../../api/admin';

const initialForm = {
  morning: '',
  evening: '',
  announcementBanner: '',
  backgroundImage: '',
  backgroundImageOpacity: 1,
  backgroundFileName: '',
  audioUrl: '',
  audioTitle: 'Temple Kirtan',
  audioFileName: '',
  home: defaultSiteContent.home,
  about: defaultSiteContent.about,
  footer: defaultSiteContent.footer,
};

export default function SettingsAdmin() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const uploadBackgroundImage = useUploadBackgroundImage();
  const uploadSiteAudio = useUploadSiteAudio();
  const [form, setForm] = useState(initialForm);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm((currentForm) => ({
        morning: settings.darshanTimings?.morning || '',
        evening: settings.darshanTimings?.evening || '',
        announcementBanner: settings.announcementBanner || '',
        backgroundImage: settings.backgroundImage || '',
        backgroundImageOpacity: settings.backgroundImageOpacity ?? 1,
        backgroundFileName: currentForm.backgroundFileName,
        audioUrl: settings.audioUrl || '',
        audioTitle: settings.audioTitle || 'Temple Kirtan',
        audioFileName: currentForm.audioFileName,
        home: { ...defaultSiteContent.home, ...settings.home },
        about: { ...defaultSiteContent.about, ...settings.about },
        footer: { ...defaultSiteContent.footer, ...settings.footer },
      }));
    }
  }, [settings]);

  function updateGroup(group, field, value) {
    setForm({ ...form, [group]: { ...form[group], [field]: value } });
  }

  function handleSave(e) {
    e.preventDefault();
    setSaved(false);
    updateSettings.mutate(
      {
        darshanTimings: { morning: form.morning, evening: form.evening },
        announcementBanner: form.announcementBanner,
        backgroundImage: form.backgroundImage,
        backgroundImageOpacity: form.backgroundImageOpacity,
        audioUrl: form.audioUrl,
        audioTitle: form.audioTitle,
        home: form.home,
        about: form.about,
        footer: form.footer,
      },
      { onSuccess: () => setSaved(true) }
    );
  }

  function handleBackgroundUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, backgroundFileName: file.name });
      uploadBackgroundImage.mutate(file);
    }
    e.target.value = '';
  }

  function handleAudioUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, audioFileName: file.name });
      uploadSiteAudio.mutate(file);
    }
    e.target.value = '';
  }

  if (isLoading) return <p className="text-xs text-indigo/50">Loading…</p>;

  return (
    <div>
      <div className="font-display font-semibold text-lg text-indigo mb-5">Settings</div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <section className="bg-white border border-indigo/10 rounded-lg p-5">
          <h2 className="font-display font-semibold text-sm text-indigo mb-4">Site Background</h2>
          <label className="block text-[11px] text-indigo/60 mb-2">
            Background Image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleBackgroundUpload}
              disabled={uploadBackgroundImage.isPending}
              className="block w-full mt-1 text-xs"
            />
            {form.backgroundFileName && (
              <span className="block text-[10px] text-teal mt-1">Uploaded: {form.backgroundFileName}</span>
            )}
          </label>
          <p className="text-[11px] text-indigo/50 leading-relaxed mb-3">
            Recommended: landscape 1920 × 1080 px, JPG/PNG/WebP, maximum 8 MB. Use a clear,
            lightly detailed image so the text stays readable.
          </p>
          {form.backgroundImage && (
            <img
              src={form.backgroundImage}
              alt="Current site background"
              className="w-full max-w-md aspect-video object-cover rounded border border-indigo/10 mb-3"
            />
          )}
          <label className="block text-[11px] text-indigo/60">
            Image Transparency
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={form.backgroundImageOpacity}
              onChange={(e) => setForm({ ...form, backgroundImageOpacity: Number(e.target.value) })}
              className="w-full mt-2"
            />
            <span className="text-[10px] text-indigo/50">{Math.round(form.backgroundImageOpacity * 100)}% image opacity</span>
          </label>
        </section>

        <section className="bg-white border border-indigo/10 rounded-lg p-5">
          <h2 className="font-display font-semibold text-sm text-indigo mb-4">Site Music</h2>
          <Field
            label="Song Title"
            value={form.audioTitle}
            onChange={(value) => setForm({ ...form, audioTitle: value })}
          />
          <label className="block text-[11px] text-indigo/60 mb-2">
            Audio File
            <input
              type="file"
              accept="audio/mpeg,audio/wav,audio/ogg,audio/aac,audio/mp4"
              onChange={handleAudioUpload}
              disabled={uploadSiteAudio.isPending}
              className="block w-full mt-1 text-xs"
            />
            {form.audioFileName && (
              <span className="block text-[10px] text-teal mt-1">Uploaded: {form.audioFileName}</span>
            )}
          </label>
          <p className="text-[11px] text-indigo/50 leading-relaxed">
            Recommended: MP3, 128–320 kbps, maximum 16 MB. Use music you have permission to publish.
            Browsers may require the visitor to click Yes before audio can play.
          </p>
        </section>

        <section className="bg-white border border-indigo/10 rounded-lg p-5">
          <h2 className="font-display font-semibold text-sm text-indigo mb-4">Home Page</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Eyebrow" value={form.home.eyebrow} onChange={(value) => updateGroup('home', 'eyebrow', value)} />
            <Field label="Primary Button" value={form.home.primaryCta} onChange={(value) => updateGroup('home', 'primaryCta', value)} />
            <Field label="Hero Title" value={form.home.title} onChange={(value) => updateGroup('home', 'title', value)} multiline />
            <Field label="Secondary Button" value={form.home.secondaryCta} onChange={(value) => updateGroup('home', 'secondaryCta', value)} />
          </div>
          <Field label="Hero Description" value={form.home.description} onChange={(value) => updateGroup('home', 'description', value)} multiline />
        </section>

        <section className="bg-white border border-indigo/10 rounded-lg p-5">
          <h2 className="font-display font-semibold text-sm text-indigo mb-4">About Page</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Eyebrow" value={form.about.eyebrow} onChange={(value) => updateGroup('about', 'eyebrow', value)} />
            <Field label="Page Title" value={form.about.title} onChange={(value) => updateGroup('about', 'title', value)} />
            <Field label="Presiding Deities Heading" value={form.about.deitiesHeading} onChange={(value) => updateGroup('about', 'deitiesHeading', value)} />
            <Field label="Presiding Deities Text" value={form.about.deitiesText} onChange={(value) => updateGroup('about', 'deitiesText', value)} />
            <Field label="Founder Heading" value={form.about.founderHeading} onChange={(value) => updateGroup('about', 'founderHeading', value)} />
            <Field label="Founder Text" value={form.about.founderText} onChange={(value) => updateGroup('about', 'founderText', value)} />
          </div>
          <Field label="First Paragraph" value={form.about.paragraphOne} onChange={(value) => updateGroup('about', 'paragraphOne', value)} multiline />
          <Field label="Second Paragraph" value={form.about.paragraphTwo} onChange={(value) => updateGroup('about', 'paragraphTwo', value)} multiline />
        </section>

        <section className="bg-white border border-indigo/10 rounded-lg p-5">
          <h2 className="font-display font-semibold text-sm text-indigo mb-4">Footer</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Brand" value={form.footer.brand} onChange={(value) => updateGroup('footer', 'brand', value)} />
            <Field label="Contact Heading" value={form.footer.contactHeading} onChange={(value) => updateGroup('footer', 'contactHeading', value)} />
            <Field label="Timings Heading" value={form.footer.timingsHeading} onChange={(value) => updateGroup('footer', 'timingsHeading', value)} />
            <Field label="Newsletter Heading" value={form.footer.newsletterHeading} onChange={(value) => updateGroup('footer', 'newsletterHeading', value)} />
            <Field label="Newsletter Placeholder" value={form.footer.newsletterPlaceholder} onChange={(value) => updateGroup('footer', 'newsletterPlaceholder', value)} />
            <Field label="Newsletter Button" value={form.footer.newsletterButton} onChange={(value) => updateGroup('footer', 'newsletterButton', value)} />
          </div>
          <Field label="Description" value={form.footer.description} onChange={(value) => updateGroup('footer', 'description', value)} multiline />
          <Field label="Contact Details (one line per entry)" value={form.footer.contactText} onChange={(value) => updateGroup('footer', 'contactText', value)} multiline />
          <Field label="Daily Timings (one line per entry)" value={form.footer.timingsText} onChange={(value) => updateGroup('footer', 'timingsText', value)} multiline />
          <Field label="Newsletter Success Message" value={form.footer.newsletterSuccess} onChange={(value) => updateGroup('footer', 'newsletterSuccess', value)} />
        </section>

        <section className="bg-white border border-indigo/10 rounded-lg p-5">
          <h2 className="font-display font-semibold text-sm text-indigo mb-4">Temple Information</h2>
        <label className="block text-[11px] text-indigo/60 mb-1">Morning Darshan Timing</label>
        <input
          value={form.morning}
          onChange={(e) => setForm({ ...form, morning: e.target.value })}
          className="w-full border border-indigo/15 rounded px-3 py-2 text-xs mb-3"
        />

        <label className="block text-[11px] text-indigo/60 mb-1">Evening Darshan Timing</label>
        <input
          value={form.evening}
          onChange={(e) => setForm({ ...form, evening: e.target.value })}
          className="w-full border border-indigo/15 rounded px-3 py-2 text-xs mb-3"
        />

        <label className="block text-[11px] text-indigo/60 mb-1">Announcement Banner</label>
        <textarea
          rows={2}
          value={form.announcementBanner}
          onChange={(e) => setForm({ ...form, announcementBanner: e.target.value })}
          className="w-full border border-indigo/15 rounded px-3 py-2 text-xs mb-4"
        />
        </section>

        {saved && <p className="text-[11px] text-teal mb-2">Saved.</p>}

        <button
          disabled={updateSettings.isPending}
          className="bg-indigo text-ivory text-xs font-semibold px-4 py-2 rounded disabled:opacity-60"
        >
          {updateSettings.isPending ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, multiline = false }) {
  const className = 'w-full border border-indigo/15 rounded px-3 py-2 text-xs';
  return (
    <label className="block text-[11px] text-indigo/60 mb-3">
      {label}
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${className} mt-1`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={`${className} mt-1`} />
      )}
    </label>
  );
}
