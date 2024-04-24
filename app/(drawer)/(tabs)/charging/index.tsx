import { Text, View, Image, StyleSheet, Keyboard } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import MainLayout from 'components/layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { useAppTheme, IStyles } from 'theme/theme';
import Button from 'components/Button';
import DigitsInput from 'components/DigitsInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import KeyboardVisibleContext from 'context/KeyboardVisibleContext';
import { router, Link } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import ChargingLots from 'services/chargingLots';
import * as Location from 'expo-location';
import { useInbalance } from 'context/InbalanceContext';
import Loader from 'components/Loader';
import Warning from 'components/Warning';

// const location = {
//   coords: {
//     latitude: 54.703927,
//     longitude: 25.278602,
//   },
// };

const Charging = () => {
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });
  const { accessToken } = useInbalance();
  const [pointNr, setPointNr] = useState('');
  const [chargingPoints, setChargingPoints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLocationAndChargingLots = async () => {
    setError('');
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const boundingBox = getBoundingBox(
      location.coords.latitude,
      location.coords.longitude,
      0.1,
    ); // 100 meters

    if (accessToken) {
      const chargingLots = await ChargingLots.getAllChargingLotsInMap(
        boundingBox.topLeftLat,
        boundingBox.topLeftLon,
        boundingBox.bottomRightLat,
        boundingBox.bottomRightLon,
        accessToken,
      );

      if (!!chargingLots.data.length) {
        const chargingPointsPromises = chargingLots.data.map(async (lot: any) => {
          const chargingPoints = await ChargingLots.getChargingPointsByCluster(
            lot.id,
            accessToken,
          );
          return {
            ...chargingPoints,
            location: lot.location,
          };
        });

        const fetchedChargingPoints = await Promise.all(chargingPointsPromises);
        setChargingPoints(fetchedChargingPoints);
      } else {
        setError('NO_CHARGING_LOTS');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationAndChargingLots();
  }, []);

  const getBoundingBox = (latitude: number, longitude: number, distance: number) => {
    const radius = 6371;
    const toRad = Math.PI / 180;

    const radiusInDegreesLatitude = (distance / 2 / radius) * (180 / Math.PI);
    const radiusInDegreesLongitude =
      (distance / 2 / (radius * Math.cos(latitude * toRad))) * (180 / Math.PI);

    const topLeftLat = latitude + radiusInDegreesLatitude;
    const topLeftLon = longitude - radiusInDegreesLongitude;

    const bottomRightLat = latitude - radiusInDegreesLatitude;
    const bottomRightLon = longitude + radiusInDegreesLongitude;

    return {
      topLeftLat,
      topLeftLon,
      bottomRightLat,
      bottomRightLon,
    };
  };

  const nextStepHandler = (val: string) => {
    Keyboard.dismiss();
    setError('');
    setPointNr(val);
    if (val) {
      let foundPoint;
      chargingPoints.some(point =>
        point.data.chargingPoints.some((cp: any) => {
          if (cp.code === val) {
            foundPoint = {
              ...cp,
              clusterId: point.data.clusterId,
              location: point.location,
            };
            return true;
          }
          return false;
        }),
      );

      if (foundPoint) {
        router.push({
          pathname: UserRoutes.CHARGING_POINT,
          params: { pointId: val, point: JSON.stringify(foundPoint) },
        });
        setPointNr('');
      } else {
        setError('NO_CHARGING_POINT');
      }
    }
  };

  return (
    <MainLayout
      title={t('charging.title')}
      subtitle={t('charging.description')}
      style={{ subtitle: { marginBottom: 32 } }}
    >
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require('assets/placeholders/Charging.png')}
          style={styles.image}
          resizeMode="cover"
        />
        {loading ? (
          <Loader positioned loadingText={`${t('searchingLocation')}...`} />
        ) : error === 'NO_CHARGING_LOTS' ? (
          <>
            <Warning danger warningText={t('errors.noChargingLotsFound')} />
            <Link style={styles.mapLink} href="/parking-lots">
              {t('findOnMap')}
            </Link>
          </>
        ) : (
          <>
            <Text style={[text.header, styles.title2]}>{t('charging.title2')}:</Text>
            <Text style={styles.subtitle2}>{t('charging.subtitle2')}</Text>
            <DigitsInput
              style={styles.input}
              length={4}
              onCompletion={(val: string) => nextStepHandler(val)}
            />
            {error === 'NO_CHARGING_POINT' && (
              <Warning danger warningText={t('errors.noChargingPointFound')} />
            )}
          </>
        )}
      </KeyboardAwareScrollView>
      <View style={styles.container}>
        {error === 'NO_CHARGING_LOTS' ? (
          <Button
            styles={styles.activeButton}
            title={t('labels.refresh')}
            onPress={fetchLocationAndChargingLots}
          />
        ) : (
          <Button
            disabled={loading}
            title={t('labels.continue')}
            onPress={() => nextStepHandler(pointNr)}
            styles={styles.activeButton}
          />
        )}
      </View>
    </MainLayout>
  );
};

export default Charging;

const createStyles = ({ colors, text }: IStyles) => {
  const isKeyboardVisible = useContext(KeyboardVisibleContext);

  return StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
    },
    image: {
      width: '100%',
      height: 159,
      borderRadius: 10,
    },
    title2: {
      marginTop: 32,
      fontSize: 18,
    },
    subtitle2: {
      ...text?.titleInformation,
      marginTop: 16,
      fontSize: 12,
      textAlign: 'center',
    },
    activeButton: {
      position: 'absolute',
      bottom: isKeyboardVisible ? -67 : 0,
    },
    input: {
      marginTop: 24,
    },
    mapLink: {
      marginTop: 18,
      ...text?.regular,
      color: colors.darkGrey,
    },
  });
};
