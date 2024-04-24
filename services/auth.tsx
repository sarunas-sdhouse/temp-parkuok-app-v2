import axios from 'axios';
import { ApiRoutes } from 'common/constants/routes';
import * as SecureStore from 'expo-secure-store';
import { IRegister, ILogin, IGoogleLogin } from 'types/user';
import { useAuth } from 'context/AuthContext';
import { IUser } from 'types/user';

const apiUrl = process.env.EXPO_PUBLIC_API_URL!;
const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY!;

export const Register = async (data: IRegister) => {
  const result = await axios.post(`${apiUrl}${ApiRoutes.REGISTER}`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return result.data;
};

export const Login = async (
  data: ILogin,
  setAuthState: React.Dispatch<
    React.SetStateAction<{ user: IUser | null; authenticated: boolean | null }>
  >,
) => {
  const result = await axios.post(`${apiUrl}${ApiRoutes.LOGIN}`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (result.data.user) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.user.token}`;
    await SecureStore.setItemAsync(tokenKey, JSON.stringify(result.data.user));
    if (setAuthState) setAuthState({ user: result.data.user, authenticated: true });
  }

  return result;
};

export const GoogleLogin = async (
  data: IGoogleLogin,
  setAuthState: React.Dispatch<
    React.SetStateAction<{ user: IUser | null; authenticated: boolean | null }>
  >,
) => {
  const result = await axios.post(`${apiUrl}${ApiRoutes.LOGIN}`, data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (result.data.user) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.user.token}`;
    await SecureStore.setItemAsync(tokenKey, JSON.stringify(result.data.user));
    if (setAuthState) setAuthState({ user: result.data.user, authenticated: true });
  }

  return result;
};

export const Logout = async (
  setAuthState: React.Dispatch<
    React.SetStateAction<{ user: IUser | null; authenticated: boolean | null }>
  >,
) => {
  await SecureStore.deleteItemAsync(tokenKey);
  delete axios.defaults.headers.common['Authorization'];

  if (setAuthState) setAuthState({ user: null, authenticated: false });
};

export const DeleteUser = async (id: string, setAuthState: React.Dispatch<
  React.SetStateAction<{ user: IUser | null; authenticated: boolean | null }>
>) => {

  const result = await axios.delete(`${apiUrl}${ApiRoutes.USERS}?id=${id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if(result) await Logout(setAuthState);

  return result;
}
