import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';

import {
  Pencil,
  UserPlus,
  Bell,
  Shuffle,
  SplitSquareHorizontal,
  LogOut,
  Trash2,
  Tag,
  DollarSign,
  ShieldCheck,
  X,
  Check,
  Plane,
  Home,
  Briefcase,
  PartyPopper,
  Layout,
} from 'lucide-react-native';

import { SettingsRow } from '../../components/SettingsRow';
import { BottomPickerModal } from '../../components/BottomPickerModal';
import { CustomModal } from '../../components/CustomModal';
import { Group } from '../../types/models';
import { MOCK_USER, MOCK_FRIENDS } from '../../services/mockData';
import { theme } from '../../utils/theme';

interface GroupSettingsTabProps {
  groupInfo: Group;
}

type GroupCategory = Group['category'];
const CATEGORIES: GroupCategory[] = ['Trip', 'Home', 'Office', 'Party', 'Others'];

const CATEGORY_ICONS: Record<GroupCategory, React.ReactNode> = {
  Trip: <Plane size={18} color={theme.colors.primary} />,
  Home: <Home size={18} color={theme.colors.primary} />,
  Office: <Briefcase size={18} color={theme.colors.primary} />,
  Party: <PartyPopper size={18} color={theme.colors.primary} />,
  Others: <Layout size={18} color={theme.colors.primary} />,
};

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'];

