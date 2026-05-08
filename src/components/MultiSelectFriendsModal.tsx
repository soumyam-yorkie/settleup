import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Modal
} from 'react-native';
import { X, Check } from 'lucide-react-native';
import { theme } from '../utils/theme';

interface Friend {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface MultiSelectFriendsModalProps {
  visible: boolean;
  friends: Friend[];
  selectedIds: string[];
  onClose: () => void;
  onConfirm: (ids: string[]) => void;
}

export const MultiSelectFriendsModal = ({ 
  visible, 
  friends, 
  selectedIds, 
  onClose, 
  onConfirm 
}: MultiSelectFriendsModalProps) => {
  const [currentSelected, setCurrentSelected] = useState<string[]>(selectedIds);

  // Keep internal state in sync with parent when modal opens or parent selection changes
  useEffect(() => {
    if (visible) {
      setCurrentSelected(selectedIds);
    }
  }, [visible, selectedIds]);

  const toggleFriend = (id: string) => {
    setCurrentSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    onConfirm(currentSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Participants</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list}>
            {friends.map((friend) => {
              const isSelected = currentSelected.includes(friend.id);
              return (
                <TouchableOpacity 
                  key={friend.id} 
                  style={styles.friendItem}
                  onPress={() => toggleFriend(friend.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.avatarContainer}>
                    {friend.avatarUrl ? (
                      <Image source={{ uri: friend.avatarUrl }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, styles.placeholderAvatar]}>
                        <Text style={styles.placeholderText}>{friend.name[0]}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.friendName}>{friend.name}</Text>
                  <View style={[
                    styles.checkbox,
                    isSelected && styles.checkboxActive
                  ]}>
                    {isSelected && <Check size={14} color={theme.colors.white} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.confirmButton} 
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>
                Confirm Selection ({currentSelected.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerHigh,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  closeButton: {
    padding: 4,
  },
  list: {
    paddingHorizontal: 24,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerLow,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  placeholderAvatar: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  friendName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.surfaceContainerHighest,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  footer: {
    padding: 24,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '800',
    // Removed dependency on length for translation keys if needed, 
    // but kept current functionality as it's UI only.
  },
});
