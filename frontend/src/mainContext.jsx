import { createContext, useContext, useState, useEffect } from "react";

const Context = createContext();

export const MainProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tokenType, setTokenType] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const storedAdmin = JSON.parse(localStorage.getItem("admin") || "null");
      const storedIsAuth = localStorage.getItem("isAuthorized") === "true";
      const storedTokenType = localStorage.getItem("tokenType");

      if (storedIsAuth) {
        setIsAuthorized(true);
        setTokenType(storedTokenType || null);
        if (storedTokenType === "admin") {
          if (storedAdmin) setAdmin(storedAdmin);
          else if (storedUser) setAdmin(storedUser);
        } else {
          if (storedUser) setUser(storedUser);
        }
      }
    } catch (err) {
      console.error("Failed to restore auth from localStorage", err);
    } finally {
      setAuthLoaded(true);
    }
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");

      if (admin) localStorage.setItem("admin", JSON.stringify(admin));
      else localStorage.removeItem("admin");

      localStorage.setItem("isAuthorized", isAuthorized ? "true" : "false");

      if (tokenType) localStorage.setItem("tokenType", tokenType);
      else localStorage.removeItem("tokenType");
    } catch (err) {
      console.error("Failed to persist auth to localStorage", err);
    }
  }, [user, admin, isAuthorized, tokenType]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        admin,
        setAdmin,
        isAuthorized,
        setIsAuthorized,
        tokenType,
        setTokenType,
        authLoaded,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useMainContext = () => useContext(Context);
