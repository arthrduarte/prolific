'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import FacebookAuth from '../_components/Facebook'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function signInWithEmail() {
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      // Redirect to home page on successful login
      router.push('/')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#f0dc1b] rounded-t-3xl py-16 px-6 text-center">
          <h1 className="text-4xl font-extrabold text-black mb-2">
            Sign in to your account
          </h1>
          <p className="text-[#495057] text-lg">
            Welcome back! Please enter your details
          </p>
        </div>
        <div className="bg-white rounded-b-3xl shadow-lg px-6 py-8 -mt-5">
          <div className="space-y-4">
            <div className="space-y-6">
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
                    placeholder="Password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#f0dc1b] focus:ring-1 focus:ring-[#f0dc1b]"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={signInWithEmail}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Sign in'}
            </button>

            <button
              onClick={() => router.push('/auth/signup')}
              className="w-full text-center text-[#495057] text-sm hover:underline"
            >
              Don't have an account? Sign up
            </button>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-[#dee2e6]"></div>
              <span className="px-4 text-sm text-[#868e96]">or</span>
              <div className="flex-1 h-px bg-[#dee2e6]"></div>
            </div>

            <button
              onClick={() => router.push('/auth')}
              className="w-full text-center text-[#495057] text-sm hover:underline"
            >
              Back to all sign in options
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 