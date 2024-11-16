import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  email: string;
  loading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    JSON.parse(localStorage.getItem("isLoggedIn") || "false")
  );
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    if (isLoggedIn) {
      localStorage.setItem("email", email);
    } else {
      localStorage.removeItem("email");
    }
  }, [isLoggedIn, email]);

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      setLoading(true);
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.email) {
            setEmail(result.email);
            setIsLoggedIn(true);

            if (rememberMe) {
              localStorage.setItem("rememberedEmail", result.email);
            } else {
              localStorage.removeItem("rememberedEmail");
            }
            return true;
          }
        }
      } catch (err) {
        console.error("Login failed:", err);
      } finally {
        setLoading(false);
      }

      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setEmail("");
    localStorage.removeItem("email");
    localStorage.setItem("isLoggedIn", "false");
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn, email, loading, login, logout }),
    [isLoggedIn, email, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
