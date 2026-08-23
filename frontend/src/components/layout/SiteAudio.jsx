import { createContext, useContext, useEffect, useRef, useState } from 'react';

const SiteAudioContext = createContext(null);

export function SiteAudioProvider({ settings, children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !settings?.audioUrl) return undefined;

    audio.src = settings.audioUrl;
    audio.load();
    setIsPlaying(false);
    setShowPrompt(false);
    audio.play().then(() => setIsPlaying(true)).catch(() => setShowPrompt(true));

    return () => audio.pause();
  }, [settings?.audioUrl]);

  function play() {
    audioRef.current?.play().then(() => {
      setIsPlaying(true);
      setShowPrompt(false);
    }).catch(() => {});
  }

  function toggle() {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      play();
    }
  }

  return (
    <SiteAudioContext.Provider value={{
      hasAudio: Boolean(settings?.audioUrl),
      isPlaying,
      title: settings?.audioTitle,
      toggle,
    }}>
      {children}
      <audio ref={audioRef} loop onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      {showPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-lg bg-indigo px-4 py-3 text-ivory shadow-lg">
          <span className="text-xs">I know your favourite song. Do you want me to play it?</span>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={play} className="rounded bg-marigold px-3 py-1.5 text-[11px] font-semibold text-indigo">Yes</button>
            <button type="button" onClick={() => setShowPrompt(false)} className="rounded border border-ivory/40 px-3 py-1.5 text-[11px] text-ivory">No</button>
          </div>
        </div>
      )}
    </SiteAudioContext.Provider>
  );
}

export function useSiteAudio() {
  return useContext(SiteAudioContext) || { hasAudio: false, isPlaying: false, toggle: () => {} };
}