export interface IAddTokens {
  amount: number;
}

export interface ICalculateByPlate {
  plate: string;
  discountCode: string | null;
}

export interface ICalculationData {
  amount: number;
  amountWithoutDiscount: number;
  fullTime: number;
  freeMinutesSpent?: number;
  paymentMethods: {
    sms: boolean;
    kevin: boolean;
  },
  ticket: string;
  time: number;
}

export interface IPaymentRequest { 
  plate: string;
  locale: string;
  discount?: string;
}