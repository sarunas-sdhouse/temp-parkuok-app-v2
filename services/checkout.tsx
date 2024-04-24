import axios from 'axios';
import { ApiRoutes } from 'common/constants/routes';
import {
  IAddTokens,
  ICalculateByPlate,
  ICalculationData,
  IPaymentRequest,
} from 'types/checkout';

const apiUrl = process.env.EXPO_PUBLIC_API_URL!;

const Checkout = {
  AddTokens: async (
    { id, data }: { id: string; data: IAddTokens },
    // setAuthState: React.Dispatch<React.SetStateAction<{ user: IUser | null; authenticated: boolean | null }>>
  ) => {
    const result = await axios.post(
      `${apiUrl}${ApiRoutes.PAYMENT_ADD_TOKENS}`,
      {
        userId: id,
        ...data,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    // if (result.status === 200) {
    //   setAuthState(prevState => ({
    //     ...prevState,
    //     user: prevState.user ? {
    //       ...prevState.user,
    //       ...data,
    //     } : null,
    //   }));

    //   const user = await SecureStore.getItemAsync(tokenKey)
    //   if (user) {
    //     await SecureStore.setItemAsync(tokenKey, JSON.stringify({...result.data, token: JSON.parse(user).token}));
    //   }
    // }

    return result;
  },

  CalculateByPlate: async (data: ICalculateByPlate) => {
    const result = await axios.post(`${apiUrl}${ApiRoutes.CALCULATE_BY_PLATE}`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return result;
  },

  SMSLog: async (
    data: ICalculationData,
    sanitizePlate: string,
    plate: string,
    sms: string,
  ) => {
    const result = await axios.post(
      `${apiUrl}${ApiRoutes.SMS_LOG}`,
      { data, sanitizePlate, plate, sms },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
  },

  PaymentRequestToKevin: async (data: IPaymentRequest) => {
    const result = await axios.post(
      `${apiUrl}${ApiRoutes.PAYMENT_REQUEST_TO_KEVIN}`,
      data,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
  },

  PayWithCredits: async (plate: string, userId: string, discountCode?: string) => {
    const result = await axios.post(
      `${apiUrl}${ApiRoutes.PAY_WITH_CREDITS}`,
      { plate, userId, discountCode },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
  },

  PayWithDiscountCode: async (plate: string, discountCode: string) => {
    const result = await axios.post(
      `${apiUrl}${ApiRoutes.PAY_WITH_DISCOUNT_CODE}`,
      { plate, discountCode },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
  },
};

export default Checkout;
