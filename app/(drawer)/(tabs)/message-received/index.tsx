import { Text, View } from 'react-native';
import Prompt from 'components/Prompt';
import MessageReceivedImage from 'assets/images/MessageReceived';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';

const Congratulations = () => {
  const { t } = useTranslation();

  return (
    <Prompt
      image={<MessageReceivedImage />}
      title={`${t('messageReceived.title')}!`}
      subtitle={t('messageReceived.description')}
      firstBtnText={t('goToHomePage')}
      firstBtnAction={() => router.replace(UserRoutes.HOME)}
    />
  );
};

export default Congratulations;
