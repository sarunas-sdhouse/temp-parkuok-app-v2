import { useState, useContext } from 'react';
import { View, StyleSheet, Keyboard, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import Input from 'components/Input';
import { useAppTheme, IStyles } from 'theme/theme';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addTokensSchema } from 'common/schemas/addTokensSchema';
import { IAddTokens } from 'types/checkout';
import { TKeyofTranslation } from 'types/translations';
import { Toast } from 'toastify-react-native';
import Loader from 'components/Loader';
import { useAuth } from 'context/AuthContext';
import Checkout from 'services/checkout';
import { UpdateLocalUser } from 'services/user';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import { Linking } from 'react-native';
import MainLayout from 'components/layouts/MainLayout';
import AddCreditsImage from 'assets/images/AddCredits';
import KeyboardVisibleContext from 'context/KeyboardVisibleContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { imageSizeCalculator } from 'utils/helpers';

const AddCredits = () => {
  const { authState, setAuthState } = useAuth();
  const { t } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors });
  const [loading, setLoading] = useState(false);

  let imageHeight = imageSizeCalculator(140)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<IAddTokens>(addTokensSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
  });

  type ChangeDataFormField = keyof IAddTokens;

  const getLabelKey = (fieldName: ChangeDataFormField): TKeyofTranslation<'lang'> =>
    `labels.${fieldName}` as TKeyofTranslation<'lang'>;

  const fieldLabels: Record<
    ChangeDataFormField,
    {
      label: TKeyofTranslation<'lang'>;
      settings?: {
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        secureTextEntry?: boolean;
        keyboardType?: 'default' | 'numeric';
      };
    }
  > = {
    amount: {
      label: getLabelKey('amount'),
      settings: {
        autoCapitalize: 'none',
        keyboardType: 'numeric',
      },
    },
  };

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    setLoading(true);

    if (!authState?.user?.id) return;

    try {
      const result = await Checkout.AddTokens({ id: authState.user.id, data });
      if (result.data.url) {
        await Linking.openURL(result.data.url);
        if (setAuthState) {
          await UpdateLocalUser(setAuthState);
          router.replace(UserRoutes.SUCCESS);
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
    <View style={styles.mainWrapper}>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false} extraScrollHeight={8}>
        <MainLayout
          style={{ image: { height: imageHeight } }}
          image={<AddCreditsImage height={imageHeight} />}
          title={t('labels.addCredits')}
          subtitle={t('addCreditsDescription.p1')}
        >
          <View style={styles.container}>
            <View>
              {Object.keys(fieldLabels).map(key => {
                const name = key as ChangeDataFormField;
                return (
                  <Controller
                    key={name}
                    control={control}
                    name={name}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        settings={fieldLabels[name].settings}
                        value={String(value)}
                        onChangeText={onChange}
                        labelText={t(getLabelKey(name))}
                        outlineColor={colors.grey}
                        bgColor={colors.white}
                        textColor={colors.black}
                        focusColor={colors.primary}
                        error={t(errors[name]?.message as TKeyofTranslation<'lang'>)}
                      />
                    )}
                  />
                );
              })}
              <Text
                style={{ ...text.interExtraLight, color: colors.darkGrey, marginTop: 8 }}
              >
                {t('addCreditsDescription.p2')} {t('addCreditsDescription.p3')}
              </Text>
            </View>
          </View>
        </MainLayout>
      </KeyboardAwareScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          title={t('labels.addCredits')}
          onPress={handleSubmit(onSubmit)}
          buttonColor={colors.primary}
          textColor={colors.white}
          styles={styles.activeButton}
        />
      </View>
    </View>
  );
};

export default AddCredits;

const createStyles = ({ colors }: IStyles) => {
  const isKeyboardVisible = useContext(KeyboardVisibleContext);

  return StyleSheet.create({
    mainWrapper: {
      position: 'relative',
      flex: 1,
      alignItems: 'center',
    },
    container: {
      marginTop: 24,
    },
    subHeader: {
      color: colors.primary,
      textAlign: 'center',
      marginVertical: 16,
    },
    buttonWrapper: {
      marginHorizontal: 30,
      alignItems: 'center',
    },
    activeButton: {
      position: 'absolute',
      bottom: isKeyboardVisible ? 16 : 88,
    },
  });
};
