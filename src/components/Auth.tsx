import React, { useState } from 'react'
import { Alert, StyleSheet, View, Text, SafeAreaView, AppState } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa', '#f1f3f5']}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.title}>Prolific</Text>
            <Text style={styles.subtitle}>
              Master new skills through interactive learning
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Input
                label="Email"
                leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#495057' }}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={'none'}
                inputContainerStyle={styles.inputContainer}
                labelStyle={styles.inputLabel}
                placeholderTextColor="#adb5bd"
              />
            </View>
            <View style={styles.verticallySpaced}>
              <Input
                label="Password"
                leftIcon={{ type: 'font-awesome', name: 'lock', color: '#495057' }}
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize={'none'}
                inputContainerStyle={styles.inputContainer}
                labelStyle={styles.inputLabel}
                placeholderTextColor="#adb5bd"
              />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
              <Button 
                title={loading ? "Loading..." : "Sign in"} 
                disabled={loading} 
                onPress={() => signInWithEmail()}
                buttonStyle={styles.button}
                titleStyle={styles.buttonText}
                disabledStyle={styles.buttonDisabled}
              />
            </View>
            <View style={styles.verticallySpaced}>
              <Button 
                title="Sign up" 
                disabled={loading} 
                onPress={() => signUpWithEmail()}
                buttonStyle={[styles.button, styles.secondaryButton]}
                titleStyle={styles.buttonText}
                disabledStyle={styles.buttonDisabled}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: '20%',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
  formContainer: {
    marginTop: 20,
    padding: 24,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  inputLabel: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#f0dc1b',
    borderRadius: 12,
    padding: 16,
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#e9ecef',
    opacity: 0.8,
  },
})