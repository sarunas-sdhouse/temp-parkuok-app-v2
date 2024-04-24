import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { useAppTheme } from 'theme/theme';
import { Platform, Text } from 'react-native';

type ButtonProps = {
  styles?: any;
  title: string;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  buttonColor?: string;
  outlineColor?: string;
  textColor?: string;
  fontSize?: number;
  onPress: () => void;
  disabled?: boolean;
  lineHeight?: number;
};

const Button: React.FC<ButtonProps> = ({
  styles,
  title,
  mode,
  buttonColor,
  outlineColor,
  textColor,
  fontSize,
  onPress,
  disabled,
  lineHeight
}) => {
  const { colors } = useAppTheme();

  return (
    <PaperButton
      disabled={disabled || false}
      style={{
        borderColor: outlineColor || colors.white,
        width: '100%',
        borderRadius: 14,
        height: 50,
        justifyContent: 'center',
        ...styles,
      }}
      mode={mode || 'contained'}
      onPress={onPress}
      labelStyle={{
        fontFamily: 'MontserratBold',
        lineHeight: lineHeight ? lineHeight : (fontSize || 16) + 7,
      }}
      buttonColor={
        buttonColor ? buttonColor : mode === 'outlined' ? colors.white : colors.primary
      }
      textColor={
        textColor ? textColor : mode === 'outlined' ? colors.primary : colors.white
      }
    >
      <Text
        style={{
          fontSize: fontSize || 16,
        }}
      >
        {title}
      </Text>
    </PaperButton>
  );
};

export default Button;
