import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [autoRecord, setAutoRecord] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Logged Out', 'You have been logged out successfully');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted');
          },
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
    iconColor,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    iconColor: string;
  }) => (
    <View style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        {subtitle && <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#D1D5DB', true: '#4CAF50' }}
        thumbColor={value ? '#fff' : '#f4f3f4'}
      />
    </View>
  );

  const ActionButton = ({
    icon,
    title,
    onPress,
    iconColor,
    isDestructive = false,
  }: {
    icon: any;
    title: string;
    onPress: () => void;
    iconColor: string;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={[styles.settingIcon, { backgroundColor: iconColor + '20' }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <ThemedText
        style={[
          styles.actionButtonText,
          isDestructive && styles.actionButtonTextDestructive,
        ]}
      >
        {title}
      </ThemedText>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#E8EAF6', '#FFFFFF']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="settings" size={32} color="#3F51B5" />
            <ThemedText style={styles.headerTitle}>Settings</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Customize your safety preferences
            </ThemedText>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
            <View style={styles.sectionCard}>
              <SettingItem
                icon="notifications"
                title="Push Notifications"
                subtitle="Receive emergency alerts and updates"
                value={notifications}
                onValueChange={setNotifications}
                iconColor="#FF9800"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="volume-high"
                title="Sound Alerts"
                subtitle="Play sound for emergency notifications"
                value={soundAlerts}
                onValueChange={setSoundAlerts}
                iconColor="#2196F3"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="phone-portrait"
                title="Vibration"
                subtitle="Vibrate on emergency alerts"
                value={vibration}
                onValueChange={setVibration}
                iconColor="#9C27B0"
              />
            </View>
          </View>

          {/* Privacy & Safety Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Privacy & Safety</ThemedText>
            <View style={styles.sectionCard}>
              <SettingItem
                icon="location"
                title="Location Sharing"
                subtitle="Share location with trusted contacts during alerts"
                value={locationSharing}
                onValueChange={setLocationSharing}
                iconColor="#4CAF50"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="videocam"
                title="Auto-Record"
                subtitle="Automatically record during emergency"
                value={autoRecord}
                onValueChange={setAutoRecord}
                iconColor="#F44336"
              />
            </View>
          </View>

          {/* Appearance Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
            <View style={styles.sectionCard}>
              <SettingItem
                icon="moon"
                title="Dark Mode"
                subtitle="Use dark theme"
                value={darkMode}
                onValueChange={setDarkMode}
                iconColor="#607D8B"
              />
            </View>
          </View>

          {/* Account Actions Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>
            <View style={styles.sectionCard}>
              <ActionButton
                icon="person-circle"
                title="Edit Profile"
                onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon')}
                iconColor="#3F51B5"
              />
              <View style={styles.divider} />
              <ActionButton
                icon="lock-closed"
                title="Change Password"
                onPress={() => Alert.alert('Change Password', 'Password change coming soon')}
                iconColor="#FF9800"
              />
              <View style={styles.divider} />
              <ActionButton
                icon="shield-checkmark"
                title="Privacy Policy"
                onPress={() => Alert.alert('Privacy Policy', 'View privacy policy')}
                iconColor="#4CAF50"
              />
              <View style={styles.divider} />
              <ActionButton
                icon="document-text"
                title="Terms of Service"
                onPress={() => Alert.alert('Terms of Service', 'View terms of service')}
                iconColor="#2196F3"
              />
            </View>
          </View>

          {/* Danger Zone Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Danger Zone</ThemedText>
            <View style={styles.sectionCard}>
              <ActionButton
                icon="log-out"
                title="Logout"
                onPress={handleLogout}
                iconColor="#FF9800"
              />
              <View style={styles.divider} />
              <ActionButton
                icon="trash"
                title="Delete Account"
                onPress={handleDeleteAccount}
                iconColor="#F44336"
                isDestructive
              />
            </View>
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <ThemedText style={styles.appInfoText}>SafetyApp v1.0.0</ThemedText>
            <ThemedText style={styles.appInfoText}>© 2025 Your Company</ThemedText>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAF6',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 76,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  actionButtonTextDestructive: {
    color: '#F44336',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  appInfoText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});