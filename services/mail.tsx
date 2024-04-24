import axios from 'axios';
import { ApiRoutes } from 'common/constants/routes';

const apiUrl = process.env.EXPO_PUBLIC_API_URL!;

const Mail = {
  IssueReport: async (messageContent: string, image: string | null) => {
    const result = await axios.post(
      `${apiUrl}${ApiRoutes.ISSUE_REPORT}`,
      { mailContent: messageContent, imageFile: image },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
  },
};

export default Mail;
