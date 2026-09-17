import { DriverProfile, EmergencyDispatch, Invoice, CommissionPackage, MatchBooking, OwnerProfile } from './types';

export const OWNER_COMMISSION_PACKAGES: CommissionPackage[] = [
  {
    id: "pkg_owner_connect",
    name: "Pay-As-You-Go Connect",
    targetRole: "owner",
    description: "Ideal for individual vehicle owners needing on-demand chauffeurs, relief drivers, or trip-by-trip hiring.",
    commissionRatePercent: 8,
    pricePerMonth: 0,
    billingCycle: "per_hire",
    features: [
      "Zero monthly subscription fee",
      "Pay only when driver matches (8% platform fee)",
      "Standard Aadhaar & Sarathi DL credential checks",
      "Direct driver phone call & WhatsApp unlock",
      "Escrow protection for driver daily wage"
    ],
    popular: false,
    badge: "FREE TO POST"
  },
  {
    id: "pkg_owner_pro",
    name: "Fleet Pro (Transporters)",
    targetRole: "owner",
    description: "Built for commercial vehicle owners, transport fleets, and multi-vehicle operators with recurring driver needs.",
    commissionRatePercent: 3,
    pricePerMonth: 1499,
    billingCycle: "monthly",
    features: [
      "Low 3% platform commission on shifts/contracts",
      "Unlimited verified driver phone & profile unlocks",
      "Priority Emergency SOS Broadcasts to drivers in 15km",
      "OBD Telematics & Shift Completion Geo-fencing",
      "GST Tax Invoices & automated recurring Razorpay mandate"
    ],
    popular: true,
    badge: "MOST POPULAR"
  },
  {
    id: "pkg_owner_enterprise",
    name: "Enterprise Logistics Suite",
    targetRole: "owner",
    description: "For logistics enterprises, bus fleet lines, and mining/construction equipment owners operating large machinery fleets.",
    commissionRatePercent: 1.5,
    pricePerMonth: 4999,
    billingCycle: "monthly",
    features: [
      "Ultra-low 1.5% platform commission on bulk contracts",
      "Bulk operator deployment (excavators, tippers, trailers)",
      "Dedicated logistics account manager & custom SLA",
      "Multi-branch dispatcher seats (up to 50 managers)",
      "Automated batch payouts & enterprise escrow API"
    ],
    popular: false,
    badge: "LARGE FLEETS"
  }
];

export const DRIVER_COMMISSION_PACKAGES: CommissionPackage[] = [
  {
    id: "pkg_driver_standard",
    name: "Standard Operator Pass",
    targetRole: "driver",
    description: "Join the verified national driver pool with zero upfront payment. Earn immediately when hired by vehicle owners.",
    commissionRatePercent: 5,
    pricePerMonth: 0,
    billingCycle: "per_hire",
    features: [
      "₹0 upfront registration & profile setup",
      "5% platform fee deducted only upon job settlement",
      "Verified Sarathi e-Badge in owner search radar",
      "Instant UPI payouts directly to your bank account",
      "Trip duty navigation & OBD progress sync"
    ],
    popular: true,
    badge: "FREE REGISTRATION"
  },
  {
    id: "pkg_driver_gold",
    name: "Gold Operator VIP",
    targetRole: "driver",
    description: "For high-frequency and commercial drivers wanting to keep 100% of their earnings with zero commission deductions.",
    commissionRatePercent: 0,
    pricePerMonth: 499,
    billingCycle: "monthly",
    features: [
      "0% commission deduction — Keep 100% of your earnings!",
      "Top #1 priority placement in Vehicle Owner search radar",
      "Direct WhatsApp dispatch from enterprise fleet owners",
      "Free medical & legal compliance renewal assists",
      "Exclusive high-paying interstate and heavy machinery jobs"
    ],
    popular: false,
    badge: "KEEP 100% WAGES"
  }
];

export const MOCK_MATCH_BOOKINGS: MatchBooking[] = [
  {
    id: "BK-9041",
    ownerId: "own_1",
    ownerName: "Fleet Logistics Ltd (Rajesh Sharma)",
    ownerType: "company",
    driverId: "drv_2",
    driverName: "Vikram Singh",
    driverPhone: "+91 98450 22104",
    vehicleModel: "CAT 320D Excavator",
    vehicleCategory: "HEMM",
    hiringBasis: "daily",
    durationUnits: 3,
    ratePerUnit: 1200,
    grossWage: 3600,
    ownerPackageId: "pkg_owner_pro",
    ownerCommissionRate: 3,
    driverPackageId: "pkg_driver_standard",
    driverCommissionRate: 5,
    totalPlatformCommission: 288, // 3% of 3600 (108) + 5% of 3600 (180)
    totalPaidByOwner: 3708,
    netDriverEarnings: 3420,
    status: "completed",
    escrowStatus: "released",
    bookingDate: "14 Mar 2025",
    startDate: "15 Mar 2025",
    origin: "Koramangala Depot Yard",
    destination: "Bengaluru Outer Ring Road Quarry"
  },
  {
    id: "BK-9028",
    ownerId: "own_2",
    ownerName: "Anand Verma (Individual Owner)",
    ownerType: "individual",
    driverId: "drv_6",
    driverName: "Sunil Patil",
    driverPhone: "+91 97321 00481",
    vehicleModel: "Mercedes-Benz E-Class",
    vehicleCategory: "LMV",
    hiringBasis: "daily",
    durationUnits: 1,
    ratePerUnit: 850,
    grossWage: 850,
    ownerPackageId: "pkg_owner_connect",
    ownerCommissionRate: 8,
    driverPackageId: "pkg_driver_gold",
    driverCommissionRate: 0,
    totalPlatformCommission: 68, // 8% of 850 (68) + 0% from gold driver
    totalPaidByOwner: 918,
    netDriverEarnings: 850,
    status: "active",
    escrowStatus: "held",
    bookingDate: "Today, 08:30 IST",
    startDate: "Today",
    origin: "Indiranagar 100ft Road",
    destination: "Kempegowda Int'l Airport Terminal 2"
  }
];

