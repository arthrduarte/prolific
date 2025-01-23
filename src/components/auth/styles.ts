import { StyleSheet } from 'react-native'

export const authStyles = StyleSheet.create({
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
  verticallySpaced: {
    paddingTop: 2,
    paddingBottom: 2,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 12,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#fff',
    marginVertical: -6
  },
  inputLabel: {
    color: '#495057',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#f0dc1b',
    borderRadius: 12,
    padding: 16,
  },
  secondaryButton: {
    backgroundColor: '#fff',
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
  switchText: {
    textAlign: 'center',
    color: '#495057',
    marginTop: 16,
  },
  inputError: {
    borderColor: '#dc3545',
    borderWidth: 1,
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
}) 