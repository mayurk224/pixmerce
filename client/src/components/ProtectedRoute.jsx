import { useAuth } from "../hooks/useAuth.js";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/15 bg-slate-950/70 px-8 py-10 text-white shadow-2xl backdrop-blur-xl">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children ?? null;
};

export default ProtectedRoute;
