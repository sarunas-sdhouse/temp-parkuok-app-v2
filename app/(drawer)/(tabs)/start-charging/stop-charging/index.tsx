import { useState } from 'react';
import Prompt from 'components/Prompt';
import StopChargingImage from 'assets/images/StopCharging';
import { useTranslation } from 'react-i18next';
import { router, useLocalSearchParams } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import { useServiceState } from 'context/ServiceStateContext';
import Chargings from 'services/chargings';
import { Toast } from 'toastify-react-native';
import { useAuth } from 'context/AuthContext';
import { useInbalance } from 'context/InbalanceContext';
import ChargingLots from 'services/chargingLots';
import { calculateDuration } from 'utils/helpers';
import { UpdateLocalUser } from 'services/user';

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

const StopCharging = () => {
  const { t } = useTranslation();
  const { charging, setCharging } = useServiceState();
  const [loading, setLoading] = useState(false);
  const { authState, setAuthState } = useAuth();
  const { data: jsonData } = useLocalSearchParams() as { data: string };
  const data = JSON.parse(jsonData);
  const { accessToken, sessionId, setSessionId } = useInbalance();

  const stopChargingHandler = async () => {
    try {
      if (
        charging &&
        authState?.user &&
        data &&
        accessToken !== null &&
        !!sessionId
      ) {
        setLoading(true);
        const stopResult = await ChargingLots.stopCharging(sessionId, accessToken);
        if(stopResult) {
          const sessionResult = await ChargingLots.getChargingSession(
            sessionId,
            accessToken,
          );
  
          if (sessionResult) {
            const result = await Chargings.updateCharging(data.id, {
              status: 'CLOSED',
              openedAt: new Date(sessionResult.data.startedAt),
              closedAt: new Date(sessionResult.data.endedAt),
              energyAmount: parseFloat(sessionResult.data.estimation.energyUsed.value),
              amountToBePaid: parseFloat(sessionResult.data.estimation.price.value) * 100,
              userId: authState?.user?.id,
            });
  
            if (result) {
              setSessionId('');
              setCharging(false);
              if (setAuthState) {
                await UpdateLocalUser(setAuthState);
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
      if (error.response && error.response.data) {
        let serverErrorMessage = error.response.data.message;

        if (!serverErrorMessage.includes('errors')) {
          serverErrorMessage = `errors.${serverErrorMessage}`;
        }
        Toast.error(t(serverErrorMessage), 'bottom');
      } else {
        Toast.error(error.message, 'bottom');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Prompt
      image={<StopChargingImage />}
      title={t('charging.title5')}
      subtitle={t('charging.description2')}
      firstBtnText={t('labels.confirm')}
      firstBtnAction={stopChargingHandler}
      secondBtnText={t('labels.cancel')}
      secondBtnAction={() => router.back()}
      isLoading={loading}
    />
  );
};

export default StopCharging;
