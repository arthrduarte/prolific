'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'
import { usePreferences } from '@/contexts/PreferencesContext'
import BackButton from '@/components/BackButton'

export default function Settings() {
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [session, setSession] = useState<any>(null)
  const { voiceMode, setVoiceMode } = usePreferences()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.replace('/')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const SettingItem = ({ 
    title, 
    description, 
    value, 
    onValueChange 
  }: { 
    title: string
    description: string
    value: boolean
    onValueChange: (value: boolean) => void 
  }) => (
    <div 
      className="flex items-center justify-between p-6 bg-primary rounded-2xl cursor-pointer hover:bg-primary-500 transition-colors"
      onClick={() => onValueChange(!value)}
    >
      <div className="flex-1 mr-4">
        <h3 className="text-lg font-semibold mb-1 text-black">{title}</h3>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
      <div className={`w-12 h-7 rounded-full p-0.5 transition-colors ${value ? 'bg-gray-900' : 'bg-gray-400'}`}>
        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </div>
  )

  const settings = [
    {
      title: "Voice Mode",
      description: "Enable audio for questions and explanations",
      value: voiceMode,
      onValueChange: setVoiceMode,
    },
    {
      title: "Push Notifications",
      description: "Get reminders for daily practice",
      value: notifications,
      onValueChange: setNotifications,
    },
  ]

  if (!session) return null

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 lg:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <BackButton />
          <h1 className="text-4xl text-black font-bold tracking-tight">Settings</h1>
        </div>
        
        <div className="space-y-3">
          {settings.map((setting) => (
            <SettingItem
              key={setting.title}
              {...setting}
            />
          ))}

          <div className="p-6 bg-yellow-300 rounded-2xl">
            <h3 className="text-lg font-semibold mb-1 text-black">Account</h3>
            <p className="text-sm text-gray-700">{session.user.email}</p>
          </div>

          <button
            className="w-full p-6 bg-gray-900 rounded-2xl text-white font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            onClick={signOut}
            disabled={loading}
          >
            {loading ? "Signing out..." : "Sign Out"}
          </button>
        </div>

        <p className="text-center text-gray-400 mt-12">Version 1.0.0</p>
      </div>
    </div>
  )
} 