import { Text, View } from 'react-native';
import Tabs from 'components/Tabs';
import LoginPage from 'components/authentication/login';
import RegisterPage from 'components/authentication/register';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';

const Authentication = () => {
  const { t } = useTranslation();
  const { idx } = useLocalSearchParams();

  const idxNumber = typeof idx === 'string' ? parseInt(idx) : 0;

  return (
    <Tabs
      firstTab={RegisterPage}
      secondTab={LoginPage}
      firstTabLabel={t("labels.register")}
      secondTabLabel={t("labels.login")}
      idx={idxNumber}
    />
  );
};

export default Authentication;
