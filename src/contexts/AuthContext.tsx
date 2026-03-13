'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'client' | 'provider' | 'admin';

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: Role;
  } | null;
  role: Role;
  setRole: (role: Role) => void;
  isAuthenticated: boolean;
  login: (role?: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use a sensible default for the current simulation
  const [role, setRole] = useState<Role>('client');
  const [user, setUser] = useState<AuthState['user']>(null);

  // Initialize with a mock user. In a real app this would come from an API/token.
  useEffect(() => {
    setUser({
      id: 'USR-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      role: role,
    });
  }, [role]);

  const login = (newRole: Role = 'client') => {
    setRole(newRole);
    setUser({
      id: 'USR-123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      role: newRole,
    });
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