export const MOCK_OWNER = {
  fullName: "Rajesh Sharma",
  vpa: "rajesh@okhdfcbank",
  company: "Fleet Logistics Ltd • South Hub",
  fleetSize: 14,
  assignedDrivers: 11,
  credits: 18450,
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWpHkogkpwaTWJfZ5LzlREW8OpyB4hNbv3LtBrnEsMgajtq2AMkpVRngyRlcEftb9iRR8d1MczT0tqqIBfxorRvsJafZbsPWqdn4C-sQ8IYn55AHEnXl4oHgEAKMi5DA42aZJYR9PqyTSuVlizCyDa1bbwKVhhs5W17sBTe9jbPv7JZb22zrXRkn89wCPyGgVYH_cA6DeB_xde360NSGdZG9_bhc-C5y7HxwAOJFrKXvCFMlR8kMmT7w",
};

export const MOCK_OWNERS: OwnerProfile[] = [
  {
    id: "own_1",
    fullName: "Rajesh Sharma",
    companyName: "Fleet Logistics Ltd",
    ownerType: "company",
    phoneNumber: "+91 98450 11029",
    email: "rajesh@fleetlogistics.in",
    city: "Bengaluru, Karnataka",
    fleetSize: 14,
    vehicles: ["Toyota Innova HyCross VIP", "Tata Prima 5530.S", "Ashok Leyland 2820", "BharatBenz 3528C"],
    gstin: "29AABCF1234F1Z8",
    aadhaarStatus: "verified",
    rcVerificationStatus: "verified",
    commercialPermitStatus: "verified",
    activePackageId: "pkg_owner_pro",
    commissionRate: 3.0,
    accountStatus: "active",
    totalHires: 48,
    totalSpend: 184500,
    rating: 4.9
  },
  {
    id: "own_2",
    fullName: "Sanjay Hegde",
    companyName: "Deccan Heavy Earthmovers & Infra",
    ownerType: "company",
    phoneNumber: "+91 98860 34120",
    email: "sanjay@deccaninfra.com",
    city: "Hosur - Bengaluru Corridor",
    fleetSize: 9,
    vehicles: ["CAT 320D Excavator", "Komatsu PC210", "JCB 3DX Super", "ACE 15XF Crane"],
    gstin: "33AABDE5678K1Z2",
    aadhaarStatus: "verified",
    rcVerificationStatus: "verified",
    commercialPermitStatus: "verified",
    activePackageId: "pkg_owner_enterprise",
    commissionRate: 1.5,
    accountStatus: "active",
    totalHires: 112,
    totalSpend: 620000,
    rating: 4.95
  },
  {
    id: "own_3",
    fullName: "Anand Verma",
    ownerType: "individual",
    phoneNumber: "+91 97321 44582",
    email: "anand.verma@gmail.com",
    city: "Indiranagar, Bengaluru",
    fleetSize: 1,
    vehicles: ["Mercedes-Benz E-Class 220d", "Toyota Fortuner 4x4"],
    aadhaarStatus: "verified",
    rcVerificationStatus: "verified",
    commercialPermitStatus: "verified",
    activePackageId: "pkg_owner_connect",
    commissionRate: 8.0,
    accountStatus: "active",
    totalHires: 6,
    totalSpend: 14800,
    rating: 4.8
  },
  {
    id: "own_4",
    fullName: "Anita Deshmukh",
    companyName: "Deshmukh Interstate Luxury Travels",
    ownerType: "company",
    phoneNumber: "+91 94220 89110",
    email: "bookings@deshmukhtravels.in",
    city: "Pune - Bengaluru Highway",
    fleetSize: 22,
    vehicles: ["Volvo 9600 Multi-Axle Sleeper", "Scania Metrolink", "Tempo Traveller 17S"],
    gstin: "27AABCD9912L1Z5",
    aadhaarStatus: "verified",
    rcVerificationStatus: "pending",
    commercialPermitStatus: "verified",
    activePackageId: "pkg_owner_enterprise",
    commissionRate: 1.5,
    accountStatus: "pending_approval",
    totalHires: 0,
    totalSpend: 0,
    rating: 5.0
  },
  {
    id: "own_5",
    fullName: "Vikramaditya Heavy Freight Corp",
    companyName: "Vikramaditya Transport Syndicate",
    ownerType: "company",
    phoneNumber: "+91 98401 77290",
    city: "Chennai - Bengaluru Industrial Corridor",
    fleetSize: 35,
    vehicles: ["Tata Signa 4825.TK", "Ashok Leyland 4220 Multi-Axle", "Volvo FH16 750 Puller"],
    gstin: "33AAECV9012J1Z1",
    aadhaarStatus: "pending",
    rcVerificationStatus: "pending",
    commercialPermitStatus: "pending",
    activePackageId: "pkg_owner_pro",
    commissionRate: 3.0,
    accountStatus: "pending_approval",
    totalHires: 0,
    totalSpend: 0,
    rating: 4.5
  }
];

