import { useState, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import MainLayout from 'components/layouts/MainLayout';
import { useTranslation } from 'react-i18next';
import { UserRoutes } from 'common/constants/routes';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { reportSchema } from 'common/schemas/reportSchema';
import { TKeyofTranslation } from 'types/translations';
import { Toast } from 'toastify-react-native';
import { useAppTheme, IStyles } from 'theme/theme';
import { IReport } from 'types/report';
import Input from 'components/Input';
import Button from 'components/Button';
import KeyboardVisibleContext from 'context/KeyboardVisibleContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PaperClipIcon from 'assets/icons/PaperClip';
import Modal from 'components/Modal';
import { Camera } from 'expo-camera';
import { useCamera } from 'utils/useCamera';
import * as ImagePicker from 'expo-image-picker';
import Select from 'components/Select';
import { router } from 'expo-router';
import Mail from 'services/mail';
import { imageToBase64 } from 'utils/helpers';
import { useAuth } from 'context/AuthContext';

const TOPICS = ['general', 'parking', 'charging', 'web', 'app'];

const Report = () => {
  const { t, i18n } = useTranslation();
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });
  const [loading, setLoading] = useState(false);
  const [addNewModal, setAddNewModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('general');
  const {
    type,
    takePhoto,
    cameraVisible,
    showCamera,
    hideCamera,
    cameraRef,
  } = useCamera();
  const [image, setImage] = useState<string | null>(null);
  const { authState, setAuthState } = useAuth();

  const showAddNewModal = () => setAddNewModal(true);
  const hideAddNewModal = () => setAddNewModal(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver<IReport>(reportSchema),
    mode: 'onSubmit',
    shouldFocusError: true,
    defaultValues: {
      email: authState?.user?.email || '' ,
    },
  });

  type ReportFormField = keyof IReport;

  const getLabelKey = (fieldName: ReportFormField): TKeyofTranslation<'lang'> =>
    `labels.${fieldName}` as TKeyofTranslation<'lang'>;

  const fieldLabels: Record<
    ReportFormField,
    {
      label: TKeyofTranslation<'lang'>;
      settings?: {
        autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
        keyboardType?: 'numeric';
        disabled?: boolean;
      };
    }
  > = {
    description: {
      label: getLabelKey('description'),
      settings: {
        autoCapitalize: 'none',
      },
    },
    phone: {
      label: getLabelKey('phone'),
      settings: {
        autoCapitalize: 'none',
        keyboardType: 'numeric'
      },
    },
    email: {
      label: getLabelKey('email'),
      settings: {
        autoCapitalize: 'none',
        disabled: true,
      },
    },
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      hideAddNewModal();
    }
  };

  const photoHandler = async () => {
    const photo = await takePhoto();
    setImage(photo);
    hideAddNewModal();
  };

  const createEmailTemplate = async (data: IReport) => {
    const { description, phone, email } = data;
    const topic = selectedTopic;
    // let imageLink = null;
    // if(image) imageLink = await imageToBase64(image);
  
    return `
      <h2>${t('reportAboutIssue')}</h2>
      <p><strong>${t('labels.topic')}:</strong> ${topic}</p>
      <p><strong>${t('labels.description')}:</strong> ${description}</p>
      <p><strong>${t('labels.phone')}:</strong> ${phone}</p>
      <p><strong>${t('labels.email')}:</strong> ${email}</p>
    `;
  };

  const onSubmit = async (data: any) => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      let imageLink = null;
      if(image) imageLink = await imageToBase64(image);

      const emailTemplate = await createEmailTemplate(data);
      const result = await Mail.IssueReport(emailTemplate, imageLink);
      if (result) {
        router.replace(UserRoutes.MESSAGE_RECEIVED);
        reset({
          description: '',
          phone: '',
          email: '',
        });
        setImage(null);
        setSelectedTopic('general');
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

  const selectData = [
    ...TOPICS.map(topic => ({ label: t(`topics.${topic}`), value: topic })),
  ];

  return (
    <MainLayout title={t('pages.report')}>
      <Modal title={t('uploadPhoto')} visible={addNewModal} onDismiss={hideAddNewModal}>
        {cameraVisible ? (
          <Camera ref={cameraRef} type={type} style={styles.camera}>
            <View style={styles.buttonContainer}>
              <Button title={t('labels.takePhoto')} onPress={photoHandler} />
              <Button
                styles={styles.button__cancelCamera}
                mode="outlined"
                outlineColor={colors.primary}
                textColor={colors.black}
                title={t('labels.cancel')}
                onPress={hideCamera}
              />
            </View>
          </Camera>
        ) : (
          <>
            <Button
              styles={styles.input}
              title={t('labels.takePhoto')}
              onPress={showCamera}
            />
            <Button
              styles={styles.input}
              title={t('labels.chooseFromGallery')}
              onPress={pickImage}
            />
            <Button
              styles={styles.button__cancel}
              mode="outlined"
              outlineColor={colors.primary}
              textColor={colors.black}
              title={t('labels.cancel')}
              onPress={hideAddNewModal}
            />
          </>
        )}
      </Modal>
      <View style={styles.container}>
        <Select
          defaultValue={selectedTopic}
          key={i18n.language}
          label={t('labels.topic')}
          placeholder={t('selectTopic')}
          data={selectData}
          style={{ marginBottom: 16 }}
          onValueChange={topic => setSelectedTopic(topic)}
        />
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          {Object.keys(fieldLabels).map(key => {
            const name = key as ReportFormField;
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
                      error={t(errors[name]?.message as TKeyofTranslation<'lang'>)}
                    />
                  </View>
                )}
              />
            );
          })}
          <TouchableOpacity style={styles.attach} onPress={showAddNewModal}>
            <PaperClipIcon />
            <Text style={styles.attach__text}>{t('labels.attachPhoto')}</Text>
            {image && <Text style={styles.imageName}>({t('photoAttached')})</Text>}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        <Button
          disabled={loading}
          title={t('labels.send')}
          onPress={handleSubmit(onSubmit)}
          styles={styles.button}
          buttonColor={colors.primary}
          textColor={colors.white}
        />
      </View>
    </MainLayout>
  );
};

export default Report;

const createStyles = ({ colors, text }: IStyles) => {
  const isKeyboardVisible = useContext(KeyboardVisibleContext);

  return StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
      marginTop: 32,
    },
    input: {
      marginBottom: 16,
    },
    button: {
      position: 'absolute',
      bottom: isKeyboardVisible ? -67 : 0,
    },
    attach: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 62,
    },
    attach__text: {
      ...text?.regular,
      fontSize: 14,
      marginLeft: 12,
    },
    button__cancel: {
      marginTop: 56,
    },
    camera: {
      position: 'relative',
      flex: 1,
      height: 400,
    },
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'space-around',
      padding: 10,
    },
    button__cancelCamera: {
      marginTop: 10,
    },
    imageName: {
      ...text?.regular,
      fontSize: 14,
      marginLeft: 12,
      fontStyle: 'italic'
    },
  });
};
