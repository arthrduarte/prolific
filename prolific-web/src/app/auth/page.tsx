'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Login from '@/components/auth/Login'
import Signup from '@/components/auth/SignUp'
import FacebookAuth from '@/components/auth/Facebook'

export default function Auth() {
  const [showLogin, setShowLogin] = useState(true)
  const [showEmailAuth, setShowEmailAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for an existing session
    supabase.auth.getSession().then(({ data: { session }}) => {
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return null // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-100">
      <div className="max-w-md mx-auto pt-16 px-4">
        {!showEmailAuth ? (
          <>
            <div className="bg-[#f0dc1b] rounded-t-3xl py-16 px-6 text-center">
              <h1 className="text-4xl font-extrabold text-black mb-2">
                Welcome to Prolific
              </h1>
              <p className="text-[#495057] text-lg">
                Join us to start your learning journey
              </p>
            </div>
            <div className="bg-white rounded-b-3xl shadow-lg px-6 py-8 -mt-5">
              <div className="space-y-4">
                <FacebookAuth />
                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-[#dee2e6]"></div>
                  <span className="px-4 text-sm text-[#868e96]">or</span>
                  <div className="flex-1 h-px bg-[#dee2e6]"></div>
                </div>
                <button
                  onClick={() => setShowEmailAuth(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-white border border-[#e9ecef] rounded-xl text-[#495057] font-semibold hover:bg-gray-50 transition-colors"
                >
                  <i className="fas fa-envelope text-[#495057] mr-2"></i>
                  Continue with email
                </button>
                <p className="text-xs text-[#868e96] text-center mt-4 leading-relaxed">
                  By registering, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </>
        ) : (
          showLogin ? (
            <Login onSwitchToSignup={() => setShowLogin(false)} />
          ) : (
            <Signup onSwitchToLogin={() => setShowLogin(true)} />
          )
        )}
      </div>
    </div>
  )
} 