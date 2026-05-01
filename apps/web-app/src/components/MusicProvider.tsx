import { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";

interface MusicContextValue {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  toggle: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
}

const MusicContext = createContext<MusicContextValue>({
  isPlaying: false,
  isMuted: false,
  volume: 0.4,
  toggle: () => {},
  toggleMute: () => {},
  setVolume: () => {},
});

const DEFAULT_VOLUME = 1;

export function useMusic() {
  return useContext(MusicContext);
}

export default function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME);
  const hasAttemptedPlay = useRef(false);

  useEffect(() => {
    const audio = new Audio("/music/just-the-two-of-us.mp3");
    audio.loop = true;
    audio.volume = DEFAULT_VOLUME;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    // Autoplay on first user interaction (browser policy compliant)
    const handleFirstClick = () => {
      if (hasAttemptedPlay.current) return;
      hasAttemptedPlay.current = true;
      audio.play().catch(() => {});
      document.removeEventListener("click", handleFirstClick);
      document.removeEventListener("touchstart", handleFirstClick);
    };

    document.addEventListener("click", handleFirstClick, { passive: true });
    document.addEventListener("touchstart", handleFirstClick, {
      passive: true,
    });

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      document.removeEventListener("click", handleFirstClick);
      document.removeEventListener("touchstart", handleFirstClick);
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    // Try to play immediately if we already know the user interacted before (e.g. navigating from another page)
    audioRef.current?.play().catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      hasAttemptedPlay.current = true;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(1, v));
    audio.volume = clamped;
    setVolumeState(clamped);
    if (clamped === 0) {
      audio.muted = true;
      setIsMuted(true);
    } else if (audio.muted) {
      audio.muted = false;
      setIsMuted(false);
    }
  }, []);

  return (
    <MusicContext.Provider value={{ isPlaying, isMuted, volume, toggle, toggleMute, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
}
