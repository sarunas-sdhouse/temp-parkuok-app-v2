import { Text, View, StyleSheet, Keyboard } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import MainLayout from 'components/layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { INewPassword } from 'types/user';
import { newPasswordSchema } from 'common/schemas/userSchema';
import { TKeyofTranslation } from 'types/translations';
import Button from 'components/Button';
import Input from 'components/Input';
import { Toast } from 'toastify-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import { CheckIsRecoveryCodeValid, ChangePasswordByRecoveryCode } from 'services/forgotPassword';
import KeyboardVisibleContext from 'context/KeyboardVisibleContext';
import Loader from 'components/Loader';

const NewPassword = () => {
  const { userId, passwordRecoveryCode } = useLocalSearchParams();
  const { t } = useTranslation();
  const styles = createStyles();
  const [loading, setLoading] = useState(false);
  const [isRecoveryCodeValid, setIsRecoveryCodeValid] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    id: '',
    recoveryCode: '',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<INewPassword>(newPasswordSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  });

  type ChangeDataFormField = keyof INewPassword;

  const getLabelKey = (fieldName: ChangeDataFormField): TKeyofTranslation<'lang'> =>
    `labels.${fieldName}` as TKeyofTranslation<'lang'>;

  const fieldLabels: Record<
    ChangeDataFormField,
    {
      label: TKeyofTranslation<'lang'>;
      placeholder: string;
      settings?: {
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        secureTextEntry?: boolean;
      };
    }
  > = {
    newPassword: {
      label: getLabelKey('newPassword'),
      placeholder: 'forgotPassword.enterNewPassword',
      settings: {
        autoCapitalize: 'none',
        secureTextEntry: true,
      },
    },
    repeatPassword: {
      label: getLabelKey('repeatPassword'),
      placeholder: 'forgotPassword.repeatNewPassword',
      settings: {
        autoCapitalize: 'none',
        secureTextEntry: true,
      },
    },
  };
  
  const resetPassword = async (data: any) => {
    Keyboard.dismiss();

    if (
      !isRecoveryCodeValid ||
      !userData.email ||
      !userData.id ||
      !userData.recoveryCode
    ) {
      return;
    }

    setLoading(true);

    try {
      const result = await ChangePasswordByRecoveryCode({
        email: userData.email,
        id: userData.id,
        newPassword: data.newPassword,
        recoveryCode: userData.recoveryCode,
      });

      if (result) {
        Toast.success(t('success.userUpdated'));
        router.push(`${UserRoutes.AUTHENTICATION}?idx=1`);
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

  const checkIsRecoveryCodeValid = async (recoveryCode: string, userId: string) => {
    try {
      const response = await CheckIsRecoveryCodeValid({
        resetCode: recoveryCode,
        userId,
      });

      if (response.status === 200 && response.data.email) {
        setIsRecoveryCodeValid(true);
        setUserData({
          email: response.data.email,
          id: userId,
          recoveryCode,
        });
        return;
      }

      setIsRecoveryCodeValid(false);
    } catch (error) {
      setIsRecoveryCodeValid(false);
    }
  };

  useEffect(() => {
    if (!passwordRecoveryCode || !userId) {
      router.push(`${UserRoutes.AUTHENTICATION}?idx=1`);
      return;
    }

    checkIsRecoveryCodeValid(
      passwordRecoveryCode as string,
      userId as string,
    );
  }, []);

  if (loading) return <Loader />;

  return (
    <MainLayout
      title={t('forgotPassword.newPassword')}
      subtitle={t('forgotPassword.createNewPassword')}
    >
      <View style={styles.container}>
        {Object.keys(fieldLabels).map(key => {
          const name = key as ChangeDataFormField;
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
                    placeholder={t(fieldLabels[name].placeholder)}
                    error={t(errors[name]?.message as TKeyofTranslation<'lang'>)}
                  />
                </View>
              )}
            />
          );
        })}
        <Button
          title={t('labels.changePassword')}
          onPress={handleSubmit(resetPassword)}
          styles={styles.button}
          // buttonColor={colors.primary}
          // textColor={colors.white}
        />
      </View>
    </MainLayout>
  );
};

export default NewPassword;

const createStyles = () => {
  const isKeyboardVisible = useContext(KeyboardVisibleContext);

  return StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
      marginTop: 48,
    },
    input: {
      marginBottom: 16,
    },
    button: {
      position: 'absolute',
      bottom: isKeyboardVisible ? -67 : 0,
    },
  });
};
