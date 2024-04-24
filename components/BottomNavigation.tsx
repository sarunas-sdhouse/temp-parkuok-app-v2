import { useContext } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';
import HomeIcon from 'assets/icons/navigation/Home';
import MapIcon from 'assets/icons/navigation/Map';
import ParkingIcon from 'assets/icons/navigation/Parking';
import SummaryIcon from 'assets/icons/navigation/Summary';
import MoreVerticalIcon from 'assets/icons/navigation/MoreVertical';
import ChargingIcon from 'assets/icons/navigation/Charging';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { router, usePathname } from 'expo-router';
import KeyboardVisibleContext from 'context/KeyboardVisibleContext';
import { useServiceState } from 'context/ServiceStateContext';
import { UserRoutes } from 'common/constants/routes';

const BottomNavigation = () => {
  const { serviceType, charging } = useServiceState();
  const { colors } = useAppTheme();
  const navigation = useNavigation();

  const activePath = usePathname();
  const isKeyboardVisible = useContext(KeyboardVisibleContext);
  const styles = createStyles({ colors });

  if (isKeyboardVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push(UserRoutes.SERVICES)}>
        <HomeIcon focused={activePath.includes(UserRoutes.SERVICES)} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push(UserRoutes.PARKING_LOTS)}>
        <MapIcon focused={activePath.includes(UserRoutes.PARKING_LOTS)} />
      </TouchableOpacity>
      {serviceType === 'CHARGING' ? (
        <TouchableOpacity onPress={() => router.push(charging ? UserRoutes.START_CHARGING : UserRoutes.CHARGING)}>
          <ChargingIcon focused={activePath.includes(UserRoutes.CHARGING) || activePath === UserRoutes.START_CHARGING} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => router.push(UserRoutes.CHECK_AMOUNT)}>
          <ParkingIcon focused={activePath.includes(UserRoutes.CHECK_AMOUNT)} />
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => router.push(serviceType === 'CHARGING' ? UserRoutes.CHARGING_HISTORY : UserRoutes.PARKING_HISTORY)}>
        <SummaryIcon focused={activePath.includes(UserRoutes.PARKING_HISTORY) || activePath.includes(UserRoutes.CHARGING_HISTORY)} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <MoreVerticalIcon />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: colors.lightGreen,
      height: 56,
      borderRadius: 50,
      alignItems: 'center',
      width: 280,
      alignSelf: 'center',
    },
  });
};
