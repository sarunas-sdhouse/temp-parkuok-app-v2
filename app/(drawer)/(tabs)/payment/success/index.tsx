import { Text } from 'react-native';
import { useAppTheme } from 'theme/theme';
import { useTranslation } from 'react-i18next';
import { useLocalSearchParams } from 'expo-router';
import SuccessImage from 'assets/images/Success';
import { router } from 'expo-router';
import { UserRoutes } from 'common/constants/routes';
import Prompt from 'components/Prompt';
import { useAuth } from 'context/AuthContext';
import { imageSizeCalculator } from 'utils/helpers';

const SuccessPage = () => {
  const { t } = useTranslation();
  const { text } = useAppTheme();
  const { order } = useLocalSearchParams();
  const { authState } = useAuth();

  let imageHeight = imageSizeCalculator(110)

  return (
    <Prompt
      style={{image: {height: imageHeight}}}
      image={<SuccessImage height={imageHeight}/>}
      title={`${t('payment.success')}!`}
      subtitle={
        order ? (
          <>
            <Text>{`${t('payment.leaveIn15')}\n${t('payment.orderNumber')}:\n`}</Text>
            <Text style={{ ...text.header, fontSize: 24 }}>{order}</Text>
            <Text>{`\n${t('payment.inCaseYouNeedToContactUs')}`}</Text>
          </>
        ) : (
          authState?.user?.credits && `${t('youNowHave')} ${authState?.user?.credits} ${t('creditsInYourAccount').toLocaleLowerCase()}`
        )
      }
      firstBtnText={t('goToHomePage')}
      firstBtnAction={() => router.replace(UserRoutes.HOME)}
    />
  );
};

export default SuccessPage;
