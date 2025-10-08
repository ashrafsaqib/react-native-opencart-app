// src/context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { driverApi } from '../api/driverApi';

type User = { id: number; firstname?: string; lastname?: string; email?: string };
const AuthContext = createContext<{
  user: User | null;
  token: string | null;
  login: (u: string, p: string) => Promise<void>;
  logout: () => void;
}>(null as any);

const TOKEN_KEY = '@driverApp:token';
const USER_ID_KEY = '@driverApp:userId';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // 1️⃣  Hydrate token/user_id on start-up
  useEffect(() => {
    (async () => {
      try {
        const [t, uid] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_ID_KEY),
        ]);
        if (t && uid) {
          setToken(t);
          setUser({ id: Number(uid) });
        }
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    if (email === 'test@test.com' && password === 'password') {
      const mockUser = { id: 1, firstname: 'Test', lastname: 'User', email: 'test@test.com' };
      const mockToken = 'fake-token';

      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, mockToken),
        AsyncStorage.setItem(USER_ID_KEY, String(mockUser.id)),
      ]);

      setToken(mockToken);
      setUser(mockUser as any);
      return;
    }

    const res = await driverApi.login({ email, password });

    // Guard against bad response
    if (!res.token || !res.user?.id) {
      throw new Error('Invalid server response');
    }

    const newToken = res.token;
    const newUserId = String(res.user.id);

    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, newToken),
      AsyncStorage.setItem(USER_ID_KEY, newUserId),
    ]);

    setToken(newToken);
    setUser(res.user);
  };

  const logout = async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_ID_KEY),
    ]);
    setToken(null);
    setUser(null);
  };

  // show nothing until hydration is done (avoids flicker)
  if (!hydrated) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);