import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme, IStyles } from 'theme/theme';
import Input from 'components/Input';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from 'utils/useLocalStorage';
import { formatLicensePlate } from 'utils/helpers';
import { UserRoutes } from 'common/constants/routes';
import { router } from 'expo-router';
import MainLayout from 'components/layouts/MainLayout';
import CheckIcon from 'assets/icons/Check';
import PlusIcon from 'assets/icons/Plus';
import Modal from 'components/Modal';

const MyPlates = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const [addNewModal, setAddNewModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [licensePlates, setLicensePlates] = useLocalStorage<string[]>(
    'licensePlates',
    [],
  );
  const { colors, text } = useAppTheme();
  const styles = createStyles({ colors, text });

  const showAddNewModal = () => setAddNewModal(true);
  const hideAddNewModal = () => setAddNewModal(false);

  // useEffect(() => {
  //   setLicensePlates([])
  // }, []);

  const addLicensePlate = () => {
    if (value.trim() !== '') {
      hideAddNewModal();
      const formattedPlate = formatLicensePlate(value);
      setLicensePlates(prevPlates => {
        if (!prevPlates.includes(formattedPlate)) {
          return [...prevPlates, formattedPlate];
        } else {
          return prevPlates;
        }
      });
      setValue('');
    }
  };

  const makeActivePlate = (index: number) => {
    if (licensePlates) {
      const selectedPlate = [...licensePlates].reverse()[index];

      const originalIndex = licensePlates.length - 1 - index;

      if (selectedPlate) {
        const remainingPlates = licensePlates.filter((_, i) => i !== originalIndex);

        const newPlates = [...remainingPlates, selectedPlate];

        setLicensePlates(newPlates);
        setSelectedIndex(0);
        router.back();
      }
    }
  };

  return (
    <MainLayout title={t('myLicensePlates')} subtitle={t('selectLicensePlate')}>
      <Modal
        title={t('addNewLicensePlate')}
        visible={addNewModal}
        onDismiss={hideAddNewModal}
      >
        <Input
          value={value}
          onChangeText={val => setValue(val)}
          onSubmitEditing={addLicensePlate}
          labelText={t('licensePlate')}
        />
        <View style={styles.modal__buttons}>
          <View style={styles.button}>
            <Button
              mode="outlined"
              outlineColor={colors.primary}
              textColor={colors.black}
              title={t('labels.cancel')}
              onPress={hideAddNewModal}
            />
          </View>
          <View style={{ ...styles.button, marginLeft: 16 }}>
            <Button title={t('labels.submit')} onPress={addLicensePlate} />
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.listItem__wrapper}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={licensePlates ? [...licensePlates].reverse() : []}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={
              <TouchableOpacity style={styles.addNew} onPress={showAddNewModal}>
                <PlusIcon />
                <Text style={styles.addNew__text}>{t('addNew')}</Text>
              </TouchableOpacity>
            }
            renderItem={({ item: plate, index }) => {
              const selected = index === selectedIndex;
              return (
                <Pressable onPress={() => setSelectedIndex(index)}>
                  <View
                    style={{
                      ...styles.listItem,
                      backgroundColor: selected ? colors.primary : colors.white,
                    }}
                  >
                    <CheckIcon style={styles.listItem__icon} />
                    <Text
                      style={{
                        ...styles.listItem__text,
                        color: selected ? colors.white : colors.black,
                      }}
                    >
                      {plate}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
        <Button
          title={t('labels.setAsActive')}
          onPress={() => makeActivePlate(selectedIndex)}
          styles={styles.activeButton}
        />
      </View>
    </MainLayout>
  );
};

export default MyPlates;

const createStyles = ({ colors, text }: IStyles) => {
  return StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
      paddingBottom: 20,
    },
    listItem__wrapper: {
      marginVertical: 47,
    },
    listItem: {
      position: 'relative',
      flexDirection: 'row',
      borderRadius: 14,
      height: 56,
      width: '100%',
      marginBottom: 24,
      alignItems: 'center',
      borderColor: colors.primary,
      borderWidth: 1,
    },
    listItem__text: {
      position: 'absolute',
      width: '100%',
      textAlign: 'center',
      ...text?.regularSemiBold,
    },
    listItem__icon: {
      marginLeft: 24,
    },
    activeButton: {
      position: 'absolute',
      bottom: 0,
    },
    addNew: {
      flexDirection: 'row',
      marginTop: 29,
      marginBottom: 53,
      alignItems: 'center',
    },
    addNew__text: {
      marginLeft: 12,
      ...text?.regular,
      color: colors.darkGrey,
    },
    modal__buttons: {
      flexDirection: 'row',
      marginTop: 16,
    },
    button: {
      flex: 1,
    },
  });
};
