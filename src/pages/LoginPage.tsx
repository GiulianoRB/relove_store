import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LogIn, Globe, Facebook, Instagram } from 'lucide-react';
import { login } from '../store/authSlice';
import { loginWithEmail, loginWithGoogle, loginWithFacebook, getUserRole } from '../services/firebase';

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    setError(null);
    try {
      let userCredential;
      if (provider === 'google') {
        userCredential = await loginWithGoogle(rememberMe);
      } else if (provider === 'facebook') {
        userCredential = await loginWithFacebook(rememberMe);
      } else {
        console.log(`Logging in with ${provider}`);
        // Handle Instagram login here (e.g., redirect to Instagram auth page)
        return;
      }

      if (userCredential && userCredential.user) {
        const role = await getUserRole(userCredential.user.uid);
        dispatch(login({
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || '',
          role: role
        }));
        navigate('/');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await loginWithEmail(email, password, rememberMe);
      if (userCredential && userCredential.user) {
        const role = await getUserRole(userCredential.user.uid);
        dispatch(login({
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          name: userCredential.user.displayName || email.split('@')[0],
          role: role
        }));
        navigate('/');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            New to Relove?{' '}
            <Link to="/register" className="text-rose-600 hover:text-rose-500">
              Create an account
            </Link>
          </p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="text-rose-600 hover:text-rose-500">Forgot your password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LogIn className="h-5 w-5 text-rose-500 group-hover:text-rose-400" aria-hidden="true" />
            </span>
            Sign in
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#faf7f5] text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <Globe className="h-5 w-5" /> Google
            </button>
            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <Facebook className="h-5 w-5" /> Facebook
            </button>
             <button
              onClick={() => handleSocialLogin('instagram')}
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <Instagram className="h-5 w-5" /> Instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