export const MOCK_DRIVERS: DriverProfile[] = [
  {
    id: "drv_2",
    fullName: "Vikram Singh",
    phoneNumber: "+91 98450 22104",
    role: "driver",
    licenseCategory: ["HEMM", "HMV"],
    experienceYears: 11,
    hourlyRate: 180,
    dailyRate: 1200,
    currentStatus: "online",
    aadhaarStatus: "verified",
    licenseNumber: "DL-KA04-2013-09884",
    badgeNumber: "HEMM-MINING-449",
    dob: "24/09/1988",
    gender: "Male",
    averageRating: 4.96,
    totalReviews: 182,
    isAiAgent: false,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwuyUG9hiicbUUvgFpgG9NK-ELHS9sRUYswN5ssotsIYCgtMJZFM1g5vjAMh61EEL6XYV_-TsmWH1XapNAoLD2i4aXTKL08lXwjWOXfLcLHkThykhM2ls3KMyOgQQ1QQumwX4oOK1RDOdukjtyHqwWx67YLPXzEqMJ2-NjcKdIEFb7EN0vXDUmAByb09TXXDDEceir5JN8OI-0xSZBag8QkvRiXHNqlRegN5wKitNnY47owQfceGw6rw",
    avatarAlt: "Portrait of heavy excavation operator Vikram Singh",
    location: {
      lat: 12.9815,
      lng: 77.6044,
      address: "Indiranagar / Koramangala 4th Block, Bengaluru, KA"
    },
    qualifiedVehicles: ["CAT 320D Excavator", "Komatsu PC210-10", "JCB 3DX EcoXcellence", "Tata Signa 4825.TK Tipper"],
    medicalFitness: "Grade A • Biometric Approved",
    policeClearance: "RTO Mining Clearance (Cleared CCTNS)"
  },
  {
    id: "drv_3",
    fullName: "Ananya Roy",
    phoneNumber: "+91 97412 88452",
    role: "driver",
    licenseCategory: ["LMV"],
    experienceYears: 7,
    hourlyRate: 120,
    dailyRate: 950,
    currentStatus: "online",
    aadhaarStatus: "verified",
    licenseNumber: "DL-KA03-2017-04812",
    badgeNumber: "VIP-CHAUFFEUR-992",
    dob: "11/11/1993",
    gender: "Female",
    averageRating: 4.98,
    totalReviews: 310,
    isAiAgent: false,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMx3ilPozSUFWTwMdT4fvzlK-A9qW-kg7fBHphZbpqpF5GrXQ3yBNJCle92vNDof77e5KyIQts0UXr_bqApzUnVQ_1HHKHsIhRpu_ArpiSSEmWeaODpej-ZGlj1CNUEnfrhb_gJCnsQ-ky7b9OcylYCsOQw7jYxLTUBIBjL5wJN1R5KD1NhLwacvE4JLC2ZbOBPjMUUeYpt06cARQT84JwP_vvtXiyqMqVsKrcbVDNiTltRi6HiQjiDA",
    avatarAlt: "Executive chauffeur Ananya Roy",
    location: {
      lat: 12.9620,
      lng: 77.5850,
      address: "Indiranagar Tech Corridor, Bengaluru, KA"
    },
    qualifiedVehicles: ["Mercedes-Benz E-Class", "BMW iX xDrive50", "Tesla Model Y ADAS", "Toyota Innova HyCross VIP"],
    medicalFitness: "Grade A • Perfect 6/6 Vision",
    policeClearance: "Zero Infractions • Airport Pass Active"
  },
  {
    id: "drv_7",
    fullName: "CyberMotion Fleet-Node #042",
    phoneNumber: "+91 90000 00042",
    role: "driver",
    licenseCategory: ["LMV", "HMV", "HEMM"],
    experienceYears: 4,
    hourlyRate: 350,
    dailyRate: 2800,
    currentStatus: "online",
    aadhaarStatus: "verified",
    licenseNumber: "ARAI-ADS-2025-DP09",
    badgeNumber: "TELE-OP-NODE-42",
    dob: "Calibrated 2025",
    gender: "AI Automated Node",
    averageRating: 4.99,
    totalReviews: 842,
    isAiAgent: true,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAM5gRa14Sq5pzaGfHzF03HvkzuL_YbpwRIyBic0mD83EFBgrCMpfa-hK2PF6xRdUDkSBi4VyfthZXWrC2sUeo2W51NAsjzWp-LucrflhQOJOQ2PmyoANIkT6XjV87F768eczZZSjMpZOvkXr0wcB-QnChi_94_3-X40LDWbUTtFNHGbMPd0LoIK8lLUFlESUcLLHyr28tKUpEr_SNNeLgOeJHszV25xuSsxY0H4Y0w-9W6_Ze0sGg0Ug",
    avatarAlt: "Autonomous AI Fleet-Node Agent",
    location: {
      lat: 12.9789,
      lng: 77.5891,
      address: "Indiranagar Spatial Grid #4, Bengaluru, KA"
    },
    qualifiedVehicles: ["Hesai 128-Beam LiDAR", "Dual 5G Ultra-Low Latency Uplink", "Automated Warehouse & Yard Tugger", "Tata Prima EV Autonomous Tug"],
    medicalFitness: "Fail-Safe Override: Active • Calibrated",
    policeClearance: "ISO 26262 Functional Safety Compliant"
  },
  {
    id: "drv_1",
    fullName: "Rajesh Verma",
    phoneNumber: "+91 94480 12345",
    role: "driver",
    licenseCategory: ["LMV", "HMV"],
    experienceYears: 9,
    hourlyRate: 150,
    dailyRate: 1100,
    currentStatus: "online",
    aadhaarStatus: "verified",
    licenseNumber: "DL-MH02-2016-99201",
    badgeNumber: "BADGE-HMV-8820",
    dob: "12/08/1986",
    gender: "Male",
    averageRating: 4.92,
    totalReviews: 124,
    isAiAgent: false,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSnZdZ7tDXqYJQ7zbWg2V0GP9KCdYEz6xJCkqQ2Y7D9hbx8QWfvlijQ36N2jqcVOsXWfoltwI6x0BXdifQX9PTqu-Zh4pCH7oVm_RUTvxuDBRXm5Y6z5X0nB4Ndh8HoDvYu6uaSQAuxXTj3nc5JMFDyVik-fb19ygiCpVXeo_qeCbP3t5RPUUxJu-KisAHkuZnIaouCKUq0KiKs-owIRe1XaeJTSZqBXgYK2f0M26g344t66bJA31zeA",
    avatarAlt: "Portrait of professional Indian transport driver Rajesh Verma",
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: "Indiranagar, Bengaluru, KA"
    },
    qualifiedVehicles: ["Tata Prima 4028", "Ashok Leyland 2820 Tipper", "Toyota Innova HyCross"],
    medicalFitness: "Grade A • Eye 6/6",
    policeClearance: "No Pending Cases (Cleared CCTNS)"
  },
  {
    id: "drv_4",
    fullName: "Manish Rawat",
    phoneNumber: "+91 99000 81234",
    role: "driver",
    licenseCategory: ["HMV"],
    experienceYears: 14,
    hourlyRate: 210,
    dailyRate: 1600,
    currentStatus: "online",
    aadhaarStatus: "verified",
    licenseNumber: "DL-KA05-2011-88912",
    badgeNumber: "HMV-INTERSTATE-982",
    dob: "18/03/1984",
    gender: "Male",
    averageRating: 4.95,
    totalReviews: 142,
    isAiAgent: false,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsSBqBjrXXi_wbGJQkWqlTPXRHyzs3RQ-V83Q3dmdMdSHhIX21m4AQPPs9V3BhKXnIpIvpsA4KH2jXlrocB9ohtAVedhECuw_c8_EuQjH5jvZCx8w5X4vUeaK3Y60psNzL0xjfxXwwI9DUh_RFL5H9xtzGbFA7rfbJn9AfVa5Mv9xoC4y3DmbskVl7SooBR8dbCuaQ9otUR7-ibs1KD08DTVvN6OhZ9jHFI6qoBsyzqMMCOnoK1_KLiA",
    avatarAlt: "Interstate heavy commercial driver Manish Rawat",
    location: {
      lat: 12.9902,
      lng: 77.6210,
      address: "Indiranagar Enclave, Bengaluru, KA"
    },
    qualifiedVehicles: ["Volvo 9600 Multi-Axle", "Tata Prima 5530.S", "Ashok Leyland 2820 Multi-Axle", "BharatBenz 3528C Heavy Tipper"],
    medicalFitness: "Grade A • Zero Night-blindness certified",
    policeClearance: "Verified Clean Record (Cleared CCTNS)"
  },
  {
    id: "drv_5",
    fullName: "Sandeep K. Yadav",
    phoneNumber: "+91 88720 94112",
    role: "driver",
    licenseCategory: ["HEMM"],
    experienceYears: 8,
    hourlyRate: 160,
    dailyRate: 1100,
    currentStatus: "offline",
    aadhaarStatus: "pending",
    licenseNumber: "DGMS-MIN-2019-4402",
    badgeNumber: "HEMM-EXCAVATOR-110",
    dob: "04/11/1991",
    gender: "Male",
    averageRating: 4.88,
    totalReviews: 64,
    isAiAgent: false,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxhBdgcvWG9UNJvKMke-G3sqx2ZXYuZW2wbo2jETEA_lMnfIVmqu_DSGChNR5YpeST3SyrzwIPyTmW6yhihY_ISnbH8A9aoYHqpoeT2ISeOfweb72WJkSe-onlGVDhU4iGpH2BieczvFSiGYlqJurE4Ag5n6BneDeKWoCIa67WTjKI4tcVb5YR-JG3QsTPZjiLrg3f_Os6G8YViww4gFL6yU1LCzkgFd-8s_9OSXGsi4SlatjYi7aESQ",
    avatarAlt: "Mining Machinery Operator Sandeep Yadav",
    location: {
      lat: 12.9510,
      lng: 77.6110,
      address: "Bhiwandi Area, Mumbai, MH"
    },
    qualifiedVehicles: ["Caterpillar 320D", "HEMM Dump Truck", "Komatsu PC300"],
    medicalFitness: "In Review (Biometrics Queue)",
    policeClearance: "Awaiting State UIDAI Sync"
  },
  {
    id: "drv_6",
    fullName: "Sunil Patil",
    phoneNumber: "+91 97321 00481",
    role: "driver",
    licenseCategory: ["LMV"],
    experienceYears: 5,
    hourlyRate: 110,
    dailyRate: 850,
    currentStatus: "acting",
    aadhaarStatus: "verified",
    licenseNumber: "DL-MH01-2019-00124",
    badgeNumber: "NIGHT-CHAUFFEUR-004",
    dob: "19/06/1994",
    gender: "Male",
    averageRating: 4.90,
    totalReviews: 98,
    isAiAgent: false,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsa9g73cXlcmhrBrE4XrczRQ6e1Hp_fP8CVE2Rx0R0R3QtOt0mbSzcghZsq2O-ieQFtv_H-tgD9aUuk7JXrkkXVnBjDlMB_vbqcp3-N-C_6uWUR2GRvvOvIkEXjfNu7GdEwautAjl3jYm6lHVW7Fr0n6QWqpoYdG9OLjBpmIsqAlRUI3LUz7qzGFtWeLExjvG2teLxyCOTf0dFJYte8v4yUBS58k50IbMj9ZBJpdVkl0XpQYP67IipQg",
    avatarAlt: "Executive chauffeur Sunil Patil",
    location: {
      lat: 12.9678,
      lng: 77.5992,
      address: "Koramangala, Bengaluru, KA"
    },
    qualifiedVehicles: ["Mercedes E-Class", "Audi A6", "Jaguar XF", "Tata Nexon EV"],
    medicalFitness: "Grade A • Zero Night-blindness certified",
    policeClearance: "Zero Incidents Recorded"
  }
];

