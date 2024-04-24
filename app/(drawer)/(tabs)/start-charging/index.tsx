import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import MainLayout from 'components/layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { useAppTheme, IStyles } from 'theme/theme';
import Button from 'components/Button';
import { useLocalSearchParams, router } from 'expo-router';
import ChargingImage from 'assets/images/Charging';
import ProgressWidget from 'components/widgets/ProgressWidget';
import TimeIcon from 'assets/icons/Time';
import LocationIcon from 'assets/icons/Location';
import BatteryChargingIcon from 'assets/icons/BatteryCharging';
import CreditCardIcon from 'assets/icons/CreditCard2';
import { calculateDuration } from 'utils/helpers';
import { UserRoutes } from 'common/constants/routes';
import Chargings from 'services/chargings';
import { useInbalance } from 'context/InbalanceContext';
import ChargingLots from 'services/chargingLots';
import { Toast } from 'toastify-react-native';
import Loader from 'components/Loader';
import Warning from 'components/Warning';
import { useAuth } from 'context/AuthContext';
import { useServiceState } from 'context/ServiceStateContext';
import { UpdateLocalUser } from 'services/user';

type DataField = {
  title: string;
  subtitle: string;
  icon: JSX.Element;
};

// const sessionResult = {
//   data: {
//     sessionId: '6f30a054-c80c-11ea-87d0-0242ac130003',
//     state: 1,
//     pointCode: '0001',
//     chargingMode: 1,
//     startedAt: '2020-08-10T06:45:30+00:00',
//     endedAt: '2020-08-10T06:45:30+00:00',
//     currentPower: {
//       value: '10.00',
//       unit: 'kW',
//     },
//     avgPower: {
//       value: '10.00',
//       unit: 'kW',
//     },
//     energyUsed: {
//       value: '10.00',
//       unit: 'kWh',
//     },
//     distance: {
//       value: '100.00',
//       unit: 'km',
//     },
//     price: {
//       value: '0.25',
//       currency: 'EUR',
//       symbol: '€',
//     },
//     paymentStatus: '1 - unpaid, 2 - paid, 3 - waiting for confirmation',
//     comment: 'string',
//     userVehicle: {
//       userVehicleId: '6f30a054-c80c-11ea-87d0-0242ac130003',
//       numberPlate: 'EV1234',
//       userGroupId: '6f30a054-c80c-11ea-87d0-0242ac130003',
//     },
//     powerMeterValuesUpdatedAt: '2020-08-10T06:45:30+00:00',
//     stationConnected: true,
//     estimation: {
//       energyUsed: {
//         value: '10.00',
//         unit: 'kWh',
//       },
//       distance: {
//         value: '100.00',
//         unit: 'km',
//       },
//       price: {
//         value: '0.25',
//         currency: 'EUR',
//         symbol: '€',
//       },
//     },
//     userTag: {
//       id: '6f30a054-c80c-11ea-87d0-0242ac130003',
//       idTag: 'KDHFJJ444',
//       name: 'User test tag',
//     },
//     stateOfCharge: {
//       value: 50,
//       unit: 'percent',
//     },
//     vehicleInParkingLot: 1,
//   },
// };

