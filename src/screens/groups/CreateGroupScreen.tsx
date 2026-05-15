import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Pencil, 
  Receipt, 
  Home, 
  Briefcase, 
  PartyPopper, 
  MoreHorizontal, 
  Search, 
  UserPlus, 
  ChevronRight, 
  ArrowRight,
  X,
  DollarSign,
} from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAppContext } from '../../context/AppContext';
import { BottomPickerModal } from '../../components/BottomPickerModal';
import { ContactPickerModal } from '../../components/ContactPickerModal';
import { RootStackParamList } from '../../types/navigation';
import { PickedContact } from '../../services/contactsService';
import { theme } from '../../utils/theme';
import { Avatar } from '../../components/Avatar';

const CATEGORIES = [
  { id: 'Trip', label: 'Trip', icon: Receipt },
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Office', label: 'Office', icon: Briefcase },
  { id: 'Party', label: 'Party', icon: PartyPopper },
  { id: 'Others', label: 'Others', icon: MoreHorizontal },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];

type Props = NativeStackScreenProps<RootStackParamList, 'CreateGroup'>;

export const CreateGroupScreen = ({ navigation }: Props) => {
  const { currentUser, friends, createGroup, addFriend } = useAppContext();
  const [groupName, setGroupName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<any>('Trip');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarUri, setAvatarUri] = useState<string>('https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80');
  const [selectedMembers, setSelectedMembers] = useState<PickedContact[]>([]);
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);

  const handlePickImage = () => {
    launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    }, (response) => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          setAvatarUri(uri);
        }
      }
    });
  };

  const handleAddContact = (contact: PickedContact) => {
    if (!selectedMembers.find(m => m.id === contact.id)) {
      setSelectedMembers(prev => [...prev, contact]);
    }
  };

  const toggleMember = (member: PickedContact) => {
    setSelectedMembers(prev => 
      prev.find(m => m.id === member.id) 
        ? prev.filter(m => m.id !== member.id)
        : [...prev, member]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    // Persist any newly added contacts to the global friends list
    selectedMembers.forEach(member => {
      const exists = friends.some(f => f.id === member.id);
      if (!exists) {
        addFriend({
          id: member.id,
          name: member.name,
          email: member.phoneOrEmail || `${member.name.toLowerCase().replace(/\s/g, '.')}@example.com`,
          avatarUrl: member.avatarUrl,
          defaultCurrency: selectedCurrency,
        });
      }
    });

    const memberIds = [currentUser.id, ...selectedMembers.map(m => m.id)];
    
    createGroup({
      id: Math.random().toString(36).substr(2, 9),
      name: groupName,
      category: selectedCategory,
      currency: selectedCurrency,
      members: memberIds,
      createdAt: new Date().toISOString(),
    });

    navigation.goBack();
  };

  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedMembers.find(m => m.id === f.id)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft color={theme.colors.primary} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Group</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: avatarUri }} 
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editBadge} activeOpacity={0.8} onPress={handlePickImage}>
                <Pencil color={theme.colors.white} size={12} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Group Name Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>GROUP NAME</Text>
            <TextInput
              style={styles.nameInput}
              placeholder="Enter group name"
              placeholderTextColor={theme.colors.outlineVariant}
              value={groupName}
              onChangeText={setGroupName}
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Category Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>SELECT CATEGORY</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity 
                    key={cat.id} 
                    style={styles.categoryItem}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.categoryIconContainer,
                      isSelected && styles.categoryIconContainerSelected
                    ]}>
                      <Icon 
                        color={isSelected ? theme.colors.white : theme.colors.outline} 
                        size={20} 
                      />
                    </View>
                    <Text style={[
                      styles.categoryLabel,
                      isSelected && styles.categoryLabelSelected
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Currency Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>CURRENCY</Text>
            <TouchableOpacity
              style={styles.currencyRow}
              onPress={() => setIsCurrencyModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.currencyIconBg}>
                <DollarSign color={theme.colors.primary} size={18} />
              </View>
              <Text style={styles.currencyValue}>{selectedCurrency}</Text>
              <ChevronRight color={theme.colors.outline} size={18} />
            </TouchableOpacity>
          </View>

          {/* Members Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>MEMBERS</Text>

            {/* Selected Members Strip */}
            {selectedMembers.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectedMembersScroll}
              >
                {selectedMembers.map((member) => (
                  <View key={member.id} style={styles.selectedMemberChip}>
                    <Avatar uri={member.avatarUrl} style={styles.selectedMemberAvatar} />
                    <Text style={styles.selectedMemberName} numberOfLines={1}>
                      {member.name.split(' ')[0]}
                    </Text>
                    <TouchableOpacity 
                      style={styles.removeMemberButton}
                      onPress={() => toggleMember(member)}
                    >
                      <X color={theme.colors.white} size={10} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
            
            <View style={styles.searchContainer}>
              <Search color={theme.colors.outline} size={20} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for friends..."
                placeholderTextColor={theme.colors.outline}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <TouchableOpacity 
              style={styles.addContactRow} 
              activeOpacity={0.7} 
              onPress={() => setIsContactModalVisible(true)}
            >
              <View style={styles.addContactIconBg}>
                <UserPlus color={theme.colors.white} size={20} />
              </View>
              <Text style={styles.addContactText}>Add new contact</Text>
              <ChevronRight color={theme.colors.primary} size={20} />
            </TouchableOpacity>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentFriendsScroll}
            >
              {filteredFriends.slice(0, 5).map((friend) => {
                const isSelected = selectedMembers.some(m => m.id === friend.id);
                return (
                  <TouchableOpacity 
                    key={friend.id} 
                    style={[
                      styles.recentFriendCard,
                      isSelected && styles.recentFriendCardSelected
                    ]}
                    onPress={() => toggleMember({ id: friend.id, name: friend.name, avatarUrl: friend.avatarUrl })}
                    activeOpacity={0.8}
                  >
                    <Avatar uri={friend.avatarUrl} style={styles.recentFriendAvatar} />
                    <View style={styles.recentFriendInfo}>
                      <Text style={[
                        styles.recentFriendName,
                        isSelected && styles.recentFriendNameSelected
                      ]}>
                        {friend.name}
                      </Text>
                      <Text style={styles.recentFriendSub}>Recently shared</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Bottom Padding for floating button */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.createButton, !groupName.trim() && styles.createButtonDisabled]} 
            activeOpacity={0.8}
            onPress={handleCreateGroup}
            disabled={!groupName.trim()}
          >
            <Text style={styles.createButtonText}>Create Group</Text>
            <ArrowRight color={theme.colors.white} size={20} />
          </TouchableOpacity>
        </View>

        <ContactPickerModal
          isVisible={isContactModalVisible}
          onClose={() => setIsContactModalVisible(false)}
          onSelect={handleAddContact}
        />

        <BottomPickerModal
          visible={isCurrencyModalVisible}
          title="Select Currency"
          selectedValue={selectedCurrency}
          options={CURRENCIES.map(cur => ({ label: cur, value: cur }))}
          onSelect={setSelectedCurrency}
          onClose={() => setIsCurrencyModalVisible(false)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
  container: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  headerRight: {
    width: 40,
  },

  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },

  // Sections
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.outline,
    marginBottom: theme.spacing.md,
  },

  // Group Name Input
  nameInput: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.onSurface,
    paddingVertical: theme.spacing.sm,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: theme.colors.surfaceContainerHighest,
    marginTop: 4,
  },

  // Categories
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  categoryIconContainerSelected: {
    backgroundColor: theme.colors.primary,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.outline,
  },
  categoryLabelSelected: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  // Currency
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: theme.borderRadius.xxl,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  currencyIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },

  // Members
  selectedMembersScroll: {
    gap: 12,
    marginBottom: theme.spacing.md,
  },
  selectedMemberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: 6,
    paddingRight: 12,
    borderRadius: 24,
    ...theme.shadows.small,
  },
  selectedMemberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  selectedMemberAvatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMemberInitials: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  selectedMemberName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurface,
    maxWidth: 80,
  },
  removeMemberButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 24,
    paddingHorizontal: theme.spacing.md,
    height: 48,
    marginBottom: theme.spacing.lg,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.onSurface,
  },

  addContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  addContactIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  addContactText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  recentFriendsScroll: {
    gap: 12,
  },
  recentFriendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    padding: theme.spacing.sm,
    paddingRight: theme.spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  recentFriendCardSelected: {
    backgroundColor: theme.colors.primaryFixed,
    borderColor: theme.colors.primary,
  },
  recentFriendAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  recentFriendInfo: {
    justifyContent: 'center',
  },
  recentFriendName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  recentFriendNameSelected: {
    color: theme.colors.primary,
  },
  recentFriendSub: {
    fontSize: 10,
    color: theme.colors.outline,
    marginTop: 2,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 0 : theme.spacing.lg,
    paddingTop: theme.spacing.md,
    backgroundColor: 'transparent',
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: theme.colors.outlineVariant,
  },
  createButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 100,
  },
});
