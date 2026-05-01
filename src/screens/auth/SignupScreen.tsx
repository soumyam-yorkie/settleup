import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react-native';
import { theme } from '../../utils/theme';
import { Button } from '../../components/Button';
import { AuthInput } from '../../components/AuthInput';

const { width } = Dimensions.get('window');

export const SignupScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SettleUp</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Main Floating Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Join SettleUp</Text>
            <Text style={styles.subtitle}>Create your account to start settling.</Text>

            <View style={styles.form}>
              <AuthInput 
                label="FULL NAME"
                placeholder="Julianne Moore"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#E2E8F0"
              />
              
              <AuthInput 
                label="EMAIL ADDRESS"
                placeholder="julianne@atelier.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#E2E8F0"
              />
              
              <AuthInput 
                label="PASSWORD"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                isPassword
                placeholderTextColor="#E2E8F0"
              />

              <View style={styles.agreeRow}>
                <TouchableOpacity 
                  style={[styles.checkbox, agree && styles.checkboxChecked]}
                  onPress={() => setAgree(!agree)}
                />
                <Text style={styles.agreeText}>
                  I agree to the <Text style={styles.link}>Terms of Service</Text> and{"\n"}
                  <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
              </View>

              <Button 
                title="Create Account"
                onPress={() => {}} 
                variant="primary"
                size="lg"
                fullWidth
                style={styles.createBtn}
              />
            </View>

            {/* Social */}
            <View style={styles.socialSection}>
              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>OR JOIN WITH</Text>
                <View style={styles.line} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} style={styles.socialIcon} />
                  <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }} style={styles.socialIcon} />
                  <Text style={styles.socialBtnText}>Apple</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.footerLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.footerLinkText}>
                  Already have an account? <Text style={styles.footerLinkHighlight}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.primary,
    marginLeft: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 140, // Space for floating bottom tabs
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 40,
    paddingHorizontal: 28,
    paddingVertical: 40,
    ...theme.shadows.large,
    shadowColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.colors.primary,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.outline,
    marginBottom: 40,
  },
  form: {
    marginBottom: 32,
  },
  agreeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    marginTop: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  agreeText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.outline,
    lineHeight: 20,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  createBtn: {
    borderRadius: 24,
    height: 60,
    ...theme.shadows.medium,
  },
  socialSection: {
    marginTop: 10,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.outline,
    marginHorizontal: 16,
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 22,
    gap: 8,
  },
  socialIcon: {
    width: 16,
    height: 16,
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  footerLink: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.outline,
  },
  footerLinkHighlight: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  bottomTabsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  bottomTabs: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 50,
    paddingRight: 12,
    paddingVertical: 10,
    borderRadius: 40,
    ...theme.shadows.medium,
    shadowOpacity: 0.1,
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.outline,
    letterSpacing: 0.5,
  },
  joinTabBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    gap: 10,
    ...theme.shadows.medium,
  },
  joinTabText: {
    fontSize: 13,
    fontWeight: '900',
    color: theme.colors.white,
    letterSpacing: 1,
  },
});
