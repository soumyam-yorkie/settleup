import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import { theme } from '../utils/theme';

interface GradientCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  colors?: string[];
  padding?: number;
}

export const GradientCard = ({ 
  children, 
  style, 
  colors = [theme.colors.primary, theme.colors.primaryContainer],
  padding = theme.spacing.xl 
}: GradientCardProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={colors[0]} stopOpacity="1" />
              <Stop offset="1" stopColor={colors[1]} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grad)" />
        </Svg>
      </View>
      <View style={{ padding }}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xxxl,
    overflow: 'hidden',
    ...theme.shadows.large,
  },
});
