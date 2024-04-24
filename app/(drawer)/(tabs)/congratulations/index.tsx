import { Text, View } from 'react-native';
import Prompt from 'components/Prompt';
import CongratulationsImage from 'assets/images/Congratulations';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';

const Congratulations = () => {
  const { t } = useTranslation();

  return (
    <Prompt
      image={<CongratulationsImage />}
      title={`${t('congratulations.title')}!`}
      subtitle={t('congratulations.description')}
      firstBtnText={t('labels.continue')}
      firstBtnAction={() => router.replace(`${UserRoutes.AUTHENTICATION}?idx=1`)}
    />
  );
};

export default Congratulations;
