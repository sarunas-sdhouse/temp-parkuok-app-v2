import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from 'theme/theme';
import MainLayout from 'components/layouts/MainLayout';

const styles = StyleSheet.create({
  container: {
    maxWidth: '100%',
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  innerContainer: {
    marginTop: 20,
    width: '100%',
  },
  heading: {
    marginTop: 5,
    marginBottom: 2,
    color: 'white',
    fontSize: 20,
  },
  subtitle: {
    marginTop: 20,
  }
});

const Terms = () => {
  const { t } = useTranslation();
  const { text } = useAppTheme();

  return (
    <ScrollView style={styles.container}>
      <MainLayout title={t('terms.header')} >
        <View style={styles.innerContainer}>
          <Text style={[text.regular, styles.subtitle]}>{t('terms.text.firstParagraph.heading')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point11')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point12')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point13')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point14')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point15')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point16')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point17')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point18')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point19')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point191')}</Text>
          <Text style={text.interExtraLight}>{t('terms.text.firstParagraph.points.point192')}</Text>
          <Text style={[text.regular, styles.subtitle]}>{t('terms.text.secondParagraph.heading')}</Text>
          {(
            t('terms.text.secondParagraph.points', { returnObjects: true }) as string[]
          ).map((point: string) => (
            <Text key={point} style={text.interExtraLight}>
              {point}
            </Text>
          ))}
          <Text style={[text.regular, styles.subtitle]}>{t('terms.text.thirdParagraph.heading')}</Text>
          {(t('terms.text.thirdParagraph.points', { returnObjects: true }) as string[]).map(
            (point: string) => (
              <Text key={point} style={text.interExtraLight}>
                {point}
              </Text>
            ),
          )}
          <Text style={[text.regular, styles.subtitle]}>{t('terms.text.forthParagraph.heading')}</Text>
          {(t('terms.text.forthParagraph.points', { returnObjects: true }) as string[]).map(
            (point: string) => (
              <Text key={point} style={text.interExtraLight}>
                {point}
              </Text>
            ),
          )}
        </View>
      </MainLayout>
    </ScrollView>
  );
};

export default Terms;
