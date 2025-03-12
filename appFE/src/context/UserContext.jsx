import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userCx, setUserCx] = useState(null);

  return (
    <UserContext.Provider value={{ userCx, setUserCx }}>
      {children}
    </UserContext.Provider>
  );
};
