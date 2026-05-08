import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Plus, Receipt, Users, UserPlus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { theme } from '../utils/theme';

export const AddExpenseFAB = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const handleNavigate = (route: keyof RootStackParamList) => {
    toggleMenu();
    // Use type assertion to silence the TS error since we are dealing with optional params
    navigation.navigate(route as any);
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const getOptionStyle = (index: number) => ({
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -72 - (index * 60)],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      }
    ],
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View 
        style={[styles.optionContainer, getOptionStyle(2)]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <View style={styles.optionLabelWrapper} pointerEvents="none">
          <Text style={styles.optionLabel}>Add Friend</Text>
        </View>
        <TouchableOpacity style={styles.optionButton} activeOpacity={0.8} onPress={() => handleNavigate('AddFriend')}>
          <UserPlus color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View 
        style={[styles.optionContainer, getOptionStyle(1)]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <View style={styles.optionLabelWrapper} pointerEvents="none">
          <Text style={styles.optionLabel}>Create Group</Text>
        </View>
        <TouchableOpacity style={styles.optionButton} activeOpacity={0.8} onPress={() => handleNavigate('CreateGroup')}>
          <Users color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View 
        style={[styles.optionContainer, getOptionStyle(0)]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <View style={styles.optionLabelWrapper} pointerEvents="none">
          <Text style={styles.optionLabel}>Add Expense</Text>
        </View>
        <TouchableOpacity style={styles.optionButton} activeOpacity={0.8} onPress={() => handleNavigate('AddExpense')}>
          <Receipt color={theme.colors.primary} size={20} />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.fab} onPress={toggleMenu} activeOpacity={0.85}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Plus color={theme.colors.white} size={28} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 110,
    right: 24,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 999,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.fab,
    zIndex: 10,
  },
  optionContainer: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  optionLabelWrapper: {
    position: 'absolute',
    right: 60, // 48px button + 12px gap
    width: 200,
    alignItems: 'flex-end',
  },
  optionLabel: {
    backgroundColor: theme.colors.white,
    color: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '700',
    ...theme.shadows.small,
  },
  optionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
});

