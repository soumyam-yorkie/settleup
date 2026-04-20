import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { theme } from '../../utils/theme';
import { FriendCard } from '../../components/FriendCard';
import { MOCK_FRIENDS } from '../../services/mockData';
import { UserPlus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

export const FriendsListScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>You are owed $100.00 in total</Text>
        </View>

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

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddFriend')}
      >
        <UserPlus color={theme.colors.white} size={24} />
        <Text style={styles.fabText}>Add Friend</Text>
      </TouchableOpacity>
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
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.fab,
  },
  fabText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
});
