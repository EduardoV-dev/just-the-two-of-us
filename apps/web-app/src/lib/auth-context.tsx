import { createContext, useCallback, useContext, useState } from "react";

import { isAuthenticated as checkAuth, login as authLogin, logout as authLogout } from "./auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(checkAuth);

  const login = useCallback((password: string) => {
    const ok = authLogin(password);
    if (ok) {
      setAuthed(true);
    }
    return ok;
  }, []);

  const doLogout = useCallback(() => {
    authLogout();
    setAuthed(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: authed, login, logout: doLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  return useContext(AuthContext);
}
