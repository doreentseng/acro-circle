'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { UserViewModel } from '@/lib/types/user';
import { guestUser } from '@/lib/data/mockData';

type AuthContextType = {
  currentUser: UserViewModel | null;
  isGuest: boolean;
  isLoading: boolean;
  loginAsGuest: () => void;
  logout: () => void;
  setCurrentUser: (user: UserViewModel) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserViewModel | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // check if it's guest mode (from localStorage)
  useEffect(() => {
    const checkGuestMode = () => {
      const guestMode = localStorage.getItem('guestMode');
      if (guestMode === 'true') {
        setCurrentUser(guestUser);
        setIsGuest(true);
        setIsLoading(false);
        return true;
      }
      return false;
    };

    if (checkGuestMode()) {
      return;
    }

    const loadCurrentUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setIsLoading(false);
          return;
        }

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setIsLoading(false);
          return;
        }

        if (user.user_metadata.userId) {
          const { data, error } = await supabase
            .from('users')
            .select('id, name, username')
            .eq('id', user.user_metadata.userId)
            .single();

          if (!error && data) {
            setCurrentUser({
              id: String(data.id),
              name: data.name,
              username: data.username,
            });
            setIsGuest(false);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const loginAsGuest = useCallback(() => {
    localStorage.setItem('guestMode', 'true');
    setCurrentUser(guestUser);
    setIsGuest(true);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('guestMode');
    setIsGuest(false);
    setCurrentUser(null);

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const value: AuthContextType = {
    currentUser,
    isGuest,
    isLoading,
    loginAsGuest,
    logout,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return ctx;
}
