import FloatingPetals from "@/components/FloatingPetals";
import MusicPlayer from "@/components/MusicPlayer";
import MusicProvider from "@/components/MusicProvider";

export default function CountdownLayout({ children }: { children: React.ReactNode }) {
  return (
    <MusicProvider>
      <FloatingPetals />
      <MusicPlayer />
      <main className="relative z-10 flex-1">{children}</main>
    </MusicProvider>
  );
}
