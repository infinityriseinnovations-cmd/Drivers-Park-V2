export type LicenseCategory = 'LMV' | 'HMV' | 'HEMM' | 'PILOT';
export type AvailabilityStatus = 'online' | 'acting' | 'offline';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type SubscriptionTier = 'free_trial' | 'basic' | 'pro_unlimited';

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
