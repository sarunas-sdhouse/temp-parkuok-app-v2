import { Text, View, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useAppTheme } from 'theme/theme';

const ListItem = ({
  icon,
  iconComponent,
  title,
  subtitle,
  disable = false,
  background = false,
  subtitleStyle,
  link = 'http://',
  noLink = false,
  onPress,
  active = false,
  redirectOnNoAuth = false
}: {
  icon?: any;
  iconComponent?: React.ReactNode;
  title: string;
  subtitle?: string;
  disable?: boolean;
  background?: boolean;
  subtitleStyle?: any;
  link?: string;
  noLink?: boolean;
  onPress?: () => void;
  active?: boolean;
  redirectOnNoAuth?: boolean;
}) => {
  const { text, colors } = useAppTheme();
  const styles = createStyles({ subtitleStyle });

  return (
    <TouchableOpacity
      disabled={disable && !redirectOnNoAuth}
      onPress={() => (noLink ? onPress?.() : Linking.openURL(link))}
    >
      <View
        style={{
          ...styles.listItem,
          backgroundColor: disable
            ? colors.background
            : background
              ? active ? colors.primary : colors.lightGreen
              : colors.white,
        }}
      >
        <View style={{ ...styles.listItem__wrapper, marginLeft: !background ? -8 : 0 }}>
          <View style={styles.listItem__icon}>
            {icon ? <Image source={icon} /> : iconComponent}
          </View>
          <View style={styles.listItem__texts}>
            <Text
              style={{
                ...text.title,
                ...styles.title,
                color: disable ? '#3C3C3C' : active ? colors.white : colors.black,
              }}
            >
              {title}
            </Text>
            {subtitle && (
              <Text style={{ ...text.subtitle, ...styles.subtitle }}>{subtitle}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;

const createStyles = ({ subtitleStyle }: { subtitleStyle: any }) => {
  return StyleSheet.create({
    container: {
      marginTop: 36,
    },
    listItem: {
      minHeight: 66,
      borderRadius: 50,
      // marginHorizontal: 11,
      marginVertical: 16,
      justifyContent: 'center',
    },
    listItem__icon: {
      marginLeft: 8,
    },
    listItem__wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    listItem__texts: {
      flex: 1,
      alignSelf: 'center',
    },
    title: {
      marginLeft: 18,
    },
    subtitle: {
      marginLeft: 18,
      ...subtitleStyle,
    },
  });
};
