import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';

interface ButtonComponentProps {
  label: string;
  component: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  noClickAction?: boolean;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  label,
  component,
  onPress,
  style,
  noClickAction,
}) => {
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      disabled={noClickAction}
    >
      <Text style={styles.text}>{label}</Text>
      {component}
    </TouchableOpacity>
  );
};

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    button: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 22,
      height: 50,
      borderColor: colors.grey,
      borderWidth: 1,
      borderRadius: 15,
    },
    text: {
      ...text?.montseratRegular,
      fontSize: 14,
    },
  });
};

export default ButtonComponent;
