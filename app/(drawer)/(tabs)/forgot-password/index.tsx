import { useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Input from 'components/Input';
import { useAppTheme, IStyles } from 'theme/theme';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { router, Link } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import { ForgotPassword } from 'services/forgotPassword';
import { useForm, Controller, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userForgotPasswordSchema } from 'common/schemas/userSchema';
import { IForgotPassword } from 'types/user';
import { TKeyofTranslation } from 'types/translations';
import { Toast } from 'toastify-react-native';
import Loader from 'components/Loader';
import MainLayout from 'components/layouts/MainLayout';

const ForgotPasswordPage = () => {
  const { t, i18n } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors });
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<IForgotPassword>(userForgotPasswordSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  });

  type LoginFormField = keyof IForgotPassword;

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
  };

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    setLoading(true);

    const { email } = data;
    try {
      const result = await ForgotPassword({ email, language: i18n.language });
      if (result) {
        router.push(UserRoutes.REQUEST_SENT);
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
    <MainLayout
      title={`${t('forgotPassword.title')}?`}
      subtitle={t('forgotPassword.resetPasswordInTwoQuickSteps')}
    >
      <View style={styles.container}>
        {Object.keys(fieldLabels).map(key => {
          const name = key as LoginFormField;
          return (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field: { onChange, value } }) => (
                <Input
                  settings={fieldLabels[name].settings}
                  value={value}
                  onChangeText={onChange}
                  labelText={t(getLabelKey(name))}
                  placeholder={t('enterYourEmail')}
                  error={t(errors[name]?.message as TKeyofTranslation<'lang'>)}
                />
              )}
            />
          );
        })}
        <Button
          title={t('forgotPassword.resetPassword')}
          onPress={handleSubmit(onSubmit)}
          styles={styles.button}
          buttonColor={colors.primary}
          textColor={colors.white}
        />
      </View>
    </MainLayout>
  );
};

export default ForgotPasswordPage;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
      marginTop: 32,
    },
    button: {
      position: 'absolute',
      bottom: 0,
    },
    link: {
      color: colors.primary,
      alignSelf: 'flex-start',
      marginTop: 52,
    },
  });
};
