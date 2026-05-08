import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Switch,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Pencil, 
  Bell, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Shield, 
  ChevronRight, 
  LogOut,
  MoreVertical,
  ArrowLeft,
  MapPin,
  Award,
  ChevronDown
} from 'lucide-react-native';

import { BottomPickerModal } from '../../components/BottomPickerModal';
import { MOCK_USER } from '../../services/mockData';
import { theme } from '../../utils/theme';

interface SettingItemProps {
  icon: any;
  label: string;
  subtext?: string;
  type?: 'toggle' | 'navigate';
  value?: boolean;
  onValueChange?: (val: boolean) => void;
  onPress?: () => void;
  statusText?: string;
  statusColor?: string;
}

const SettingItem = ({ 
  icon: Icon, 
  label, 
  subtext, 
  type = 'navigate', 
  value, 
  onValueChange, 
  onPress,
  statusText,
  statusColor
}: SettingItemProps) => (
  <TouchableOpacity 
    style={styles.settingItem} 
    onPress={onPress} 
    disabled={type === 'toggle'}
    activeOpacity={0.7}
  >
    <View style={styles.settingIconContainer}>
      <Icon size={20} color={theme.colors.primary} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingLabel}>{label}</Text>
      {subtext && <Text style={styles.settingSubtext}>{subtext}</Text>}
    </View>
    {type === 'toggle' ? (
      <Switch 
        value={value} 
        onValueChange={onValueChange}
        trackColor={{ false: theme.colors.surfaceContainerHighest, true: theme.colors.primary }}
        thumbColor={theme.colors.white}
      />
    ) : (
      <View style={styles.settingRight}>
        {statusText && (
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, statusColor ? { color: statusColor } : {}]}>
              {statusText}
            </Text>
            {statusText === 'HIGH' && <View style={styles.statusDot} />}
          </View>
        )}
        <ChevronRight size={18} color={theme.colors.outlineVariant} />
      </View>
    )}
  </TouchableOpacity>
);

export const ProfileScreen = ({ navigation }: any) => {
  const [expenseAlerts, setExpenseAlerts] = useState(true);
  const [reminders, setReminders] = useState(false);
  const [currency, setCurrency] = useState('USD');

  // Modal States
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isSecurityModalVisible, setIsSecurityModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerButton}>
          <ArrowLeft size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MoreVertical size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Info */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: MOCK_USER.avatarUrl }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editBadge}>
              <Pencil size={14} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{MOCK_USER.name} Vance</Text>
          <Text style={styles.userEmail}>eleanor.vance@atelier-finance.com</Text>
          
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Award size={14} color={theme.colors.primary} />
              <Text style={styles.badgeText}>PREMIUM MEMBER</Text>
            </View>
            <View style={[styles.badge, styles.grayBadge]}>
              <MapPin size={14} color={theme.colors.outline} />
              <Text style={[styles.badgeText, styles.grayBadgeText]}>LONDON, UK</Text>
            </View>
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <TouchableOpacity>
            <Text style={styles.sectionAction}>PREFERENCES</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingsCard}>
          <SettingItem 
            icon={Bell}
            label="Expense Added"
            subtext="Real-time alerts for all new transactions"
            type="toggle"
            value={expenseAlerts}
            onValueChange={setExpenseAlerts}
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={Calendar}
            label="Reminders"
            subtext="Daily digest of upcoming bill settlements"
            type="toggle"
            value={reminders}
            onValueChange={setReminders}
          />
        </View>

        {/* Account Preferences */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Preferences</Text>
          <TouchableOpacity>
            <ChevronDown size={20} color={theme.colors.outline} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsCard}>
          <SettingItem 
            icon={DollarSign}
            label="Currency Settings"
            subtext={`${currency} - ${currency === 'USD' ? 'US DOLLAR' : currency === 'EUR' ? 'EURO' : 'BRITISH POUND'}`}
            onPress={() => setIsCurrencyModalVisible(true)}
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={CreditCard}
            label="Payment Methods"
            subtext="3 CARDS CONNECTED TO ATELIER"
            onPress={() => setIsPaymentModalVisible(true)}
          />
          <View style={styles.divider} />
          <SettingItem 
            icon={Shield}
            label="Security"
            statusText="HIGH"
            statusColor={theme.colors.success}
            onPress={() => setIsSecurityModalVisible(true)}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={theme.colors.danger} />
          <Text style={styles.logoutText}>Logout from Eleanor's Device</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Modals */}
      <BottomPickerModal
        visible={isCurrencyModalVisible}
        title="Select Currency"
        options={[
          { label: 'USD - US Dollar', value: 'USD' },
          { label: 'EUR - Euro', value: 'EUR' },
          { label: 'GBP - British Pound', value: 'GBP' },
        ]}
        selectedValue={currency}
        onSelect={setCurrency}
        onClose={() => setIsCurrencyModalVisible(false)}
      />

      <BottomPickerModal
        visible={isPaymentModalVisible}
        title="Payment Methods"
        options={[
          { label: 'Visa ending in 4242 (Default)', value: 'visa' },
          { label: 'MasterCard ending in 8888', value: 'master' },
          { label: 'Apple Pay', value: 'apple' },
          { label: '+ Add New Card', value: 'add' },
        ]}
        selectedValue="visa"
        onSelect={() => {}}
        onClose={() => setIsPaymentModalVisible(false)}
      />

      <BottomPickerModal
        visible={isSecurityModalVisible}
        title="Security Center"
        options={[
          { label: 'Biometric Authentication (Enabled)', value: 'bio' },
          { label: 'Two-Factor Auth (Enabled)', value: '2fa' },
          { label: 'Change App PIN', value: 'pin' },
          { label: 'Recent Login Activity', value: 'activity' },
        ]}
        selectedValue="bio"
        onSelect={() => {}}
        onClose={() => setIsSecurityModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 36, // Squircle-like
  },
  editBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.outline,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  grayBadge: {
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  grayBadgeText: {
    color: theme.colors.outline,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  sectionAction: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  settingsCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...theme.shadows.small,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  settingSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.outline,
    marginTop: 2,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.outline,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceContainerLow,
    marginLeft: 60,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.colors.danger}05`,
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.danger,
  },
});
