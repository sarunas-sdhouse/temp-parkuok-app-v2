import { View, StyleSheet, Keyboard } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';
import { useTranslation } from 'react-i18next';
import Input from 'components/Input';
import Button from 'components/Button';
import { Toast } from 'toastify-react-native';
import { ICalculationData } from 'types/checkout';
import Checkout from 'services/checkout';
import { generateSms } from 'utils/helpers';
import { formatLicensePlate } from 'utils/helpers';

interface IDiscountInput {
  value: string;
  isLoading: boolean;
  setCalculationData: (data: ICalculationData) => void;
  setLoading: (loading: boolean) => void;
  setSmsText: (text: string) => void;
  discountCode: string;
  setDiscountCode: (code: string) => void;
}

const DiscountInput = ({
  discountCode,
  setDiscountCode,
  value,
  isLoading,
  setSmsText,
  setCalculationData,
  setLoading,
}: IDiscountInput) => {
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors });

  const applyDiscount = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const formattedPlate = formatLicensePlate(value);
      const response = await Checkout.CalculateByPlate({
        plate: formattedPlate,
        discountCode: discountCode || null,
      });
      if (response.data.paymentMethods.sms) {
        const sms = generateSms(value, response.data.amount);
        setSmsText(sms);
        await Checkout.SMSLog(response.data, formattedPlate, value, sms);
      }
      setCalculationData(response.data);
    } catch (error: any) {
      setDiscountCode('');
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.input}>
        <Input
          labelText={t('applyDiscountCode')}
          placeholder={'05KLK0'}
          value={discountCode}
          onChangeText={val => setDiscountCode(val)}
          onSubmitEditing={applyDiscount}
          disabled={isLoading}
        />
      </View>
      <View>
        <Button
          title={t('labels.apply')}
          onPress={applyDiscount}
          disabled={isLoading}
          buttonColor={colors.primary}
          textColor={colors.white}
        />
      </View>
    </View>
  );
};

export default DiscountInput;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      width: '100%',
      marginTop: 24,
    },
    input: {
      flex: 1,
      marginRight: 16,
    },
  });
};
