import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserPlus } from 'lucide-react-native';

import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { FriendCard } from '../../components/FriendCard';
import { MOCK_FRIENDS } from '../../services/mockData';
import { RootStackParamList } from '../../types/navigation';
import { theme } from '../../utils/theme';
import { PickedContact } from '../../services/contactsService';
import { ContactPickerModal } from '../../components/ContactPickerModal';

export const FriendsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);

  const handleSelectContact = (contact: PickedContact) => {
    console.log('Picked Contact for Friends List:', contact);
    // Future: Add to DB/MOCK_FRIENDS
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card variant="flat" style={styles.summary} padding={theme.spacing.md}>
          <Text style={styles.summaryText}>You are owed $100.00 in total</Text>
        </Card>

        {MOCK_FRIENDS.map((friend) => (
          <FriendCard
            key={friend.id}
            name={friend.name}
            balance={friend.balance}
            avatarUrl={friend.avatarUrl}
            currency="$"
            onPress={() => console.log('Friend Pressed', friend.id)}
          />
        ))}
      </ScrollView>

      <Button
        variant="primary"
        leftIcon={UserPlus}
        title="Add Friend"
        onPress={() => setIsContactModalVisible(true)}
        style={styles.fab}
      />

      <ContactPickerModal
        isVisible={isContactModalVisible}
        onClose={() => setIsContactModalVisible(false)}
        onSelect={handleSelectContact}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 120,
  },
  summary: {
    backgroundColor: theme.colors.secondaryContainer,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  summaryText: {
    color: theme.colors.onSecondaryContainer,
    fontWeight: '600',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.fab,
  },
});

