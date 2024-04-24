import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { TicketsResponse } from 'types/tickets';
import { useWindowDimensions } from 'react-native';

export const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export const generateSms = (plate: string, amount: number) => {
  if (!plate) {
    throw Error('InvalidPlate');
  }

  if (amount < 0) {
    throw Error('InvalidAmount');
  }

  return `ON PARKUOK ${amount / 100} ${plate}`.replace(/,/g, '.');
};

export const formatLicensePlate = (plate: string): string => {
  return plate.replace(/\s/g, '').toUpperCase().trim();
};

export const calculatePrice = (cents: number) => {
  return (cents / 100).toFixed(2).replace('.', ',');
};

export const formatTime = (time: number) => {
  const { t } = useTranslation();

  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours}${t('hoursShort')} ${minutes}${t('minutesShort')}`;
};

export const hexToRGBA = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const formatLTHours = (hours: number) => {
  if (hours === 0 || (hours >= 10 && hours <= 20)) {
    return `${hours} valandų`;
  } else if (hours === 1 || hours % 10 === 1) {
    return `${hours} valanda`;
  } else {
    return `${hours} valandos`;
  }
};

const compressImage = async (imageUri: string) => {
  const compressedImage = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 550 } }],
    { format: ImageManipulator.SaveFormat.JPEG },
  );
  return compressedImage.uri;
};

export const imageToBase64 = async (imagePath: string) => {
  try {
    const compressedImagePath = await compressImage(imagePath);
    const imageBase64 = await FileSystem.readAsStringAsync(compressedImagePath, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return imageBase64;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const calculateDuration = (ticket: any) => {
  const openedAt = new Date(ticket.openedAt);
  const closedAt = new Date(ticket.closedAt);

  const diffInMilliseconds = closedAt.getTime() - openedAt.getTime();
  const diffInSeconds = diffInMilliseconds / 1000;
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = Math.floor(diffInSeconds % 60);

  return {
    hours,
    minutes,
    seconds,
  };
};

export const formatDate = (date: string): string => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const day = newDate.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const imageSizeCalculator = (imgHeight: number) => {
  const windowHeight = useWindowDimensions().height;
  const baseScreenHeight = 667;
  const targetImageHeight = imgHeight;

  let imageHeight = targetImageHeight * (windowHeight / baseScreenHeight);
  return imageHeight;
};
