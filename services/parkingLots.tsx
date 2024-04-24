import axios from 'axios';
import { ApiRoutes } from 'common/constants/routes';

const apiUrl = process.env.EXPO_PUBLIC_API_URL!;

const ParkingLots = {
  getAllParkingLots: async () => {
    const response = await axios.get(`${apiUrl}${ApiRoutes.PARKING_LOTS}`);
    return response.data;
  },
  getLotById: async (id: string) => {
    const response = await axios.get(`${apiUrl}${ApiRoutes.PARKING_LOTS}?id=${id}`);
    return response.data;
  },
};

export default ParkingLots;
