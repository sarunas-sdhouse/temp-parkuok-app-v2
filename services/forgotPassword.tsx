import axios from 'axios';
import { ApiRoutes } from 'common/constants/routes';

const apiUrl = process.env.EXPO_PUBLIC_API_URL!;

export const ForgotPassword = async ({
  email,
  language,
}: {
  email: string;
  language: string;
}) => {
  const result = await axios.post(
    `${apiUrl}${ApiRoutes.FORGOT_PASSWORD}`,
    {
      email,
      language,
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  return result;
};

export const CheckIsRecoveryCodeValid = async ({
  resetCode,
  userId,
}: {
  resetCode: string;
  userId: string;
}) => {
  const result = await axios.post(
    `${apiUrl}${ApiRoutes.CHECK_IS_RECOVERY_CODE_VALID}`,
    {
      resetCode,
      userId,
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  return result;
};

export const ChangePasswordByRecoveryCode = async ({
  newPassword,
  recoveryCode,
  email,
  id,
}: {
  newPassword: string;
  recoveryCode: string;
  email: string;
  id: string;
}) => {
  const result = await axios.put(
    `${apiUrl}${ApiRoutes.CHANGE_PASSWORD_BY_RECOVERY_CODE}`,
    {
      newPassword,
      recoveryCode,
      email,
      id,
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  return result;
};
