import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, LogIn, LogOut, User } from 'lucide-react';
import { RootState, AppDispatch } from '../store/store';
import { logout, setUserRole, login } from '../store/authSlice';
import { logoutUser, onAuthChange } from '../services/firebase';
import { AnyAction } from '@reduxjs/toolkit';
import { ThunkDispatch } from 'redux-thunk';

export function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const auth = useSelector((state: RootState) => state.auth);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setUserRole(user.role);
        (dispatch as ThunkDispatch<any, any, AnyAction>)(async (dispatch) => {
          dispatch(setUserRole(user.role));
        });
      } else {
        setUserRole(null);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl text-rose-600">
          Relove
        </Link>

        <nav className="flex items-center gap-6">
          {auth.isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Hi, {auth.user?.name}
              </span>
              {userRole === 'admin' && (
                <Link
                  to="/admin/products"
                  className="text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
                >
                  <User size={20} />
                  <span className="text-sm">Admin</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
              >
                <LogOut size={20} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
            >
              <LogIn size={20} />
              <span className="text-sm">Sign In</span>
            </Link>
          )}
          <Link
            to="/cart"
            className="text-gray-600 hover:text-gray-900 transition relative"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
