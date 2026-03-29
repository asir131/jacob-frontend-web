'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'client' | 'provider';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  login: (role?: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('client');
  const [user, setUser] = useState<User | null>(null);

  // Simulation of auth state synchronization
  useEffect(() => {
    // In a real app, this would check localStorage/session for an existing session
    const mockUser: User = {
      id: 'USR-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      role: role,
    };
    setUser(mockUser);
  }, [role]);

  const login = (newRole: Role = 'client') => {
    setRole(newRole);
  };

  const logout = () => {
    setUser(null);
    setRole('client');
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
