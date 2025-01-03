import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { App } from './App';
import './index.css';
import { checkInitialAuth } from './services/firebase';
import { login, setUserRole } from './store/authSlice';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';

const root = createRoot(document.getElementById('root')!);

const checkAuth = async () => {
  checkInitialAuth(async (user) => {
    if (user) {
      (store.dispatch as ThunkDispatch<any, any, AnyAction>)(async (dispatch) => {
        dispatch(login({
          id: user.uid,
          email: user.email || '',
          name: user.displayName || user.email?.split('@')[0] || '',
          role: user.role
        }));
      });
    }
  });
};

checkAuth();

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
