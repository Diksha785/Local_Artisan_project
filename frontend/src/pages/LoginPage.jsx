import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      if (user.role === 'artisan') {
        navigate('/artisan/dashboard');
      } else {
        navigate('/products');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fillQuickDemo = (role) => {
    if (role === 'artisan') {
      setEmail('sunita.artisan@example.com');
      setPassword('password123');
    } else {
      setEmail('buyer@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-amber-200 p-8 rounded-3xl space-y-6 shadow-md">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-terracotta-600 text-2xl">
            🪔
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 font-serif">Welcome Back</h1>
          <p className="text-xs text-stone-500 font-medium">
            Sign in to access your GraminCraft account
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
          <span className="text-[11px] font-bold text-stone-700 block text-center">Quick Demo One-Click Login:</span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => fillQuickDemo('artisan')}
              className="bg-amber-200/80 hover:bg-amber-300 text-stone-900 py-1.5 px-2 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <Store className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Demo Artisan</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('buyer')}
              className="bg-stone-900 hover:bg-stone-800 text-white py-1.5 px-2 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Buyer</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-amber-50/40 border border-amber-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                required
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-amber-50/40 border border-amber-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                required
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-terracotta-600 hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
