import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

interface EmergencyEvent {
  id: string;
  type: 'panic' | 'timer' | 'check-in';
  date: Date;
  location: string;
  status: 'resolved' | 'active' | 'cancelled';
}

export default function EmergencyHistory() {
  const [events, setEvents] = useState<EmergencyEvent[]>([
    {
      id: '1',
      type: 'panic',
      date: new Date('2025-10-07T14:30:00'),
      location: 'Main Street, Downtown',
      status: 'resolved',
    },
    {
      id: '2',
      type: 'timer',
      date: new Date('2025-10-05T09:15:00'),
      location: 'Park Avenue',
      status: 'resolved',
    },
    {
      id: '3',
      type: 'check-in',
      date: new Date('2025-10-03T18:45:00'),
      location: 'Home',
      status: 'resolved',
    },
  ]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'panic':
        return 'alert-circle';
      case 'timer':
        return 'timer';
      case 'check-in':
        return 'checkmark-circle';
      default:
        return 'information-circle';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'panic':
        return '#F44336';
      case 'timer':
        return '#FF9800';
      case 'check-in':
        return '#4CAF50';
      default:
        return '#2196F3';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return '#4CAF50';
      case 'active':
        return '#F44336';
      case 'cancelled':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deleteEvent = (id: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this emergency event from history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEvents(events.filter((e) => e.id !== id));
          },
        },
      ]
    );
  };

  const clearAllHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all emergency history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            setEvents([]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FFF3E0', '#FFFFFF']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="time" size={32} color="#FF9800" />
            <ThemedText style={styles.headerTitle}>Emergency History</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              View all your past emergency alerts and check-ins
            </ThemedText>
          </View>

          {/* Clear All Button */}
          {events.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearAllHistory}>
              <Ionicons name="trash-outline" size={20} color="#F44336" />
              <ThemedText style={styles.clearButtonText}>Clear All History</ThemedText>
            </TouchableOpacity>
          )}

          {/* Events List */}
          <View style={styles.eventsList}>
            <ThemedText style={styles.sectionTitle}>
              Recent Events ({events.length})
            </ThemedText>

            {events.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={64} color="#ccc" />
                <ThemedText style={styles.emptyText}>No emergency history</ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  Your emergency alerts and check-ins will appear here
                </ThemedText>
              </View>
            ) : (
              events.map((event) => (
                <View key={event.id} style={styles.eventCard}>
                  <View
                    style={[
                      styles.eventIconContainer,
                      { backgroundColor: getEventColor(event.type) + '20' },
                    ]}
                  >
                    <Ionicons
                      name={getEventIcon(event.type)}
                      size={28}
                      color={getEventColor(event.type)}
                    />
                  </View>

                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <ThemedText style={styles.eventType}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Alert
                      </ThemedText>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: getStatusColor(event.status) },
                        ]}
                      >
                        <ThemedText style={styles.statusText}>
                          {event.status.toUpperCase()}
                        </ThemedText>
                      </View>
                    </View>

                    <View style={styles.eventDetails}>
                      <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color="#666" />
                        <ThemedText style={styles.detailText}>
                          {formatDate(event.date)}
                        </ThemedText>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color="#666" />
                        <ThemedText style={styles.detailText}>
                          {formatTime(event.date)}
                        </ThemedText>
                      </View>
                      <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={16} color="#666" />
                        <ThemedText style={styles.detailText}>
                          {event.location}
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteEvent(event.id)}
                  >
                    <Ionicons name="trash-outline" size={22} color="#999" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#2196F3" />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoTitle}>About History</ThemedText>
              <ThemedText style={styles.infoText}>
                Emergency events are automatically logged for your safety records. You can
                delete individual events or clear all history at any time.
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
    backgroundColor: '#FFF3E0',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  clearButtonText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
  },
  eventsList: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
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