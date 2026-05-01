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
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { AppLogo } from '../../components/AppLogo';
import { theme } from '../../utils/theme';
import { Button } from '../../components/Button';
import { AuthInput } from '../../components/AuthInput';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <ArrowLeft size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>SettleUp</Text>
          </View>

          {/* Main Content Area */}
          <View style={styles.content}>
            <AppLogo size={54} showText={false} containerStyle={styles.logoContainer} />
            
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Manage your group finances with{"\n"}editorial precision.
            </Text>

            <View style={styles.form}>
              <AuthInput 
                label="Email Address"
                placeholder="julianne@atelier.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <AuthInput 
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                isPassword
              />

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button 
                title="Login"
                rightIcon={ArrowRight}
                onPress={() => {}} 
                variant="primary"
                size="lg"
                fullWidth
                style={styles.loginBtn}
              />
            </View>

            {/* Footer Social */}
            <View style={styles.socialSection}>
              <View style={styles.dividerRow}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
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
                onPress={() => navigation.navigate('Signup')}
              >
                <Text style={styles.footerLinkText}>
                  Don't have an account? <Text style={styles.footerLinkHighlight}>Sign Up</Text>
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
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  content: {
    marginTop: 20,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: theme.colors.primary,
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.outline,
    lineHeight: 26,
    marginBottom: 40,
  },
  form: {
    marginBottom: 32,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  loginBtn: {
    borderRadius: 24,
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
    gap: 16,
    marginBottom: 40,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: 14,
    borderRadius: 18,
    gap: 10,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  socialIcon: {
    width: 18,
    height: 18,
  },
  socialBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  footerLink: {
    alignItems: 'center',
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
});
