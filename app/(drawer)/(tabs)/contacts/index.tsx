import { Text, View, Linking, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from 'theme/theme';
import MainLayout from 'components/layouts/MainLayout';
import ListItem from 'components/ListItem';
import BuildingIcon from 'assets/icons/contacts/Building';
import LocationIcon from 'assets/icons/contacts/Location';
import MailIcon from 'assets/icons/contacts/Mail';
import PhoneIcon from 'assets/icons/contacts/Phone';

const ContactsItems = [
  {
    icon: <PhoneIcon />,
    title: 'phoneNumber',
    subtitle: '+370 620 82222',
    link: 'tel:+37062082222',
  },
  {
    icon: <MailIcon />,
    title: 'labels.email',
    subtitle: 'hello@parkuok.lt',
    link: 'mailto:hello@parkuok.lt',
  },
  {
    icon: <LocationIcon />,
    title: 'ourLocation',
    subtitle: 'Savanorių pr. 123, LT-03150 Vilnius, Lietuva',
    link: 'http://maps.google.com/maps?q=Savanorių+pr.+123,+LT-03150+Vilnius,+Lietuva',
  },
];

const DetailsItems = [
  {
    icon: <BuildingIcon />,
    title: 'Kitoks miestas, UAB',
    subtitle:
      'Įmonės kodas: 303118462\nPVM kodas: LT100007942912\nA/S LT57 7300 0101 4003 7833\nAB Swedbank',
  },
];

const Contacts = () => {
  const { t } = useTranslation();
  const { text, colors } = useAppTheme();

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <MainLayout title={`${t('getInTouch')}!`} subtitle={t('texts.contacts.subtitle')}>
        {ContactsItems.map((item, index) => (
          <ListItem
            key={index}
            iconComponent={item.icon}
            title={t(item.title)}
            subtitle={t(item.subtitle)}
            subtitleStyle={{ ...text.interLight, color: colors.darkGrey }}
            link={item.link}
          />
        ))}
        {/* <Text style={{ ...text.regular, ...styles.title }}>{t('companyDetails')}</Text> */}
        {DetailsItems.map((item, index) => (
          <ListItem
            key={index}
            iconComponent={item.icon}
            title={t(item.title)}
            subtitle={t(item.subtitle)}
            subtitleStyle={{ ...text.interLight, color: colors.darkGrey }}
          />
        ))}
      </MainLayout>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    marginTop: 48,
    marginBottom: 32,
  },
});

export default Contacts;
