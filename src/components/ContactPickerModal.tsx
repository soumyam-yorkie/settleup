import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { X, Search, User } from 'lucide-react-native';

import { theme } from '../utils/theme';
import { getAllDeviceContacts, PickedContact } from '../services/contactsService';

interface ContactPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (contact: PickedContact) => void;
}

export const ContactPickerModal = ({ isVisible, onClose, onSelect }: ContactPickerModalProps) => {
  const [contacts, setContacts] = useState<PickedContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<PickedContact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadContacts();
    }
  }, [isVisible]);

  const loadContacts = async () => {
    setIsLoading(true);
    const data = await getAllDeviceContacts();
    setContacts(data);
    setFilteredContacts(data);
    setIsLoading(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = contacts.filter(c => 
      c.name.toLowerCase().includes(text.toLowerCase()) || 
      (c.phoneOrEmail && c.phoneOrEmail.toLowerCase().includes(text.toLowerCase()))
    );
    setFilteredContacts(filtered);
  };

  const renderContactItem = ({ item }: { item: PickedContact }) => (
    <TouchableOpacity 
      style={styles.contactItem} 
      onPress={() => {
        onSelect(item);
        onClose();
        setSearchQuery('');
      }}
    >
      <View style={styles.avatarContainer}>
        {item.avatarUrl ? (
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <User color={theme.colors.onPrimaryContainer} size={20} />
          </View>
        )}
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        {item.phoneOrEmail && (
          <Text style={styles.contactSub}>{item.phoneOrEmail}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Contact</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={theme.colors.onSurface} size={24} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Search color={theme.colors.outline} size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor={theme.colors.outline}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <X color={theme.colors.outline} size={16} />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          {isLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator color={theme.colors.primary} size="large" />
              <Text style={styles.loaderText}>Loading contacts...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredContacts}
              keyExtractor={(item) => item.id}
              renderItem={renderContactItem}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchQuery ? 'No contacts found' : 'No contacts available'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: '90%',
    paddingTop: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.onSurface,
    fontFamily: 'Manrope',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    marginHorizontal: theme.spacing.lg,
    borderRadius: 24,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    marginBottom: theme.spacing.md,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
    fontFamily: 'Manrope',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainer,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: 'Manrope',
  },
  contactSub: {
    fontSize: 13,
    color: theme.colors.outline,
    marginTop: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 12,
    color: theme.colors.outline,
    fontSize: 14,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.outline,
    fontSize: 16,
  },
});
