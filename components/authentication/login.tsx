import { useState } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Input from 'components/Input';
import { useAppTheme, IStyles } from 'theme/theme';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userLoginSchema } from 'common/schemas/userSchema';
import { ILogin } from 'types/user';
import { TKeyofTranslation } from 'types/translations';
import { useAuth } from 'context/AuthContext';
import { Login } from 'services/auth';
import { Toast } from 'toastify-react-native';
import Loader from 'components/Loader';
import DividerWithText from 'components/DividerWithText';
import GoogleSignin from 'components/GoogleSignin';
import MainLayout from 'components/layouts/MainLayout';

const LoginPage = () => {
  const { t } = useTranslation();
  const { authState, setAuthState } = useAuth();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors });
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<ILogin>(userLoginSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  });

  type LoginFormField = keyof ILogin;

  const getLabelKey = (fieldName: LoginFormField): TKeyofTranslation<'lang'> =>
    `labels.${fieldName}` as TKeyofTranslation<'lang'>;

  const fieldLabels: Record<
    LoginFormField,
    {
      label: TKeyofTranslation<'lang'>;
      settings?: {
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        secureTextEntry?: boolean;
      };
    }
  > = {
    email: {
      label: getLabelKey('email'),
      settings: {
        autoCapitalize: 'none',
      },
    },
    password: {
      label: getLabelKey('password'),
      settings: {
        secureTextEntry: true,
      },
    },
  };

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      if (setAuthState) {
        const result = await Login(data, setAuthState);
        if (result) {
          router.replace(UserRoutes.HOME);
        }
      }
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
  };

  if (loading) return <Loader />;

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        {Object.keys(fieldLabels).map(key => {
          const name = key as LoginFormField;
          return (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field: { onChange, value } }) => (
                <View style={styles.input}>
                  <Input
                    settings={fieldLabels[name].settings}
                    value={value}
                    onChangeText={onChange}
                    labelText={t(getLabelKey(name))}
                    outlineColor={colors.grey}
                    bgColor={colors.white}
                    textColor={colors.black}
                    focusColor={colors.primary}
                    error={t(errors[name]?.message as TKeyofTranslation<'lang'>)}
                    dismissOnBlur={false}
                  />
                </View>
              )}
            />
          );
        })}
      </ScrollView>
      <Text
        onPress={() => router.push(UserRoutes.FORGOT_PASSWORD)}
        style={{
          ...text.interLight,
          ...styles.link,
          borderBottomWidth: 1,
          borderBottomColor: colors.primary,
        }}
      >
        {t('forgotPassword.title')}?
      </Text>
      <Button
        title={t('labels.login')}
        onPress={handleSubmit(onSubmit)}
        styles={styles.button}
        buttonColor={colors.primary}
        textColor={colors.white}
      />
      <DividerWithText text={t('or')} />
      <GoogleSignin />
      {/* <Text
        onPress={() => {}}
        style={{
          ...text.interLight,
          ...styles.continue,
          borderBottomWidth: 1,
          borderBottomColor: colors.primary,
        }}
      >
        {t('continueWithoutLoggingIn')}
      </Text> */}
    </View>
  );
};

export default LoginPage;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      marginTop: 24,
      paddingHorizontal: 30,
    },
    link: {
      alignSelf: 'flex-end',
      marginTop: -8,
    },
    input: {
      marginBottom: 16,
    },
    button: {
      marginTop: 40,
    },
    continue: {
      alignSelf: 'center',
    },
  });
};
