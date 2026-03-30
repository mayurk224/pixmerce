import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import { useAuth } from "./hooks/useAuth.js";
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";

function App() {
  const { isAuthenticated, loading } = useAuth();
  const audioRef = useRef(null);
  const bgRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio("/sfx.mp3");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        window.addEventListener("click", tryPlay);
        window.addEventListener("keydown", tryPlay);
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Parallax only on desktop
      if (window.innerWidth < 640) return;

      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 20;
      const y = (event.clientY / innerHeight - 0.5) * 20;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleToggleMute = () => {
    if (!audioRef.current) {
      return;
    }

    const nextMutedState = !isMuted;
    audioRef.current.muted = nextMutedState;
    setIsMuted(nextMutedState);
  };

  return (
    /*
     * Mobile  : outer div scrolls horizontally (overflow-x-auto).
     *           Background is absolute 200vw wide — user pans to explore it.
     *           Content wrapper is sticky left-0 so it stays in the viewport.
     * Desktop : outer div clips overflow; background is fixed with parallax.
     */
    <div className="overflow-x-auto sm:overflow-hidden">
      {/* Wide canvas — 200vw on mobile, collapses to nothing on desktop */}
      <div className="relative min-w-[200vw] min-h-screen sm:min-w-0">
        {/* Background */}
        <div
          ref={bgRef}
          className="
            absolute inset-0 min-w-[200vw] min-h-screen
            bg-[url('/bg.png')] bg-cover bg-left will-change-transform
            sm:fixed sm:inset-0 sm:min-w-0 sm:bg-center
          "
        />

        {/* Content — sticky on mobile so it stays in view while bg scrolls */}
        <div className="sticky left-0 w-screen z-10 min-h-screen">
          <Navbar isMuted={isMuted} onToggleMute={handleToggleMute} />

          <main className="flex min-h-screen items-center justify-center px-4 pt-24 pb-8">
            {loading ? (
              <div className="rounded-3xl border border-white/15 bg-slate-950/70 px-8 py-10 text-center text-white shadow-2xl backdrop-blur-xl">
                Checking session...
              </div>
            ) : isAuthenticated ? (
              <Home />
            ) : (
              <AuthPage />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
