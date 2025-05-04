import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState(generateRandomUsername());

  function generateRandomUsername() {
    return "User_" + Math.floor(Math.random() * 10000);
  }

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
