"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchApi, getToken, removeToken, setToken } from './api';
import { useRouter, usePathname } from 'next/navigation';

export interface User {
  id: number;
  email: string;
  role: 'employee' | 'hr' | string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      if (pathname !== '/login') {
        router.push('/login');
      }
      return;
    }

    // verify token
    fetchApi('/auth/me')
      .then(data => {
        setUser(data.user);
      })
      .catch(() => {
        removeToken();
        setUser(null);
        if (pathname !== '/login') {
          router.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, router]);

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    if (user.role === 'hr') {
      router.push('/hr');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    try {
      await fetchApi('/auth/signout', { method: 'POST' });
    } catch {
      // ignore
    }
    removeToken();
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      removeToken();
      setUser(null);
      if (pathname !== '/login') {
        router.push('/login');
      }
    };

    window.addEventListener('dayflow:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('dayflow:unauthorized', handleUnauthorized);
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
