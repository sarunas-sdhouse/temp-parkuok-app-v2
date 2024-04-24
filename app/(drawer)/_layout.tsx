import BottomNavigation from 'components/BottomNavigation';
import { Tabs } from 'expo-router/tabs';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import 'utils/i18n';

export default function Layout() {
  const navigation = useNavigation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <BottomNavigation/>}
    />
  );
}
