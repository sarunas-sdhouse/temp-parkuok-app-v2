import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';
import { GoogleLogin } from 'services/auth';
import { router } from 'expo-router';
import { useAuth } from 'context/AuthContext';
import { UserRoutes } from 'common/constants/routes';
import { Toast } from 'toastify-react-native';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import GoogleIcon from 'assets/icons/Google';

const GoogleLoginPage = () => {
  const { t } = useTranslation();
  const { authState, setAuthState } = useAuth();
  const {
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID
  } = process.env;

  const configureGoogleSignin = GoogleSignin.configure({
    scopes: ['profile', 'email'],
    // webClientId: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    webClientId: '270757186542-in1duu31b9udmlc1fnefqs26bpslnvgh.apps.googleusercontent.com',
    // androidClientId: EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    // iosClientId: EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
    iosClientId: '270757186542-ke2htsatj9i18acghj77kmj9tqdaci92.apps.googleusercontent.com'
  });

  useEffect(() => {
    configureGoogleSignin;
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      const { idToken } = userInfo;
      if (idToken && setAuthState) {
        const result = await GoogleLogin({ token: idToken }, setAuthState);
        if (result) {
          router.replace(UserRoutes.HOME);
        }
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.error(t('errors.userCanceledLogin'), 'bottom');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.error(t('errors.signInInProgress'), 'bottom');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.error(t('errors.serviceNotAvailable'), 'bottom');
      } else {
        Toast.error(error.message, 'bottom');
      }
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={signIn}>
      <GoogleIcon />
      <Text style={styles.buttonText}>{t('googleSignIn')}</Text>
    </TouchableOpacity>
  );
};

export default GoogleLoginPage;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 14,
    height: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000000',
    borderWidth: 1,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    marginLeft: 16,
  },
});
