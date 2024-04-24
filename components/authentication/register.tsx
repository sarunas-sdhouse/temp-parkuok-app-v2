import { useState } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import Input from 'components/Input';
import { useAppTheme, IStyles } from 'theme/theme';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema } from 'common/schemas/userSchema';
import { IRegister } from 'types/user';
import { TKeyofTranslation } from 'types/translations';
import { useAuth } from 'context/AuthContext';
import { Register } from 'services/auth';
import { Toast } from 'toastify-react-native';
import Loader from 'components/Loader';
import DividerWithText from 'components/DividerWithText';
import GoogleSignin from 'components/GoogleSignin';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { authState } = useAuth();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors });
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<IRegister>(userSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  });

  type RegisterFormField = keyof IRegister;

  const getLabelKey = (fieldName: RegisterFormField): TKeyofTranslation<'lang'> =>
    `labels.${fieldName}` as TKeyofTranslation<'lang'>;

  const fieldLabels: Record<
    RegisterFormField,
    {
      label: TKeyofTranslation<'lang'>;
      settings?: {
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        secureTextEntry?: boolean;
      };
    }
  > = {
    name: {
      label: getLabelKey('name'),
      settings: { autoCapitalize: 'words' },
    },
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
    repeatPassword: {
      label: getLabelKey('repeatPassword'),
      settings: {
        secureTextEntry: true,
      },
    },
  };

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const result = await Register(data);
      if (result) {
        Toast.success(t('success.userCreated'));
        router.replace({
          pathname: UserRoutes.AUTHENTICATION,
          params: { email: result.data.email },
        });
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
          const name = key as RegisterFormField;
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
        <Button
          title={t('labels.register')}
          onPress={handleSubmit(onSubmit)}
          styles={styles.button}
          buttonColor={colors.primary}
          textColor={colors.white}
        />
        <DividerWithText text={t('or')} />
        <GoogleSignin />
      </ScrollView>
    </View>
  );
};

export default RegisterPage;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      marginTop: 24,
      paddingHorizontal: 30
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
