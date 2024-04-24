import { Text, View, StyleSheet } from 'react-native';
import { ICalculationData } from 'types/checkout';
import { useTranslation } from 'react-i18next';
import { formatTime, calculatePrice } from 'utils/helpers';
import { useAppTheme, IStyles } from 'theme/theme';
import { Divider } from 'react-native-paper';

interface ICalculationInfo {
  paymentData: ICalculationData | null;
}

const CalculationInfo = ({ paymentData }: ICalculationInfo) => {
  const { t } = useTranslation();
  const { text, colors } = useAppTheme();
  const styles = createStyles({ colors, text });

  const calculateDiscount = () => {
    if ((paymentData?.amount || 0) <= 0) {
      return paymentData?.amountWithoutDiscount || 0;
    }

    const discount =
      (paymentData?.amountWithoutDiscount || 0) - (paymentData?.amount || 0);
    return discount;
  };

  return (
    <View>
      <Text
        style={styles.title}
      >
        {t('payment.title')}
      </Text>
      <View style={styles.row}>
        <Text style={styles.column}>{t('payment.parkingTime')}</Text>
        <Text style={styles.columnBold}>{formatTime(paymentData?.fullTime || 0)}</Text>
      </View>
      <Divider style={styles.divider} />
      {paymentData?.amount !== paymentData?.amountWithoutDiscount && (
        <>
          <View style={styles.row}>
            <Text style={styles.column}>{t('payment.subTotal')}</Text>
            <Text style={styles.columnBold}>
              {calculatePrice(paymentData?.amountWithoutDiscount || 0)} €
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.column}>{t('payment.discount')}</Text>
            <Text style={styles.columnBold}>-{calculatePrice(calculateDiscount())} €</Text>
          </View>
          <Divider style={styles.divider} />
        </>
      )}
      <View style={styles.row}>
        <Text style={styles.column}>{t('payment.total')}</Text>
        <Text style={styles.columnBold}>
          {calculatePrice((paymentData?.amount || 0) < 0 ? 0 : paymentData?.amount || 0)}{' '}
          €
        </Text>
      </View>
      <Divider style={styles.divider} />
    </View>
  );
};

export default CalculationInfo;

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      // alignItems: 'center',
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
    title: {
      ...text!.headerMedium,
      color: colors.primary,
      marginVertical: 0,
      alignSelf: 'center',
    },
  });
};
