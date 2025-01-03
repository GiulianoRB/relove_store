import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './store';

interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; email: string; name: string; role: 'user' | 'admin' }>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    setUserRole: (state, action: PayloadAction<'user' | 'admin'>) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    }
  },
});

export const { login, logout, setUserRole } = authSlice.actions;
export default authSlice.reducer;
