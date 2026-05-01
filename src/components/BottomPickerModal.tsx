import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Check } from 'lucide-react-native';

import { theme } from '../utils/theme';

interface PickerOption<T extends string = string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

interface BottomPickerModalProps<T extends string = string> {
  visible: boolean;
  title: string;
  options: PickerOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  onClose: () => void;
}

export function BottomPickerModal<T extends string = string>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: BottomPickerModalProps<T>) {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('screen').height;
  const panY = React.useRef(new Animated.Value(screenHeight)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false, // Allow taps to pass through to FlatList items
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Capture the touch only if the user is swiping down with a threshold
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          // Dismiss
          Animated.parallel([
            Animated.timing(panY, {
              toValue: screenHeight,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(onClose);
        } else {
          // Reset
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  React.useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.spring(panY, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // For dismissal, the onClose is usually called after the pan gesture completes.
      // However, if visible is set to false externally:
      panY.setValue(screenHeight);
      overlayOpacity.setValue(0);
    }
  }, [visible, screenHeight]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(panY, {
        toValue: screenHeight,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  const handleSelect = (value: T) => {
    onSelect(value);
    handleClose();
  };

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={[styles.container, { height: screenHeight }]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY }] }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle bar area - explicitly for swiping */}
          <View style={styles.handleBarArea}>
            <View style={styles.handleBar} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Options */}
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
            renderItem={({ item, index }) => {
              const isSelected = item.value === selectedValue;
              const isLast = index === options.length - 1;

              return (
                <TouchableOpacity
                  style={[
                    styles.optionRow,
                    isSelected && styles.optionRowSelected,
                    !isLast && styles.optionRowBorder,
                  ]}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.6}
                >
                  {item.icon && <View style={styles.optionIcon}>{item.icon}</View>}
                  <Text style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}>
                    {item.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Check size={18} color={theme.colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </Animated.View>

        {/* Bottom Fill — Correctly sized for safe area and anchored to bottom */}
        <View 
          style={[
            styles.bottomFill, 
            { height: insets.bottom + 20 }
          ]} 
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.overlay, 
  },
  sheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 0, 
    maxHeight: '70%',
    zIndex: 2,
  },
  bottomFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    zIndex: 1,
  },
  handleBarArea: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'center',
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.outlineVariant,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 52,
  },
  optionRowSelected: {
    backgroundColor: theme.colors.primaryFixed,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceContainerLow,
  },
  optionIcon: {
    marginRight: theme.spacing.md,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  optionLabelSelected: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  checkIcon: {
    marginLeft: theme.spacing.sm,
  },
});
