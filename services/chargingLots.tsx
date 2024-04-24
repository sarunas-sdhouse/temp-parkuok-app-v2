import axios from 'axios';
import { ApiRoutes } from 'common/constants/routes';
import qs from 'qs';

const apiUrl = process.env.EXPO_PUBLIC_INBALANCE_ENDPOINT!;

const ChargingLots = {
  getAccessToken: async () => {
    const body = {
      grant_type: 'password',
      client_id: process.env.EXPO_PUBLIC_INBALANCE_CLIENT_ID,
      client_secret: process.env.EXPO_PUBLIC_INBALANCE_CLIENT_SECRET,
      username: process.env.EXPO_PUBLIC_INBALANCE_USERNAME,
      password: process.env.EXPO_PUBLIC_INBALANCE_PASSWORD,
    };

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const response = await axios.post(
      `${apiUrl}${ApiRoutes.INBALANCE_ACCESS_TOKEN}`,
      qs.stringify(body),
      config,
    );

    return response.data.access_token;
  },

  getAllChargingLotsInMap: async (
    topLeftLat: number,
    topLeftLon: number,
    bottomRightLat: number,
    bottomRightLon: number,
    accessToken: string,
  ) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.get(
      `${apiUrl}${ApiRoutes.INBALANCE_CLUSTERS}/${topLeftLat}/${topLeftLon}/${bottomRightLat}/${bottomRightLon}`,
      config,
    );

    return response.data;
  },

  getChargingPointsByCluster: async (
    clusterId: number,
    accessToken: string,
  ) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.get(
      `${apiUrl}${ApiRoutes.INBALANCE_CLUSTER}/${clusterId}/points`,
      config,
    );

    return response.data;
  },

  startCharging: async (
    chargingPointCode: string,
    vehicleNumberPlate: string,
    chargingMode: number,
    accessToken: string,
  ) => {
    const data = {
      chargingPointCode,
      vehicleNumberPlate,
      chargingMode
    };
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post(
      `${apiUrl}${ApiRoutes.INBALANCE_START_CHARGING}`,
      data,
      config,
    );
    return response.data;
  },

  stopCharging: async (
    sessionId: string,
    accessToken: string,
  ) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post(
      `${apiUrl}${ApiRoutes.INBALANCE_STOP_CHARGING}/${sessionId}`,
      config,
    );
    return response.data;
  },

  getChargingSession: async (
    sessionId: string,
    accessToken: string,
  ) => {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.get(
      `${apiUrl}${ApiRoutes.INBALANCE_CHECK_SESSION}/${sessionId}`,
      config,
    );

    return response.data;
  },
};

export default ChargingLots;
