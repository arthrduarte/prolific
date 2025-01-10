import React, { useState } from 'react'
import { Alert, View, Text, TouchableOpacity } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { authStyles as styles } from './styles'

interface LoginProps {
  onSwitchToSignup: () => void
}

export default function Login({ onSwitchToSignup }: LoginProps) {
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

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Sign in to your account</Text>
        <Text style={styles.subtitle}>
          Welcome back! Please enter your details
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
            title={loading ? "Loading..." : "Sign in"} 
            disabled={loading} 
            onPress={signInWithEmail}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
            disabledStyle={styles.buttonDisabled}
          />
        </View>
        <TouchableOpacity onPress={onSwitchToSignup}>
          <Text style={styles.switchText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}
