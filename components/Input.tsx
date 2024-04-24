import { useState } from 'react';
import { StyleSheet, View, Keyboard, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Text, TextInputProps, Tooltip } from 'react-native-paper';
import { useAppTheme, IStyles } from 'theme/theme';
import InfoIcon from 'assets/icons/Info';

interface IInput extends Omit<TextInputProps, 'error'> {
  settings?: any;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  outlineColor?: string;
  textColor?: string;
  focusColor?: string;
  bgColor?: string;
  labelText?: string;
  error?: string;
  onSubmitEditing?: () => void;
  dismissOnBlur?: boolean;
}
const Input = ({
  settings,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  outlineColor,
  focusColor,
  textColor,
  bgColor,
  labelText,
  error,
  onSubmitEditing,
  dismissOnBlur = true,
  ...rest
}: IInput) => {
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors }, bgColor);

  const [secureTextEntry, setSecureTextEntry] = useState(
    settings?.secureTextEntry || false,
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      keyboardShouldPersistTaps={'handled'}
    >
      {labelText && <Text style={{ ...text.regular, ...styles.label }}>{labelText}</Text>}
      <TextInput
        disabled={settings?.disabled || false}
        keyboardType={settings?.keyboardType || 'default'}
        secureTextEntry={secureTextEntry}
        right={
          settings?.secureTextEntry ? (
            <TextInput.Icon
              icon="eye"
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          ) : null
        }
        autoCapitalize={settings?.autoCapitalize}
        value={value === 'undefined' ? '' : value || ''}
        onBlur={() => (dismissOnBlur ? Keyboard.dismiss() : null)}
        onChangeText={onChangeText}
        mode="outlined"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || colors.placeholder}
        style={styles.input}
        theme={{
          roundness: 15,
          colors: {
            error: colors.danger,
            primary: colors.primary || colors.white,
          },
        }}
        outlineColor={outlineColor || colors.grey}
        textColor={rest.disabled ? colors.grey : textColor || colors.black}
        onSubmitEditing={onSubmitEditing}
        error={!!error}
        {...rest}
      />
      {!!settings?.tooltip && (
        <View style={styles.rightIcon}>
          <Tooltip title={settings.tooltip} enterTouchDelay={0}>
            <TouchableOpacity>
              <InfoIcon />
            </TouchableOpacity>
          </Tooltip>
        </View>
      )}
      {error && <Text style={{ color: colors.danger }}>{error}</Text>}
    </ScrollView>
  );
};

export default Input;

const createStyles = ({ colors }: IStyles, bgColor?: string) => {
  return StyleSheet.create({
    container: {
      width: '100%',
      // marginBottom: 16,
    },
    label: {
      fontSize: 14,
      marginBottom: 4,
    },
    input: {
      fontFamily: 'MontserratMedium',
      height: 50,
      width: '100%',
      borderRadius: 14,
      backgroundColor: colors.white,
      justifyContent: 'center',
    },
    rightIcon: {
      position: 'absolute',
      right: 24,
      bottom: 15,
      // height: '100%',
      justifyContent: 'center',
    },
  });
};
