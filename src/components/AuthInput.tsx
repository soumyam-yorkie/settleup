import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ViewStyle,
  TextInputProps
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../utils/theme';

interface AuthInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
}

export const AuthInput = ({ 
  label, 
  isPassword, 
  error, 
  containerStyle, 
  ...props 
}: AuthInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[
        styles.label, 
        isFocused && styles.labelFocused,
        error ? { color: theme.colors.error } : {}
      ]}>
        {label.toUpperCase()}
      </Text>
      
      <View style={[
        styles.inputWrapper,
        isFocused && styles.wrapperFocused,
        error ? styles.wrapperError : {}
      ]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.outlineVariant}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.outline} />
            ) : (
              <Eye size={20} color={theme.colors.outline} />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.outline,
    letterSpacing: 1,
    marginBottom: 8,
  },
  labelFocused: {
    color: theme.colors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderColor: theme.colors.surfaceContainerHigh,
    paddingVertical: 8,
  },
  wrapperFocused: {
    borderColor: theme.colors.primary,
  },
  wrapperError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    padding: 0,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 11,
    color: theme.colors.error,
    marginTop: 4,
    fontWeight: '600',
  },
});
