import { useAuth } from "../hooks/useAuth.js";

const UserProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <section className="w-full max-w-2xl rounded-[2rem] border border-white/15 bg-slate-950/70 p-6 text-white shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-yellow-300/90">
            Current User
          </p>
          <h1 className="mt-2 text-3xl font-bold">{user?.name}</h1>
        </div>
        <button
          type="button"
          className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.15em] transition hover:bg-white/8"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/55">Email</p>
          <p className="mt-2 text-base">{user?.email ?? "Unavailable"}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/55">User ID</p>
          <p className="mt-2 text-base">{user?.id ?? "Unavailable"}</p>
        </article>
      </div>
    </section>
  );
};

export default UserProfilePage;
