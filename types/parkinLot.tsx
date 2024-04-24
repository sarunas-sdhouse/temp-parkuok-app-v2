export interface ILocation {
  lat: number;
  lng: number;
}

interface IPaymentMethods {
  sms: boolean;
  kevin: boolean;
}

export interface IParkingLot {
  location: ILocation;
  paymentMethods: IPaymentMethods;
  id: string;
  enabled: boolean;
  freeHoursTrack: boolean;
  cpparkAmountCalculation: boolean;
  publicId: string;
  address: string;
  city: string;
  pricing: number;
  spacesTotal: number;
  spacesVacant: number;
  apiUrl: string;
  paymentKey: string;
  freeHours: number;
  intervalPriceCents: number;
  intervalMinutes: number;
  maxSumPerDayCents: number | null;
  image: string;
  freeHoursLabel_en: string;
  freeHoursLabel_lt: string;
  pricingLabel_en: string;
  pricingLabel_lt: string;
}