import { useState } from 'react';
import DeleteImage from 'assets/images/Delete';
import { useTranslation } from 'react-i18next';
import Prompt from 'components/Prompt';
import { router } from 'expo-router';
import { useAuth } from 'context/AuthContext';
import { DeleteUser } from 'services/auth';
import { Toast } from 'toastify-react-native';
import { UserRoutes } from 'common/constants/routes';

const Delete = () => {
  const { t } = useTranslation();
  const { authState, setAuthState } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      if(authState?.user?.id && setAuthState) {
        const result = await DeleteUser(authState?.user?.id, setAuthState);
        if (result) {
          router.replace(UserRoutes.HOME);
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        let serverErrorMessage = error.response.data.message;

        if (!serverErrorMessage.includes('errors')) {
          serverErrorMessage = `errors.${serverErrorMessage}`;
        }
        Toast.error(t(serverErrorMessage), 'bottom');
      } else {
        Toast.error(error.message, 'bottom');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Prompt
      image={<DeleteImage />}
      title={t('pages.deleteAccount')}
      subtitle={t('deleteAccount')}
      firstBtnText={t('labels.confirm')}
      firstBtnAction={handleDelete}
      secondBtnText={t('labels.cancel')}
      secondBtnAction={() => router.back()}
      isLoading={loading}
    />
  );
};

export default Delete;