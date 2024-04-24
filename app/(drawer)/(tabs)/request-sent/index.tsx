import { Text, View } from 'react-native';
import Prompt from 'components/Prompt';
import IsSentImage from 'assets/images/IsSent';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';

const RequestSent = () => {
  const { t } = useTranslation();

  return (
    <Prompt
      image={<IsSentImage />}
      title={`${t('requestSent.title')}!`}
      subtitle={t('requestSent.description')}
    />
  );
};

export default RequestSent;
