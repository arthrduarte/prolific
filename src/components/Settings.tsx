import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView } from 'react-native'
import { Button } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import { Text, Switch, View as UIView } from 'react-native-ui-lib'
import { usePreferences } from '../contexts/PreferencesContext'

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

  return (
    <ScrollView style={styles.container}>
      <Text text40 style={styles.title}>Settings</Text>
      
      {/* Learning Section */}
      <View style={styles.section}>
        <Text text65 style={styles.sectionTitle}>Learning</Text>
        <View style={styles.settingItem}>
          <UIView spread row centerV>
            <View>
              <Text text65>Voice Mode</Text>
              <Text text90 style={styles.settingDescription}>
                Enable audio for questions and explanations
              </Text>
            </View>
            <Switch
              value={voiceMode}
              onValueChange={setVoiceMode}
            />
          </UIView>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text text65 style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingItem}>
          <UIView spread row centerV>
            <View>
              <Text text65>Push Notifications</Text>
              <Text text90 style={styles.settingDescription}>
                Get reminders for daily practice
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
            />
          </UIView>
        </View>
        <View style={styles.settingItem}>
          <UIView spread row centerV>
            <View>
              <Text text65>Dark Mode</Text>
              <Text text90 style={styles.settingDescription}>
                Switch to dark theme
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </UIView>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text text65 style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingItem}>
          <Text text65 style={styles.email}>{session.user.email}</Text>
        </View>
        <Button
          title={loading ? "Signing out..." : "Sign Out"}
          onPress={signOut}
          disabled={loading}
          buttonStyle={styles.signOutButton}
          titleStyle={styles.signOutButtonText}
        />
      </View>

      <Text text90 style={styles.version}>Version 1.0.0</Text>
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
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  sectionTitle: {
    color: '#868e96',
    marginBottom: 16,
    fontWeight: '600',
  },
  settingItem: {
    marginBottom: 16,
  },
  settingDescription: {
    color: '#adb5bd',
    marginTop: 4,
  },
  email: {
    color: '#495057',
  },
  signOutButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fa5252',
    borderRadius: 12,
    marginTop: 16,
    height: 48,
  },
  signOutButtonText: {
    color: '#fa5252',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#adb5bd',
    paddingVertical: 24,
  },
})