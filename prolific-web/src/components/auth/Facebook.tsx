'use client'

import { supabase } from '@/lib/supabase'
import { FaFacebook } from 'react-icons/fa'

export default function FacebookAuth() {
  const performOAuth = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        scopes: 'email,public_profile',
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('OAuth error:', error)
    }
  }

  return (
    <button
      onClick={performOAuth}
      className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-[#1877F2] rounded-xl text-white font-semibold hover:bg-[#1874EA] transition-colors"
    >
      <FaFacebook className="text-xl" />
      Continue with Facebook
    </button>
  )
} 