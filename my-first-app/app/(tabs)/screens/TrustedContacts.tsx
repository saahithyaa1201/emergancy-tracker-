import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

export default function TrustedContacts() {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  const requestContactsPermission = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    setPermissionGranted(status === 'granted');
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Denied',
        'We need access to your contacts to add trusted contacts.',
        [{ text: 'OK' }]
      );
    }
  };

  const pickContact = async () => {
    if (permissionGranted === null) {
      await requestContactsPermission();
      return;
    }

    if (!permissionGranted) {
      Alert.alert(
        'Permission Required',
        'Please grant contacts permission in your device settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      // For demo, pick first contact. In real app, show picker
      const contact = data[0];
      const phone = contact.phoneNumbers?.[0]?.number || 'No phone';
      
      const newContact: TrustedContact = {
        id: Date.now().toString(),
        name: contact.name || 'Unknown',
        phone,
      };

      setContacts([...contacts, newContact]);
      Alert.alert('Success', `${newContact.name} added as trusted contact`);
    }
  };

  const removeContact = (id: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this trusted contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setContacts(contacts.filter((c) => c.id !== id));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F3E5F5', '#FFFFFF']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="people" size={32} color="#9C27B0" />
            <ThemedText style={styles.headerTitle}>Trusted Contacts</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Add people who will be notified in an emergency
            </ThemedText>
          </View>

          {/* Add Contact Button */}
          <TouchableOpacity style={styles.addButton} onPress={pickContact}>
            <LinearGradient
              colors={['#9C27B0', '#7B1FA2']}
              style={styles.addButtonGradient}
            >
              <Ionicons name="person-add" size={24} color="#fff" />
              <ThemedText style={styles.addButtonText}>Add Trusted Contact</ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          {/* Contacts List */}
          <View style={styles.contactsList}>
            <ThemedText style={styles.sectionTitle}>
              Your Trusted Contacts ({contacts.length})
            </ThemedText>

            {contacts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#ccc" />
                <ThemedText style={styles.emptyText}>No trusted contacts yet</ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  Add contacts who should be notified in case of emergency
                </ThemedText>
              </View>
            ) : (
              contacts.map((contact) => (
                <View key={contact.id} style={styles.contactCard}>
                  <View style={styles.contactIcon}>
                    <Ionicons name="person" size={24} color="#9C27B0" />
                  </View>
                  <View style={styles.contactInfo}>
                    <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
                    <ThemedText style={styles.contactPhone}>{contact.phone}</ThemedText>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeContact(contact.id)}
                  >
                    <Ionicons name="trash-outline" size={22} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoTitle}>Privacy & Safety</ThemedText>
              <ThemedText style={styles.infoText}>
                Your trusted contacts will only be notified when you trigger an emergency alert
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
    backgroundColor: '#F3E5F5',
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
  addButton: {
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactsList: {
    marginBottom: 30,
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
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
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