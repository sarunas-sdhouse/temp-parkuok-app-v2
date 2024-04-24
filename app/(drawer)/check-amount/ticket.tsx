import { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import MainLayout from 'components/layouts/MainLayout';
import TicketImage from 'assets/images/Ticket';
import { useAppTheme, IStyles } from 'theme/theme';
import ProgressWidget from 'components/widgets/ProgressWidget';
import TimeIcon from 'assets/icons/Time';
import LocationIcon from 'assets/icons/Location';
import CreditCardIcon from 'assets/icons/CreditCard2';
import { useLocalSearchParams, router } from 'expo-router';
import { formatTime, calculatePrice, generateSms } from 'utils/helpers';
import { ICalculationData } from 'types/checkout';
import DiscountInput from 'components/checkAmount/DiscountInput';
import PaymentMethods from 'components/checkAmount/PaymentMethods';
import * as Linking from 'expo-linking';
import Checkout from 'services/checkout';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'context/AuthContext';
import { UpdateLocalUser } from 'services/user';
import { UserRoutes } from 'common/constants/routes';
import { Toast } from 'toastify-react-native';

type ParamsType = {
  paymentData?: ICalculationData;
  plate?: string;
};

const Ticket = () => {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const styles = createStyles({ colors });
  const local = useLocalSearchParams();
  const params: ParamsType = {
    paymentData: local.paymentData ? JSON.parse(local.paymentData as string) : undefined,
    plate: local.plate ? JSON.parse(local.plate as string) : undefined,
  };
  const [payWithSms, setPayWithSms] = useState(false);
  const [smsText, setSmsText] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(params.paymentData);
  const { authState, setAuthState } = useAuth();

  const calculateDiscount = () => {
    if ((paymentData?.amount || 0) <= 0) {
      return paymentData?.amountWithoutDiscount || 0;
    }

    const discount =
      (paymentData?.amountWithoutDiscount || 0) - (paymentData?.amount || 0);
    return discount;
  };

  const data = [
    {
      title: t('payment.parkingTime'),
      subtitle: formatTime(paymentData?.fullTime || 0),
      icon: <TimeIcon />,
    },
    {
      title: 'Location',
      subtitle: 'Sukilėlių pr. 52, Kaunas',
      icon: <LocationIcon />,
    },
  ];

  if (paymentData?.amount !== paymentData?.amountWithoutDiscount) {
    data.push(
      {
        title: t('payment.subTotal'),
        subtitle: `${calculatePrice(paymentData?.amountWithoutDiscount || 0)} €`,
        icon: <CreditCardIcon />,
      },
      {
        title: t('payment.discount'),
        subtitle: `-${calculatePrice(calculateDiscount())} €`,
        icon: <CreditCardIcon />,
      },
    );
  }

  data.push({
    title: t('payment.total'),
    subtitle:
      (params.paymentData?.amount || 0) > 0
        ? `${calculatePrice(
            (params.paymentData?.amount || 0) < 0 ? 0 : paymentData?.amount || 0,
          )} €`
        : t('payment.youDontNeedToPayText'),
    icon: <CreditCardIcon />,
  });

  const onPayWithSmsClick = async () => {
    if (params.plate && paymentData?.amount) {
      const sms = generateSms(params.plate, paymentData.amount);
      setSmsText(sms);
      const url = `sms:1332;?&body=${encodeURIComponent(sms)}`;
      Linking.openURL(url);
      setPayWithSms(true);
      await Checkout.SMSLog(paymentData, params.plate, params.plate, sms);
    }
  };

  const onPaymentClick = async () => {
    if (params.plate) {
      setLoading(true);
      try {
        const result = await Checkout.PaymentRequestToKevin({
          plate: params.plate,
          locale: i18n.language,
          discount: discountCode,
        });
        if (result.data.url) {
          // const browserResult = await WebBrowser.openBrowserAsync(result.data.url);
          await Linking.openURL(result.data.url);
          // if (browserResult.type === 'dismiss') {
          if (setAuthState) {
            await UpdateLocalUser(setAuthState);
            router.replace(UserRoutes.HOME);
          }
          // }
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
    }
  };

  return (
    <MainLayout
      title={`${t('ticket')} #${paymentData?.ticket || '000'}`}
      style={{ header: { paddingBottom: 24 } }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <TicketImage style={styles.image} />
        <ProgressWidget style={styles.pannel} data={data} />
        {paymentData &&
        ((paymentData.amount && paymentData.amount > 0) ||
          paymentData.amountWithoutDiscount > 0) ? (
          <>
            <DiscountInput
              setDiscountCode={setDiscountCode}
              discountCode={discountCode}
              value={params.plate || ''}
              isLoading={loading}
              setSmsText={setSmsText}
              setLoading={setLoading}
              setCalculationData={setPaymentData}
            />
            <PaymentMethods
              plate={params.plate || ''}
              setLoading={setLoading}
              discountCode={discountCode}
              isLoading={loading}
              calculationData={paymentData}
              onPayWithSmsClick={onPayWithSmsClick}
              onPaymentClick={onPaymentClick}
              smsText={smsText}
            />
          </>
        ) : null}
      </ScrollView>
    </MainLayout>
  );
};

export default Ticket;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    image: {
      alignSelf: 'center',
      marginTop: 32,
    },
    pannel: {
      marginTop: 26,
    },
  });
};
