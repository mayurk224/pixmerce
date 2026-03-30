import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import ParentModal from "./components/ParentModal.jsx";
import { useAuth } from "./hooks/useAuth.js";
import { shopService } from "./service/shopService.js";
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { Routes, Route, useNavigate, useLocation } from "react-router";

const parallaxTransform = {
  transform: "translate(var(--parallax-x), var(--parallax-y)) scale(1.05)",
};

function App() {
  const { token, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const audioRef = useRef(null);
  const sceneRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [currentShopItems, setCurrentShopItems] = useState([]);

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
    const setParallax = (x, y) => {
      if (!sceneRef.current) {
        return;
      }

      sceneRef.current.style.setProperty("--parallax-x", `${x}px`);
      sceneRef.current.style.setProperty("--parallax-y", `${y}px`);
    };

    const handleMouseMove = (event) => {
      if (window.innerWidth < 640) {
        setParallax(0, 0);
        return;
      }

      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 20;
      const y = (event.clientY / innerHeight - 0.5) * 20;

      setParallax(x, y);
    };

    const handleMouseLeave = () => setParallax(0, 0);

    setParallax(0, 0);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const fetchShops = async () => {
      if (!isAuthenticated || !token) {
        return;
      }
      setLoadingShops(true);
      try {
        const response = await shopService.getAllShops(token);
        if (response.success) {
          setShops(response.shops);
        }
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      } finally {
        setLoadingShops(false);
      }
    };

    fetchShops();
  }, [isAuthenticated, token]);

  const handleToggleMute = () => {
    if (!audioRef.current) {
      return;
    }

    const nextMutedState = !isMuted;
    audioRef.current.muted = nextMutedState;
    setIsMuted(nextMutedState);
  };

  const handleExploreItems = async (shop) => {
    if (!shop || !token) {
      return;
    }
    try {
      setSelectedShop(shop);
      const response = await shopService.getShopItems(shop.categorySlug, token);
      if (response.success) {
        setCurrentShopItems(response.items);
        setSelectedShop(response.shop ?? shop);
        setIsShopModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch shop items:", error);
      alert("Failed to load shop items. Please try again.");
    }
  };

  const handleCloseShopModal = () => {
    setIsShopModalOpen(false);
    setCurrentShopItems([]);
    setSelectedShop(null);
  };

  return (
    <div className="overflow-x-auto sm:overflow-hidden">
      <div
        ref={sceneRef}
        className="relative min-w-[400vw] min-h-screen sm:min-w-0"
        style={{ "--parallax-x": "0px", "--parallax-y": "0px" }}
      >
        <div
          className="absolute inset-0 min-w-[200vw] min-h-screen bg-[url('/bg.png')] bg-cover bg-left transition-transform duration-200 ease-out will-change-transform sm:fixed sm:inset-0 sm:min-w-0 sm:bg-center"
          style={parallaxTransform}
        />

        {loading ? (
          <div className="rounded-3xl border border-white/15 bg-slate-950/70 px-8 py-10 text-center text-white shadow-2xl backdrop-blur-xl">
            Checking session...
          </div>
        ) : (isAuthenticated && location.pathname !== "/about") ? (
          <div
            className="pointer-events-none absolute inset-0 z-20 min-w-[200vw] min-h-screen transition-transform duration-200 ease-out sm:min-w-0"
            style={parallaxTransform}
          >
            <div className="pointer-events-auto absolute top-[75%] lg:left-[53%] left-[80%] w-fit min-w-[180px] -translate-x-1/2 -translate-y-full rounded-2xl border border-yellow-300/75 bg-slate-950 text-center text-white shadow-[0_12px_32px_rgba(15,23,42,0.45)]">
              <div className="max-h-60 overflow-y-auto space-y-3">
                {loadingShops ? (
                  <p className="py-2 text-[10px] uppercase tracking-widest text-slate-400">
                    Scanning for shops...
                  </p>
                ) : shops.length > 0 ? (
                  shops.map((shop) => (
                    <div
                      key={shop._id}
                      className="group relative rounded-xl border border-white/5 bg-white/5 p-2 z-30"
                    >
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-100/90">
                        {shop.name}
                      </p>
                      <div className="flex items-center justify-center gap-2 z-30">
                        <button
                          type="button"
                          onClick={() => handleExploreItems(shop)}
                          className="rounded-full border border-yellow-300/80 bg-yellow-300/10 px-4 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-yellow-100 transition hover:-translate-y-0.5 hover:bg-yellow-300/20"
                        >
                          Enter
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/about')}
                          className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/85 transition hover:-translate-y-0.5 hover:bg-white/10"
                        >
                          About
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-2 text-[10px] uppercase tracking-widest text-slate-400">
                    No active signals found.
                  </p>
                )}
              </div>

              {/* ARROW */}
              <div className="absolute left-1/2 -bottom-2 h-10 w-10 -translate-x-1/2 rotate-45 border border-yellow-300/75 bg-slate-950 z-0" />

              {/* COVER */}
              <div className="absolute left-1/2 bottom-0 h-10 w-20 -translate-x-1/2 bg-slate-950 z-20" />
            </div>
          </div>
        ) : null}

        <div className="sticky left-0 z-10 min-h-screen w-screen">
          <Navbar isMuted={isMuted} onToggleMute={handleToggleMute} />

          <main
            id="market-panel"
            className="flex min-h-screen items-center justify-center px-4 pt-24 pb-8"
          >
            {loading ? (
              <div className="rounded-3xl border border-white/15 bg-slate-950/70 px-8 py-10 text-center text-white shadow-2xl backdrop-blur-xl">
                Checking session...
              </div>
            ) : (
              <Routes>
                <Route
                  path="/"
                  element={isAuthenticated ? <Home /> : <AuthPage />}
                />
                <Route
                  path="/about"
                  element={
                    <>
                      {isAuthenticated ? <Home /> : <AuthPage />}
                      <About onBack={() => navigate("/")} />
                    </>
                  }
                />
              </Routes>
            )}
          </main>
        </div>

        <ParentModal
          isOpen={isShopModalOpen}
          onClose={handleCloseShopModal}
          items={currentShopItems}
          shop={selectedShop}
        />
      </div>
    </div>
  );
}

export default App;
