import { View, StyleSheet } from 'react-native';
import { Text, Surface, Divider } from 'react-native-paper';
import { useAppTheme, IStyles } from 'theme/theme';
import { useTranslation } from 'react-i18next';

const SmsPayment = ({ smsText }: { smsText: string }) => {
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });

  return (
    <Surface style={styles.surface}>
      <View>
        <Text style={styles.title}>{t('payment.directionsForPaymentWithSms')}</Text>
        <View style={styles.row}>
          <Text style={styles.column}>{t('number')}</Text>
          <Text style={styles.columnBold}>1332</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.column}>{t('smsText')}</Text>
          <Text style={styles.columnBold}>{smsText}</Text>
        </View>
        <Divider style={styles.divider} />
      </View>
    </Surface>
  );
};

export default SmsPayment;

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    surface: {
      backgroundColor: colors.white,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 24,
      marginBottom: 20,
    },
    title: {
      ...text!.headerMedium,
      color: colors.primary,
      marginVertical: 0,
      alignSelf: 'center',
    },
    row: {
      flexDirection: 'row',
      marginVertical: 15,
    },
    column: {
      width: '50%',
      ...text!.regular,
      color: colors.primary,
      marginTop: 5,
    },
    columnBold: {
      width: '50%',
      ...text!.regularBold,
      color: colors.primary,
      marginTop: 5,
      textAlign: 'right'
    },
    divider: {
      height: 1,
      backgroundColor: colors.primary,
    },
  });
};
