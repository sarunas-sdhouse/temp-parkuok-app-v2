import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { View, StyleSheet, Linking, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { useAppTheme, IStyles } from 'theme/theme';
import ParkingLots from 'services/parkingLots';
import { IParkingLot } from 'types/parkinLot';
import Loader from 'components/Loader';
import LocationLightIcon from 'assets/icons/LocationLight';
import PinLightIcon from 'assets/icons/PinLight';
import MediumWidget from 'components/widgets/MediumWidget';
import TimeItem from 'assets/icons/TimeWithBg';
import TimeIcon from 'assets/icons/Time';
import ParkingIcon from 'assets/icons/Parking';
import ParkingLotsIcon from 'assets/icons/Parking_lots';

const placeholderImage = require('assets/placeholders/parking-lot-placeholder.jpg');

const Lot = () => {
  const { lotId } = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const [lot, setLot] = useState<IParkingLot>();
  const [isLoading, setIsloading] = useState(false);
  const { colors, text } = useAppTheme();
  const [isImageError, setIsImageError] = useState(false);
  const styles = createStyles({ colors });

  useEffect(() => {
    setIsloading(true);
    if (typeof lotId !== 'string') return;

    const getLot = async () => {
      const response = await ParkingLots.getLotById(lotId);

      if (response.image === 'null') {
        response.image = null;
      }

      setLot(response);

      if (response.image) {
        setIsImageError(false);
      } else {
        setIsImageError(true);
      }

      setIsloading(false);
    };

    getLot();
  }, []);

  if (isLoading) return <Loader />;

  if (!lot) return;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          style={styles.image}
          source={isImageError ? placeholderImage : { uri: lot.image }}
          contentFit={isImageError ? 'contain' : 'cover'}
        />
        <View style={styles.container}>
          <View style={styles.columns}>
            <View style={styles.firstColumn}>
              <View style={styles.firstColumn__item}>
                <PinLightIcon style={styles.icon} />
                <View>
                  <Text style={{ ...text.header, ...styles.header }}>{lot.address}</Text>
                  <Text style={{ ...text.header, ...styles.subheader }}>{lot.city}</Text>
                </View>
              </View>
              <View style={{ ...styles.firstColumn__item, marginTop: 16 }}>
                <LocationLightIcon style={styles.icon} />
                <Text style={text.regular}>
                  {lot.location.lat}, {lot.location.lng}
                </Text>
              </View>
              <View style={{ ...styles.firstColumn__item, marginTop: 16 }}>
                <TimeIcon
                  style={{ ...styles.icon, marginLeft: 2 }}
                  height={19}
                  width={19}
                />
                <View>
                  <Text style={text.regular}>
                    {lot[
                      `freeHoursLabel_${i18n.language}` as
                        | 'freeHoursLabel_en'
                        | 'freeHoursLabel_lt'
                    ] || `${lot.freeHours} ${t('freeHours').toLowerCase()}`}
                  </Text>
                  <Text style={{ ...text.header, ...styles.subheader }}>
                    {lot[
                      `pricingLabel_${i18n.language}` as
                        | 'pricingLabel_en'
                        | 'pricingLabel_lt'
                    ] || `${lot.pricing.toFixed(2)} € / h`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              ...text.header,
              fontSize: 16,
              textAlign: 'left',
              marginBottom: 16,
            }}
          >
            {t('parkingDetails')}
          </Text>
          <View style={styles.widgets}>
            <MediumWidget
              icon={<ParkingIcon />}
              itemText={t('widgets.totalSlots')}
              itemValue={lot.spacesTotal}
            />
            <MediumWidget
              icon={<ParkingLotsIcon />}
              itemText={t('widgets.availableSlots')}
              itemValue={lot.spacesVacant}
            />
          </View>
          <Button
            styles={{ marginVertical: 32 }}
            title={t('labels.findOnMap')}
            onPress={() => {
              const url = `http://maps.google.com/?q=${lot.location.lat},${lot.location.lng}`;
              Linking.openURL(url);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Lot;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      marginHorizontal: 32,
      marginBottom: 72,
    },
    columns: {
      flexDirection: 'row',
      marginTop: 32,
      marginBottom: 32,
      justifyContent: 'space-between',
    },
    firstColumn: {
      width: '90%',
    },
    firstColumn__item: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 16,
    },
    secondColumn: {
      width: '30%',
      alignItems: 'flex-end',
      flexDirection: 'column',
    },
    image: {
      width: '100%',
      height: 337,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    header: {
      fontSize: 16,
      textAlign: 'left',
    },
    subheader: {
      fontSize: 14,
      color: colors.grey,
      textAlign: 'left',
    },
    widgets: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
    },
  });
};
