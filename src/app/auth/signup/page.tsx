'use client'

import React, { useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa'
import FacebookAuth from '../_components/Facebook'

interface SignupProps {
  onSwitchToLogin: () => void
}

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    setError(null)

    const {
      data: { session },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          full_name: name,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
    } else if (!session) {
      setError('Please check your inbox for email verification!')
    }
    
    setLoading(false)
  }

  return (
    <>
      <div className="bg-[#f0dc1b] rounded-t-3xl py-16 px-6 text-center">
        <h1 className="text-4xl font-extrabold text-black mb-2">
          Create your account
        </h1>
        <p className="text-[#495057] text-lg">
          Join Prolific to start your learning journey
        </p>
      </div>
      <div className="bg-white rounded-b-3xl shadow-lg px-6 py-8 -mt-5">
        <div className="space-y-4">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f0dc1b] focus:ring-1 focus:ring-[#f0dc1b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@address.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f0dc1b] focus:ring-1 focus:ring-[#f0dc1b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 6 characters)"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f0dc1b] focus:ring-1 focus:ring-[#f0dc1b]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-1 ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-200 focus:border-[#f0dc1b] focus:ring-[#f0dc1b]'
                  }`}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  Passwords don't match
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={signUpWithEmail}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Sign up'}
          </button>

          <button
            onClick={onSwitchToLogin}
            className="w-full text-center text-[#495057] text-sm hover:underline"
          >
            Already have an account? Sign in
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-[#dee2e6]"></div>
            <span className="px-4 text-sm text-[#868e96]">or</span>
            <div className="flex-1 h-px bg-[#dee2e6]"></div>
          </div>

          <FacebookAuth />
        </div>
      </div>
    </>
  )
} 