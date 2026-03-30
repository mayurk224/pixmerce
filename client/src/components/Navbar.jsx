import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import { Link } from "react-router";

const navLinkClassName =
  "text-sm font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:text-yellow-300";

const Navbar = ({ isMuted, onToggleMute }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-black/10 backdrop-blur-[2px]">
      {/* ── Main bar ── */}
      <div className="flex w-full items-center justify-between px-4 py-2 text-white sm:px-6">
        {/* LOGO */}
        <Link
          to="/"
          className="text-base font-bold tracking-[0.25em] text-yellow-300"
          style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
        >
          PIXMERCE
        </Link>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop nav links – hidden on mobile */}
          {isAuthenticated && (
            <div className="hidden items-center gap-3 sm:flex">
              <Link to="/leaderboard" className={navLinkClassName}>
                Leaderboard
              </Link>
              <Link to="/about" className={navLinkClassName}>
                About
              </Link>

              <div className="h-5 w-px bg-white/10" />

              {/* User pill */}
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-1 py-0.5">
                <img
                  src={user?.avatar}
                  alt={user?.name ?? "Player avatar"}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-yellow-300/60"
                />
                <div className="">
                  <p className="pr-1 text-xs font-medium text-white">
                  {user?.name}
                </p>
                <p className="pr-1 text-xs text-gray-300">
                  Balance: {user?.walletBalance ?? 0}
                </p>
                </div>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="flex h-7 w-8 items-center justify-center overflow-hidden rounded-full border border-rose-300/50 bg-rose-500/10 transition hover:scale-105 hover:bg-rose-500/20"
              >
                <img
                  src="/exit.jpg"
                  alt="Logout"
                  className="h-full w-full object-cover"
                />
              </button>
            </div>
          )}

          {/* About link when NOT authenticated (desktop) */}
          {!isAuthenticated && (
            <Link to="/about" className={`hidden sm:inline ${navLinkClassName}`}>
              About
            </Link>
          )}

          {/* Mute button – always visible */}
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? "Unmute music" : "Mute music"}
            className="h-8 w-8 overflow-hidden rounded-full border border-yellow-300 transition hover:scale-105"
          >
            <img
              src={isMuted ? "/mute.jpg" : "/on.jpg"}
              alt={isMuted ? "Muted" : "Sound on"}
              className="h-full w-full object-cover"
            />
          </button>

          {/* Hamburger – visible only on mobile */}
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            title="Toggle menu"
            className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/5 transition hover:bg-white/10 sm:hidden"
            aria-label="Toggle navigation menu"
          >
            {/* Animated bars */}
            <span
              className={`block h-0.5 w-5 rounded bg-white transition-all duration-300 ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 rounded bg-white transition-all duration-300 ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      <div
        className={`overflow-hidden transition-all duration-300 sm:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-white/10 bg-black/40 px-5 py-4 backdrop-blur-md">
          {isAuthenticated ? (
            <>
              {/* User info row */}
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <img
                  src={user?.avatar}
                  alt={user?.name ?? "Player"}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-yellow-300/60"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">Balance: ${user?.walletBalance ?? 0}</p>
                </div>
              </div>

              
              <Link
                to="/leaderboard"
                onClick={() => setMenuOpen(false)}
                className={`py-2 ${navLinkClassName}`}
              >
                Leaderboard
              </Link>
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className={`py-2 ${navLinkClassName}`}
              >
                About
              </Link>

              <div className="my-2 h-px bg-white/10" />

              {/* Logout row */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex items-center gap-2 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-rose-300 transition hover:text-rose-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={`py-2 ${navLinkClassName}`}
            >
              About
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
