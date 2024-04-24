import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { List, Icon, Divider, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';
import { IStyles } from 'theme/theme';
import { TKeyofTranslation } from 'types/translations';
import { router, usePathname } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import Button from './Button';
import { useAuth } from 'context/AuthContext';
import { Logout } from 'services/auth';
import AvatarIcon from 'assets/icons/Avatar';
import SettingsIcon from 'assets/icons/menu/Settings';
import ContactsIcon from 'assets/icons/menu/Contacts';
import MyPlatesIcon from 'assets/icons/menu/MyPlates';
import PolicyIcon from 'assets/icons/menu/Policy';
import TermsIcon from 'assets/icons/menu/Terms';
import MainLogo from 'assets/logo/Main';
import { useLocalStorage } from 'utils/useLocalStorage';

const MENU = [
  {
    name: 'pages.profile',
    icon: <SettingsIcon />,
    path: UserRoutes.PROFILE,
    needAuth: true,
  },
  {
    name: 'pages.myPlates',
    icon: <MyPlatesIcon />,
    path: UserRoutes.MY_PLATES,
  },
  {
    name: 'pages.contacts',
    icon: <ContactsIcon />,
    path: UserRoutes.CONTACTS,
  },
  {
    name: 'pages.privacyPolicy',
    icon: <PolicyIcon />,
    path: 'https://citypro.lt/privatumo-politika/',
    external: true,
  },
  {
    name: 'pages.termsOfService',
    icon: <TermsIcon />,
    path: UserRoutes.TERMS,
  },
  {
    name: 'pages.report',
    icon: <TermsIcon />,
    path: UserRoutes.REPORT,
  },
  // {
  //   name: 'CONGRATULATIONS',
  //   icon: <TermsIcon/>,
  //   path: '/congratulations',
  // },
];

const Sidebar = ({ theme }: { theme: any }) => {
  const { authState, setAuthState } = useAuth();
  const { colors, text } = theme;
  const { t, i18n } = useTranslation();
  const styles = createStyles({ colors });
  const activePath = usePathname();

  const [language, setLanguage] = useLocalStorage<string>('language', 'lt');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  useEffect(() => {
    if(language && language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return (
    <View style={styles.sidebarWrapper}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View>
            <View style={styles.headerContainer}>
              <View style={styles.headerLogoClose}>
                <MainLogo width={105} height={33.5} />
              </View>
              <View
                style={
                  authState?.authenticated
                    ? styles.headerContainerSubHead_auth
                    : styles.headerContainerSubHead
                }
              >
                {authState?.authenticated ? (
                  <View style={styles.headerAuth}>
                    <TouchableOpacity onPress={() => router.push(UserRoutes.PROFILE)}>
                      <AvatarIcon style={styles.avatar} />
                    </TouchableOpacity>
                    <Text style={{ ...text.montseratRegular, fontSize: 14 }}>
                      {authState.user?.name}
                    </Text>
                    <Text style={{ ...text.montseratRegular, fontSize: 14 }}>
                      {t('credits')}: {Number(authState.user?.credits).toFixed(2)}
                    </Text>
                    <Button
                      title={t('labels.addCredits')}
                      onPress={() => router.push(UserRoutes.ADD_CREDITS)}
                      styles={{ width: 'auto', marginTop: 30 }}
                    />
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => router.push(UserRoutes.HOME)}>
                    <View style={styles.headerContainerSubHeadHome}>
                      <View style={styles.homeIcon}>
                        <Icon source="home" color={colors.primary} size={30} />
                      </View>
                      <Text style={styles.text}>{t('pages.home')}</Text>
                    </View>
                  </TouchableOpacity>
                )}

                <View style={styles.headerContainerSubHeadLanguages}>
                  <Text
                    onPress={() => changeLanguage('lt')}
                    style={{
                      ...text.regular,
                      ...(i18n.language === 'lt'
                        ? styles.languageActive
                        : styles.languageInactive),
                    }}
                  >
                    LT
                  </Text>
                  <Divider style={styles.divider} />
                  <Text
                    onPress={() => changeLanguage('en')}
                    style={{
                      ...text.regular,
                      ...(i18n.language === 'en'
                        ? styles.languageActive
                        : styles.languageInactive),
                    }}
                  >
                    EN
                  </Text>
                </View>
              </View>
            </View>
            {MENU.filter(
              menuItem => !(menuItem.needAuth && !authState?.authenticated),
            ).map(menuItem => (
              <List.Item
                key={menuItem.path}
                title={t(menuItem.name as TKeyofTranslation<'lang'>)}
                titleStyle={{ ...text.title, fontSize: 16 }}
                style={
                  menuItem.path === activePath
                    ? {
                        backgroundColor: colors.lightGreen,
                        marginHorizontal: -24,
                        paddingHorizontal: 24,
                      }
                    : {}
                }
                left={() => (
                  <View style={{ justifyContent: 'center', marginRight: 14 }}>
                    {menuItem.icon}
                  </View>
                )}
                onPress={() => {
                  if (menuItem.external) {
                    WebBrowser.openBrowserAsync(menuItem.path);
                  } else {
                    router.push(menuItem.path);
                  }
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonsContainer}>
        {authState?.authenticated ? (
          <Button
            title={t('labels.logout')}
            mode="outlined"
            textColor={colors.danger}
            outlineColor={colors.danger}
            buttonColor={colors.white}
            onPress={async () => {
              if (setAuthState) {
                await Logout(setAuthState);
                router.replace(UserRoutes.HOME);
              } else {
                console.error('setAuthState is undefined');
              }
            }}
          />
        ) : (
          <>
            <Button
              styles={{ marginBottom: 10 }}
              title={t('labels.login')}
              mode="outlined"
              textColor={colors.primary}
              outlineColor={colors.primary}
              buttonColor={colors.white}
              onPress={() => router.push(`${UserRoutes.AUTHENTICATION}?idx=1`)}
            />
            <Button
              title={t('labels.register')}
              mode="outlined"
              textColor={colors.info}
              outlineColor={colors.info}
              buttonColor={colors.white}
              onPress={() => router.push(`${UserRoutes.AUTHENTICATION}?idx=0`)}
            />
          </>
        )}
      </View>
    </View>
  );
};
export default Sidebar;

const createStyles = ({ colors }: IStyles) => {
  return StyleSheet.create({
    sidebarWrapper: {
      flex: 1,
    },
    avatar: {
      marginTop: 24,
      marginBottom: 18,
    },
    headerContainer: {
      borderBottomColor: colors.primary,
      borderBottomWidth: 1,
      marginBottom: 5,
      // marginHorizontal: -16,
      // paddingHorizontal: 16,
    },
    headerAuth: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 8,
    },
    headerImage: {
      width: 104.91,
      height: 33.35,
    },
    headerLogoClose: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    headerContainerSubHead: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
      marginTop: 10,
      alignItems: 'center',
    },
    headerContainerSubHead_auth: {},
    headerContainerSubHeadHome: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerContainerSubHeadLanguages: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'flex-end',
      marginRight: 32,
      marginTop: 14,
      marginBottom: 16,
      width: 67,
    },
    homeIcon: {
      marginRight: 10,
    },
    text: {
      color: colors.primary,
      fontSize: 20,
    },
    divider: {
      width: 1,
      height: 18,
      marginHorizontal: 18,
      backgroundColor: colors.primary,
    },
    container: {
      position: 'relative',
      flex: 1,
      paddingHorizontal: 24,
      flexDirection: 'column',
      marginTop: 20,
      justifyContent: 'space-between',
    },
    languageActive: {
      color: colors.primary,
    },
    languageInactive: {
      color: '#aaa',
    },
    itemActive: {
      backgroundColor: colors.activeMenuItem,
      // marginHorizontal: -16,
      // paddingHorizontal: 16,
    },
    buttonsContainer: {
      marginBottom: 20,
      paddingHorizontal: 24,
      paddingTop: 20,
    },
  });
};