export const MOCK_DISPATCHES: EmergencyDispatch[] = [
  {
    id: "DP-8924",
    title: "Urgent Tipper Driver (25T Mining Quarry)",
    vehicle: "Ashok Leyland 2820 Tipper (Heavy Hauler)",
    origin: "Kolar Stone Basin #3",
    destination: "Bengaluru East Infrastructure Terminal",
    payout: 2200,
    status: "broadcasting",
    timestamp: "04m 18s ago",
    matchedDriversCount: 48,
    respondingDrivers: [
      {
        id: "resp_1",
        fullName: "Ramesh Kumar",
        phoneNumber: "+91 94110 99824",
        role: "driver",
        licenseCategory: ["HMV"],
        experienceYears: 12,
        hourlyRate: 160,
        dailyRate: 1300,
        currentStatus: "online",
        aadhaarStatus: "verified",
        licenseNumber: "DL-KA02-2012-09224",
        dob: "14/05/1982",
        gender: "Male",
        averageRating: 4.90,
        totalReviews: 342,
        isAiAgent: false,
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuANyAzKkLP3uBJ7h58VFV2hae40ZIBGn39kzByJq7HmZWnHYHscGqIDGyz-tCXxiBwp4HWqz4LsHpJMQGe7NvLN4Lh_yxMtfTCgLu8e6krJKFXFMsBa7aaNWEg3sHZN2c1xcL9HT2yFObstpBdPRIFIFjqvYyoOEj_uO6oVT6cbNZ9z0q2tUDkxXT38EUQxnyi2kcIgRI60gHLMVvEaQWYxEQ4ciPpWW9-J4XlkFkl9TEh_dhntNJxjXA",
        avatarAlt: "Tipper Driver Ramesh Kumar",
        location: {
          lat: 12.9734,
          lng: 77.5921,
          address: "Indiranagar Depot"
        },
        qualifiedVehicles: ["Ashok Leyland Tipper", "Tata Signa Tipper"],
        medicalFitness: "Grade A • Eye 6/6",
        policeClearance: "No cases pending"
      },
      {
        id: "resp_2",
        fullName: "Gurpreet Singh",
        phoneNumber: "+91 97201 44101",
        role: "driver",
        licenseCategory: ["HMV"],
        experienceYears: 14,
        hourlyRate: 190,
        dailyRate: 1500,
        currentStatus: "online",
        aadhaarStatus: "verified",
        licenseNumber: "DL-PB11-2010-00441",
        dob: "02/10/1980",
        gender: "Male",
        averageRating: 4.80,
        totalReviews: 189,
        isAiAgent: false,
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzpgMQEl3XGkZX6C4lvLo4MuBGvLgY40Sq9USIPJjoIi6BQKj60I5u5f0WH0iYA1mdivKkySXt-tAcWzAyqxLiLkC9PqA5mHToC1qrQ9jnkXNbp-DJTN2bexspUikKakExHbhJJFy4go9gWdp84FL4fttj1Qz5bSABoUT34vYisywRLPrHDI8UyJYMs0q-OjwbNYT4hkn8cftOi_IreZougrYJhQQQiys4rZWS2I_eQLCQwwH4--3hHw",
        avatarAlt: "Gurpreet Singh",
        location: {
          lat: 12.9790,
          lng: 77.5999,
          address: "Koramangala 1st Block"
        },
        qualifiedVehicles: ["Multi-axle Trailer", "Tata Prima 4028"],
        medicalFitness: "Grade A • Satisfactory",
        policeClearance: "No criminal records"
      }
    ]
  },
  {
    id: "DP-8810",
    title: "Emergency Night LMV Chauffeur",
    vehicle: "Mercedes E-Class (Executive Sedan)",
    origin: "Koramangala 4th Block",
    destination: "Kempegowda Int'l Airport Terminal 2",
    payout: 950,
    status: "active",
    timestamp: "12m 30s ago",
    matchedDriversCount: 14,
    respondingDrivers: [],
    assignedDriver: {
      id: "drv_6",
      fullName: "Sunil Patil",
      phoneNumber: "+91 97321 00481",
      role: "driver",
      licenseCategory: ["LMV"],
      experienceYears: 5,
      hourlyRate: 110,
      dailyRate: 850,
      currentStatus: "acting",
      aadhaarStatus: "verified",
      licenseNumber: "DL-MH01-2019-00124",
      badgeNumber: "NIGHT-CHAUFFEUR-004",
      dob: "19/06/1994",
      gender: "Male",
      averageRating: 4.90,
      totalReviews: 98,
      isAiAgent: false,
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsa9g73cXlcmhrBrE4XrczRQ6e1Hp_fP8CVE2Rx0R0R3QtOt0mbSzcghZsq2O-ieQFtv_H-tgD9aUuk7JXrkkXVnBjDlMB_vbqcp3-N-C_6uWUR2GRvvOvIkEXjfNu7GdEwautAjl3jYm6lHVW7Fr0n6QWqpoYdG9OLjBpmIsqAlRUI3LUz7qzGFtWeLExjvG2teLxyCOTf0dFJYte8v4yUBS58k50IbMj9ZBJpdVkl0XpQYP67IipQg",
      avatarAlt: "Executive chauffeur Sunil Patil",
      location: {
        lat: 12.9678,
        lng: 77.5992,
        address: "Koramangala, Bengaluru, KA"
      },
      qualifiedVehicles: ["Mercedes E-Class", "Audi A6", "Jaguar XF", "Tata Nexon EV"],
      medicalFitness: "Grade A • Zero Night-blindness certified",
      policeClearance: "Zero Incidents Recorded"
    }
  }
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-2025-081",
    plan: "Fleet Pro Monthly",
    type: "Recurring Mandate",
    date: "04 Mar 2025, 08:30 IST",
    vpa: "rajesh@okhdfcbank",
    paymentId: "pay_Q8l39sPz901",
    amount: 1499.00,
    status: "PAID"
  },
  {
    id: "INV-2025-044",
    plan: "Daily Quick Pass",
    type: "Ad-Hoc Unlocks",
    date: "18 Feb 2025, 14:15 IST",
    vpa: "rajesh@okhdfcbank",
    paymentId: "pay_P1m24vKx482",
    amount: 199.00,
    status: "PAID"
  },
  {
    id: "INV-2025-012",
    plan: "Fleet Pro Monthly",
    type: "Recurring Mandate",
    date: "04 Feb 2025, 08:30 IST",
    vpa: "rajesh@okhdfcbank",
    paymentId: "pay_N9k87mJx119",
    amount: 1499.00,
    status: "PAID"
  }
];

