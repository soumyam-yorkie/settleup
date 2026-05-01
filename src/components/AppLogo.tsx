import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Wallet } from 'lucide-react-native';
import { theme } from '../utils/theme';

interface AppLogoProps {
  size?: number;
  showText?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppLogo = ({ 
  size = 52, 
  showText = true, 
  containerStyle,
  textStyle 
}: AppLogoProps) => {
  const iconSize = size * 0.45;
  const borderRadius = size * 0.3;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={[
        styles.logoBox, 
        { width: size, height: size, borderRadius },
      ]}>
        <Wallet size={iconSize} color={theme.colors.white} />
      </View>
      {showText && (
        <Text style={[styles.logoText, textStyle]}>SettleUp</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  logoBox: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: -0.5,
    marginTop: 12,
  },
});
