import FloatingPetals from "@/components/FloatingPetals";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import MusicProvider from "@/components/MusicProvider";
import Navigation from "@/components/Navigation";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <MusicProvider>
      <FloatingPetals />
      <Navigation />
      <MusicPlayer />
      <main className="relative z-10 flex-1 pb-20 md:pt-16 md:pb-0">
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
      </main>
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </MusicProvider>
  );
}