export interface VehicleModelItem {
  name: string;
  category: 'LMV' | 'HMV' | 'HEMM' | 'Bus' | 'EV';
  brand: string;
  description: string;
  popular?: boolean;
}

export const MASTER_VEHICLE_CATALOG: VehicleModelItem[] = [
  // LMV / Executive / Private / Electric
  { name: "Toyota Innova HyCross", category: "LMV", brand: "Toyota", description: "VIP Hybrid MPV / Executive fleet", popular: true },
  { name: "Toyota Innova Crysta", category: "LMV", brand: "Toyota", description: "Reliable commercial long-distance MPV", popular: true },
  { name: "Toyota Fortuner 4x4", category: "LMV", brand: "Toyota", description: "Heavy Duty SUV / Rough terrain", popular: true },
  { name: "Mercedes-Benz E-Class", category: "LMV", brand: "Mercedes-Benz", description: "Ultra-luxury executive chauffeur sedan", popular: true },
  { name: "BMW iX / 7-Series", category: "LMV", brand: "BMW", description: "Next-gen ADAS Electric Flagship", popular: true },
  { name: "Audi A6 Matrix", category: "LMV", brand: "Audi", description: "VIP corporate airport transfer", popular: false },
  { name: "Tata Nexon EV Max", category: "LMV", brand: "Tata", description: "Smart electric urban fleet", popular: true },
  { name: "Mahindra XUV700 AX7", category: "LMV", brand: "Mahindra", description: "ADAS Level-2 Highway Cruiser", popular: true },
  { name: "Mahindra Scorpio-N", category: "LMV", brand: "Mahindra", description: "Rugged rural / industrial escort SUV", popular: false },
  { name: "Hyundai Ioniq 5", category: "LMV", brand: "Hyundai", description: "800V fast-charge luxury EV", popular: false },
  { name: "Maruti Suzuki Ertiga Fleet", category: "LMV", brand: "Maruti", description: "High-mileage CNG commuter MPV", popular: true },
  { name: "Kia Carnival Limousine", category: "LMV", brand: "Kia", description: "VIP captain seat lounge MPV", popular: false },
  { name: "Tesla Model Y ADAS", category: "LMV", brand: "Tesla", description: "Autopilot certified electric crossover", popular: false },

  // HMV / Heavy Commercial Trucks & Multi-Axle
  { name: "Tata Prima 5530.S", category: "HMV", brand: "Tata", description: "55-Ton multi-axle trailer tractor", popular: true },
  { name: "Tata Signa 4825.TK Tipper", category: "HMV", brand: "Tata", description: "16-Wheeler heavy mining & aggregates tipper", popular: true },
  { name: "Ashok Leyland 2820 Multi-Axle", category: "HMV", brand: "Ashok Leyland", description: "28-Ton commercial freight hauler", popular: true },
  { name: "BharatBenz 3528C Heavy Tipper", category: "HMV", brand: "BharatBenz", description: "Heavy construction deep-quarry tipper", popular: true },
  { name: "Volvo FH16 750 Puller", category: "HMV", brand: "Volvo", description: "Over-dimensional cargo (ODC) ultra puller", popular: true },
  { name: "Eicher Pro 6028 Haulier", category: "HMV", brand: "Eicher", description: "Interstate container cargo transport", popular: false },
  { name: "Mahindra Blazo X 35", category: "HMV", brand: "Mahindra", description: "FuelSmart heavy multi-axle truck", popular: false },
  { name: "Scania R500 V8 Heavy Haul", category: "HMV", brand: "Scania", description: "Long-haul refrigerated cold-chain truck", popular: false },

  // HEMM / Heavy Earthmoving Machinery & Cranes
  { name: "CAT 320D Hydraulic Excavator", category: "HEMM", brand: "Caterpillar", description: "20-Ton high-output infrastructure digger", popular: true },
  { name: "Komatsu PC210-10 Crawler", category: "HEMM", brand: "Komatsu", description: "Heavy duty mining bucket excavator", popular: true },
  { name: "JCB 3DX Super EcoXcellence", category: "HEMM", brand: "JCB", description: "India's highest selling backhoe loader", popular: true },
  { name: "Tata Hitachi EX200 LC", category: "HEMM", brand: "Tata Hitachi", description: "Heavy stone quarry & pipeline excavator", popular: true },
  { name: "BEML D80 Heavy Bulldozer", category: "HEMM", brand: "BEML", description: "National defense & open-cast mine dozer", popular: false },
  { name: "L&T 9020 Wheel Loader", category: "HEMM", brand: "L&T", description: "High-capacity gravel & bulk cargo loader", popular: false },
  { name: "ACE 15XF Mobile Hydraulic Crane", category: "HEMM", brand: "ACE", description: "Industrial pick-and-carry mobile hydra crane", popular: true },
  { name: "Schwing Stetter Concrete Transit Mixer", category: "HMV", brand: "Schwing Stetter", description: "Heavy ready-mix concrete transit drum truck", popular: true },
  { name: "Sany SY215C Heavy Digger", category: "HEMM", brand: "Sany", description: "Reinforced arm demolition excavator", popular: false },
  { name: "Volvo EC210D Excavator", category: "HEMM", brand: "Volvo CE", description: "Fuel-efficient heavy earthmoving equipment", popular: false },

  // Buses / Coaches / Transit
  { name: "Volvo 9600 Multi-Axle Sleeper", category: "Bus", brand: "Volvo", description: "15-Meter ultra-luxury intercity sleeper coach", popular: true },
  { name: "Scania Metrolink HD", category: "Bus", brand: "Scania", description: "Multi-axle interstate tourist express", popular: false },
  { name: "Ashok Leyland 12M Viking", category: "Bus", brand: "Ashok Leyland", description: "Standard Indian state & staff passenger coach", popular: true },
  { name: "Tata Starbus Ultra EV", category: "Bus", brand: "Tata", description: "Zero-emission electric city bus", popular: false }
];

