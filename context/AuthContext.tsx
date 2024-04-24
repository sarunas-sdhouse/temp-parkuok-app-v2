import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useTranslation } from 'react-i18next';
import { IUser } from 'types/user';
import User from 'services/user';
import axios from 'axios';
import * as SplashScreen from 'expo-splash-screen';
import { UpdateLocalUser } from 'services/user';
import { set } from 'react-hook-form';
import { AppState } from 'react-native';
import Loader from 'components/Loader';

const tokenKey = process.env.EXPO_PUBLIC_TOKEN_KEY!;

interface AuthContext {
  authState?: { user: IUser | null; authenticated: boolean | null };
  setAuthState?: React.Dispatch<
    React.SetStateAction<{ user: IUser | null; authenticated: boolean | null }>
  >;
}

const AuthContext = createContext<AuthContext>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [authState, setAuthState] = useState<{
    user: IUser | null;
    authenticated: boolean | null;
  }>({
    user: null,
    authenticated: null,
  });

  const loadUser = async () => {
    const user = await SecureStore.getItemAsync(tokenKey);

    if (user) {
      const parsedUser = JSON.parse(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      const updatedUser = await UpdateLocalUser(setAuthState);
      setAuthState(prevState => ({
        ...prevState,
        user: updatedUser,
        authenticated: true,
      }));
    }
    setLoading(false);
    SplashScreen.hideAsync();
  };

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    loadUser();

    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadUser();
      }
    });

    return () => {
      appStateListener.remove();
    };
  }, []);

  const value = {
    authState,
    setAuthState,
  };

  if (loading) {
    return <Loader/>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};