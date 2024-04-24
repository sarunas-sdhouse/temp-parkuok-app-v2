import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import MainLayout from 'components/layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { useAppTheme, IStyles } from 'theme/theme';
import Button from 'components/Button';
import { useLocalSearchParams, router } from 'expo-router';
import DataList from 'components/DataList';
import { useServiceState } from 'context/ServiceStateContext';
import { UserRoutes } from 'common/constants/routes';
import Chargings from 'services/chargings';
import { Toast } from 'toastify-react-native';
import { useLocalStorage } from 'utils/useLocalStorage';
import Input from 'components/Input';
import Modal from 'components/Modal';
import { formatLicensePlate } from 'utils/helpers';
import PlusIcon from 'assets/icons/Plus';
import Warning from 'components/Warning';
import { IChargingPoint } from 'types/chargings';
import { useAuth } from 'context/AuthContext';
import { useInbalance } from 'context/InbalanceContext';
import ChargingLots from 'services/chargingLots';

// const chargingResult = {
//   "data": {
//     "sessionId": "6f30a054-c80c-11ea-87d0-0242ac130003"
//   }
// }

const Charging = () => {
  const searchParams = useLocalSearchParams();
  const pointId = searchParams.pointId as string;
  const point = JSON.parse(searchParams.point as string) as IChargingPoint;
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });
  const { charging, setCharging } = useServiceState();
  const [loading, setLoading] = useState(false);
  const [newLicensePlate, setNewLicensePlate] = useState('');
  const [licensePlates, setLicensePlates] = useLocalStorage<string[]>(
    'licensePlates',
    [],
  );
  const [addNewModal, setAddNewModal] = useState(false);
  const { authState } = useAuth();
  const { accessToken, setSessionId } = useInbalance();

  const showAddNewModal = () => setAddNewModal(true);
  const hideAddNewModal = () => setAddNewModal(false);

  const data = [
    {
      title: t('status'),
      value: point.availableForCharging ? t('available') : t('notAvailable'),
      tooltip: point.availableForCharging
        ? t('charging.statusTooltip')
        : t('charging.statusTooltipNotAvailable'),
    },
    {
      title: t('charging.price'),
      value: `${point.price.originalPrice.value} €/kWh`,
    },
    {
      title: `ASAP ${t('charging.price')}`,
      value: `${point.asap.originalPrice.value} €/kWh`,
    },
    {
      title: t('location'),
      value: `${point.location.street}, ${point.location.city}`,
    },
    {
      title: t('creditsInYourAccount'),
      value: Number(authState?.user?.credits).toFixed(2),
    },
  ];

  const startChargingHandler = async (type: 1 | 2) => {
    if(authState && parseFloat(authState?.user?.credits || "0") <= 0) {
      Toast.error(t('errors.noCredits'), 'bottom');
      return;
    }

    setLoading(true);
    try {
      if (!charging && licensePlates && pointId && accessToken) {
        const plate = licensePlates[licensePlates.length - 1];
        const chargingResult = await ChargingLots.startCharging(
          pointId,
          plate,
          type,
          accessToken,
        );

        if (chargingResult) {
          const databaseResult = await Chargings.addNewCharging({
            plate,
            clusterId: point.clusterId,
            clusterPointId: pointId,
            sessionId: chargingResult.data.sessionId,
            location: `${point.location.street}, ${point.location.city}`,
            openedAt: new Date(),
            status: 'OPEN',
          });

          if (databaseResult) {
            setCharging(true);
            setSessionId(databaseResult.sessionId);
            router.replace(
              `${UserRoutes.START_CHARGING}?sessionId=${databaseResult.sessionId}`,
            );
          }
        }
      }
    } catch (error: any) {
      if (error.response?.data?.errors[0]?.code) {
        let message = ''
        switch (error.response.data.errors[0].code) {
          case 'CHARGING_POINT_NOT_OCCUPIED':
            message = t('errors.chargingCableNotConnected');
            break;
          case 'CHARGING_POINT_ACTIVE':
            message = t('errors.chargingPointActive');
            break;
          case 'CHARGING_STATION_DISCONNECTED':
            message = t('errors.chargingStationDisconnected');
            break;
          case 'ENTITY_NOT_FOUND':
            message = t('errors.entityNotFound');
            break;
          case 'CHARGING_POINT_NOT_FOUND':
            message = t('errors.chargingPointNotFound');
            break;
          default:
            message = t('errors.somethingWentWrong');
            break;
        }
        Toast.error(message, 'bottom');
      } else {
        Toast.error(t('errors.somethingWentWrong'), 'bottom');
      }
    } finally {
      setLoading(false);
    }
  };

  const addLicensePlate = () => {
    if (newLicensePlate.trim() !== '') {
      hideAddNewModal();
      const formattedPlate = formatLicensePlate(newLicensePlate);
      setLicensePlates(prevPlates => {
        if (!prevPlates.includes(formattedPlate)) {
          return [...prevPlates, formattedPlate];
        } else {
          return prevPlates;
        }
      });
      setNewLicensePlate('');
    }
  };

  return (
    <MainLayout
      title={`${t('charging.title3')} #${pointId}`}
      style={{ subtitle: { marginBottom: 32 } }}
    >
      <Modal
        title={t('addNewLicensePlate')}
        visible={addNewModal}
        onDismiss={hideAddNewModal}
      >
        <Input
          value={newLicensePlate}
          onChangeText={val => setNewLicensePlate(val)}
          onSubmitEditing={addLicensePlate}
          labelText={t('licensePlate')}
        />
        <View style={styles.modal__buttons}>
          <View style={styles.modal__button}>
            <Button
              mode="outlined"
              outlineColor={colors.primary}
              textColor={colors.black}
              title={t('labels.cancel')}
              onPress={hideAddNewModal}
            />
          </View>
          <View style={{ ...styles.modal__button, marginLeft: 16 }}>
            <Button title={t('labels.submit')} onPress={addLicensePlate} />
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <DataList data={data} />
        <Warning
          warningText={
            licensePlates && licensePlates[licensePlates.length - 1]
              ? t('charging.warning')
              : t('charging.warning2')
          }
        />

        {licensePlates && licensePlates[licensePlates.length - 1] ? null : (
          <TouchableOpacity style={styles.addNew} onPress={showAddNewModal}>
            <PlusIcon />
            <Text style={styles.addNew__text}>{t('addNewLicensePlate')}</Text>
          </TouchableOpacity>
        )}
        {licensePlates && licensePlates[licensePlates.length - 1] ? (
          <>
            <Button
              disabled={loading}
              title={t('charging.startAsapCharging')}
              onPress={() => startChargingHandler(2)}
              styles={styles.activeButton}
            />
            <Button
              disabled={loading}
              title={t('charging.startCharging')}
              onPress={() => startChargingHandler(1)}
              styles={{ ...styles.activeButton, ...styles.button2 }}
            />
          </>
        ) : null}
      </View>
    </MainLayout>
  );
};

export default Charging;

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
      marginTop: 32,
    },
    activeButton: {
      position: 'absolute',
      bottom: 0,
    },
    input: {
      marginTop: 24,
    },
    button2: {
      bottom: 67,
    },
    modal__buttons: {
      flexDirection: 'row',
      marginTop: 16,
    },
    modal__button: {
      flex: 1,
    },
    addNew: {
      flexDirection: 'row',
      marginTop: 29,
      marginBottom: 53,
      alignItems: 'center',
    },
    addNew__text: {
      marginLeft: 12,
      ...text?.regular,
      color: colors.darkGrey,
    },
  });
};
