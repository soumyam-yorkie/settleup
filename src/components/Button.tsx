import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  View
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';

import { theme } from '../utils/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: theme.colors.surfaceContainerHigh };
      case 'outline':
        return { 
          backgroundColor: 'transparent', 
          borderWidth: 1.5, 
          borderColor: theme.colors.primary 
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'danger':
        return { backgroundColor: theme.colors.danger + '15' }; // Light red bg
      case 'primary':
      default:
        return { backgroundColor: theme.colors.primary };
    }
  };

  const getTextColor = (): string => {
    if (disabled) return theme.colors.outline;
    switch (variant) {
      case 'secondary':
        return theme.colors.onSurface;
      case 'outline':
        return theme.colors.primary;
      case 'ghost':
        return theme.colors.primary;
      case 'danger':
        return theme.colors.danger;
      case 'primary':
      default:
        return theme.colors.white;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 6, paddingHorizontal: 12, borderRadius: theme.borderRadius.md };
      case 'lg':
        return { paddingVertical: 14, paddingHorizontal: 24, borderRadius: theme.borderRadius.xl };
      case 'md':
      default:
        return { paddingVertical: 14, paddingHorizontal: 20, borderRadius: theme.borderRadius.round };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        style,
        (disabled || loading) && styles.disabled,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {LeftIcon && <LeftIcon size={size === 'sm' ? 16 : 20} color={getTextColor()} style={styles.leftIcon} />}
          <Text style={[
            styles.text, 
            { color: getTextColor() },
            size === 'sm' && styles.textSm,
            size === 'lg' && styles.textLg,
            textStyle
          ]}>
            {title}
          </Text>
          {RightIcon && <RightIcon size={size === 'sm' ? 16 : 20} color={getTextColor()} style={styles.rightIcon} />}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Manrope',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  textSm: {
    fontSize: 12,
  },
  textLg: {
    fontSize: 16,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
