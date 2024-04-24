import { useState } from 'react';
import { View, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { Surface, Text, Divider, Switch } from 'react-native-paper';
import Input from 'components/Input';
import { useAppTheme, IStyles } from 'theme/theme';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateUserSchema } from 'common/schemas/userSchema';
import { IProfile } from 'types/user';
import { TKeyofTranslation } from 'types/translations';
import { Toast } from 'toastify-react-native';
import Loader from 'components/Loader';
import { useAuth } from 'context/AuthContext';
import User from 'services/user';
import ChangePasswordModal from 'components/modals/ChangePassword';
import MainLayout from 'components/layouts/MainLayout';
import ButtonComponent from 'components/ButtonComponent';
import KeyIcon from 'assets/icons/Key';
import TrashIcon from 'assets/icons/Trash';

const Profile = () => {
  const { authState, setAuthState } = useAuth();
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<IProfile>(updateUserSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
    defaultValues: {
      name: authState?.user?.name || '',
      email: authState?.user?.email || '',
    },
  });

  type ChangeDataFormField = keyof IProfile;

  const getLabelKey = (fieldName: ChangeDataFormField): TKeyofTranslation<'lang'> =>
    `labels.${fieldName}` as TKeyofTranslation<'lang'>;

  const fieldLabels: Record<
    ChangeDataFormField,
    {
      label: TKeyofTranslation<'lang'>;
      settings?: {
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        secureTextEntry?: boolean;
        tooltip?: string;
        disabled?: boolean;
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
        tooltip: t('tooltips.youMustVerify'),
        disabled: true,
      },
    },
  };

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    setLoading(true);

    if (!authState?.user?.id || !setAuthState) return;

    try {
      const result = await User.UpdateUser({ id: authState.user.id, data }, setAuthState);
      if (result) {
        Toast.success(t('success.userUpdated'));
        router.push(UserRoutes.HOME);
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
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <MainLayout title={t('pages.profile')}>
        <View style={styles.container}>
          <ChangePasswordModal
            modalVisible={modalVisible}
            setModalVisible={val => setModalVisible(val)}
          />
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
                      outlineColor={colors.grey}
                      bgColor={colors.white}
                      textColor={colors.black}
                      focusColor={colors.primary}
                      error={t(errors[name]?.message as TKeyofTranslation<'lang'>)}
                    />
                  </View>
                )}
              />
            );
          })}
          <Button
            title={t('labels.saveChanges')}
            onPress={handleSubmit(onSubmit)}
            textColor={colors.white}
            styles={{ marginTop: 20 }}
          />
          <Divider style={styles.divider} />
          {/* <ButtonComponent
            noClickAction
            style={styles.buttonComponent}
            label={t('labels.emailNotifications')}
            onPress={() => {}}
            component={
              <Switch
                style={{marginRight: -2}}
                value={switchValue}
                onValueChange={() => setSwitchValue(!switchValue)}
              />
            }
          /> */}
          <ButtonComponent
            style={styles.buttonComponent}
            label={t('labels.changePassword')}
            onPress={() => setModalVisible(true)}
            component={<KeyIcon />}
          />
          <ButtonComponent
            style={styles.buttonComponent}
            label={t('labels.deleteAccount')}
            onPress={() => router.push(UserRoutes.DELETE)}
            component={<TrashIcon />}
          />
        </View>
      </MainLayout>
    </ScrollView>
  );
};

export default Profile;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    container: {
      marginTop: 32,
    },
    link: {
      color: colors.primary,
      alignSelf: 'flex-start',
      marginTop: 52,
    },
    modalStyle: {
      backgroundColor: colors.white,
      padding: 20,
      marginHorizontal: 20,
      borderRadius: 16,
    },
    input: {
      marginBottom: 16,
    },
    divider: {
      height: 1,
      backgroundColor: colors.primary,
      marginVertical: 24,
    },
    buttonComponent: {
      marginBottom: 16,
    },
  });
};
