import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => navigation.goBack()}
    >
      <FontAwesome name="chevron-left" size={18} color="#000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
}); 