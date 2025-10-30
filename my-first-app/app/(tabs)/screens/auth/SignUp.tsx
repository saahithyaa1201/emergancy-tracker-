import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // ✅ Changed to Expo Router
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

// ✅ Supabase setup
const supabaseUrl = 'https://krkclhpdxqsxvjixmvqx.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya2NsaHBkeHFzeHZqaXhtdnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NjkzMTUsImV4cCI6MjA3NTA0NTMxNX0.16w6CNG-LzLma876yokKjpPjF8YuPLc8VF6PyskAaRQ';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignUp() {
  const router = useRouter(); // ✅ Using Expo Router

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [fullNameFocused, setFullNameFocused] = useState(false);

  function validate() {
    if (!fullName.trim()) return 'Full name is required';
    if (!email.trim()) return 'Email is required';
    if (!password) return 'Password is required';
    if (!confirmPassword) return 'Please confirm your password';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Enter a valid email';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        console.log('Signed up:', data.user);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        setError('✅ Account created successfully! Check your email to verify.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

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
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#ff006e', '#8338ec', '#3a86ff']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="person-add" size={40} color="#fff" />
              </LinearGradient>
            </View>
            <ThemedText type="title" style={styles.title}>
              Create Account
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Join us and start your journey
            </ThemedText>
          </View>

          <View style={styles.formCard}>
            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <View
                style={[
                  styles.inputContainer,
                  fullNameFocused && styles.inputFocused,
                  error && !fullName && styles.inputError,
                ]}
              >
                <Ionicons
                  name="person"
                  size={20}
                  color={fullNameFocused ? '#ff006e' : '#9ca3af'}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Full name"
                  placeholderTextColor="#6b7280"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  style={styles.input}
                  onFocus={() => setFullNameFocused(true)}
                  onBlur={() => setFullNameFocused(false)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <View
                style={[
                  styles.inputContainer,
                  emailFocused && styles.inputFocused,
                  error && !email && styles.inputError,
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

            {/* Password */}
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

            {/* Confirm Password */}
            <View style={styles.inputWrapper}>
              <View
                style={[
                  styles.inputContainer,
                  confirmPasswordFocused && styles.inputFocused,
                  error && confirmPassword.length === 0 && styles.inputError,
                ]}
              >
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={confirmPasswordFocused ? '#ff006e' : '#9ca3af'}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Confirm password"
                  placeholderTextColor="#6b7280"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#ff006e" />
                <ThemedText style={styles.error}>{error}</ThemedText>
              </View>
            )}

            {/* Submit Button */}
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
                    <ThemedText style={styles.buttonText}>Create Account</ThemedText>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <ThemedText style={styles.signInText}>
                Already have an account?{' '}
              </ThemedText>
              <TouchableOpacity 
  onPress={() => {
    try {
      router.push('/(tabs)/screens/auth/SignIn')  // ✅ This matches your path
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }}
  activeOpacity={0.7}
>
  <ThemedText style={styles.signInLink}>Sign In</ThemedText>
</TouchableOpacity>
            </View>

            <ThemedText style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </ThemedText>
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
  logoContainer: {
    marginBottom: 20,
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
    shadowColor: '#ff006e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signInText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14 },
  signInLink: { color: '#ff006e', fontSize: 14, fontWeight: 'bold' },
  termsText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});