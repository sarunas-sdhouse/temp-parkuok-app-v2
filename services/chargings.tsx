import axios from 'axios';
import { ApiRoutes } from 'common/constants/routes';
import { IChargingData } from 'types/chargings';

const apiUrl = process.env.EXPO_PUBLIC_API_URL!;

const Chargings = {
  addNewCharging: async (data: IChargingData) => {
    const response = await axios.post(`${apiUrl}${ApiRoutes.CHARGINGS}`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },

  getChargingsByPlates: async (plates: Array<string>, page: number) => {
    const response = await axios.get(
      `${apiUrl}${ApiRoutes.CHARGINGS}?plates=${encodeURIComponent(
        JSON.stringify(plates),
      )}&page=${page}`,
    );

    return response.data.data;
  },

  getChargingBySessionId: async (sessionId: string) => {
    const response = await axios.get(
      `${apiUrl}${ApiRoutes.CHARGINGS}?sessionId=${sessionId}`,
    );

    return response.data.data;
  },

  updateCharging: async (id: string, data: IChargingData) => {
    const response = await axios.put(`${apiUrl}${ApiRoutes.CHARGINGS}?id=${id}`, data, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },
};

export default Chargings;
