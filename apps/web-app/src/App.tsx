import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

import GalleryView from "@/app/(protected)/gallery/_components/GalleryView";
import HomeView from "@/app/(protected)/home/_components/HomeView";
import LettersView from "@/app/(protected)/letters/_components/LettersView";
import TimelineView from "@/app/(protected)/timeline/_components/TimelineView";
import LoginForm from "@/app/_components/LoginForm";
import CountdownView from "@/app/countdown/_components/CountdownView";
import FloatingPetals from "@/components/FloatingPetals";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import MusicProvider from "@/components/MusicProvider";
import Navigation from "@/components/Navigation";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";
import { isCountdownLocked } from "@/lib/auth";
import { AuthProvider, useAuthContext } from "@/lib/auth-context";

function CountdownLayout() {
  return (
    <MusicProvider>
      <FloatingPetals />
      <MusicPlayer />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
    </MusicProvider>
  );
}

function ProtectedLayout() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <MusicProvider>
      <FloatingPetals />
      <Navigation />
      <MusicPlayer />
      <main className="relative z-10 flex-1 pb-20 md:pt-16 md:pb-0">
        <PageTransitionWrapper>
          <Outlet />
        </PageTransitionWrapper>
      </main>
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>
    </MusicProvider>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuthContext();
  const locked = isCountdownLocked();

  if (locked) {
    return (
      <Routes>
        <Route element={<CountdownLayout />}>
          <Route path="/countdown" element={<CountdownView />} />
        </Route>
        <Route path="*" element={<Navigate to="/countdown" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginForm />}
      />
      <Route
        path="/countdown"
        element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />}
      />
      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<HomeView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/letters" element={<LettersView />} />
        <Route path="/timeline" element={<TimelineView />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