const StartCharging = () => {
  const { sessionId } = useLocalSearchParams();
  const { authState, setAuthState } = useAuth();
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });
  const {
    accessToken,
    sessionId: sessionIdInLocalStorage,
    setSessionId: setSessionIdInLocalStorage,
  } = useInbalance();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [duration, setDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const { setCharging } = useServiceState();

  useEffect(() => {
    const id = sessionIdInLocalStorage || sessionId;
    const fetchChargingData = async () => {
      if (!!id && accessToken !== null) {
        try {
          const resultFromDb = await Chargings.getChargingBySessionId(id as string);
          const sessionResult = await ChargingLots.getChargingSession(id as string, accessToken);

          setData({ ...resultFromDb, ...sessionResult.data });
          setLoading(false);
          setError(false);
        } catch (error: any) {
          setError(true);
          setLoading(false);
          Toast.error(t('errors.somethingWentWrong'), 'bottom');
        }
      }
    };

    fetchChargingData();
  }, [sessionIdInLocalStorage, accessToken]);

  const stopCharging = async () => {
    setLoading(true);
    try {
      if (!!sessionIdInLocalStorage && accessToken !== null) {
        const stopResult = await ChargingLots.stopCharging(sessionIdInLocalStorage, accessToken);
        if(stopResult) {
          const sessionResult = await ChargingLots.getChargingSession(
            sessionIdInLocalStorage,
            accessToken,
          );
          if (sessionResult) {
            const result = await Chargings.updateCharging(data.id, {
              sessionId: sessionIdInLocalStorage,
              status: 'CLOSED',
              openedAt: sessionResult.data.startedAt,
              closedAt: sessionResult.data.endedAt,
              energyAmount: parseFloat(sessionResult.data.estimation.energyUsed.value),
              amountToBePaid: parseFloat(sessionResult.data.estimation.price.value) * 100,
              userId: authState?.user?.id,
            });
            if (result) {
              setSessionIdInLocalStorage('');
              setCharging(false);
              if (setAuthState) {
                await UpdateLocalUser(setAuthState);
                router.replace(UserRoutes.SUCCESS);
              }
              router.push({
                pathname: UserRoutes.COMPLETED_CHARGING,
                params: {
                  data: JSON.stringify({
                    ...{...data, ...sessionResult.data},
                    duration: calculateDuration({
                      openedAt: sessionResult.data.startedAt,
                      closedAt: sessionResult.data.endedAt,
                    }),
                  }),
                },
              });
            }
          }
        }
      }
    } catch (error: any) {
      setLoading(false);
      Toast.error(t('errors.somethingWentWrong'), 'bottom');
    }
  };

  // INTERVALS
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (data) {
        const time = calculateDuration({
          openedAt: data.startedAt,
          closedAt: new Date(),
        });
        setDuration(time);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [data]); // Fetch every second

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!!sessionIdInLocalStorage && accessToken !== null && authState) {
        const sessionResult = await ChargingLots.getChargingSession(
          sessionIdInLocalStorage,
          accessToken,
        );

        if (
          sessionResult.data.state === 4 ||
          Number(authState.user?.credits) <= sessionResult.data.estimation.price.value
        )
          stopCharging(); // 4 - Finished

        if (sessionResult) {
          setData((prevData: any) => ({
            ...prevData,
            estimation: {
              ...prevData.estimation,
              energyUsed: {
                ...prevData.estimation.energyUsed,
                value: sessionResult.data.estimation.energyUsed.value,
              },
              price: {
                ...prevData.estimation.price,
                value: sessionResult.data.estimation.price.value,
              },
            },
          }));
        }
      }
    }, 60000); // Fetch every minute

    return () => clearInterval(intervalId);
  }, [sessionIdInLocalStorage, accessToken]);

  const dataFields = [
    {
      title: t('charging.timeSpent'),
      subtitle: `${duration.hours.toString().padStart(2, '0')}:${duration.minutes
        .toString()
        .padStart(2, '0')}:${duration.seconds.toString().padStart(2, '0')}`,
      icon: <TimeIcon />,
    },
    {
      title: `kWh (${t('charging.amount')})`,
      subtitle: data?.estimation.energyUsed.value,
      icon: <BatteryChargingIcon />,
    },
    {
      title: t('location'),
      subtitle: data?.location,
      icon: <LocationIcon />,
    },
    {
      title: t('payment.total'),
      subtitle: `${data?.estimation.price.value} ${t('credits').toLocaleLowerCase()}`,
      icon: <CreditCardIcon />,
    },
  ];

  if (loading) return <Loader />;

  return (
    <MainLayout title={t('charging.title4')}>
      <View style={styles.container}>
        <ChargingImage />
        {error ? (
          <Warning danger warningText={t('errors.tryToReloadApp')} />
        ) : (
          <>
            <ProgressWidget style={styles.pannel} data={dataFields} />
            <Button
              title={t('charging.stopCharging')}
              onPress={() =>
                router.push({
                  pathname: UserRoutes.STOP_CHARGING,
                  params: { data: JSON.stringify(data) },
                })
              }
              styles={styles.activeButton}
            />
          </>
        )}
      </View>
    </MainLayout>
  );
};

export default StartCharging;

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
      marginTop: 32,
      alignItems: 'center',
    },
    activeButton: {
      position: 'absolute',
      bottom: 0,
    },
    pannel: {
      marginTop: 32,
    },
  });
};
