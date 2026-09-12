export interface ChurchListResponse {
  id: string;
  name: string;
  slug: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  denomination: string;
  description: string;
  establishedDate: string;
  email: string;
  phoneNumber: string;
  website: string;
  churchSize: string;
  numberOfBranches: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  mission: string | null;
  vision: string | null;
  values: string[];
  isActive: boolean;
  isSuspended: boolean;
  isDeleted: boolean;
  metadata: Record<string, any> | null;
  address: ChurchAddress;
  subscription: ChurchSubscription;
  _count: {
    members: number;
    teams: number;
  };
}

export interface ChurchAddress {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  organizationId: string;
  teamId: string | null;
}

export interface ChurchSubscription {
  id: string;
  plan: 'MINISTRY' | 'BASIC' | 'PREMIUM' | string;
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELED' | string;
  isPaid: boolean;
  isActive: boolean;
  invoiceAmount: number;
  paidAmount: number;
  balAmount: number;
  maxUsers: number | null;
  maxTeams: number | null;
  maxSmallGroups: number | null;
  currentUsers: number;
  currentTeams: number;
  currentSmallGroups: number;
  features: string[];
  startDate: string;
  endDate: string;
  isAutoRenew: boolean;
  paymentMethod: 'M_PESA' | 'CARD' | 'BANK_TRANSFER' | string;
  lastPaymentDate: string | null;
  nextBillingDate: string | null;
  canceledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}
