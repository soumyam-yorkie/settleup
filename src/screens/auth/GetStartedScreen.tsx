import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  FlatList,
  StatusBar,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Wallet, 
  Fingerprint, 
  LogIn, 
  BarChart3, 
  Scale, 
  FileText,
  CheckCircle2,
  Award
} from 'lucide-react-native';
import { AppLogo } from '../../components/AppLogo';
import { theme } from '../../utils/theme';
import { Button } from '../../components/Button';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.6; // Increased width for better presence
const ITEM_SPACING = 10;
const SNAP_INTERVAL = ITEM_WIDTH + ITEM_SPACING * 2;

const ONBOARDING_DATA = [
  {
    id: '1',
    feature: 'Track Shared Expenses',
    icon: BarChart3,
    iconBg: '#F0F2FF',
    iconColor: '#535CE8',
  },
  {
    id: '2',
    feature: 'Split Bills Fairly',
    icon: Scale,
    iconBg: '#E8FFF3',
    iconColor: '#27AE60',
  },
  {
    id: '3',
    feature: 'Settle Debts Instantly',
    icon: FileText,
    iconBg: '#FFF0F0',
    iconColor: '#EB5757',
  },
];

export const GetStartedScreen = ({ navigation }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / SNAP_INTERVAL);
    if (index !== activeIndex && index >= 0 && index < ONBOARDING_DATA.length) {
      setActiveIndex(index);
    }
  };

  const renderItem = ({ item }: any) => {
    const Icon = item.icon;
    return (
      <View style={styles.carouselItem}>
        <View style={styles.featureCard}>
          <View style={[styles.featureIconBox, { backgroundColor: item.iconBg }]}>
            <Icon size={22} color={item.iconColor} />
          </View>
          <Text style={styles.featureText}>{item.feature}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header Logo */}
        <AppLogo containerStyle={styles.header} />

        {/* Hero Graphic */}
        <View style={styles.graphicSection}>
          <View style={styles.mainGraphic}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80' }} 
              style={styles.graphicImage}
            />
            <View style={styles.floatingBadge}>
              <View style={styles.badgeIconBox}>
                <CheckCircle2 size={18} color={theme.colors.white} />
              </View>
              <View style={styles.badgeLine} />
              <View style={styles.badgeLineShort} />
            </View>
          </View>
        </View>

        {/* Main Title Area */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Simplify your{"\n"}finances</Text>
          <Text style={styles.subtitle}>Track. Split. Settle.</Text>
        </View>

        {/* Carousel Section */}
        <View style={styles.carouselSection}>
          <FlatList
            data={ONBOARDING_DATA}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onScroll={onScroll}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            snapToAlignment="center"
            contentContainerStyle={styles.carouselContent}
            scrollEventThrottle={16}
          />
          
          <View style={styles.pagination}>
            {ONBOARDING_DATA.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.dot, 
                  activeIndex === i && styles.activeDot
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Button 
            title="Get Started"
            onPress={() => navigation.navigate('Signup')}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.primaryBtn}
          />
          
          <View style={styles.secondaryRow}>
            <TouchableOpacity 
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate('Login')}
            >
              <LogIn size={18} color={theme.colors.onSurface} />
              <Text style={styles.secondaryBtnText}>Login</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryBtn}>
              <Fingerprint size={18} color={theme.colors.onSurface} />
              <Text style={styles.secondaryBtnText}>Biometrics</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>CONTINUE WITH</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/0/747.png' }} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <View style={styles.atelierIcon}>
                <Award size={20} color={theme.colors.primary} />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.legalText}>
            By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text>{"\n"}and acknowledge our <Text style={styles.link}>Privacy Policy</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', 
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBox: {
    backgroundColor: theme.colors.primary,
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...theme.shadows.medium,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  graphicSection: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  mainGraphic: {
    width: 200,
    height: 200,
    borderRadius: 40,
    backgroundColor: '#1E293B',
    overflow: 'visible',
    position: 'relative',
    ...theme.shadows.large,
  },
  graphicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    opacity: 0.6,
  },
  floatingBadge: {
    position: 'absolute',
    bottom: -10,
    right: -20,
    backgroundColor: '#7CFFAF', 
    width: 110,
    height: 110,
    borderRadius: 24,
    padding: 16,
    transform: [{ rotate: '-8deg' }],
    ...theme.shadows.medium,
    elevation: 8,
  },
  badgeIconBox: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeLine: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    marginBottom: 6,
    width: '80%',
  },
  badgeLineShort: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    width: '50%',
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.outline,
    marginTop: 12,
  },
  carouselSection: {
    height: 180,
    marginBottom: 40, // Increased gap above buttons
  },
  carouselContent: {
    paddingHorizontal: (width - ITEM_WIDTH) / 2 - ITEM_SPACING,
  },
  carouselItem: {
    width: ITEM_WIDTH,
    marginHorizontal: ITEM_SPACING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 24,
    borderRadius: 28,
    width: '100%',
    height: 120,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  featureIconBox: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.onSurface,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.outlineVariant,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
  },
  actionsSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  primaryBtn: {
    marginBottom: 16,
    ...theme.shadows.medium,
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: 18,
    borderRadius: 24,
    gap: 12,
    ...theme.shadows.small,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.onSurface,
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
    justifyContent: 'center',
    gap: 20,
    marginBottom: 32,
  },
  socialBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  socialIcon: {
    width: 22,
    height: 22,
  },
  atelierIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${theme.colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legalText: {
    fontSize: 11,
    textAlign: 'center',
    color: theme.colors.outline,
    lineHeight: 18,
  },
  link: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
});
