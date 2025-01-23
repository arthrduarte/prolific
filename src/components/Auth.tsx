import React, { useState, useEffect } from 'react'
import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Button } from '@rneui/themed'
import Login from './auth/Login'
import Signup from './auth/SignUp'
import FacebookAuth from './auth/Facebook'
import { supabase } from '../lib/supabase'

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
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#ffffff', '#fff', '#f1f3f5']}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          {!showEmailAuth ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Welcome to Prolific</Text>
                <Text style={styles.subtitle}>
                  Join us to start your learning journey
                </Text>
              </View>
              <View style={styles.formContainer}>
                <FacebookAuth />
                <View style={styles.orContainer}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>or</Text>
                  <View style={styles.orLine} />
                </View>
                <Button
                  title="Continue with email"
                  onPress={() => setShowEmailAuth(true)}
                  buttonStyle={[styles.button, styles.emailButton]}
                  titleStyle={styles.emailButtonText}
                />
              </View>
            </>
          ) : (
            showLogin ? (
              <Login onSwitchToSignup={() => setShowLogin(false)} />
            ) : (
              <Signup onSwitchToLogin={() => setShowLogin(true)} />
            )
          )}
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
    justifyContent: 'center'
  },
  header: {
    paddingHorizontal: 24,
    height: 240,
    backgroundColor: '#f0dc1b',
    justifyContent: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#dee2e6',
  },
  orText: {
    marginHorizontal: 10,
    color: '#868e96',
    fontSize: 14,
  },
  button: {
    borderRadius: 12,
    padding: 16,
  },
  emailButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  emailButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },
})