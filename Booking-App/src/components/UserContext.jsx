import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // ✅ Initialize from localStorage (SAFE)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        return {
          user: JSON.parse(storedUser),
          token: token,
        };
      }
      return null;
    } catch (err) {
      console.error("Error parsing user:", err);
      return null;
    }
  });

  // ✅ Sync with localStorage
  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem("user", JSON.stringify(user.user));
      localStorage.setItem("token", user.token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};