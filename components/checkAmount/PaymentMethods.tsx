import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme, IStyles } from 'theme/theme';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { Toast } from 'toastify-react-native';
import { ICalculationData } from 'types/checkout';
import Checkout from 'services/checkout';
import { formatLicensePlate } from 'utils/helpers';
import { useAuth } from 'context/AuthContext';
import User from 'services/user';
import { UserRoutes } from 'common/constants/routes';
import { router } from 'expo-router';
import { UpdateLocalUser } from 'services/user';

interface IPaymentMethods {
  calculationData: ICalculationData | null;
  onPayWithSmsClick: () => void;
  onPaymentClick: () => void;
  setLoading: (value: boolean) => void;
  smsText: string;
  isLoading: boolean;
  plate: string;
  discountCode?: string;
}

const PaymentMethods = ({
  plate,
  setLoading,
  discountCode,
  isLoading,
  calculationData,
  onPayWithSmsClick,
  onPaymentClick,
  smsText,
}: IPaymentMethods) => {
  const { t } = useTranslation();
  const { authState, setAuthState } = useAuth();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });
  const tokens = parseFloat(authState?.user?.credits || '0') || 0;

  const payWithDiscountCode = async () => {
    if (discountCode) {
      setLoading(true);
      try {
        const payment = await Checkout.PayWithDiscountCode(
          formatLicensePlate(plate),
          discountCode,
        );
        router.replace(`${UserRoutes.SUCCESS}?order=${payment.data.paymentId}`);
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
    }
  };

  const payWithCredits = async () => {
    setLoading(true);
    try {
      if (authState?.user) {
        const payment = await Checkout.PayWithCredits(
          formatLicensePlate(plate),
          authState?.user.id,
          discountCode,
        );
        const result = await User.GetUserById(authState?.user.id);

        if (result && setAuthState) await UpdateLocalUser(setAuthState);
        router.replace(`${UserRoutes.SUCCESS}?order=${payment.data.paymentId}`);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const serverErrorMessage = error.response.data.message;
        Toast.error(t(`${serverErrorMessage}`), 'bottom');
      } else {
        Toast.error(error.message, 'bottom');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {(calculationData?.amount || 0) <= 0 &&
        (calculationData?.amountWithoutDiscount || 0) > 0 && (
          <Button
            title={t('labels.payWithDiscountCode')}
            mode="outlined"
            textColor={colors.primary}
            outlineColor={colors.primary}
            onPress={payWithDiscountCode}
            styles={{ marginTop: 16 }}
            buttonColor={colors.white}
            disabled={isLoading}
          />
        )}
      {(calculationData?.amount || 0) > 0 && (
        <View>
          {calculationData?.paymentMethods.sms && (
            <Button
              title={t('labels.sms')}
              mode="outlined"
              textColor={colors.primary}
              outlineColor={colors.primary}
              onPress={onPayWithSmsClick}
              styles={{ marginTop: 16 }}
              buttonColor={colors.white}
              disabled={isLoading}
            />
          )}
          {calculationData?.paymentMethods.kevin && (
            <Button
              title={t('labels.bankOrCard')}
              mode="outlined"
              textColor={colors.primary}
              outlineColor={colors.primary}
              onPress={onPaymentClick}
              styles={{ marginTop: 16 }}
              buttonColor={colors.white}
              disabled={isLoading}
            />
          )}
          {tokens >= (calculationData?.amount || 0) / 100 && (
            <Button
              title={t('labels.payWithCredits')}
              mode="outlined"
              textColor={colors.primary}
              outlineColor={colors.primary}
              onPress={payWithCredits}
              styles={{ marginTop: 16 }}
              buttonColor={colors.white}
              disabled={isLoading}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default PaymentMethods;

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    }
  });
};
