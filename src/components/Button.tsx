import React from 'react';
import { 
  Pressable, 
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
  title?: string;
  children?: React.ReactNode;
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

const VARIANT_STYLES: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: theme.colors.primary },
  secondary: { backgroundColor: theme.colors.surfaceContainerHigh },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: `${theme.colors.danger}15` },
};

const TEXT_COLORS: Record<ButtonVariant, string> = {
  primary: theme.colors.white,
  secondary: theme.colors.onSurface,
  outline: theme.colors.primary,
  ghost: theme.colors.primary,
  danger: theme.colors.danger,
};

const SIZE_STYLES: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: theme.borderRadius.md },
  md: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: theme.borderRadius.round },
  lg: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: theme.borderRadius.xl },
};

const ICON_SIZES: Record<ButtonSize, number> = {
  sm: 16,
  md: 20,
  lg: 20,
};

export const Button = ({
  onPress,
  title,
  children,
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
  const variantStyle = VARIANT_STYLES[variant];
  const textColor = disabled ? theme.colors.outline : TEXT_COLORS[variant];
  const sizeStyle = SIZE_STYLES[size];
  const iconSize = ICON_SIZES[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        sizeStyle,
        fullWidth && { alignSelf: 'stretch' },
        disabled && styles.disabled,
        pressed && { opacity: 0.7 },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {LeftIcon && (
            <LeftIcon 
              size={iconSize} 
              color={textColor} 
              style={(title || children) ? styles.leftIcon : undefined} 
            />
          )}
          {children ?? (
            <Text style={[
              styles.text, 
              { color: textColor },
              size === 'sm' && styles.textSm,
              size === 'lg' && styles.textLg,
              textStyle
            ]}>
              {title}
            </Text>
          )}
          {RightIcon && (
            <RightIcon 
              size={iconSize} 
              color={textColor} 
              style={(title || children) ? styles.rightIcon : undefined} 
            />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.typography?.fontFamily?.bold ?? 'System',
    fontWeight: theme.typography?.weight?.bold ?? '700',
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
