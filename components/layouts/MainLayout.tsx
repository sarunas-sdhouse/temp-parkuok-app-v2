import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';
import Loader from 'components/Loader';

type MainLayoutProps = {
  image?: React.ReactNode;
  title?: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  style?: {
    header?: object;
    subtitle?: object;
    image?: object;
  };
  loading?: boolean;
};

const MainLayout = ({
  image,
  title,
  subtitle,
  children,
  style,
  loading,
}: MainLayoutProps) => {
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text, image });

  return (
    // <ScrollView keyboardShouldPersistTaps="handled">
    <View style={styles.container}>
      <View style={{...styles.image, ...style?.image}}>{image}</View>
      {title && <Text style={{ ...text.header, ...style?.header }}>{title}</Text>}
      {subtitle && (
        <Text style={{ ...styles.subtitle, ...style?.subtitle }}>{subtitle}</Text>
      )}
      {loading ? <Loader /> : children}
    </View>
    // </ScrollView>
  );
};

export default MainLayout;

interface IExtendedStyles extends IStyles {
  image?: React.ReactNode;
}

const createStyles = ({ colors, text, image }: IExtendedStyles) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
      paddingTop: 15,
      paddingHorizontal: 30,
      paddingBottom: 88,
    },
    subtitle: {
      ...text?.titleInformation,
      marginTop: 24,
      textAlign: 'center',
    },
    image: {
      marginBottom: image ? 24 : 0,
      alignItems: 'center'
    },
  });
};
