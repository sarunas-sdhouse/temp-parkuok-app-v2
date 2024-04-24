import axios from 'axios';
import { ApiRoutes } from 'common/constants/routes';

const apiUrl = process.env.EXPO_PUBLIC_API_URL!;

const Tickets = {
  getTicketsByPlates: async (plates: Array<string>, page: number) => {
    const response = await axios.get(
      `${apiUrl}${ApiRoutes.TICKETS}?plates=${encodeURIComponent(
        JSON.stringify(plates),
      )}&page=${page}`,
    );

    return response.data;
  },
};

export default Tickets;
