'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import type { User, ToastMessage, ToastType } from '@/types';
import { MOCK_CREDENTIALS, MOCK_USER } from '@/data/mockUser';
import { generateId } from '@/lib/utils';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  toasts: ToastMessage[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'auth-user';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored) as User);
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);

    if (
      email === MOCK_CREDENTIALS.email &&
      password === MOCK_CREDENTIALS.password
    ) {
      setUser(MOCK_USER);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
      // Set a lightweight cookie for middleware route protection
      document.cookie = 'auth-session=1; path=/; max-age=86400; SameSite=Lax';
    } else {
      throw new Error('Invalid email or password');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    document.cookie = 'auth-session=; path=/; max-age=0';
  }, []);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        toasts,
        login,
        logout,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAuth(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAuth must be used within AppProvider');
  return ctx;
}
