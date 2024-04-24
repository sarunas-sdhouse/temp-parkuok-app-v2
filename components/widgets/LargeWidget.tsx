import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';

interface IWidget {
  icon: React.ReactNode;
  itemText: string;
  itemValue: string | number;
  style?: object;
}

const LargeWidget = ({ icon, itemText, itemValue, style }: IWidget) => {
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors });

  return (
    <View style={{...styles.container, ...style}}>
      <View style={styles.icon}>{icon}</View>
      <Text style={{...text.interRegular, ...styles.text}}>{itemText.toUpperCase()}</Text>
      <Text style={{...text.interBold, ...styles.value}}>{itemValue}</Text>
    </View>
  );
};

export default LargeWidget;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 15,
      paddingTop: 32,
      paddingBottom: 24,
    },
    icon: {
      marginBottom: 29
    },
    text: {
      color: colors.darkGrey
    },
    value: {
      fontSize: 30,
      marginTop: 16
    }
  });
};