export interface IndustryTopModel {
  name: string;
  brand: string;
  category: 'LMV' | 'Truck' | 'Bus' | 'Machinery' | 'Flight';
  description: string;
  isIndustryLeader?: boolean;
}

export const INDUSTRY_TOP_MODELS_BY_CATEGORY: Record<string, IndustryTopModel[]> = {
  LMV: [
    { name: "Toyota Innova HyCross", brand: "Toyota", category: "LMV", description: "Top #1 VIP Chauffeur & Executive Hybrid MPV", isIndustryLeader: true },
    { name: "Toyota Fortuner 4x4", brand: "Toyota", category: "LMV", description: "Top Heavy Duty Rough-Terrain & VIP Escort SUV", isIndustryLeader: true },
    { name: "Mercedes-Benz E-Class", brand: "Mercedes-Benz", category: "LMV", description: "Top Ultra-Luxury Corporate Chauffeur Sedan", isIndustryLeader: true },
    { name: "BMW iX / 7-Series", brand: "BMW", category: "LMV", description: "Top Next-Gen ADAS Electric Flagship", isIndustryLeader: true },
    { name: "Tata Nexon EV Max", brand: "Tata", category: "LMV", description: "Top Urban Electric Commercial Fleet Crossover", isIndustryLeader: false },
    { name: "Mahindra XUV700 AX7", brand: "Mahindra", category: "LMV", description: "Top ADAS Level-2 Long-Distance Cruiser", isIndustryLeader: false },
    { name: "Toyota Innova Crysta", brand: "Toyota", category: "LMV", description: "Reliable High-Mileage Commercial Diesel MPV", isIndustryLeader: false },
    { name: "Maruti Suzuki Ertiga Fleet", brand: "Maruti", category: "LMV", description: "High-Efficiency Urban CNG Commuter MPV", isIndustryLeader: false }
  ],
  Truck: [
    { name: "Tata Prima 5530.S", brand: "Tata", category: "Truck", description: "Top #1 55-Ton Heavy Multi-Axle Trailer Tractor", isIndustryLeader: true },
    { name: "Tata Signa 4825.TK Tipper", brand: "Tata", category: "Truck", description: "Top 16-Wheeler Heavy Mining & Aggregate Tipper", isIndustryLeader: true },
    { name: "Ashok Leyland 2820 Multi-Axle", brand: "Ashok Leyland", category: "Truck", description: "Top 28-Ton Commercial Long-Haul Freight Hauler", isIndustryLeader: true },
    { name: "BharatBenz 3528C Heavy Tipper", brand: "BharatBenz", category: "Truck", description: "Top Heavy Construction & Deep-Quarry Hauler", isIndustryLeader: true },
    { name: "Volvo FH16 750 Puller", brand: "Volvo", category: "Truck", description: "Top Over-Dimensional Cargo (ODC) Ultra Puller", isIndustryLeader: true },
    { name: "Eicher Pro 6028 Haulier", brand: "Eicher", category: "Truck", description: "Interstate High-Speed Cargo Container Carrier", isIndustryLeader: false },
    { name: "Tata Ace Gold / Intra V50", brand: "Tata", category: "Truck", description: "Top Light Commercial Last-Mile Cargo Fleet", isIndustryLeader: false }
  ],
  Bus: [
    { name: "Volvo 9600 Multi-Axle Sleeper", brand: "Volvo", category: "Bus", description: "Top #1 15-Meter Ultra-Luxury Intercity Sleeper Coach", isIndustryLeader: true },
    { name: "Scania Metrolink HD", brand: "Scania", category: "Bus", description: "Top Multi-Axle Premium Interstate Tourist Express", isIndustryLeader: true },
    { name: "Ashok Leyland 12M Viking", brand: "Ashok Leyland", category: "Bus", description: "Top Indian Corporate & Public Passenger Coach", isIndustryLeader: true },
    { name: "Tata Starbus Ultra EV", brand: "Tata", category: "Bus", description: "Top Zero-Emission Electric City Transit Bus", isIndustryLeader: true },
    { name: "Force Urbania / Tempo 17S", brand: "Force", category: "Bus", description: "Top Executive VIP Travel & Tourist Van", isIndustryLeader: false },
    { name: "BharatBenz 1624 Intercity", brand: "BharatBenz", category: "Bus", description: "Top Air-Suspended Intercity Luxury Tourer", isIndustryLeader: false }
  ],
  Machinery: [
    { name: "CAT 320D Hydraulic Excavator", brand: "Caterpillar", category: "Machinery", description: "Top #1 20-Ton Global Heavy Mining & Quarry Digger", isIndustryLeader: true },
    { name: "JCB 3DX Super EcoXcellence", brand: "JCB", category: "Machinery", description: "Top #1 Highest Selling Heavy Backhoe Loader", isIndustryLeader: true },
    { name: "Komatsu PC210-10 Crawler", brand: "Komatsu", category: "Machinery", description: "Top Heavy Mining Crawler Bucket Excavator", isIndustryLeader: true },
    { name: "Tata Hitachi EX200 LC", brand: "Tata Hitachi", category: "Machinery", description: "Top Heavy Stone Quarry & Pipeline Earthmover", isIndustryLeader: true },
    { name: "ACE 15XF Mobile Hydraulic Crane", brand: "ACE", category: "Machinery", description: "Top Industrial Pick-and-Carry Mobile Hydra Crane", isIndustryLeader: true },
    { name: "L&T 9020 Wheel Loader", brand: "L&T", category: "Machinery", description: "Top High-Capacity Bulk Cargo Material Handling Loader", isIndustryLeader: false },
    { name: "BEML D80 Heavy Bulldozer", brand: "BEML", category: "Machinery", description: "Top Open-Cast Mining & Defense Earth Leveller", isIndustryLeader: false }
  ],
  Flight: [
    { name: "Bell 407 / 429 Helicopter", brand: "Bell", category: "Flight", description: "Top #1 VIP & Offshore Industrial Charter Helicopter", isIndustryLeader: true },
    { name: "Airbus H125 / H145 Ecureuil", brand: "Airbus", category: "Flight", description: "Top High-Altitude & Corporate Utility Rotorcraft", isIndustryLeader: true },
    { name: "Cessna Citation CJ4", brand: "Textron", category: "Flight", description: "Top Light Corporate Executive Jet Charter", isIndustryLeader: true },
    { name: "Beechcraft King Air B200", brand: "Beechcraft", category: "Flight", description: "Top Twin-Turboprop Regional Executive Aircraft", isIndustryLeader: false },
    { name: "DJI Agras T40 / FlytBase Heavy Drone", brand: "DJI", category: "Flight", description: "Top Industrial Heavy Logistics & Aerial Survey Drone", isIndustryLeader: false }
  ]
};

