import React, { useState } from 'react'
import { StyleSheet, View, SafeAreaView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Login from './auth/Login'
import Signup from './auth/SignUp'

export default function Auth() {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#ffffff', '#f8f9fa', '#f1f3f5']}
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