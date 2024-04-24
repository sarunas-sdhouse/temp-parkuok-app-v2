import { Text, View, StyleSheet } from 'react-native';
import MainLayout from 'components/layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { router, useLocalSearchParams } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import MediumWidget from 'components/widgets/MediumWidget';
import TimeIcon from 'assets/icons/Time';
import BatteryIcon from 'assets/icons/Battery';
import CreditCard2 from 'assets/icons/CreditCard2';
import { useAppTheme, IStyles } from 'theme/theme';
import { useAuth } from 'context/AuthContext';
import Button from 'components/Button';

const CompletedCharging = () => {
  const { authState } = useAuth();
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });
  const { data: jsonData } = useLocalSearchParams() as { data: string };
  const data = JSON.parse(jsonData);

  return (
    <MainLayout title={t('charging.title6')} subtitle={t('charging.description3')}>
      <View style={styles.container}>
        <View style={styles.widgetsRow}>
          <MediumWidget
            style={{ ...styles.widget, marginRight: '4%' }}
            icon={<TimeIcon />}
            itemText={t('charging.timeSpent')}
            itemValue={`${data?.duration?.hours.toString().padStart(2, '0')}:${data?.duration?.minutes
              .toString()
              .padStart(2, '0')}:${data?.duration?.seconds.toString().padStart(2, '0')}`}
          />
          <MediumWidget
            style={styles.widget}
            icon={<BatteryIcon />}
            itemText="kWh"
            itemValue={data?.estimation?.energyUsed?.value}
          />
        </View>
        <MediumWidget
          row
          style={{ marginTop: '4%' }}
          icon={<CreditCard2 />}
          itemText={t('labels.creditCost')}
          itemValue={data?.estimation?.price?.value}
        />
        <View style={styles.remaining}>
          <Text style={styles.remaining__text}>{t('remainingCredits')}: </Text>
          {authState?.authenticated && (
            <Text style={styles.remaining__text2}>
              {Number(authState.user?.credits).toFixed(2)}
            </Text>
          )}
        </View>
        <Button
          title={t('labels.addCredits')}
          onPress={() => router.replace(UserRoutes.ADD_CREDITS)}
          styles={styles.activeButton}
        />
        <Button
          title={t('pages.services')}
          onPress={() => router.replace(UserRoutes.SERVICES)}
          styles={{ ...styles.activeButton, ...styles.button2 }}
        />
      </View>
    </MainLayout>
  );
};

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
    },
    widgetsRow: {
      flexDirection: 'row',
      marginTop: 32,
    },
    widget: {
      width: '48%',
    },
    remaining: {
      flexDirection: 'row',
      marginTop: 24,
    },
    remaining__text: {
      ...text?.interRegular,
    },
    remaining__text2: {
      ...text?.interBold,
      fontSize: 14,
    },
    activeButton: {
      position: 'absolute',
      bottom: 0,
    },
    button2: {
      bottom: 67,
    },
  });
};

export default CompletedCharging;
