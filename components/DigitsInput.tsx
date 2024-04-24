import React, { useRef, createRef, useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';

interface DigitsInputProps {
  length: number;
  style: any;
  onCompletion?: (value: string) => void;
}

const DigitsInput: React.FC<DigitsInputProps> = ({ length, style, onCompletion }) => {
  const { colors, text } = useAppTheme();
  const [values, setValues] = useState(Array(length).fill(''));
  const inputsRef = useRef(
    Array(length)
      .fill(0)
      .map(() => createRef<TextInput>()),
  );

  const focusNextInput = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    if (newValues.every(v => v !== '')) {
      onCompletion?.(newValues.join(''));
      setValues(Array(length).fill(''));
    } else if (newValues.join('') === '') {
      inputsRef.current[0].current?.focus();
    }
    if (index < length - 1 && value !== '') {
      inputsRef.current[index + 1].current?.focus();
    }
  };

  const handleBackspace = (index: number) => {
    if (index > 0) {
      inputsRef.current[index - 1].current?.focus();
    }
  };

  const handleFocus = (index: number) => {
    if (index > 0 && values[index - 1] === '') {
      inputsRef.current[index - 1].current?.focus();
    }
  };

  return (
    <View style={{ ...styles.container, ...style }}>
      {Array(length)
        .fill(0)
        .map((_, i) => (
          <View style={styles.inputWrapper} key={i}>
            <TextInput
              ref={inputsRef.current[i]}
              style={[styles.input, { borderColor: values[i] !== '' ? colors.primary : colors.grey }]}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={value => {
                if (i === 0 || values[i - 1] !== '') {
                  focusNextInput(i, value);
                }
              }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(i);
                }
              }}
              onFocus={() => handleFocus(i)}
              value={values[i]}
              selectionColor={colors.primary}
            />
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputWrapper: {
    marginHorizontal: 12,
  },
  input: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
});

export default DigitsInput;
