import React from 'react';
import { View, Image, ImageStyle, StyleProp, StyleSheet } from 'react-native';
import { User, Users } from 'lucide-react-native';

import { theme } from '../utils/theme';

interface AvatarProps {
  uri?: string | null;
  style?: StyleProp<ImageStyle>;
  type?: 'user' | 'group';
  size?: number;
}

export const Avatar = ({ uri, style, type = 'user', size }: AvatarProps) => {
  const isImage = uri && uri.trim() !== '';
  
  if (isImage) {
    return (
      <Image 
        source={{ uri }} 
        style={style} 
      />
    );
  }

  // Fallback to Icon-based placeholder
  const Icon = type === 'group' ? Users : User;
  const flatStyle = (StyleSheet.flatten(style) || {}) as any;
  
  // Robust size calculation
  const getDimension = (dim: any, fallback: number) => {
    if (typeof dim === 'number') return dim;
    return fallback;
  };

  const width = size || getDimension(flatStyle.width, 40);
  
  // For percentage-based containers, we use a larger icon scale
  const iconSizeBase = (typeof flatStyle.width === 'string' && flatStyle.width.includes('%')) 
    ? 60 
    : width;

  return (
    <View style={[
      styles.placeholder, 
      style, // Apply original styles (width, height, etc.)
      !isImage && { justifyContent: 'center', alignItems: 'center' }
    ]}>
      <Icon 
        size={iconSizeBase * 0.5} 
        color="#64748B" // Slate 500 - Professional grey
        strokeWidth={1.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#F1F5F9', // Slate 100 - Clean light grey
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
