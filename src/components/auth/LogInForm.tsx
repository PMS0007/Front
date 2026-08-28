'use client';

import { Eye, EyeOff, TreePine } from 'lucide-react';
import Link from 'next/link';
import { useLoginForm } from '@/hooks/auth/useLogInForm';
import { GoogleIcon } from '@/data/google';

export default function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    error,
    loading,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-2 text-[#2f3f32]">
        <TreePine size={20} strokeWidth={1.75} />
        <span className="font-serif text-lg tracking-wide">Havenwood</span>
      </div>

      <h1 className="mt-6 font-serif text-4xl text-[#1c1c1a]">
        Welcome back
      </h1>
      <p className="mt-2 text-sm text-[#8a8880]">
        Enter your details below to step back into your cozy space.
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold tracking-wider text-[#3c3b36]"
          >
            EMAIL
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-[#e4e1d8] bg-white px-4 py-3 text-sm text-[#1c1c1a] placeholder-[#a9a79d] outline-none transition focus:border-[#8fae8f] focus:ring-1 focus:ring-[#8fae8f]/40"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold tracking-wider text-[#3c3b36]"
            >
              PASSWORD
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-[#b9863f] transition hover:text-[#9c6f30]"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-[#e4e1d8] bg-white px-4 py-3 pr-11 text-sm text-[#1c1c1a] placeholder-[#a9a79d] outline-none transition focus:border-[#8fae8f] focus:ring-1 focus:ring-[#8fae8f]/40"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a9a79d] transition hover:text-[#6b6a63]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-lg bg-[#2f3f32] py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-[#26331f] disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-[#e4e1d8]" />
        <span className="text-xs tracking-widest text-[#a9a79d]">OR</span>
        <span className="h-px flex-1 bg-[#e4e1d8]" />
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e4e1d8] bg-white py-3 text-sm text-[#3c3b36] transition hover:bg-[#f4f2ec]"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <p className="mt-6 text-center text-xs text-[#8a8880]">
        Don&apos;t have an account?{' '}
        <Link
          href="/auth/sign-in"
          className="font-semibold text-[#1c1c1a] underline underline-offset-2"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}