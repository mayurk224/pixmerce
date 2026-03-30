import { useEffect, useState } from "react";
import { AuthContext } from "./authContext.js";
import { authService } from "../service/authService.js";

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

const createAvatarDataUrl = (label = "PM") => {
  const initials =
    label
      .trim()
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase())
      .filter(Boolean)
      .slice(0, 2)
      .join("") || "PM";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#facc15" />
          <stop offset="100%" stop-color="#fb7185" />
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="24" fill="url(#avatarGradient)" />
      <text x="48" y="58" text-anchor="middle" font-size="34" font-family="Arial, sans-serif" fill="#111827" font-weight="700">
        ${initials}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const normalizeUser = (userData) => {
  if (!userData) {
    return null;
  }

  const name =
    userData.name ??
    userData.username ??
    userData.given_name ??
    userData.email?.split("@")[0] ??
    "Pixel Player";

  const avatar =
    userData.avatarUrl ??
    userData.avatar ??
    userData.picture ??
    userData.imageUrl ??
    createAvatarDataUrl(name);

  return {
    id: userData.id ?? userData._id ?? crypto.randomUUID(),
    email: userData.email ?? "player@pixelmarket.dev",
    name,
    avatar,
  };
};

const readStoredUser = () => {
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
    return rawUser ? normalizeUser(JSON.parse(rawUser)) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = readStoredUser();

      if (!storedToken) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      if (storedUser && isMounted) {
        setUser(storedUser);
        setToken(storedToken);
      }

      try {
        const response = await authService.getCurrentUser(storedToken);

        if (!isMounted) {
          return;
        }

        setUser(normalizeUser(response.user));
        setToken(storedToken);
      } catch {
        if (!isMounted) {
          return;
        }

        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = async (userData, userToken) => {
    const normalizedUser = normalizeUser(userData);
    setUser(normalizedUser);
    setToken(userToken ?? null);
    return normalizedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    loginContext: login,
    logoutContext: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
