export interface IChargingData {
  userId?: string;
  amountToBePaid?: number;
  plate?: string;
  clusterId?: string;
  clusterPointId?: string;
  sessionId?: string;
  status: 'OPEN' | 'CLOSED';
  openedAt?: Date | string;
  closedAt?: Date | string;
  amountPaid?: number;
  paid?: boolean;
  energyAmount?: number;
  location?: string;
}

interface IPrice {
  currency: string;
  discountApplied: boolean;
  originalPrice: {
    currency: string;
    symbol: string;
    value: string;
  };
  symbol: string;
  value: string;
}

interface ILocation {
  city: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  country: string;
  postalCode: string;
  street: string;
}

export interface IChargingPoint {
  asap: IPrice;
  availableForCharging: boolean;
  clusterId: string;
  code: string;
  freeParkingByNumberPlate: boolean;
  location: ILocation;
  pointType: number;
  price: IPrice;
  state: number;
  wireType: number;
}