// UserContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(/* Initial state */ null);

  const value = {
    userInfo,
    setUserInfo,
  };

  console.log('UserContextProvider value:', value);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
