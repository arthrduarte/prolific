import React, { useState, useEffect } from 'react'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Login from './auth/Login'
import Signup from './auth/SignUp'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [showLogin, setShowLogin] = useState(true)
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
          {showLogin ? (
            <Login onSwitchToSignup={() => setShowLogin(false)} />
          ) : (
            <Signup onSwitchToLogin={() => setShowLogin(true)} />
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
    justifyContent: 'center',
    paddingBottom: '20%',
  },
})