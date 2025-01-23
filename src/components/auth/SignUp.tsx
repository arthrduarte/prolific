import React, { useState } from 'react'
import { Alert, View, Text, TouchableOpacity } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { authStyles as styles } from './styles'
import FacebookAuth from './Facebook'
import * as Linking from 'expo-linking'

interface SignupProps {
  onSwitchToLogin: () => void
}

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: Linking.createURL('/')
      }
    })

    if (error) Alert.alert('Error', error.message)
    if (!session) Alert.alert('Success', 'Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Join Prolific to start your learning journey
        </Text>
      </View>
      <View style={styles.formContainer}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#495057' }}
            onChangeText={setEmail}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
            inputContainerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
            placeholderTextColor="#adb5bd"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock', color: '#495057' }}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            placeholder="Password (min. 6 characters)"
            autoCapitalize={'none'}
            inputContainerStyle={styles.inputContainer}
            labelStyle={styles.inputLabel}
            placeholderTextColor="#adb5bd"
            autoComplete="new-password"
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Confirm Password"
            leftIcon={{ type: 'font-awesome', name: 'lock', color: '#495057' }}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            placeholder="Confirm your password"
            autoCapitalize={'none'}
            inputContainerStyle={[
              styles.inputContainer,
              confirmPassword && password !== confirmPassword && styles.inputError
            ]}
            labelStyle={styles.inputLabel}
            placeholderTextColor="#adb5bd"
            autoComplete="new-password"
            errorMessage={
              confirmPassword && password !== confirmPassword 
                ? "Passwords don't match" 
                : ''
            }
          />
        </View>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button 
            title={loading ? "Loading..." : "Sign up"} 
            disabled={loading} 
            onPress={signUpWithEmail}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            disabledStyle={styles.buttonDisabled}
          />
        </View>
        <TouchableOpacity onPress={onSwitchToLogin}>
          <Text style={styles.switchText}>Already have an account? Sign in</Text>
        </TouchableOpacity>
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>
        <View style={styles.verticallySpaced}>
          <FacebookAuth />
        </View>
      </View>
    </>
  )
}
