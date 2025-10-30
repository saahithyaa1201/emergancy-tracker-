import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
// Import your auth context - adjust the path based on your project structure
// import { useAuth } from '@/context/AuthContext';

const getLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission denied', 'Location permission is required!');
    return null;
  }

  let location = await Location.getCurrentPositionAsync({});
  return location.coords; // { latitude, longitude }
};

// Replace with your actual backend URL
// For Android emulator use: http://10.0.2.2:3000
// For iOS simulator use: http://localhost:3000
// For physical device use your computer's IP: http://192.168.x.x:3000
const API_URL = 'http://10.0.2.2:3000';

const { width, height } = Dimensions.get('window');

interface PanicAlertResponse {
  success: boolean;
  message: string;
  data?: any;
}

export default function HomeScreen() {
  const router = useRouter();
  // Uncomment when you have auth context set up:
  // const { user } = useAuth();
  
  // For now, use a default user ID - replace with actual user from auth
  const [userId, setUserId] = useState('user-123');
  const [userName, setUserName] = useState('Alex');
  
  const [isPanicPressed, setIsPanicPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  // Initialize user data - replace with your actual auth logic
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // When you have auth, replace this with:
        // setUserId(user?.id || 'anonymous');
        // setUserName(user?.name || 'User');
        
        // For now, you can fetch user data from your backend or auth provider
        // Example: const userData = await fetchUserData();
        // setUserId(userData.id);
        // setUserName(userData.name);
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };

    initializeUser();
  }, []);

  const sendPanicAlert = async (
    latitude: number,
    longitude: number
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      const payload = {
        userId,
        latitude,
        longitude,
      };

      console.log('Sending panic alert with payload:', payload);

      const response = await fetch(`${API_URL}/api/panic-alerts/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: PanicAlertResponse = await response.json();

      if (response.ok && data.success) {
        setAlertSent(true);
        // Reset alert sent flag after 3 seconds
        setTimeout(() => setAlertSent(false), 3000);

        Alert.alert(
          '✅ Alert Sent Successfully',
          'Your emergency contacts have been notified with your location. Emergency services have been alerted.',
          [{ text: 'OK', onPress: () => console.log('Alert acknowledged') }]
        );

        console.log('Panic alert created successfully:', data);
        return true;
      } else {
        throw new Error(
          data.message || 'Failed to send alert. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error sending panic alert:', error);

      Alert.alert(
        '❌ Failed to Send Alert',
        'Could not send emergency alert. Please check your connection or call emergency services directly.',
        [{ text: 'OK' }]
      );

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePanicButton = async () => {
    // Prevent multiple simultaneous requests
    if (isLoading) {
      Alert.alert('Please wait', 'Your previous alert is still being sent.');
      return;
    }

    try {
      const coords = await getLocation();

      if (!coords) {
        Alert.alert(
          'Location Error',
          'Could not access your location. Please enable location services in your phone settings.'
        );
        return;
      }

      console.log('Location obtained:', coords);

      // Send to backend
      const success = await sendPanicAlert(coords.latitude, coords.longitude);

      if (success) {
        // Trigger vibration pattern
        Vibration.vibrate([0, 50, 100, 50]);
      }
    } catch (error) {
      console.error('Error in handlePanicButton:', error);

      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again or contact emergency services directly.'
      );
    }
  };

  const triggerAlert = () => {
    // Haptic feedback
    Vibration.vibrate([0, 100, 50, 100]);

    Alert.alert(
      '🚨 Emergency Alert Confirmation',
      'Are you sure you want to trigger a panic alert? This will:\n\n• Notify your emergency contacts\n• Send your location\n• Alert emergency services\n\nThis action cannot be immediately cancelled.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsPanicPressed(false),
        },
        {
          text: 'Trigger Alert',
          onPress: () => {
            console.log('Panic alert confirmed by user');
            setIsPanicPressed(false);
            handlePanicButton();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const onSafetyTimerPress = () => {
    console.log('Navigating to Safety Timer');
    router.push('/(tabs)/screens/SafetyTimer');
  };

  const onTrustedContactsPress = () => {
    console.log('Navigating to Trusted Contacts');
    router.push('/(tabs)/screens/TrustedContacts');
  };

  const onEmergencyHistoryPress = () => {
    console.log('Navigating to Emergency History');
    router.push('/(tabs)/screens/EmergencyHistory');
  };

  const onSettingsPress = () => {
    console.log('Navigating to Settings');
    router.push('/(tabs)/screens/Settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E3F2FD', '#FFFFFF', '#F0F4FF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Decorative circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <View style={styles.profileContainer}>
              <LinearGradient
                colors={['#4CAF50', '#66BB6A']}
                style={styles.profileGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="person" size={28} color="#fff" />
              </LinearGradient>
            </View>
            <ThemedText style={styles.welcomeText}>
              Welcome, {userName}
            </ThemedText>
            <ThemedText style={styles.statusText}>
              <View style={styles.statusDot} /> You're protected
            </ThemedText>
          </View>

          {/* Alert Status Banner */}
          {alertSent && (
            <View style={styles.successBanner}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#4CAF50"
              />
              <ThemedText style={styles.successBannerText}>
                Alert sent successfully
              </ThemedText>
            </View>
          )}

          {/* Emergency Info Banner */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={20} color="#2196F3" />
            <ThemedText style={styles.infoText}>
              Tap the panic button and confirm to send an emergency alert
            </ThemedText>
          </View>

          {/* Main Panic Button */}
          <View style={styles.mainContent}>
            <TouchableOpacity
              style={[
                styles.panicButton,
                isPanicPressed && styles.panicButtonPressed,
                isLoading && styles.panicButtonDisabled,
              ]}
              onPress={triggerAlert}
              onPressIn={() => !isLoading && setIsPanicPressed(true)}
              onPressOut={() => setIsPanicPressed(false)}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <LinearGradient
                colors={
                  isPanicPressed
                    ? ['#D32F2F', '#B71C1C']
                    : ['#FF1744', '#D32F2F']
                }
                style={styles.panicGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.panicIconContainer}>
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#fff" />
                  ) : (
                    <Ionicons name="alert-circle" size={56} color="#fff" />
                  )}
                </View>
                <ThemedText style={styles.panicButtonText}>
                  {isLoading ? 'SENDING' : 'PANIC'}
                </ThemedText>
                <ThemedText style={styles.panicButtonSubtext}>
                  {isLoading
                    ? 'Please wait...'
                    : 'Tap to trigger alert'}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>

            {/* Pulse Animation Rings */}
            {!isLoading && (
              <>
                <View style={[styles.pulseRing, styles.pulseRing1]} />
                <View style={[styles.pulseRing, styles.pulseRing2]} />
              </>
            )}
          </View>

          {/* Quick Access Section */}
          <View style={styles.quickAccessSection}>
            <ThemedText style={styles.quickAccessTitle}>
              Quick Access
            </ThemedText>

            <View style={styles.quickAccessRow}>
              <TouchableOpacity
                style={styles.quickAccessButton}
                onPress={onSafetyTimerPress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="timer-outline" size={28} color="#2196F3" />
                </View>
                <ThemedText style={styles.quickAccessButtonText}>
                  Safety{'\n'}Timer
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessButton}
                onPress={onTrustedContactsPress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="people-outline" size={28} color="#9C27B0" />
                </View>
                <ThemedText style={styles.quickAccessButtonText}>
                  Trusted{'\n'}Contacts
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessButton}
                onPress={onEmergencyHistoryPress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="time-outline" size={28} color="#FF9800" />
                </View>
                <ThemedText style={styles.quickAccessButtonText}>
                  Emergency{'\n'}History
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickAccessButton}
                onPress={onSettingsPress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="settings-outline" size={28} color="#4CAF50" />
                </View>
                <ThemedText style={styles.quickAccessButtonText}>
                  Settings
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Safety Tips Section */}
          <View style={styles.tipsSection}>
            <View style={styles.tipCard}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
              <View style={styles.tipContent}>
                <ThemedText style={styles.tipTitle}>Safety Tip</ThemedText>
                <ThemedText style={styles.tipText}>
                  Keep your trusted contacts updated and enable location services
                </ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  circle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    top: -80,
    right: -60,
  },
  circle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    bottom: 100,
    left: -40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  profileContainer: {
    marginBottom: 12,
  },
  profileGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  successBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#2E7D32',
    marginLeft: 8,
    lineHeight: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1976D2',
    marginLeft: 8,
    lineHeight: 18,
  },
  mainContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
    position: 'relative',
  },
  panicButton: {
    width: Math.min(width * 0.55, 220),
    height: Math.min(width * 0.55, 220),
    borderRadius: Math.min(width * 0.275, 110),
    overflow: 'hidden',
    shadowColor: '#D32F2F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 2,
  },
  panicButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  panicButtonDisabled: {
    opacity: 0.7,
  },
  panicGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: Math.min(width * 0.275, 110),
  },
  panicIconContainer: {
    marginBottom: 8,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panicButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  panicButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: Math.min(width * 0.65, 260),
    height: Math.min(width * 0.65, 260),
    borderRadius: Math.min(width * 0.325, 130),
    borderWidth: 2,
    borderColor: 'rgba(255, 23, 68, 0.3)',
    zIndex: 1,
  },
  pulseRing1: {
    width: Math.min(width * 0.65, 260),
    height: Math.min(width * 0.65, 260),
  },
  pulseRing2: {
    width: Math.min(width * 0.75, 300),
    height: Math.min(width * 0.75, 300),
    borderColor: 'rgba(255, 23, 68, 0.2)',
  },
  quickAccessSection: {
    marginBottom: 30,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  quickAccessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAccessButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessButtonText: {
    fontSize: 12,
    color: '#424242',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});