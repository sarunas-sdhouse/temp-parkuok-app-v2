import { Camera, CameraType } from 'expo-camera';
import { useState, useRef } from 'react';
import { Toast } from 'toastify-react-native';
import { useTranslation } from 'react-i18next';

export const useCamera = () => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const { t } = useTranslation();

  const showCamera = () => setCameraVisible(true);
  const hideCamera = () => setCameraVisible(false);

  const takePhoto = async () => {
    if (!permission || !permission.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Toast.error(t('errors.needPermissionToUse'), 'bottom');
        return null;
      }
    }
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      hideCamera();
      return photo.uri;
    }
    return null;
  };

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  return {
    type,
    takePhoto,
    toggleCameraType,
    cameraVisible,
    showCamera,
    hideCamera,
    cameraRef,
  };
};