import React, { useState, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X,
  User,
  Users,
  Calendar as CalendarIcon,
  ChevronDown,
  AlertCircle
} from 'lucide-react-native';

import { Button } from '../../components/Button';
import { ToggleSelector } from '../../components/ToggleSelector';
import { ParticipantSelector } from '../../components/ParticipantSelector';
import { CategorySelector } from '../../components/CategorySelector';
import { MultiSelectFriendsModal } from '../../components/MultiSelectFriendsModal';
import { BottomPickerModal } from '../../components/BottomPickerModal';
import { CalendarModal } from '../../components/CalendarModal';
import { theme } from '../../utils/theme';
import { MOCK_USER, MOCK_FRIENDS, MOCK_GROUPS } from '../../services/mockData';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, 'AddExpense'>;

export const AddExpenseScreen = ({ navigation, route }: Props) => {
  const { groupId, friendId } = route.params || {};

  // Form State
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [payerType, setPayerType] = useState<'Me' | 'Friend'>('Me');
  const [actualPayerId, setActualPayerId] = useState(MOCK_USER.id);
  const [isWholeGroup, setIsWholeGroup] = useState(true);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<'Equal' | 'Custom'>('Equal');
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [dateOption, setDateOption] = useState('today');
  const [customDate, setCustomDate] = useState(new Date());

  // Modal Visibility
  const [isFriendModalVisible, setIsFriendModalVisible] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // Context Data
  const currentGroup = useMemo(() => 
    MOCK_GROUPS.find(g => g.id === groupId) || MOCK_GROUPS[0],
  [groupId]);

  const groupMembers = useMemo(() => {
    return currentGroup.members
      .map(id => MOCK_FRIENDS.find(f => f.id === id) || (id === MOCK_USER.id ? MOCK_USER : null))
      .filter((m): m is any => m !== null);
  }, [currentGroup]);

  const allFriends = useMemo(() => MOCK_FRIENDS, []);

  // Initial setup based on route params
  useEffect(() => {
    if (friendId) {
      setIsWholeGroup(false);
      setSelectedParticipants([friendId]);
    }
  }, [friendId]);

  const activeParticipants = useMemo(() => {
    if (isWholeGroup) return groupMembers;
    return groupMembers.filter(m => selectedParticipants.includes(m.id) || m.id === MOCK_USER.id);
  }, [isWholeGroup, selectedParticipants, groupMembers]);

  const totalCustomAmount = useMemo(() => {
    return Object.values(customAmounts).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  }, [customAmounts]);

  const isAmountBalanced = useMemo(() => {
    if (splitType === 'Equal') return true;
    const total = parseFloat(amount) || 0;
    return Math.abs(total - totalCustomAmount) < 0.01;
  }, [amount, totalCustomAmount, splitType]);

  const handlePayerTypeChange = (type: 'Me' | 'Friend') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPayerType(type);
    if (type === 'Me') {
      setActualPayerId(MOCK_USER.id);
    } else {
      const firstFriend = groupMembers.find(m => m.id !== MOCK_USER.id);
      if (firstFriend) setActualPayerId(firstFriend.id);
    }
  };

  const handleSplitTypeChange = (type: 'Equal' | 'Custom') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSplitType(type);
    if (type === 'Custom' && Object.keys(customAmounts).length === 0) {
      const total = parseFloat(amount) || 0;
      const count = activeParticipants.length;
      const equalPart = count > 0 ? (total / count).toFixed(2) : '0.00';
      const initial: Record<string, string> = {};
      activeParticipants.forEach(p => initial[p.id] = equalPart);
      setCustomAmounts(initial);
    }
  };

  const handleCustomAmountChange = (userId: string, val: string) => {
    setCustomAmounts(prev => ({ ...prev, [userId]: val }));
  };

  const handleToggleParticipant = (id: string) => {
    setIsWholeGroup(false);
    setSelectedParticipants(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleToggleWholeGroup = () => {
    setIsWholeGroup(true);
    setSelectedParticipants([]);
  };

  const handleAddParticipants = (ids: string[]) => {
    setIsWholeGroup(false);
    setSelectedParticipants(ids);
  };

  const handleDateOptionSelect = (option: string) => {
    if (option === 'other') {
      setIsCalendarVisible(true);
    } else {
      setDateOption(option);
    }
  };

  const handleCustomDateConfirm = (date: Date) => {
    setCustomDate(date);
    setDateOption('other');
  };

  const getDateLabel = () => {
    if (dateOption === 'today') return 'Today';
    if (dateOption === 'yesterday') return 'Yesterday';
    
    // Format: "Oct 28"
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[customDate.getMonth()]} ${customDate.getDate()}`;
  };

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Amount Section */}
        <View style={styles.amountCard}>
          <Text style={styles.sectionLabel}>AMOUNT</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={theme.colors.outlineVariant}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              autoFocus
            />
          </View>
          <View style={styles.amountUnderline} />
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.descriptionRow}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="What was it for?"
              placeholderTextColor={theme.colors.outline}
              value={description}
              onChangeText={setDescription}
            />
            <TouchableOpacity 
              style={styles.dateChip}
              onPress={() => setIsDateModalVisible(true)}
            >
              <CalendarIcon size={14} color={theme.colors.primary} />
              <Text style={styles.dateText}>{getDateLabel()}</Text>
              <ChevronDown size={14} color={theme.colors.outline} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardDivider} />
          <Text style={styles.innerLabel}>CATEGORY</Text>
          <CategorySelector selectedId={category} onSelect={setCategory} />
        </View>

        {/* Paid By Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PAID BY</Text>
          <ToggleSelector
            options={[
              { label: 'Me', value: 'Me', icon: <User /> },
              { label: 'Friend', value: 'Friend', icon: <Users /> },
            ]}
            selectedValue={payerType}
            onSelect={(val) => handlePayerTypeChange(val as 'Me' | 'Friend')}
            style={styles.payerToggle}
          />

          {payerType === 'Friend' && (
            <View style={styles.subSelectorContainer}>
              <Text style={styles.subSelectorLabel}>Select who paid:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.payerAvatars}>
                {groupMembers.filter(m => m.id !== MOCK_USER.id).map(member => {
                  const isActive = actualPayerId === member.id;
                  return (
                    <TouchableOpacity 
                      key={member.id} 
                      onPress={() => setActualPayerId(member.id)}
                      style={[styles.payerAvatarItem, isActive && styles.payerAvatarActive]}
                    >
                      <Image source={{ uri: member.avatarUrl }} style={styles.smallAvatar} />
                      <Text style={[styles.smallAvatarName, isActive && styles.activeText]}>
                        {member.name.split(' ')[0]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Split Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SPLIT TYPE</Text>
          <ToggleSelector
            variant="pill"
            options={[
              { label: 'Equal', value: 'Equal' },
              { label: 'Custom', value: 'Custom' },
            ]}
            selectedValue={splitType}
            onSelect={(val) => handleSplitTypeChange(val as 'Equal' | 'Custom')}
          />
        </View>

        {/* Split With Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>
              {splitType === 'Equal' ? 'SPLIT WITH' : 'CUSTOM SPLIT AMOUNTS'}
            </Text>
            <TouchableOpacity onPress={() => setIsFriendModalVisible(true)}>
              <Text style={styles.addMoreText}>+ Add more</Text>
            </TouchableOpacity>
          </View>

          {splitType === 'Equal' ? (
            <ParticipantSelector
              participants={groupMembers.filter(m => m.id !== MOCK_USER.id)}
              selectedIds={selectedParticipants}
              onToggle={handleToggleParticipant}
              isWholeGroup={isWholeGroup}
              onToggleWholeGroup={handleToggleWholeGroup}
            />
          ) : (
            <View style={styles.customSplitList}>
              {activeParticipants.map(participant => (
                <View key={participant.id} style={styles.customSplitRow}>
                  <View style={styles.participantInfo}>
                    {participant.avatarUrl ? (
                      <Image source={{ uri: participant.avatarUrl }} style={styles.miniAvatar} />
                    ) : (
                      <View style={styles.miniPlaceholder}>
                        <Text style={styles.miniPlaceholderText}>{participant.name[0]}</Text>
                      </View>
                    )}
                    <Text style={styles.participantName}>{participant.name}</Text>
                  </View>
                  <View style={styles.customInputContainer}>
                    <Text style={styles.miniCurrency}>$</Text>
                    <TextInput
                      style={styles.customAmountInput}
                      value={customAmounts[participant.id] || ''}
                      onChangeText={(val) => handleCustomAmountChange(participant.id, val)}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                    />
                  </View>
                </View>
              ))}

              <View style={[
                styles.balanceSummary,
                !isAmountBalanced && styles.balanceSummaryError
              ]}>
                <View style={styles.balanceInfo}>
                  <Text style={styles.balanceLabel}>Total Split:</Text>
                  <Text style={styles.balanceValue}>${totalCustomAmount.toFixed(2)}</Text>
                </View>
                {!isAmountBalanced && (
                  <View style={styles.errorRow}>
                    <AlertCircle size={14} color={theme.colors.error} />
                    <Text style={styles.errorText}>
                      Remaining: ${(parseFloat(amount || '0') - totalCustomAmount).toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Save Expense"
          onPress={handleSave}
          disabled={!amount || !description || !isAmountBalanced}
          size="lg"
          fullWidth
          variant="primary"
        />
      </View>

      {/* Modals */}
      <MultiSelectFriendsModal
        visible={isFriendModalVisible}
        friends={allFriends}
        selectedIds={selectedParticipants}
        onClose={() => setIsFriendModalVisible(false)}
        onConfirm={handleAddParticipants}
      />

      <BottomPickerModal
        visible={isDateModalVisible}
        title="Select Date"
        options={[
          { label: 'Today', value: 'today' },
          { label: 'Yesterday', value: 'yesterday' },
          { label: 'Choose custom date...', value: 'other' },
        ]}
        selectedValue={dateOption}
        onSelect={handleDateOptionSelect}
        onClose={() => setIsDateModalVisible(false)}
      />

      <CalendarModal
        visible={isCalendarVisible}
        initialDate={customDate}
        onClose={() => setIsCalendarVisible(false)}
        onSelect={handleCustomDateConfirm}
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
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  amountCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.outline,
    letterSpacing: 1,
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.primary,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '800',
    color: theme.colors.primary,
    flex: 1,
    padding: 0,
  },
  amountUnderline: {
    height: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
    opacity: 0.8,
  },
  detailsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    padding: 0,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
    marginVertical: 16,
  },
  innerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.outline,
    letterSpacing: 1,
    marginBottom: 10,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  payerToggle: {
    marginBottom: 12,
  },
  subSelectorContainer: {
    marginTop: 8,
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  subSelectorLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    marginBottom: 12,
  },
  payerAvatars: {
    flexDirection: 'row',
  },
  payerAvatarItem: {
    alignItems: 'center',
    marginRight: 20,
    opacity: 0.5,
  },
  payerAvatarActive: {
    opacity: 1,
  },
  smallAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeText: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  smallAvatarName: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  customSplitList: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  customSplitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerLow,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  miniPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPlaceholderText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
    borderRadius: 10,
    paddingHorizontal: 8,
    width: 100,
  },
  miniCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    marginRight: 4,
  },
  customAmountInput: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    flex: 1,
    paddingVertical: 6,
  },
  balanceSummary: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: theme.colors.surfaceContainerHigh,
  },
  balanceSummaryError: {
    borderTopColor: `${theme.colors.error}20`,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: `${theme.colors.error}10`,
    padding: 8,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.error,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceContainerHigh,
  },
});
