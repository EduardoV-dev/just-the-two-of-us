import Navigation from "@/components/Navigation";
import MusicProvider from "@/components/MusicProvider";
import MusicPlayer from "@/components/MusicPlayer";
import FloatingPetals from "@/components/FloatingPetals";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import Footer from "@/components/Footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MusicProvider>
      <FloatingPetals />
      <Navigation />
      <MusicPlayer />
      <main className="flex-1 pb-20 md:pb-0 md:pt-16 relative z-10">
        <PageTransitionWrapper>{children}</PageTransitionWrapper>
      </main>
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </MusicProvider>
  );
}
