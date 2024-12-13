import React, { useState } from 'react'
import { Alert, View, Text, TouchableOpacity } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { authStyles as styles } from './styles'

interface SignupProps {
  onSwitchToLogin: () => void
}

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
          />
        </View>
        <View style={styles.verticallySpaced}>
          <Input
            label="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock', color: '#495057' }}
            onChangeText={setPassword}
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
      </View>
    </>
  )
}
