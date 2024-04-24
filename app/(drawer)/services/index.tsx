import { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import MainLayout from 'components/layouts/MainLayout';
import ListItem from 'components/ListItem';
import { useAuth } from 'context/AuthContext';
import { useAppTheme, IStyles } from 'theme/theme';
import { useServiceState } from 'context/ServiceStateContext';
import CarParkingIcon from 'assets/icons/services/CarParking';
import CarChargingIcon from 'assets/icons/services/CarCharging';
import CarReservationIcon from 'assets/icons/services/CarReservation';
import CarCleaningIcon from 'assets/icons/services/CarCleaning';
import { UserRoutes } from 'common/constants/routes';
import { router, Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles({ colors });
  const { authState } = useAuth();
  const { serviceType, setServiceType, charging, setCharging } = useServiceState();

  const SERVICES = [
    {
      title: t('services.carParking'),
      icon: <CarParkingIcon />,
      disable: false,
      value: 'PARKING',
      serviceLink: UserRoutes.CHECK_AMOUNT,
    },
    {
      title: t('services.carCharging'),
      subTitle: t('onlyAfterLoggingIn'),
      icon: <CarChargingIcon disabled={!authState?.authenticated} />,
      disable: !authState?.authenticated,
      needAuth: true,
      value: 'CHARGING',
      redirectOnNoAuth: true,
      serviceLink: UserRoutes.CHARGING,
    },
    {
      title: t('services.parkingReservation'),
      subTitle: t('comingSoon'),
      icon: <CarReservationIcon disabled />,
      disable: true,
    },
    {
      title: t('services.carCleaning'),
      subTitle: t('comingSoon'),
      icon: <CarCleaningIcon disabled />,
      disable: true,
    },
  ];

  return (
    <MainLayout title={t('pages.services')}>
      <View style={styles.container}>
        {SERVICES.map((service, index) => (
          <ListItem
            key={index}
            noLink
            onPress={() => {
              if (!service.disable && service.value) {
                if (charging && serviceType !== service.value) {
                  router.push(UserRoutes.STOP_CHARGING);
                } else {
                  setServiceType(service.value);
                  router.push(service.serviceLink);
                }
              } else {
                router.push(`${UserRoutes.AUTHENTICATION}?idx=1`);
              }
            }}
            active={serviceType === service.value}
            disable={service.disable}
            iconComponent={service.icon}
            title={service.title}
            subtitle={
              service.needAuth && authState?.authenticated ? '' : service.subTitle
            }
            redirectOnNoAuth={service.redirectOnNoAuth}
            background
          />
        ))}
        {/* <Link href="/completed-charging">
          <Text>Go to completed charging</Text>
        </Link> */}
      </View>
    </MainLayout>
  );
};

export default Services;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      marginTop: 36,
    },
  });
};
