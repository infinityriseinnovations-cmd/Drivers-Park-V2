export type LicenseCategory = 'LMV' | 'HMV' | 'HEMM';
export type AvailabilityStatus = 'online' | 'acting' | 'offline';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type SubscriptionTier = 'free_trial' | 'basic' | 'pro_unlimited';
export type OwnerType = 'individual' | 'company';

export interface OwnerProfile {
  id: string;
  fullName: string;
  companyName?: string;
  ownerType: OwnerType;
  phoneNumber: string;
  email?: string;
  city: string;
  fleetSize: number;
  vehicles: string[];
  gstin?: string;
  aadhaarStatus: VerificationStatus;
  rcVerificationStatus: VerificationStatus;
  commercialPermitStatus: VerificationStatus;
  activePackageId: string;
  commissionRate: number; // e.g. 3 for 3%
  accountStatus: 'active' | 'pending_approval' | 'suspended';
  totalHires: number;
  totalSpend: number;
  rating: number;
}

export interface CommissionPackage {
  id: string;
  name: string;
  targetRole: 'owner' | 'driver';
  description: string;
  commissionRatePercent: number; // e.g. 8 for 8%, 3 for 3%, 0 for 0%
  pricePerMonth: number;
  billingCycle: 'per_hire' | 'monthly' | 'annual';
  features: string[];
  popular?: boolean;
  badge?: string;
}

export interface MatchBooking {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerType: OwnerType;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicleModel: string;
  vehicleCategory: string;
  hiringBasis: 'hourly' | 'daily' | 'monthly' | 'trip';
  durationUnits: number; // e.g. 1 day, 8 hours, 30 days
  ratePerUnit: number; // e.g. 1200 / day
  grossWage: number; // gross amount earned by driver
  ownerPackageId: string;
  ownerCommissionRate: number; // % fee charged to owner or deducted
  driverPackageId: string;
  driverCommissionRate: number; // % fee charged to driver
  totalPlatformCommission: number; // commission earned by Drivers Park
  totalPaidByOwner: number; // grossWage + ownerFee
  netDriverEarnings: number; // grossWage - driverFee
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  escrowStatus: 'held' | 'released' | 'refunded';
  bookingDate: string;
  startDate: string;
  origin: string;
  destination: string;
}

export interface DriverProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: 'driver' | 'owner';
  licenseCategory: LicenseCategory[];
  experienceYears: number;
  hourlyRate: number;
  dailyRate: number;
  currentStatus: AvailabilityStatus;
  aadhaarStatus: VerificationStatus;
  licenseNumber: string;
  badgeNumber?: string;
  dob: string;
  gender: string;
  averageRating: number;
  totalReviews: number;
  isAiAgent: boolean;
  avatarUrl: string;
  avatarAlt: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  qualifiedVehicles: string[];
  medicalFitness: string;
  policeClearance: string;
}

export interface EmergencyDispatch {
  id: string;
  title: string;
  vehicle: string;
  origin: string;
  destination: string;
  payout: number;
  status: 'draft' | 'broadcasting' | 'dispatched' | 'active';
  eta?: string;
  timestamp: string;
  matchedDriversCount: number;
  respondingDrivers: DriverProfile[];
  assignedDriver?: DriverProfile;
  platformCommission?: number;
}

export interface Invoice {
  id: string;
  plan: string;
  type: string;
  date: string;
  vpa: string;
  paymentId: string;
  amount: number;
  status: 'PAID' | 'FAILED' | 'PENDING';
}

