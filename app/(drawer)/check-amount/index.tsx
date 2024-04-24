import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Keyboard } from 'react-native';
import { Text, Surface, Switch } from 'react-native-paper';
import { useAppTheme, IStyles } from 'theme/theme';
import { useTranslation } from 'react-i18next';
import Input from 'components/Input';
import { formatLicensePlate } from 'utils/helpers';
import Button from 'components/Button';
import { useLocalStorage } from 'utils/useLocalStorage';
import Checkout from 'services/checkout';
import { Toast } from 'toastify-react-native';
import CalculationInfo from 'components/checkAmount/CalculationInfo';
import { ScrollView, Platform } from 'react-native';
import { ICalculationData } from 'types/checkout';
import DiscountInput from 'components/checkAmount/DiscountInput';
import PaymentMethods from 'components/checkAmount/PaymentMethods';
import * as WebBrowser from 'expo-web-browser';
import LogosLine from 'components/checkAmount/LogosLine';
import SmsPayment from 'components/checkAmount/SmsPayment';
import { generateSms } from 'utils/helpers';
import { Link, useLocalSearchParams } from 'expo-router';
import { UpdateLocalUser } from 'services/user';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import MainLayout from 'components/layouts/MainLayout';

export default function Page() {
  const { plate: queryPlate } = useLocalSearchParams();
  const { text, colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const styles = createStyles({ colors, text });
  const [licensePlates, setLicensePlates] = useLocalStorage<string[]>(
    'licensePlates',
    [],
  );
  const [paymentData, setPaymentData] = useState<ICalculationData | null>(null);
  const [switchValue, setSwitchValue] = useState(licensePlates && !!licensePlates.length);
  const [isValueSetByUser, setIsValueSetByUser] = useState(false);

  useEffect(() => {
    if (
      (licensePlates && !!licensePlates.length) ||
      (licensePlates && value === licensePlates[licensePlates.length - 1])
    ) {
      setSwitchValue(true);
    }
  }, [licensePlates?.length]);

  useEffect(() => {
    if (
      switchValue &&
      licensePlates &&
      value !== licensePlates[licensePlates.length - 1]
    ) {
      setValue(licensePlates[licensePlates.length - 1]);
      setIsValueSetByUser(false);
    } else if (!switchValue && value !== '' && !isValueSetByUser) {
      setValue('');
    }
  }, [switchValue, licensePlates, value, isValueSetByUser]);

  const searchLicensePlate = async () => {
    Keyboard.dismiss();
    const trimmedValue = value.trim();
    if (trimmedValue !== '') {
      setLoading(true);
      setPaymentData(null);
      const formattedPlate = formatLicensePlate(trimmedValue);
      if (licensePlates && !licensePlates.includes(formattedPlate)) {
        const newPlates = [...licensePlates, formattedPlate];
        await setLicensePlates(newPlates);
      }

      try {
        const result = await Checkout.CalculateByPlate({
          plate: formattedPlate,
          discountCode: null,
        });
        setPaymentData(result.data);
        // setValue('');
        router.push(
          `/check-amount/ticket?paymentData=${encodeURIComponent(
            JSON.stringify(result.data),
          )}&plate=${encodeURIComponent(JSON.stringify(formattedPlate))}`,
        );
      } catch (error: any) {
        setPaymentData(null);
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

  return (
    <MainLayout title={t('checkParkingPrice')}>
      <View style={styles.container}>
        <View>
          <ScrollView
            keyboardShouldPersistTaps={Platform.OS === 'ios' ? 'handled' : 'never'}
          >
            <Text style={styles.inputText}>{t('enterPlate')}</Text>
            <Input
              placeholder={t('licensePlate')}
              value={value}
              onChangeText={val => {
                setValue(val);
                setIsValueSetByUser(true);
              }}
              onSubmitEditing={searchLicensePlate}
              disabled={switchValue === null ? undefined : switchValue}
            />
            {licensePlates && !!licensePlates.length && (
              <View style={styles.switchContainer}>
                <Switch
                  value={switchValue === null ? undefined : switchValue}
                  onValueChange={() => setSwitchValue(!switchValue)}
                />
                <View style={styles.switchText__wrapper}>
                  <Text style={styles.switchText}>{`${t('activeLicensePlate')} ${
                    licensePlates && '(' + licensePlates[licensePlates.length - 1] + ')'
                  }`}</Text>
                </View>
              </View>
            )}
            <Text
              onPress={() => router.push(UserRoutes.MY_PLATES)}
              style={styles.linkText}
            >
              {t('myLicensePlates')}
            </Text>
          </ScrollView>
        </View>
        <Button
          styles={styles.activeButton}
          title={t('labels.calculate')}
          onPress={searchLicensePlate}
          disabled={loading || value === ''}
        />
      </View>
    </MainLayout>
  );
}

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      marginTop: 40,
      flex: 1,
    },
    inputText: {
      marginBottom: 8,
      ...text?.regular,
    },
    paymentInfoContainer: {
      width: '100%',
    },
    switchContainer: {
      height: 20,
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 30,
    },
    switchText__wrapper: {
      flex: 1,
      height: 100,
    },
    switchText: {
      marginLeft: 8,
      ...text?.regular,
    },
    linkText: {
      ...text?.regular,
      color: colors.darkGrey,
      marginTop: 16,
    },
    surface: {
      backgroundColor: colors.white,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 24,
      marginVertical: 20,
    },
    activeButton: {
      position: 'absolute',
      bottom: 0,
    },
  });
};
