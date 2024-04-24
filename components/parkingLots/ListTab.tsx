import React, { useState, useEffect, memo } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Select from 'components/Select';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import ParkingLots from 'services/parkingLots';
import Loader from 'components/Loader';
import { IParkingLot } from 'types/parkinLot';
import { useTranslation } from 'react-i18next';
import { useAppTheme, IStyles } from 'theme/theme';
import ArrowRightIcon from 'assets/icons/ArrowRight';
import { Image } from 'expo-image';

interface IListItem {
  address: string;
  city: string;
  availability: string;
  free: number;
  price: number;
  freeHoursLabel?: string;
  priceLabel?: string;
  image?: string;
}

const placeholderImage = require('assets/placeholders/parking-lot-placeholder.jpg');

const ListItem = memo(
  ({ address, city, free, freeHoursLabel, price, priceLabel, image }: IListItem) => {
    const { t } = useTranslation();
    const { colors, text } = useAppTheme();
    const styles = createStyles({ colors });

    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listItemContent}>
          <View style={styles.listItemContainer__image}>
            <Image
              style={styles.image}
              source={image}
              contentFit="cover"
              transition={500}
            />
            <View style={[styles.badge, styles.badgeLeft]}>
              <Text style={{ color: 'white' }}>
                {freeHoursLabel || `${free} ${t('freeHours').toLowerCase()}`}
              </Text>
            </View>
            <View style={[styles.badge, styles.badgeRight]}>
              <Text style={{ color: 'white' }}>
                {priceLabel || `${price.toFixed(2)}€ / h`}
              </Text>
            </View>
          </View>
          <View style={styles.listItemContainer__titleContainer}>
            <View style={styles.listItemContainer__address_city}>
              <Text style={{ ...text.header, ...styles.header }}>{address}</Text>
              <Text style={{ ...text.header, ...styles.subheader }}>{city}</Text>
            </View>
            <ArrowRightIcon />
          </View>
        </View>
      </View>
    );
  },
);

const ListTab = () => {
  const { t, i18n } = useTranslation();
  const [selectedCity, setSelectedCity] = useState('all');
  const [parkingLots, setParkingLots] = useState<IParkingLot[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors });

  useEffect(() => {
    setIsloading(true);
    const getParkingLots = async () => {
      const response = await ParkingLots.getAllParkingLots();
      setParkingLots(response);
      setIsloading(false);
    };

    getParkingLots();
  }, []);

  if (isLoading) return <Loader />;

  const uniqueCities = Array.from(new Set(parkingLots.map(lot => lot.city)));

  const selectData = [
    { label: t('all'), value: 'all' },
    ...uniqueCities.map(city => ({ label: city, value: city })),
  ];

  return (
    <View style={styles.container}>
      <Select
        key={i18n.language}
        label={t('labels.city')}
        placeholder={t('selectCity')}
        data={selectData}
        style={{ marginBottom: 32, marginTop: 24 }}
        onValueChange={city => setSelectedCity(city)}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={parkingLots.filter(
          item => selectedCity === 'all' || item.city === selectedCity,
        )}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`${UserRoutes.PARKING_LOTS}/${item.id}`)}>
            <ListItem
              image={item.image && item.image !== 'null' ? item.image : placeholderImage}
              address={item.address}
              city={item.city}
              availability={`${item.spacesVacant}/${item.spacesTotal}`}
              free={item.freeHours}
              freeHoursLabel={
                item[
                  `freeHoursLabel_${i18n.language}` as
                    | 'freeHoursLabel_en'
                    | 'freeHoursLabel_lt'
                ] || `${item.freeHours} ${t('freeHours').toLowerCase()}`
              }
              price={item.pricing}
              priceLabel={
                item[
                  `pricingLabel_${i18n.language}` as 'pricingLabel_en' | 'pricingLabel_lt'
                ] || `${item.pricing.toFixed(2)} € / h`
              }
            />
          </Pressable>
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />
    </View>
  );
};

export default ListTab;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 30,
    },
    listItemContainer: {
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      marginBottom: 16,
      elevation: 3,
    },
    listItemContent: {
      borderRadius: 15,
      overflow: 'hidden',
    },
    listItemContainer__image: {
      height: 171,
      backgroundColor: 'white',
    },
    image: {
      flex: 1,
      width: '100%',
      backgroundColor: '#0553',
    },
    listItemContainer__titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.white,
      paddingHorizontal: 24,
      paddingVertical: 10,
    },
    listItemContainer__address_city: {
      width: '90%'
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
    badge: {
      backgroundColor: 'rgba(66, 183, 5, 0.85)',
      color: 'white',
      paddingVertical: 4,
      paddingHorizontal: 17,
      position: 'absolute',
      bottom: 8,
      borderRadius: 15,
    },
    badgeLeft: {
      left: 24,
    },
    badgeRight: {
      left: 24,
      bottom: 42,
    },
  });
};
