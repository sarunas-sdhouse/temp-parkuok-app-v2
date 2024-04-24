import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';

interface IWidget {
  row?: boolean;
  icon: React.ReactNode;
  itemText: string;
  itemValue: string | number;
  style?: object;
  background?: boolean;
}

interface IExtendedStyles extends IStyles {
  row?: boolean;
  background?: boolean;
}

const MediumWidget = ({ row = false, icon, itemText, itemValue, style, background }: IWidget) => {
  const { colors, text } = useAppTheme();
  const styles = createStyles({ row, colors, background });

  return (
    <View style={{...styles.container, ...style}}>
      <View style={styles.leftContainer}>
        <View style={styles.icon}>{icon}</View>
        <Text style={{...text.interRegular, ...styles.text}}>{itemText.toUpperCase()}</Text>
      </View>
      <Text style={{...text.interBold, ...styles.value}}>{itemValue}</Text>
    </View>
  );
};

export default MediumWidget;

const createStyles = ({ row, colors, background }: IExtendedStyles) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: row ? 'row' : 'column',
      justifyContent: row ? 'space-between' : 'flex-start',
      padding: 16,
      borderWidth: background ? 0 : 1,
      backgroundColor: background ? colors.lightGreen : colors.white,
      borderColor: colors.primary,
      borderRadius: 15,
    },
    leftContainer: {
      flexDirection: row ? 'row' : 'column',
      alignItems: row ? 'center' : 'flex-start',
    },
    icon: {
      marginBottom: row ? 0 : 8
    },
    text: {
      color: colors.darkGrey,
      marginLeft: row ? 16 : 0,
    },
    value: {
      fontSize: 20,
      marginTop: row ? 0 : 5,
    }
  });
};