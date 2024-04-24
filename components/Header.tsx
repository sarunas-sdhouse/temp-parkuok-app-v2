import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { router } from 'expo-router';
import MainLogo from 'assets/logo/Main';

const Header = ({
  back = false,
  transparent = false,
  backLink,
}: {
  back?: boolean;
  transparent?: boolean;
  backLink?: string;
}) => {
  const styles = createStyle(transparent);

  return (
    <View style={styles.container}>
      {back && (
        <TouchableOpacity
          style={styles.back}
          onPress={() => (backLink ? router.replace(backLink) : router.back())}
        >
          <Icon source="arrow-left" size={30} />
        </TouchableOpacity>
      )}
      {!transparent && <MainLogo />}
    </View>
  );
};

export default Header;

const createStyle = (transparent: boolean) => {
  return StyleSheet.create({
    container: {
      marginTop: transparent ? -32 : 32,
      marginBottom: 24,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
    back: {
      position: 'absolute',
      left: 16,
      top: transparent ? 64 : 16,
    },
  });
};