export const GroupSettingsTab = ({ groupInfo }: GroupSettingsTabProps) => {
  const [simplifyDebts, setSimplifyDebts] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Editable local state
  const [groupName, setGroupName] = useState(groupInfo.name);
  const [category, setCategory] = useState(groupInfo.category);
  const [currency, setCurrency] = useState(groupInfo.currency);

  // Modal states
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [draftName, setDraftName] = useState(groupName);

  const [removeMemberModalVisible, setRemoveMemberModalVisible] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string, name: string } | null>(null);

  const [leaveGroupModalVisible, setLeaveGroupModalVisible] = useState(false);
  const [deleteGroupModalVisible, setDeleteGroupModalVisible] = useState(false);

  // Picker states
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  const allMembers = groupInfo.members.map(id => {
    if (id === MOCK_USER.id) return { ...MOCK_USER, isAdmin: true };
    const friend = MOCK_FRIENDS.find(f => f.id === id);
    return friend ? { ...friend, isAdmin: false } : null;
  }).filter(Boolean) as (typeof MOCK_USER & { isAdmin: boolean })[];

  const handleEditName = () => {
    setDraftName(groupName);
    setNameModalVisible(true);
  };

  const handleSaveName = () => {
    if (draftName.trim()) {
      setGroupName(draftName.trim());
    }
    setNameModalVisible(false);
  };

  const handleEditCategory = () => {
    setCategoryModalVisible(true);
  };

  const handleEditCurrency = () => {
    setCurrencyModalVisible(true);
  };

  const handleRemoveMember = (member: { id: string, name: string }) => {
    setMemberToRemove(member);
    setRemoveMemberModalVisible(true);
  };

  const confirmRemoveMember = () => {
    // Logic to remove member
    setRemoveMemberModalVisible(false);
  };

  const handleLeaveGroup = () => {
    setLeaveGroupModalVisible(true);
  };

  const handleDeleteGroup = () => {
    setDeleteGroupModalVisible(true);
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* ── Section 1: Group Info ── */}
        <Text style={[styles.sectionLabel, styles.sectionLabelFirst]}>GROUP INFO</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon={<Pencil size={16} color={theme.colors.primary} />}
            label="Group Name"
            rightLabel={groupName}
            onPress={handleEditName}
          />
          <SettingsRow
            icon={<Tag size={16} color={theme.colors.primary} />}
            label="Category"
            rightLabel={category}
            onPress={handleEditCategory}
          />
          <SettingsRow
            icon={<DollarSign size={16} color={theme.colors.primary} />}
            label="Currency"
            rightLabel={currency}
            onPress={handleEditCurrency}
            isLast
          />
        </View>

        {/* ── Section 2: Members ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderLabel}>MEMBERS</Text>
          <TouchableOpacity style={styles.addMemberChip} onPress={() => {}}>
            <UserPlus size={12} color={theme.colors.primary} />
            <Text style={styles.addMemberText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsCard}>
          {allMembers.map((member, index) => (
            <View
              key={member.id}
              style={[styles.memberRow, index < allMembers.length - 1 && styles.memberRowBorder]}
            >
              <Image source={{ uri: member.avatarUrl ?? '' }} style={styles.memberAvatar} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>
                  {member.id === MOCK_USER.id ? 'You' : member.name}
                </Text>
                {member.isAdmin && (
                  <View style={styles.adminBadge}>
                    <ShieldCheck size={10} color={theme.colors.primary} />
                    <Text style={styles.adminText}>Admin</Text>
                  </View>
                )}
              </View>
              {!member.isAdmin && (
                <TouchableOpacity
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => handleRemoveMember({ id: member.id, name: member.name })}
                >
                  <Text style={styles.removeMember}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* ── Section 3: Preferences ── */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon={<Shuffle size={16} color={theme.colors.primary} />}
            label="Simplify Debts"
            description="Minimize the number of repayments"
            variant="toggle"
            value={simplifyDebts}
            onValueChange={setSimplifyDebts}
          />
          <SettingsRow
            icon={<SplitSquareHorizontal size={16} color={theme.colors.primary} />}
            label="Default Split"
            rightLabel="Equal"
            onPress={() => {}}
          />
          <SettingsRow
            icon={<Bell size={16} color={theme.colors.primary} />}
            label="Notifications"
            description="Get notified about new expenses"
            variant="toggle"
            value={notifications}
            onValueChange={setNotifications}
            isLast
          />
        </View>

        {/* ── Section 4: Danger Zone ── */}
        <Text style={styles.sectionLabel}>DANGER ZONE</Text>
        <View style={styles.settingsCard}>
          <SettingsRow
            icon={<LogOut size={16} color={theme.colors.danger} />}
            label="Leave Group"
            description="You can be re-added later"
            danger
            onPress={handleLeaveGroup}
          />
          <SettingsRow
            icon={<Trash2 size={16} color={theme.colors.danger} />}
            label="Delete Group"
            description="Permanently removes all data"
            danger
            onPress={handleDeleteGroup}
            isLast
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Modals ── */}

      {/* Edit Name Modal */}
      <CustomModal
        visible={nameModalVisible}
        title="Edit Group Name"
        onClose={() => setNameModalVisible(false)}
        onConfirm={handleSaveName}
        confirmLabel="Save"
      >
        <TextInput
          style={styles.modalInput}
          value={draftName}
          onChangeText={setDraftName}
          autoFocus
          placeholder="Enter group name"
          placeholderTextColor={theme.colors.outline}
          returnKeyType="done"
          onSubmitEditing={handleSaveName}
        />
      </CustomModal>

      {/* Remove Member Modal */}
      <CustomModal
        visible={removeMemberModalVisible}
        title="Remove Member"
        description={`Are you sure you want to remove ${memberToRemove?.name} from this group?`}
        onClose={() => setRemoveMemberModalVisible(false)}
        onConfirm={confirmRemoveMember}
        confirmLabel="Remove"
        isDanger
        confirmIcon={<Trash2 size={16} color={theme.colors.white} />}
      />

      {/* Leave Group Modal */}
      <CustomModal
        visible={leaveGroupModalVisible}
        title="Leave Group"
        description="Are you sure you want to leave this group? You can be re-added later by an admin."
        onClose={() => setLeaveGroupModalVisible(false)}
        onConfirm={() => setLeaveGroupModalVisible(false)}
        confirmLabel="Leave"
        isDanger
        confirmIcon={<LogOut size={16} color={theme.colors.white} />}
      />

      {/* Delete Group Modal */}
      <CustomModal
        visible={deleteGroupModalVisible}
        title="Delete Group"
        description="This will permanently delete the group and all its expenses. This action cannot be undone."
        onClose={() => setDeleteGroupModalVisible(false)}
        onConfirm={() => setDeleteGroupModalVisible(false)}
        confirmLabel="Delete"
        isDanger
        confirmIcon={<Trash2 size={16} color={theme.colors.white} />}
      />

      {/* ── Category Picker ── */}
      <BottomPickerModal<GroupCategory>
        visible={categoryModalVisible}
        title="Select Category"
        selectedValue={category}
        options={CATEGORIES.map(cat => ({ 
          label: cat, 
          value: cat,
          icon: CATEGORY_ICONS[cat]
        }))}
        onSelect={setCategory}
        onClose={() => setCategoryModalVisible(false)}
      />

      {/* ── Currency Picker ── */}
      <BottomPickerModal
        visible={currencyModalVisible}
        title="Select Currency"
        selectedValue={currency}
        options={CURRENCIES.map(cur => ({ label: cur, value: cur }))}
        onSelect={setCurrency}
        onClose={() => setCurrencyModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
  },

  // Section labels
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 1.2,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  sectionLabelFirst: {
    marginTop: 0,
  },

  // Members section header — label + Add chip on same line
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.outline,
    letterSpacing: 1.2,
  },
  addMemberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.primaryFixed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.round,
  },
  addMemberText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  // Shared card wrapper
  settingsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },

  // Member rows
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 56,
  },
  memberRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerLow,
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.md,
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.primaryFixed,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.round,
  },
  adminText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  removeMember: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.danger,
  },

  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: 14,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: theme.colors.onSurface,
    backgroundColor: theme.colors.surfaceContainerLowest,
  },
});
