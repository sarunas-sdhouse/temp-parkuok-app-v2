import axios from 'axios';
import { ApiRoutes } from 'common/constants/routes';
import { IProfile, IChangePassword } from 'types/user';
import { IUser } from 'types/user';
import * as SecureStore from 'expo-secure-store';

const apiUrl = process.env.EXPO_PUBLIC_API_URL!;
const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY!;

export const UpdateLocalUser = async (
  setAuthState: React.Dispatch<React.SetStateAction<{ user: IUser | null; authenticated: boolean | null }>>
): Promise<IUser | null> => {
  const user = await SecureStore.getItemAsync(tokenKey);
  if(user) {
    const parsedUser = JSON.parse(user);
    const result = await User.GetUserById(parsedUser.id);

    if (result.status === 200) {
      setAuthState(prevState => ({
        ...prevState,
        user: prevState.user ? {
          ...prevState.user,
          ...result.data,
        } : null,
      }));
    }

    const updatedUser = {...result.data, token: parsedUser.token}
    await SecureStore.setItemAsync(tokenKey, JSON.stringify(updatedUser));

    return updatedUser;
  }
  return null;
};

const User = {
  GetUserById: async (id: string) => {
    const result = await axios.get(
      `${apiUrl}${ApiRoutes.USERS}?id=${id}`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
  },

  UpdateUser: async (
    {id, data}: {id: string, data: IProfile},
    setAuthState: React.Dispatch<React.SetStateAction<{ user: IUser | null; authenticated: boolean | null }>>
  ) => {
    const result = await axios.put(
      `${apiUrl}${ApiRoutes.USERS}`,
      {
        id,
        ...data,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );
    
    if (result.status === 200) {
      setAuthState(prevState => ({
        ...prevState,
        user: prevState.user ? {
          ...prevState.user,
          ...data,
        } : null,
      }));

      const user = await SecureStore.getItemAsync(tokenKey)
      if (user) {
        await SecureStore.setItemAsync(tokenKey, JSON.stringify({...result.data, token: JSON.parse(user).token}));
      }
    }

    return result;
  },

  ChangeUserPassword: async (
    {id, data}: {id: string, data: IChangePassword}
  ) => {
    const result = await axios.put(
      `${apiUrl}${ApiRoutes.CHANGE_PASSWORD}`,
      {
        id,
        ...data
      },
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

export default User;