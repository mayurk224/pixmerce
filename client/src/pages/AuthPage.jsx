import GoogleAuthButton from "../components/GoogleAuthButton";

const AuthPage = () => {
  return (
    <section className="w-full max-w-2xl rounded-4xl px-8 py-12 text-center text-white shadow-2xl backdrop-blur-xl sm:px-12">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-yellow-300/90">
        Arcade Access
      </p>
      <h1
        className="mb-5 text-5xl font-bold tracking-[0.22em] sm:text-7xl"
        style={{ fontFamily: "'Pixelify Sans', sans-serif" }}
      >
        Pixel Market
      </h1>
      <p className="mx-auto mb-8 max-w-lg text-sm leading-7 text-slate-200 sm:text-base">
        Sign in to enter the market, track your progress, and climb the
        leaderboard.
      </p>
      <GoogleAuthButton />
    </section>
  );
};

export default AuthPage;
