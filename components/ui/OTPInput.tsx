import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Keyboard,
} from 'react-native';

interface OTPInputProps {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
  onComplete?: (code: string) => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  focusedInputStyle?: TextStyle;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChangeText,
  onComplete,
  containerStyle,
  inputStyle,
  focusedInputStyle,
  autoFocus = true,
  secureTextEntry = false,
}) => {
  const [focusedIndex, setFocusedIndex] = useState(autoFocus ? 0 : -1);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Handle completion
  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChangeText = (text: string, index: number) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    
    if (numericText.length > 1) {
      // Handle paste operation
      const pastedCode = numericText.slice(0, length);
      onChangeText(pastedCode);
      
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(pastedCode.length, length - 1);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
      return;
    }

    // Handle single character input
    const newValue = value.split('');
    newValue[index] = numericText;
    const newCode = newValue.join('').slice(0, length);
    
    onChangeText(newCode);

    // Auto-focus next input
    if (numericText && index < length - 1) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move to previous input if current is empty
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        // Clear current input
        const newValue = value.split('');
        newValue[index] = '';
        onChangeText(newValue.join(''));
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const renderInput = (index: number) => {
    const isFocused = focusedIndex === index;
    const hasValue = !!value[index];

    return (
      <TextInput
        key={index}
        ref={(ref) => (inputRefs.current[index] = ref)}
        style={[
          styles.input,
          inputStyle,
          isFocused && styles.focusedInput,
          isFocused && focusedInputStyle,
          hasValue && styles.filledInput,
        ]}
        value={value[index] || ''}
        onChangeText={(text) => handleChangeText(text, index)}
        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
        onFocus={() => handleFocus(index)}
        onBlur={handleBlur}
        keyboardType="numeric"
        maxLength={1}
        selectTextOnFocus
        secureTextEntry={secureTextEntry}
        textAlign="center"
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
      />
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length }, (_, index) => renderInput(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    fontSize: 24,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  focusedInput: {
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
  },
  filledInput: {
    borderColor: '#34C759',
    backgroundColor: '#FFFFFF',
  },
});
