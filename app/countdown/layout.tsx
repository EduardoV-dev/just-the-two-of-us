import MusicProvider from "@/components/MusicProvider";
import MusicPlayer from "@/components/MusicPlayer";
import FloatingPetals from "@/components/FloatingPetals";

export default function CountdownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MusicProvider>
      <FloatingPetals />
      <MusicPlayer />
      <main className="flex-1 relative z-10">{children}</main>
    </MusicProvider>
  );
}
