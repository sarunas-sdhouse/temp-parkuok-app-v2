import { useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { useAppTheme, IStyles } from 'theme/theme';
import { Text, Modal, Portal } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import Input from 'components/Input';
import { changePasswordSchema } from 'common/schemas/userSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { IChangePassword } from 'types/user';
import { TKeyofTranslation } from 'types/translations';
import Button from 'components/Button';
import User from 'services/user';
import { useAuth } from 'context/AuthContext';
import { Toast } from 'toastify-react-native';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import Loader from 'components/Loader';

interface IChangePasswordModalProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

const ChangePasswordModal = ({
  modalVisible,
  setModalVisible,
}: IChangePasswordModalProps) => {
  const { authState, setAuthState } = useAuth();
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const styles = createStyles({ colors });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver<IChangePassword>(changePasswordSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  });

  type ChangeDataFormField = keyof IChangePassword;

  const getLabelKey = (fieldName: ChangeDataFormField): TKeyofTranslation<'lang'> =>
    `labels.${fieldName}` as TKeyofTranslation<'lang'>;

  const fieldLabels: Record<
    ChangeDataFormField,
    {
      label: TKeyofTranslation<'lang'>;
      settings?: {
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        secureTextEntry?: boolean;
      };
    }
  > = {
    oldPassword: {
      label: getLabelKey('oldPassword'),
      settings: {
        autoCapitalize: 'none',
        secureTextEntry: true,
      },
    },
    newPassword: {
      label: getLabelKey('newPassword'),
      settings: {
        autoCapitalize: 'none',
        secureTextEntry: true,
      },
    },
    repeatPassword: {
      label: getLabelKey('repeatPassword'),
      settings: {
        autoCapitalize: 'none',
        secureTextEntry: true,
      },
    },
  };

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    setLoading(true);

    if (!authState?.user?.id || !setAuthState) return;

    try {
      const result = await User.ChangeUserPassword({ id: authState.user.id, data });
      if (result) {
        Toast.success(t('success.userUpdated'));
        router.push(UserRoutes.HOME);
        setModalVisible(false);
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

  const onCancel = () => {
    setModalVisible(false);
    reset();
  };

  if (loading)
    return (
      <Portal>
        <Modal visible={true}>
          <Loader />
        </Modal>
      </Portal>
    );

  return (
    <Portal>
      <Modal
        visible={modalVisible}
        onDismiss={onCancel}
        contentContainerStyle={styles.modalStyle}
      >
        <Text style={{ ...text.header, color: colors.primary, marginBottom: 24 }}>
          {t('labels.changePassword')}
        </Text>
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
                    disabled={loading}
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
          title={t('labels.cancel')}
          mode="outlined"
          textColor={colors.danger}
          outlineColor={colors.danger}
          onPress={onCancel}
          styles={{ marginTop: 16 }}
          buttonColor={colors.white}
        />
        <Button
          title={t('labels.update')}
          onPress={handleSubmit(onSubmit)}
          styles={{ marginTop: 16 }}
          buttonColor={colors.primary}
          textColor={colors.white}
        />
      </Modal>
    </Portal>
  );
};

export default ChangePasswordModal;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    modalStyle: {
      backgroundColor: colors.white,
      padding: 20,
      marginHorizontal: 20,
      borderRadius: 16,
    },
    input: {
      marginBottom: 16,
    }
  });
};
