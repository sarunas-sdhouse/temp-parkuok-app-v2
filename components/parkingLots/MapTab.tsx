import React, { useEffect, useState, useRef } from 'react';
import { Text } from 'react-native-paper';
import MapView, { Marker, Callout } from 'react-native-maps';
import ParkingLots from 'services/parkingLots';
import ChargingLots from 'services/chargingLots';
import * as Location from 'expo-location';
import { Image, StyleSheet, View, Linking, TouchableOpacity, Pressable } from 'react-native';
import { IParkingLot } from 'types/parkinLot';
import { useTranslation } from 'react-i18next';
import { useAppTheme, IStyles } from 'theme/theme';
import Button from 'components/Button';
import { useServiceState } from 'context/ServiceStateContext';
import { useInbalance } from 'context/InbalanceContext';
import TargetIcon from 'assets/icons/Target';

const defaultBoundingBox = {
  topLeftLat: 56.373966,
  topLeftLon: 21.06303,
  bottomRightLat: 53.86642,
  bottomRightLon: 26.63301,
};

const MapTab = () => {
  const { serviceType } = useServiceState();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text, serviceType });
  const { t, i18n } = useTranslation();
  const { accessToken } = useInbalance();
  const [location, setLocation] = useState({
    latitude: 55.1694,
    longitude: 23.8813,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = useState<any[]>([]);
  const mapRef = useRef<MapView | null>(null);

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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
  
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
  
      // Animate the map to the user's location
      mapRef.current?.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000,
      );
  
      // Watch the user's location
      let watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
        },
        (newLocation) => {
          setLocation({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
      );
  
      // Clean up the watcher when the component unmounts
      return () => {
        watcher.remove();
      };
    })();
  }, []);

  useEffect(() => {
    const getLots = async () => {
      let response;
      if (serviceType === 'CHARGING') {
        if (accessToken) {
          // const boundingBox = getBoundingBox(location.latitude, location.longitude, 20);
          // response = await ChargingLots.getAllChargingLotsInMap(
          //   boundingBox.topLeftLat,
          //   boundingBox.topLeftLon,
          //   boundingBox.bottomRightLat,
          //   boundingBox.bottomRightLon,
          //   accessToken,
          // );

          // if (!response.data || response.data.length === 0) {
            response = await ChargingLots.getAllChargingLotsInMap(
              defaultBoundingBox.topLeftLat,
              defaultBoundingBox.topLeftLon,
              defaultBoundingBox.bottomRightLat,
              defaultBoundingBox.bottomRightLon,
              accessToken,
            );
          // }
          setMarkers(response.data);
        } else {
          return;
        }
      } else {
        response = await ParkingLots.getAllParkingLots();
        setMarkers(response);
      }
    };

    getLots();
  }, [serviceType]);

  const getPin = (spacesVacant: number) => {
    if (serviceType === 'CHARGING') {
      if (spacesVacant === 0) {
        return require(`assets/map-pins/charging/map-pin-red.png`);
      }

      if (spacesVacant <= 10) {
        return require(`assets/map-pins/charging/map-pin-yellow.png`);
      }

      return require(`assets/map-pins/charging/map-pin-green.png`);
    } else {
      if (spacesVacant === 0) {
        return require(`assets/map-pins/parking/map-pin-red.png`);
      }

      if (spacesVacant <= 10) {
        return require(`assets/map-pins/parking/map-pin-yellow.png`);
      }

      return require(`assets/map-pins/parking/map-pin-green.png`);
    }
  };

  const calloutBodyToShow = (marker: any) => {
    if (serviceType === 'CHARGING') {
      return (
        <View>
          <View style={styles.calloutLine}>
            <Text style={styles.calloutLine__title}>{t('labels.availablePoints')}</Text>
            <Text
              style={styles.calloutLine__value}
            >{`${marker.availablePoints} | ${marker.totalPoints}`}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.calloutLine}>
            <Text style={styles.calloutLine__title}>{t('price')}</Text>
            <Text
              style={styles.calloutLine__value}
            >{`${marker.price.value} ${marker.price.symbol} / kWh`}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.calloutLine}>
            <Text style={styles.calloutLine__title}>{`ASAP ${t('price')}`}</Text>
            <Text
              style={styles.calloutLine__value}
            >{`${marker.asapPrice.value} ${marker.asapPrice.symbol} / kWh`}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.calloutLine}>
            <Text style={styles.calloutLine__title}>{t('cableTypes')}</Text>
            <Text style={styles.calloutLine__value}>
              {marker.wireTypes.map((type: string) => {
                type;
              })}
            </Text>
          </View>
          <View style={styles.divider} />
        </View>
      );
    } else {
      return (
        <View>
          <View style={styles.calloutLine}>
            <Text style={styles.calloutLine__title}>{t('labels.spacesVacant')}</Text>
            <Text style={styles.calloutLine__value}>{marker.spacesVacant}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.calloutLine}>
            <Text style={styles.calloutLine__title}>{t('labels.status')}</Text>
            <Text style={styles.calloutLine__value}>
              {marker.spacesVacant === 0 ? t('labels.full') : t('labels.available')}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.calloutLine}>
            <Text style={styles.calloutLine__title}>{t('price')}</Text>
            <Text style={{...styles.calloutLine__value, maxWidth: '40%',}}>
              {marker[`pricingLabel_${i18n.language}` as 'pricingLabel_en' | 'pricingLabel_lt'] || `${marker.pricing.toFixed(2)} € / h`}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.calloutLine}>
            <Text style={styles.calloutLine__title}>{t('freeHoursShort')}</Text>
            <Text style={{...styles.calloutLine__value, maxWidth: '40%',}}>
              {marker[`freeHoursLabel_${i18n.language}` as 'freeHoursLabel_en' | 'freeHoursLabel_lt'] || `${marker.freeHours} ${t('freeHours').toLowerCase()}`}
            </Text>
          </View>
        </View>
      );
    }
  };

  const focusOnUserLocation = () => {
    if (location) {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000,
      );
    }
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        // provider={'google'}
        ref={mapRef}
        style={styles.map}
        region={location}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={
              serviceType === 'CHARGING'
                ? {
                    latitude: marker.location.coordinates.latitude,
                    longitude: marker.location.coordinates.longitude,
                  }
                : { latitude: marker.location.lat, longitude: marker.location.lng }
            }
            title={
              serviceType === 'CHARGING'
                ? `${marker.location.street}, ${marker.location.city}`
                : `${marker.address}, ${marker.city}`
            }
            // tracksViewChanges={false}
          >
            <Image
              source={getPin(
                serviceType === 'CHARGING' ? marker.availablePoints : marker.spacesVacant,
              )}
              style={
                serviceType === 'CHARGING'
                  ? { width: 27, height: 31 }
                  : { width: 50, height: 40 }
              }
            />
            <Callout
              tooltip
              onPress={() => {
                const url =
                  serviceType === 'CHARGING'
                    ? `http://maps.google.com/?q=${marker.location.coordinates.latitude},${marker.location.coordinates.longitude}`
                    : `http://maps.google.com/?q=${marker.location.lat},${marker.location.lng}`;
                Linking.openURL(url);
              }}
            >
              <View style={styles.calloutContainer}>
                <View style={styles.calloutTitleContainer}>
                  <Text style={styles.calloutTitle}>
                    {serviceType === 'CHARGING'
                      ? `${marker.location.street}, ${marker.location.city}`
                      : `${marker.address}, ${marker.city}`}
                  </Text>
                </View>
                <View style={styles.calloutBody}>
                  {calloutBodyToShow(marker)}
                  <TouchableOpacity onPress={() => {}} style={styles.button}>
                    <View style={styles.button__text_wrapper}>
                      <Text style={styles.button__text}>{t('labels.findOnMap')}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <Pressable style={styles.returnBtn} onPress={focusOnUserLocation}>
        <TargetIcon style={styles.btnIcon} />
      </Pressable>
    </View>
  );
};

