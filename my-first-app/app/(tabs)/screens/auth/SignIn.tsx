import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  function validate() {
    if (!email.trim()) return 'Email is required';
    if (!password) return 'Password is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Enter a valid email';
    return null;
  }

  async function onSubmit() {
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      // Simulate authentication
      await new Promise((r) => setTimeout(r, 900));
      
      // Clear form
      setEmail('');
      setPassword('');
      setError(null);
      
      // Navigate to Home screen - replace removes SignIn from navigation stack
      router.replace('/(tabs)/screens/HomeScreen');
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleSignUpPress = () => {
    try {
      console.log('Navigating to SignUp...');
      router.push('/(tabs)/screens/auth/SignUp');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#1a0a2e', '#2d1b4e', '#4a1f6f', '#6b2d8f']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#ff006e', '#8338ec', '#3a86ff']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="sparkles" size={40} color="#fff" />
              </LinearGradient>
            </View>
            <ThemedText type="title" style={styles.title}>
              Welcome Back
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Sign in to continue your journey
            </ThemedText>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <View
                style={[
                  styles.inputContainer,
                  emailFocused && styles.inputFocused,
                  error && !password && styles.inputError,
                ]}
              >
                <Ionicons
                  name="mail"
                  size={20}
                  color={emailFocused ? '#ff006e' : '#9ca3af'}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="#6b7280"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <View
                style={[
                  styles.inputContainer,
                  passwordFocused && styles.inputFocused,
                  error && password.length === 0 && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={passwordFocused ? '#ff006e' : '#9ca3af'}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#6b7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#ff006e" />
                <ThemedText style={styles.error}>{error}</ThemedText>
              </View>
            )}

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>
                Forgot password?
              </ThemedText>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={onSubmit}
              activeOpacity={0.9}
              disabled={loading}
            >
              <LinearGradient
                colors={['#ff006e', '#8338ec', '#3a86ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <ThemedText style={styles.buttonText}>Sign In</ThemedText>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <ThemedText style={styles.dividerText}>or continue with</ThemedText>
              <View style={styles.divider} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#ff006e" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="#ff006e" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#ff006e" />
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <ThemedText style={styles.signUpText}>
                Don't have an account?{' '}
              </ThemedText>
              <TouchableOpacity
                onPress={handleSignUpPress}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ThemedText style={styles.signUpLink}>Sign Up</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 0, 110, 0.1)',
    top: -100,
    right: -100,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(131, 56, 236, 0.1)',
    bottom: -50,
    left: -50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    zIndex: 1,
  },
  logoContainer: { marginBottom: 20 },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff006e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: { marginBottom: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputFocused: {
    borderColor: '#ff006e',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  inputError: { borderColor: '#ff006e' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#fff' },
  eyeIcon: { padding: 8 },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  error: { color: '#ff006e', fontSize: 14 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: { color: '#ff006e', fontSize: 14, fontWeight: '600' },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 8,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    marginHorizontal: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  signUpLink: {
    color: '#ff006e',
    fontSize: 14,
    fontWeight: 'bold',
  },
});