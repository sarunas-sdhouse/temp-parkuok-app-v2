import { useEffect, useState, memo } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';
import MainLayout from 'components/layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import LargeWidget from 'components/widgets/LargeWidget';
import MediumWidget from 'components/widgets/MediumWidget';
import ClockBigIcon from 'assets/icons/ClockBig';
import { useAppTheme, IStyles } from 'theme/theme';
import ParkingIcon from 'assets/icons/Parking';
import CreditCard2 from 'assets/icons/CreditCard2';
import Tickets from 'services/tickets';
import { useLocalStorage } from 'utils/useLocalStorage';
import { TicketsResponse } from 'types/tickets';
import Loader from 'components/Loader';
import { calculateDuration, formatDate } from 'utils/helpers';
import { Toast } from 'toastify-react-native';

interface IItem {
  item: TicketsResponse;
}

const ParkingHistory = () => {
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });
  const [loading, setLoading] = useState(false);
  const [licensePlates, setLicensePlates] = useLocalStorage<string[]>(
    'licensePlates',
    [],
  );
  const [data, setData] = useState<TicketsResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalTime, setTotalTime] = useState({ hours: 0, minutes: 0 });
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const isFocused = useIsFocused();

  // GET DATA FOR ALL LICENCE PLATES
  useEffect(() => {
    const fetchData = async (retryCount = 0) => {
      try {
        setLoading(true);
        const newPage = 1;
        setPage(newPage);
        if (licensePlates) {
          const response = await Tickets.getTicketsByPlates(licensePlates, newPage);
  
          setTotalTime(response.totalDuration);
          setTotalSessions(response.totalSessions);
          setTotalSpent(parseFloat((response.totalSpent / 100).toFixed(2)));
  
          setData(response.tickets);
        }
        setLoading(false);
      } catch (error) {
        if (retryCount < 3) {
          fetchData(retryCount + 1);
        } else {
          setLoading(false);
          Toast.error(t('errors.somethingWentWrong'), 'bottom');
        }
      }
    };
  
    fetchData();
  }, [licensePlates?.length, isFocused]);

  const Item = memo(({ item }: IItem) => {
    const duration = calculateDuration(item);
    return (
      <View style={styles.row}>
        <View style={[styles.column, { width: 100 }]}>
          <Text style={styles.text}>{formatDate(item.closedAt)}</Text>
        </View>
        <View style={[styles.column, { width: 100 }]}>
          <Text style={styles.text}>{`${duration.hours}h ${duration.minutes}min`}</Text>
        </View>
        <View style={[styles.column, { width: 100 }]}>
          <Text style={styles.text}>{((item.amountPaid || 0) / 100).toFixed(2)} €</Text>
        </View>
      </View>
    );
  });

  const handleLoadMore = async () => {
    setLoadingMore(true);
    if(licensePlates) {
      const newPage = page + 1;
      setPage(newPage);
      const newResponse = await Tickets.getTicketsByPlates(licensePlates, newPage);
      setData(prevData => [...prevData, ...newResponse.tickets]);
    }
    setLoadingMore(false);
  };

  const renderListFooter = () => {
    if (!loadingMore) return null;
    return (
      <Text>{t('loading')}...</Text>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout title={t('parkingSummary')}>
      <View style={styles.container}>
        <View style={styles.bigContainer}>
          <LargeWidget
            icon={<ClockBigIcon />}
            itemText={t('totalTime')}
            itemValue={`${totalTime.hours}h ${totalTime.minutes}min`}
          />
        </View>
        <View style={styles.mediumContainer}>
          <MediumWidget
            background
            style={{ flex: 0, height: 110 }}
            icon={<ParkingIcon />}
            itemText={t('totalSessions')}
            itemValue={totalSessions}
          />
          <MediumWidget
            background
            icon={<CreditCard2 />}
            itemText={t('totalSpent')}
            itemValue={`${totalSpent} €`}
            style={{ marginTop: '12%', flex: 0, height: 110 }}
          />
        </View>
      </View>
      <Divider style={styles.divider} />
      <Text style={styles.title}>{t('parkingHistory')}</Text>
      <ScrollView horizontal style={{ width: '100%' }}>
        <View style={styles.historyContainer}>
          <View style={styles.headerRow}>
            <View style={[styles.column, { width: 100 }]}>
              <Text style={styles.headerText}>{t('date')}</Text>
            </View>
            <View style={[styles.column, { width: 100 }]}>
              <Text style={styles.headerText}>{t('duration')}</Text>
            </View>
            <View style={[styles.column, { width: 100 }]}>
              <Text style={styles.headerText}>{t('amountPaid')}</Text>
            </View>
          </View>
          <FlatList
            data={data}
            renderItem={({ item, index }) => <Item item={item} />}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderListFooter}
            ListFooterComponentStyle={{ height: 20 }}
          />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default ParkingHistory;

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingTop: 32,
      width: '100%',
    },
    historyContainer: {
      flex: 1,
    },
    mediumContainer: {
      width: '47%',
      height: '100%',
    },
    bigContainer: {
      minWidth: '47%',
      marginRight: '6%',
      height: '100%',
    },
    divider: {
      height: 1,
      backgroundColor: colors.primary,
      marginVertical: 32,
      marginHorizontal: -30,
    },
    title: {
      ...text?.interBold,
      color: colors.darkGrey,
      marginBottom: 16,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 19,
    },
    headerText: {
      fontFamily: 'InterExtraLight',
      color: colors.darkGrey,
      fontSize: 12,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    column: {
      // flex: 1,
      width: '33.33%',
    },
    text: {
      fontFamily: 'InterRegular',
      fontSize: 14,
    },
  });
};
