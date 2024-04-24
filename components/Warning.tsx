import { Text, View, StyleSheet } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';

interface IWarning {
  warningText: string;
  danger?: boolean;
}

const Warning = ({ warningText, danger = false }: IWarning) => {
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text, danger });

  return (
    <View style={styles.warning}>
      <Text style={styles.warning__text}>{warningText}</Text>
    </View>
  );
};

export default Warning;

interface IExtendedStyles extends IStyles {
  danger: boolean;
}

const createStyles = ({ colors, text, danger }: IExtendedStyles) => {
  return StyleSheet.create({
    warning: {
      backgroundColor: danger ? colors.mediumRed : colors.mediumGreen,
      paddingHorizontal: 46,
      paddingVertical: 12,
      borderRadius: 15,
      marginTop: 24,
    },
    warning__text: {
      ...text?.interRegular,
      fontSize: 12,
      color: danger ? colors.black : colors.primary,
    },
  });
};
