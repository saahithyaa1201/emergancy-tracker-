import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SafetyTimer() {
  const [selectedTime, setSelectedTime] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const timeOptions = [15, 30, 45, 60, 90, 120];

  useEffect(() => {
    let interval: number;
    if (isTimerActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false);
            Alert.alert(
              '⚠️ Safety Timer Expired',
              'Your safety timer has expired. Emergency contacts will be notified.',
              [{ text: 'OK' }]
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, remainingTime]);

  const startTimer = () => {
    setRemainingTime(selectedTime * 60);
    setIsTimerActive(true);
  };

  const stopTimer = () => {
    Alert.alert(
      'Stop Timer',
      'Are you sure you want to stop the safety timer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            setIsTimerActive(false);
            setRemainingTime(0);
          },
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#E3F2FD', '#FFFFFF']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="timer" size={32} color="#2196F3" />
            <ThemedText style={styles.headerTitle}>Safety Timer</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Set a timer to check in. If you don't respond, we'll alert your contacts.
            </ThemedText>
          </View>

          {/* Timer Display */}
          {isTimerActive ? (
            <View style={styles.activeTimerContainer}>
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.timerCircle}
              >
                <ThemedText style={styles.timerText}>{formatTime(remainingTime)}</ThemedText>
                <ThemedText style={styles.timerLabel}>Remaining</ThemedText>
              </LinearGradient>

              <TouchableOpacity style={styles.stopButton} onPress={stopTimer}>
                <ThemedText style={styles.stopButtonText}>Stop Timer</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Time Selection */}
              <View style={styles.timeSelectionContainer}>
                <ThemedText style={styles.sectionTitle}>Select Duration (minutes)</ThemedText>
                <View style={styles.timeGrid}>
                  {timeOptions.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeOption,
                        selectedTime === time && styles.timeOptionSelected,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <ThemedText
                        style={[
                          styles.timeOptionText,
                          selectedTime === time && styles.timeOptionTextSelected,
                        ]}
                      >
                        {time}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Start Button */}
              <TouchableOpacity style={styles.startButton} onPress={startTimer}>
                <LinearGradient
                  colors={['#4CAF50', '#388E3C']}
                  style={styles.startButtonGradient}
                >
                  <Ionicons name="play" size={24} color="#fff" />
                  <ThemedText style={styles.startButtonText}>Start Timer</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#FF9800" />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoTitle}>How it works</ThemedText>
              <ThemedText style={styles.infoText}>
                • Set a timer before traveling{'\n'}
                • Check in before time expires{'\n'}
                • Emergency contacts notified if no response
              </ThemedText>
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
    padding: 20,
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
  activeTimerContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  timerLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  stopButton: {
    marginTop: 30,
    backgroundColor: '#F44336',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeSelectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeOption: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  timeOptionSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  timeOptionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  timeOptionTextSelected: {
    color: '#2196F3',
  },
  startButton: {
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
});