interface ExtendedStyles extends IStyles {
  serviceType: string | null;
}

export default MapTab;

const createStyles = ({ colors, text, serviceType }: ExtendedStyles) => {
  return StyleSheet.create({
    returnBtn: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1000,
    },
    btnIcon: {

    },
    map: {
      // flex: 1,
      height: '125%',
    },
    mapContainer: {
      position: 'relative',
      flex: 1,
      overflow: 'hidden',
      marginTop: serviceType === 'CHARGING' ? 0 : 16,
    },
    calloutContainer: {
      width: 218,
      borderRadius: 15,
      backgroundColor: 'white',
    },
    calloutTitleContainer: {
      backgroundColor: '#EEF8F1',
      padding: 10,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      paddingHorizontal: 15,
      paddingVertical: 24,
    },
    calloutTitle: {
      fontFamily: 'InterSemiBold',
      fontSize: 14,
    },
    calloutBody: {
      padding: 10,
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    calloutLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    calloutLine__title: {
      ...text?.interRegular,
      fontSize: 12,
      color: colors.darkGrey,
    },
    calloutLine__value: {
      ...text?.regularSemiBold,
      fontSize: 12,
      color: colors.black,
    },
    divider: {
      height: 1,
      backgroundColor: colors.primary,
      marginVertical: 5,
    },
    button: {
      marginTop: 16,
      backgroundColor: colors.primary,
      // width: 'auto',
      borderRadius: 14,
      height: 28,
      justifyContent: 'center',
    },
    button__text_wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    button__text: {
      ...text?.regularBold,
      fontSize: 12,
    },
  });
};
