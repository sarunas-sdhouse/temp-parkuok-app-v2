import { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Drawer } from 'expo-router/drawer';
import Sidebar from 'components/Sidebar';
import { theme } from 'theme/theme';
import * as Font from 'expo-font';
import { AuthProvider } from 'context/AuthContext';
import { KeyboardVisibleProvider } from 'context/KeyboardVisibleContext';
import { ServiceStateProvider } from 'context/ServiceStateContext';
import { InbalanceProvider } from 'context/InbalanceContext';
import ToastManager from 'toastify-react-native';
import { useNavigation } from '@react-navigation/native';
import 'utils/i18n';

export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        MontserratRegular: require('assets/fonts/Montserrat-Regular.ttf'),
        MontserratSemiBold: require('assets/fonts/Montserrat-SemiBold.ttf'),
        MontserratExtraLight: require('assets/fonts/Montserrat-ExtraLight.ttf'),
        MontserratMedium: require('assets/fonts/Montserrat-Medium.ttf'),
        MontserratBold: require('assets/fonts/Montserrat-Bold.ttf'),
        InterExtraLight: require('assets/fonts/Inter-ExtraLight.ttf'),
        InterLight: require('assets/fonts/Inter-Light.ttf'),
        InterRegular: require('assets/fonts/Inter-Regular.ttf'),
        InterMedium: require('assets/fonts/Inter-Medium.ttf'),
        InterSemiBold: require('assets/fonts/Inter-SemiBold.ttf'),
        InterBold: require('assets/fonts/Inter-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ServiceStateProvider>
        <InbalanceProvider>
          <KeyboardVisibleProvider>
            <PaperProvider theme={theme}>
              <ToastManager position="bottom" animationStyle="rightInOut" style={{ width: '100%' }} />
              <Drawer
                screenOptions={{
                  drawerPosition: 'right',
                  headerLeft() {
                    return null;
                  },
                  drawerStyle: {
                    backgroundColor: theme.colors.white,
                    width: '80%',
                    // marginBottom: 72
                  },
                  // overlayColor: 'transparent',
                  headerShown: false,
                  headerTitle: '',
                }}
                drawerContent={() => <Sidebar theme={theme} />}
              />
            </PaperProvider>
          </KeyboardVisibleProvider>
        </InbalanceProvider>
      </ServiceStateProvider>
    </AuthProvider>
  );
}
