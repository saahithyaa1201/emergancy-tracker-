import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

// Replace with your backend URL
const API_URL = 'http://YOUR_IP_ADDRESS:3000'; // e.g., http://192.168.1.100:3000
const USER_ID = 'user-123'; // TODO: Get from your auth context

export default function TrustedContacts() {
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [allDeviceContacts, setAllDeviceContacts] = useState<any[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadTrustedContactsFromBackend();
  }, []);

  // Load saved trusted contacts from backend
  const loadTrustedContactsFromBackend = async () => {
    try {
      setIsLoading(true);
      console.log('📥 Loading trusted contacts from backend...');
      
      const response = await fetch(`${API_URL}/api/trusted-contacts?userId=${USER_ID}`);
      const data = await response.json();
      
      console.log('Backend response:', data);
      
      if (response.ok && data.success) {
        setTrustedContacts(data.data);
        console.log(`✅ Loaded ${data.data.length} trusted contacts`);
      }
    } catch (error) {
      console.error('❌ Error loading trusted contacts:', error);
      Alert.alert('Error', 'Failed to load trusted contacts from server');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle "Add Trusted Contacts" button click
  const handleAddContacts = async () => {
    if (isLoading) return;

    // Step 1: Request permission
    console.log('📱 Requesting contacts permission...');
    
    const { status } = await Contacts.requestPermissionsAsync();
    console.log('Permission status:', status);
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your contacts to add trusted contacts.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
              } else {
                Linking.openSettings();
              }
            }
          }
        ]
      );
      return;
    }

    // Step 2: Check if user already has 3 contacts
    if (trustedContacts.length >= 3) {
      Alert.alert('Limit Reached', 'You can only add up to 3 trusted contacts.');
      return;
    }

    // Step 3: Load all device contacts
    try {
      setIsLoading(true);
      console.log('📇 Loading device contacts...');
      
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
        pageSize: 1000,
      });

      // Filter contacts that have phone numbers
      const contactsWithPhone = data.filter(
        (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
      );
      
      console.log(`✅ Found ${contactsWithPhone.length} contacts with phone numbers`);
      
      if (contactsWithPhone.length === 0) {
        Alert.alert('No Contacts', 'No contacts with phone numbers found on your device.');
        return;
      }
      
      setAllDeviceContacts(contactsWithPhone);
      setSelectedContacts(new Set());
      setPickerVisible(true);
    } catch (error) {
      console.error('❌ Failed to read contacts:', error);
      Alert.alert('Error', 'Could not read contacts from device. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle contact selection in the picker
  const toggleContactSelection = (contact: any) => {
    const phone = contact.phoneNumbers?.[0]?.number || '';
    if (!phone) return;

    const newSelected = new Set(selectedContacts);
    
    if (newSelected.has(contact.id)) {
      newSelected.delete(contact.id);
    } else {
      const maxSelectable = 3 - trustedContacts.length;
      if (newSelected.size >= maxSelectable) {
        Alert.alert(
          'Limit Reached', 
          `You can only select ${maxSelectable} more contact${maxSelectable > 1 ? 's' : ''}.`
        );
        return;
      }
      newSelected.add(contact.id);
    }
    
    setSelectedContacts(newSelected);
  };

  // Save selected contacts to backend
  const confirmSelection = async () => {
    if (selectedContacts.size === 0) {
      Alert.alert('No Selection', 'Please select at least one contact.');
      return;
    }

    try {
      setIsLoading(true);
      setPickerVisible(false);
      
      const selectedContactsData = allDeviceContacts
        .filter(c => selectedContacts.has(c.id))
        .map(c => ({
          name: c.name || 'Unknown',
          phone: c.phoneNumbers?.[0]?.number || '',
        }));

      console.log('💾 Saving contacts to backend:', selectedContactsData);

      // Save to backend
      const response = await fetch(`${API_URL}/api/trusted-contacts/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: USER_ID,
          contacts: selectedContactsData,
        }),
      });

      const data = await response.json();
      console.log('Backend response:', data);

      if (response.ok && data.success) {
        // Reload trusted contacts from backend
        await loadTrustedContactsFromBackend();
        setSelectedContacts(new Set());
        
        Alert.alert(
          '✅ Success',
          `${selectedContactsData.length} trusted contact${selectedContactsData.length > 1 ? 's' : ''} added successfully!`
        );
      } else {
        throw new Error(data.message || 'Failed to save contacts');
      }
    } catch (error: any) {
      console.error('❌ Error saving contacts:', error);
      Alert.alert('Error', error.message || 'Failed to save contacts to server');
      setPickerVisible(true); // Reopen picker on error
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a trusted contact
  const removeContact = (id: string, name: string) => {
    Alert.alert(
      'Remove Contact',
      `Are you sure you want to remove ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              console.log('🗑️ Deleting contact:', id);
              
              const response = await fetch(
                `${API_URL}/api/trusted-contacts/${id}?userId=${USER_ID}`,
                { method: 'DELETE' }
              );
              
              const data = await response.json();
              
              if (response.ok && data.success) {
                await loadTrustedContactsFromBackend();
                Alert.alert('✅ Success', 'Contact removed successfully');
              } else {
                throw new Error(data.message || 'Failed to remove contact');
              }
            } catch (error: any) {
              console.error('❌ Error removing contact:', error);
              Alert.alert('Error', 'Failed to remove contact from server');
            } finally {
              setIsLoading(false);
            }
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

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingBanner}>
              <ActivityIndicator size="small" color="#9C27B0" />
              <ThemedText style={styles.loadingText}>Loading...</ThemedText>
            </View>
          )}

          {/* Add Contact Button */}
          <TouchableOpacity
            style={[styles.addButton, (isLoading || trustedContacts.length >= 3) && styles.addButtonDisabled]}
            onPress={handleAddContacts}
            disabled={isLoading || trustedContacts.length >= 3}
          >
            <LinearGradient
              colors={['#9C27B0', '#7B1FA2']}
              style={styles.addButtonGradient}
            >
              <Ionicons name="person-add" size={24} color="#fff" />
              <ThemedText style={styles.addButtonText}>
                {trustedContacts.length >= 3 ? 'Maximum Contacts Added' : 'Add Trusted Contacts'}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          {/* Contacts List */}
          <View style={styles.contactsList}>
            <ThemedText style={styles.sectionTitle}>
              Your Trusted Contacts ({trustedContacts.length}/3)
            </ThemedText>
            {trustedContacts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#ccc" />
                <ThemedText style={styles.emptyText}>No trusted contacts yet</ThemedText>
                <ThemedText style={styles.emptySubtext}>
                  Tap "Add Trusted Contacts" to select up to 3 people from your phone contacts
                </ThemedText>
              </View>
            ) : (
              trustedContacts.map((contact, index) => (
                <View key={contact.id} style={styles.contactCard}>
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>{index + 1}</Text>
                  </View>
                  <View style={styles.contactIcon}>
                    <Ionicons name="person" size={24} color="#9C27B0" />
                  </View>
                  <View style={styles.contactInfo}>
                    <ThemedText style={styles.contactName}>{contact.name}</ThemedText>
                    <ThemedText style={styles.contactPhone}>{contact.phone}</ThemedText>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeContact(contact.id, contact.name)}
                    disabled={isLoading}
                  >
                    <Ionicons name="trash-outline" size={22} color="#F44336" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Contact Picker Modal */}
          <Modal visible={pickerVisible} animationType="slide">
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderRow}>
                  <TouchableOpacity
                    onPress={() => {
                      setPickerVisible(false);
                      setSelectedContacts(new Set());
                    }}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={28} color="#333" />
                  </TouchableOpacity>
                  <View style={styles.modalHeaderText}>
                    <ThemedText style={styles.modalTitle}>Select Contacts</ThemedText>
                    <ThemedText style={styles.modalSubtitle}>
                      {selectedContacts.size}/{3 - trustedContacts.length} selected
                    </ThemedText>
                  </View>
                </View>
                
                {selectedContacts.size > 0 && (
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={confirmSelection}
                  >
                    <LinearGradient
                      colors={['#9C27B0', '#7B1FA2']}
                      style={styles.confirmButtonGradient}
                    >
                      <ThemedText style={styles.confirmButtonText}>
                        Confirm Selection ({selectedContacts.size})
                      </ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              <FlatList
                data={allDeviceContacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selectedContacts.has(item.id);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.contactCard,
                        isSelected && styles.contactCardSelected
                      ]}
                      onPress={() => toggleContactSelection(item)}
                    >
                      <View style={styles.contactIcon}>
                        <Ionicons name="person" size={24} color="#9C27B0" />
                      </View>
                      <View style={styles.contactInfo}>
                        <Text style={styles.contactName}>{item.name}</Text>
                        <Text style={styles.contactPhone}>
                          {item.phoneNumbers?.[0]?.number}
                        </Text>
                      </View>
                      <Ionicons 
                        name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
                        size={24} 
                        color={isSelected ? "#4CAF50" : "#9C27B0"} 
                      />
                    </TouchableOpacity>
                  );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </SafeAreaView>
          </Modal>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoTitle}>Privacy & Safety</ThemedText>
              <ThemedText style={styles.infoText}>
                Your contacts are securely stored and will only be notified when you trigger the emergency alert
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
  loadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3E5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#9C27B0',
    marginLeft: 8,
  },
  addButton: {
    marginBottom: 30,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonDisabled: {
    opacity: 0.6,
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
  contactCardSelected: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  priorityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
  },
  modalHeaderText: {
    flex: 1,
    marginLeft: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  confirmButton: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
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