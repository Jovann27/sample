import { createContext, useContext, useState } from "react";

const Context = createContext();

export const MainProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [tokenType, setTokenType] = useState(null);

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
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useMainContext = () => useContext(Context);
