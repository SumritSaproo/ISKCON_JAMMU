import { useState, useEffect } from 'react';
import { useSettings } from '../../api/content';
import { useUpdateSettings } from '../../api/admin';

export default function SettingsAdmin() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState({ morning: '', evening: '', announcementBanner: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        morning: settings.darshanTimings?.morning || '',
        evening: settings.darshanTimings?.evening || '',
        announcementBanner: settings.announcementBanner || '',
      });
    }
  }, [settings]);

  function handleSave(e) {
    e.preventDefault();
    setSaved(false);
    updateSettings.mutate(
      {
        darshanTimings: { morning: form.morning, evening: form.evening },
        announcementBanner: form.announcementBanner,
      },
      { onSuccess: () => setSaved(true) }
    );
  }

  if (isLoading) return <p className="text-xs text-indigo/50">Loading…</p>;

  return (
    <div>
      <div className="font-display font-semibold text-lg text-indigo mb-5">Settings</div>

      <form onSubmit={handleSave} className="bg-white border border-indigo/10 rounded-lg p-5 max-w-md">
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
