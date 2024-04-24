export interface TicketsResponse {
  id: string;
  lotId: string;
  lotPublicId: string;
  plate: string;
  status: string;
  openedAt: string;
  closedAt: string;
  updatedAt: string;
  amountPaid: number;
  amountToBePaid: number;
  amountToBePaidWithoutDiscount: number;
  calculatedAt: string;
  paid: boolean;
  paidAt: string;
  discountCode: string;
  freeMinutesSpendingId: string;
}