import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@rneui/themed'
import { usePreferences } from '../contexts/PreferencesContext'
import React from 'react'

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

  const SettingItem = ({ title, description, value, onValueChange, isLast = false }) => (
    <TouchableOpacity 
      style={[
        styles.settingCard,
        value ? styles.cardYellow : styles.cardDark
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.9}
    >
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle,
          value ? styles.textDark : styles.textLight
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.settingDescription,
          value ? styles.descriptionDark : styles.descriptionLight
        ]}>
          {description}
        </Text>
      </View>
      <View style={[
        styles.toggle,
        value ? styles.toggleDark : styles.toggleYellow,
        value && styles.toggleActive
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
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.cardsContainer}>
          {settings.map((setting, index) => (
            <SettingItem
              key={setting.title}
              {...setting}
            />
          ))}

          <View style={[
            styles.settingCard,
            settings.length % 2 === 0 ? styles.cardYellow : styles.cardDark,
          ]}>
            <View style={styles.settingContent}>
              <Text style={[
                styles.settingTitle,
                settings.length % 2 === 0 ? styles.textDark : styles.textLight,
              ]}>
                Account
              </Text>
              <Text style={[
                styles.settingDescription,
                settings.length % 2 === 0 ? styles.descriptionDark : styles.descriptionLight,
              ]}>
                {session.user.email}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.settingCard,
              (settings.length + 1) % 2 === 0 ? styles.cardYellow : styles.cardDark,
            ]}
            onPress={signOut}
            disabled={loading}
            activeOpacity={0.9}
          >
            <Text style={[
              styles.settingTitle,
              (settings.length + 1) % 2 === 0 ? styles.textDark : styles.textLight,
            ]}>
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
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -1,
    padding: 24,
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
  },
  textDark: {
    color: '#000',
  },
  textLight: {
    color: '#fff',
  },
  settingDescription: {
    fontSize: 14,
  },
  descriptionDark: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  descriptionLight: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleYellow: {
    backgroundColor: '#ffd43b',
  },
  toggleDark: {
    backgroundColor: '#212529',
  },
  toggleActive: {
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