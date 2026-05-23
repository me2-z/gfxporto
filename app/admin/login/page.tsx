"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans selection:bg-white/30 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="glass-card p-8 md:p-10 rounded-[2rem] border border-white/8">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white mb-4"
            >
              <span className="text-2xl font-black text-black">M</span>
            </motion.div>
            <h1 className="text-3xl font-black mb-1">
              MEET<span className="text-gray-500">.</span>
            </h1>
            <p className="text-gray-500 text-sm uppercase tracking-[0.2em] font-mono">
              Admin Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error */}
            <AnimateError error={error} />

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <i className="ri-user-line text-white/30" />
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/40 focus:bg-white/8 transition-all placeholder:text-white/20 text-sm"
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <i className="ri-lock-line text-white/30" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white focus:outline-none focus:border-white/40 focus:bg-white/8 transition-all placeholder:text-white/20 text-sm"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-60 mt-2 flex items-center justify-center gap-2 text-sm shadow-xl shadow-white/10"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <i className="ri-login-box-line" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs text-white/25 hover:text-white/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <i className="ri-arrow-left-line" />
              Back to portfolio
            </Link>
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-[11px] text-white/15 mt-6 font-mono">
          MEET. Admin · Secured with JWT
        </p>
      </motion.div>
    </div>
  );
}

function AnimateError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
      animate={{ opacity: 1, height: 'auto', marginBottom: 4 }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm overflow-hidden"
    >
      <i className="ri-error-warning-fill mt-0.5 flex-shrink-0" />
      <span>{error}</span>
    </motion.div>
  );
}
