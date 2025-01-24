import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@rneui/themed'
import { usePreferences } from '../contexts/PreferencesContext'
import React from 'react'
import { BackButton } from './BackButton'

export default function Settings() {
  const [loading, setLoading] = useState(false)
  const { voiceMode, setVoiceMode } = usePreferences()
  const [notifications, setNotifications] = useState(true)
  const [session, setSession] = useState<any>(null)

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const SettingItem = ({ title, description, value, onValueChange }) => (
    <TouchableOpacity 
      style={[
        styles.settingCard,
        styles.cardYellow
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.9}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>
          {title}
        </Text>
        <Text style={styles.settingDescription}>
          {description}
        </Text>
      </View>
      <View style={[
        styles.toggle,
        value ? styles.toggleActive : styles.toggleInactive
      ]}>
        <View style={[
          styles.toggleCircle,
          value && styles.toggleCircleActive
        ]} />
      </View>
    </TouchableOpacity>
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

  if (!session) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>Settings</Text>
        </View>
        
        <View style={styles.cardsContainer}>
          {settings.map((setting) => (
            <SettingItem
              key={setting.title}
              {...setting}
            />
          ))}

          <View style={[styles.settingCard, styles.cardYellow]}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                Account
              </Text>
              <Text style={styles.settingDescription}>
                {session.user.email}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.settingCard, styles.cardDark]}
            onPress={signOut}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Text style={styles.signOutText}>
              {loading ? "Signing out..." : "Sign Out"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -1,
    marginTop: 16,
  },
  cardsContainer: {
    padding: 24,
    gap: 12,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 72,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  cardYellow: {
    backgroundColor: '#ffd43b',
  },
  cardDark: {
    backgroundColor: '#212529',
  },
  settingContent: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  settingDescription: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  signOutText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#212529',
  },
  toggleInactive: {
    backgroundColor: '#868e96',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleCircleActive: {
    transform: [{ translateX: 20 }],
  },
  version: {
    textAlign: 'center',
    color: '#adb5bd',
    paddingVertical: 24,
  },
});