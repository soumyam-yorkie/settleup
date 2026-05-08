import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { theme } from '../utils/theme';

interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface ParticipantSelectorProps {
  participants: Participant[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  isWholeGroup?: boolean;
  onToggleWholeGroup?: () => void;
}

export const ParticipantSelector = ({ 
  participants, 
  selectedIds, 
  onToggle,
  isWholeGroup,
  onToggleWholeGroup
}: ParticipantSelectorProps) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.container}
    >
      {/* Whole Group Option */}
      {onToggleWholeGroup && (
        <TouchableOpacity 
          style={styles.item} 
          onPress={onToggleWholeGroup}
          activeOpacity={0.8}
        >
          <View style={[
            styles.avatarContainer, 
            isWholeGroup && styles.avatarSelected
          ]}>
            <View style={[styles.avatar, styles.groupAvatar]}>
              <Text style={styles.groupAvatarText}>WF</Text>
            </View>
          </View>
          <Text style={[styles.name, isWholeGroup && styles.nameActive]}>Whole Group</Text>
        </TouchableOpacity>
      )}

      {/* Individual Participants */}
      {participants.map((person) => {
        const isSelected = selectedIds.includes(person.id);
        const firstName = person.name.split(' ')[0];
        const initials = person.name.split(' ').map(n => n[0]).join('').toUpperCase();

        return (
          <TouchableOpacity 
            key={person.id} 
            style={styles.item} 
            onPress={() => onToggle(person.id)}
            activeOpacity={0.8}
          >
            <View style={[
              styles.avatarContainer, 
              isSelected && !isWholeGroup && styles.avatarSelected
            ]}>
              {person.avatarUrl ? (
                <Image source={{ uri: person.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.placeholderAvatar]}>
                  <Text style={styles.placeholderText}>{initials}</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.name, 
              isSelected && !isWholeGroup && styles.nameActive
            ]}>
              {firstName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
    gap: 20,
  },
  item: {
    alignItems: 'center',
    width: 72,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: theme.colors.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  groupAvatar: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupAvatarText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  placeholderAvatar: {
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  nameActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
