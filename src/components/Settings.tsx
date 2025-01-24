import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { Text } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { usePreferences } from '../contexts/PreferencesContext'
import { FontAwesome } from '@expo/vector-icons'

interface SettingsProps {
  session: Session
}

export default function Settings({ session }: SettingsProps) {
  const [loading, setLoading] = useState(false)
  const { voiceMode, setVoiceMode } = usePreferences()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

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
        styles.settingItem,
        !isLast && styles.settingItemBorder
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View style={styles.settingRow}>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
        <View style={[
          styles.toggle,
          value && styles.toggleActive
        ]}>
          <View style={[
            styles.toggleCircle,
            value && styles.toggleCircleActive
          ]} />
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {/* Learning Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning</Text>
        <SettingItem
          title="Voice Mode"
          description="Enable audio for questions and explanations"
          value={voiceMode}
          onValueChange={setVoiceMode}
          isLast={true}
        />
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          title="Push Notifications"
          description="Get reminders for daily practice"
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={[styles.settingItem, styles.settingItemBorder]}>
          <Text style={styles.email}>{session.user.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={signOut}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.signOutButtonText}>
            {loading ? "Signing out..." : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    fontSize: 42,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#868e96',
    marginBottom: 16,
    fontWeight: '600',
  },
  settingItem: {
    paddingVertical: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  settingDescription: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 4,
  },
  email: {
    fontSize: 16,
    color: '#495057',
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: '#212529',
    borderRadius: 16,
    marginTop: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#adb5bd',
    paddingVertical: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e9ecef',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#ffd43b',
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
});