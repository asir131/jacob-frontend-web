import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Role = 'client' | 'provider';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  phone?: string;
  address?: string;
  preferredLanguage?: string;
  locationLat?: number;
  locationLng?: number;
}

interface AuthState {
  user: AuthUser | null;
  role: Role;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  role: 'client',
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuthState: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.role = action.payload?.role || 'client';
      state.isAuthenticated = !!action.payload;
    },
    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    setAuthRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
      if (state.user) {
        state.user.role = action.payload;
      }
    },
    updateAuthProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      state.role = state.user.role;
      state.isAuthenticated = true;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.role = 'client';
      state.isAuthenticated = false;
    },
  },
});

export const { hydrateAuthState, loginSuccess, setAuthRole, updateAuthProfile, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
