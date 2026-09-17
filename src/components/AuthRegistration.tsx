import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Compass, 
  Smartphone, 
  Mail, 
  User, 
  Check, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Loader2,
  Building2,
  Car,
  HardHat,
  X,
  Zap,
  Sparkles,
  Plus,
  CreditCard,
  Percent,
  Layers,
  ArrowRight
} from 'lucide-react';
import { OWNER_COMMISSION_PACKAGES, DRIVER_COMMISSION_PACKAGES } from '../data';
import { OwnerType } from '../types';

interface AuthRegistrationProps {
  onCompleteRegistration: (profile: {
    role: 'owner' | 'driver';
    fullName: string;
    contact: string;
    ownerType?: OwnerType;
    selectedPackageId?: string;
    commissionRate?: number;
    details: any;
    ownerRequirement?: {
      from: string;
      to: string;
      vehicleType: string;
      vehicleModel: string;
      tripType: 'one-way' | 'two-way';
      hiringBasis: 'daily' | 'monthly' | 'enterprise';
    };
  }) => void;
  onCancel?: () => void;
}

export default function AuthRegistration({ onCompleteRegistration, onCancel }: AuthRegistrationProps) {
  // Stepper state: 'role' (Step 1) -> 'otp' (Step 2) -> 'details' (Step 3) -> 'success' (Step 4)
  const [step, setStep] = useState<'role' | 'otp' | 'details' | 'success'>('role');
  
  // Core user role: strictly vehicle owner or driver/operator
  const [role, setRole] = useState<'owner' | 'driver'>('owner');
  const [ownerType, setOwnerType] = useState<OwnerType>('company');
  const [driverSpecialization, setDriverSpecialization] = useState<'commercial' | 'machinery' | 'chauffeur'>('machinery');
  
  const [fullName, setFullName] = useState('');
  const [contactMethod, setContactMethod] = useState<'sms' | 'whatsapp' | 'email'>('sms');
  const [contactVal, setContactVal] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [timer, setTimer] = useState(120);
  const [otpError, setOtpError] = useState('');

  // Selected Commission Package (Step 3)
  const [selectedOwnerPackage, setSelectedOwnerPackage] = useState<string>('pkg_owner_pro');
  const [selectedDriverPackage, setSelectedDriverPackage] = useState<string>('pkg_driver_standard');

  // Profile details depending on role
  const [ownerDetails, setOwnerDetails] = useState({
    fleetName: 'Fleet Logistics Ltd • South Hub',
    city: 'Bengaluru',
    gstin: '29ABCDE1234F1Z5',
    vpa: 'rajesh.cargo@okhdfcbank'
  });

  const [driverDetails, setDriverDetails] = useState({
    licenseCategories: ['HMV', 'HEMM'],
    licenseNumber: 'DL-KA04-2013-09884',
    badgeNumber: 'HEMM-MINING-449',
    experienceYears: '8',
    hourlyRate: '180',
    dailyRate: '1200',
    medicalFitness: 'Grade A • Biometric Approved',
    vehicleModelsExperience: [
      'CAT 320D Hydraulic Excavator',
      'JCB 3DX EcoXcellence',
      'Tata Prima 5530.S Heavy Hauler',
      'Toyota Innova HyCross'
    ]
  });

  const [newModelTag, setNewModelTag] = useState('');

  // OWNER VEHICLE ROUTE REQUIREMENT DETAILS (Step 3)
  const [ownerRequirement, setOwnerRequirement] = useState({
    from: 'Indiranagar Tech Park, Bengaluru',
    to: 'Kempegowda Int. Airport (KIA) Terminal-2',
    vehicleType: 'LMV',
    vehicleModel: 'Toyota Innova HyCross',
    tripType: 'one-way' as 'one-way' | 'two-way',
    hiringBasis: 'daily' as 'daily' | 'monthly' | 'enterprise'
  });

  const [geoLocating, setGeoLocating] = useState(false);

  // Vehicle models catalog (Road & Machinery only)
  const modelsByType: Record<string, string[]> = {
    LMV: [
      "Toyota Innova HyCross",
      "Toyota Innova Crysta",
      "Toyota Fortuner 4x4",
      "Mercedes-Benz E-Class",
      "Mahindra XUV700 AX7",
      "Tata Safari Kryotec Luxury ADAS",
      "Maruti Suzuki Ertiga Fleet"
    ],
    Truck: [
      "Tata Prima 5530.S",
      "Tata Signa 4825.TK Tipper",
      "Ashok Leyland 2820 Multi-Axle",
      "BharatBenz 3528C Heavy Tipper",
      "Volvo FH16 750 Puller",
      "Eicher Pro 6028 Haulier"
    ],
    Bus: [
      "Volvo 9600 Multi-Axle Sleeper",
      "Scania Metrolink HD",
      "Ashok Leyland 12M Viking",
      "Tata Starbus Ultra EV"
    ],
    Machinery: [
      "CAT 320D Hydraulic Excavator",
      "JCB 3DX Super EcoXcellence",
      "Komatsu PC210-10 Crawler",
      "Tata Hitachi EX200 LC",
      "ACE 15XF Mobile Hydraulic Crane",
      "Schwing Stetter Concrete Transit Mixer",
      "BEML D80 Heavy Bulldozer"
    ]
  };

  const handleVehicleTypeChange = (type: string) => {
    const firstModel = modelsByType[type]?.[0] || '';
    setOwnerRequirement(prev => ({
      ...prev,
      vehicleType: type,
      vehicleModel: firstModel
    }));
  };

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Quick Demo Auto-fill triggers
  const handleQuickDemoFill = (type: 'owner_company' | 'owner_ind' | 'driver_hemm' | 'driver_gold') => {
    if (type === 'owner_company') {
      setRole('owner');
      setOwnerType('company');
      setSelectedOwnerPackage('pkg_owner_pro');
      setFullName('Rajesh Sharma');
      setContactMethod('sms');
      setContactVal('+91 98450 11029');
      setOwnerDetails({
        fleetName: 'Fleet Logistics Ltd • South Hub',
        city: 'Bengaluru',
        gstin: '29ABCDE1234F1Z5',
        vpa: 'rajesh.cargo@okhdfcbank'
      });
      setOwnerRequirement({
        from: 'Koramangala Depot Yard, Bengaluru',
        to: 'Outer Ring Road Aggregates Quarry',
        vehicleType: 'Machinery',
        vehicleModel: 'CAT 320D Hydraulic Excavator',
        tripType: 'one-way',
        hiringBasis: 'daily'
      });
    } else if (type === 'owner_ind') {
      setRole('owner');
      setOwnerType('individual');
      setSelectedOwnerPackage('pkg_owner_connect');
      setFullName('Anand Verma');
      setContactMethod('whatsapp');
      setContactVal('+91 98112 33409');
      setOwnerDetails({
        fleetName: 'Anand Verma (Private Vehicle)',
        city: 'Bengaluru',
        gstin: 'N/A • Personal Vehicle',
        vpa: 'anand.verma@upi'
      });
      setOwnerRequirement({
        from: 'Indiranagar 100ft Road',
        to: 'Kempegowda Int. Airport (KIA) Terminal-2',
        vehicleType: 'LMV',
        vehicleModel: 'Mercedes-Benz E-Class',
        tripType: 'one-way',
        hiringBasis: 'daily'
      });
    } else if (type === 'driver_hemm') {
      setRole('driver');
      setDriverSpecialization('machinery');
      setSelectedDriverPackage('pkg_driver_standard');
      setFullName('Vikram Singh');
      setContactMethod('sms');
      setContactVal('+91 98450 22104');
      setDriverDetails({
        licenseCategories: ['HEMM', 'HMV'],
        licenseNumber: 'DL-KA04-2013-09884',
        badgeNumber: 'HEMM-MINING-449',
        experienceYears: '11',
        hourlyRate: '180',
        dailyRate: '1200',
        medicalFitness: 'Grade A • Biometric Approved',
        vehicleModelsExperience: ['CAT 320D Hydraulic Excavator', 'JCB 3DX Super EcoXcellence', 'Tata Prima 5530.S']
      });
    } else {
      setRole('driver');
      setDriverSpecialization('chauffeur');
      setSelectedDriverPackage('pkg_driver_gold');
      setFullName('Sunil Patil');
      setContactMethod('whatsapp');
      setContactVal('+91 97321 00481');
      setDriverDetails({
        licenseCategories: ['LMV'],
        licenseNumber: 'DL-KA03-2016-00441',
        badgeNumber: 'LMV-GOLD-108',
        experienceYears: '9',
        hourlyRate: '130',
        dailyRate: '850',
        medicalFitness: 'Grade A • Eye 6/6 Certified',
        vehicleModelsExperience: ['Mercedes-Benz E-Class', 'Toyota Innova HyCross', 'Toyota Fortuner 4x4']
      });
    }
  };

  const handleGeoLocate = () => {
    setGeoLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOwnerRequirement(prev => ({
            ...prev,
            from: `GPS Pin: ${position.coords.latitude.toFixed(4)}° N, ${position.coords.longitude.toFixed(4)}° E (Indiranagar, BLR)`
          }));
          setGeoLocating(false);
        },
        () => {
          setTimeout(() => {
            setOwnerRequirement(prev => ({
              ...prev,
              from: "GPS Anchor: 12.9716° N, 77.5946° E (Bengaluru Hub)"
            }));
            setGeoLocating(false);
          }, 600);
        },
        { timeout: 4000 }
      );
    } else {
      setOwnerRequirement(prev => ({
        ...prev,
        from: "GPS Anchor: 12.9716° N, 77.5946° E (Bengaluru Hub)"
      }));
      setGeoLocating(false);
    }
  };

  // Step 1 Submit -> Proceed to Step 2 (OTP)
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contactVal.trim()) {
      if (role === 'owner') {
        setFullName('Rajesh Sharma');
        setContactVal('+91 98450 11029');
      } else {
        setFullName('Vikram Singh');
        setContactVal('+91 98450 22104');
      }
    }
    setTimer(120);
    setOtpError('');
    setStep('otp');
  };

  // Step 2 Submit -> Verify OTP -> Proceed to Step 3 (Details)
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === '123456' || otpInput === '1234' || otpInput === '') {
      setStep('details');
    } else {
      setOtpError("Invalid verification code. Tap 'Auto-Fill 123456' below to bypass.");
    }
  };

  const handleBypassOtp = () => {
    setOtpInput('123456');
    setOtpError('');
    setTimeout(() => {
      setStep('details');
    }, 250);
  };

  // Step 3 Driver license toggle
  const handleToggleLicenseCat = (cat: string) => {
    setDriverDetails(prev => {
      const exists = prev.licenseCategories.includes(cat);
      return {
        ...prev,
        licenseCategories: exists 
          ? prev.licenseCategories.filter(c => c !== cat) 
          : [...prev.licenseCategories, cat]
      };
    });
  };

  const handleAddCustomModelTag = () => {
    if (!newModelTag.trim()) return;
    if (!driverDetails.vehicleModelsExperience.includes(newModelTag.trim())) {
      setDriverDetails(prev => ({
        ...prev,
        vehicleModelsExperience: [...prev.vehicleModelsExperience, newModelTag.trim()]
      }));
    }
    setNewModelTag('');
  };

  const handleRemoveModelTag = (tag: string) => {
    setDriverDetails(prev => ({
      ...prev,
      vehicleModelsExperience: prev.vehicleModelsExperience.filter(m => m !== tag)
    }));
  };

  // Step 3 Final Submit -> Success -> onCompleteRegistration
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');

    const activePkg = role === 'owner' 
      ? OWNER_COMMISSION_PACKAGES.find(p => p.id === selectedOwnerPackage)
      : DRIVER_COMMISSION_PACKAGES.find(p => p.id === selectedDriverPackage);

    setTimeout(() => {
      const activeDetails = role === 'owner' ? ownerDetails : {
        ...driverDetails,
        qualifiedVehicles: driverDetails.vehicleModelsExperience
      };

      onCompleteRegistration({
        role,
        fullName: fullName || (role === 'owner' ? 'Rajesh Sharma' : 'Vikram Singh'),
        contact: contactVal || '+91 98450 11029',
        ownerType: role === 'owner' ? ownerType : undefined,
        selectedPackageId: role === 'owner' ? selectedOwnerPackage : selectedDriverPackage,
        commissionRate: activePkg?.commissionRatePercent ?? (role === 'owner' ? 3 : 5),
        details: activeDetails,
        ownerRequirement: role === 'owner' ? ownerRequirement : undefined
      });
    }, 1800);
  };

  // Guest explore mode bypass
  const handleGuestExplore = () => {
    onCompleteRegistration({
      role: 'owner',
      fullName: 'Rajesh Sharma',
      contact: '+91 98450 11029',
      ownerType: 'company',
      selectedPackageId: 'pkg_owner_pro',
      commissionRate: 3,
      details: ownerDetails,
      ownerRequirement: ownerRequirement
    });
  };

  const activeOwnerPackageObj = OWNER_COMMISSION_PACKAGES.find(p => p.id === selectedOwnerPackage) || OWNER_COMMISSION_PACKAGES[1];
  const activeDriverPackageObj = DRIVER_COMMISSION_PACKAGES.find(p => p.id === selectedDriverPackage) || DRIVER_COMMISSION_PACKAGES[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#F4F6F9] overflow-y-auto flex flex-col text-left font-sans antialiased" id="auth-portal-screen">
      
      {/* ========================================================================= */}
      {/* TOP COMMAND HEADER */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border-divider px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-lg shadow-sm">
            ▲
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-primary">Drivers<span className="text-status-active">Park</span></span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary font-mono-code uppercase">
                Owner & Operator Exchange
              </span>
            </div>
            <span className="text-[10px] text-text-tertiary hidden sm:block">Connecting Vehicle Owners with Verified Drivers on Package Commission</span>
          </div>
        </div>

        {/* Stepper indicator & Quick Skip */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-text-secondary bg-canvas-subtle px-3 py-1.5 rounded-full border border-border-divider">
            <span className={`w-2 h-2 rounded-full ${step === 'role' ? 'bg-primary' : 'bg-status-active'}`}></span>
            <span>
              {step === 'role' && 'Step 1: Account Role & Purpose'}
              {step === 'otp' && 'Step 2: Security Verification'}
              {step === 'details' && 'Step 3: Vehicle Specs & Package Selection'}
              {step === 'success' && 'Step 4: Commission Activation'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleGuestExplore}
            className="h-9 px-3.5 rounded-lg border border-border-divider bg-white hover:bg-canvas-subtle text-text-primary text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Explore with verified fleet owner demo profile"
          >
            <Sparkles className="w-3.5 h-3.5 text-status-warning" />
            <span>Instant Demo Mode</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT CONTAINER (Dual-Column Architecture) */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Step Progress Breadcrumb Bar */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between max-w-4xl mx-auto">
          <div className="grid grid-cols-3 w-full gap-2 sm:gap-4">
            
            {/* Step 1 Pill */}
            <div 
              onClick={() => { if (step !== 'success') setStep('role'); }}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                step === 'role' 
                  ? 'bg-primary text-white border-primary shadow-xs' 
                  : step === 'otp' || step === 'details' || step === 'success'
                  ? 'bg-white text-text-primary border-status-active/50'
                  : 'bg-white/70 text-text-tertiary border-border-divider'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step === 'role' ? 'bg-white text-primary' : 'bg-status-active text-white'
              }`}>
                {step === 'otp' || step === 'details' || step === 'success' ? '✓' : '1'}
              </div>
              <div className="truncate text-left leading-tight">
                <span className="block text-xs font-bold truncate">Account Role</span>
                <span className="hidden sm:block text-[10px] opacity-80 truncate">Owner or Driver</span>
              </div>
            </div>

            {/* Step 2 Pill */}
            <div 
              className={`p-2.5 sm:p-3 rounded-xl border transition-all flex items-center gap-2 ${
                step === 'otp' 
                  ? 'bg-primary text-white border-primary shadow-xs' 
                  : step === 'details' || step === 'success'
                  ? 'bg-white text-text-primary border-status-active/50'
                  : 'bg-white/70 text-text-tertiary border-border-divider'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step === 'otp' ? 'bg-white text-primary' : step === 'details' || step === 'success' ? 'bg-status-active text-white' : 'bg-border-divider text-text-tertiary'
              }`}>
                {step === 'details' || step === 'success' ? '✓' : '2'}
              </div>
              <div className="truncate text-left leading-tight">
                <span className="block text-xs font-bold truncate">Security OTP</span>
                <span className="hidden sm:block text-[10px] opacity-80 truncate">Identity Verification</span>
              </div>
            </div>

            {/* Step 3 Pill */}
            <div 
              className={`p-2.5 sm:p-3 rounded-xl border transition-all flex items-center gap-2 ${
                step === 'details' 
                  ? 'bg-primary text-white border-primary shadow-xs' 
                  : step === 'success'
                  ? 'bg-white text-text-primary border-status-active/50'
                  : 'bg-white/70 text-text-tertiary border-border-divider'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step === 'details' ? 'bg-white text-primary' : step === 'success' ? 'bg-status-active text-white' : 'bg-border-divider text-text-tertiary'
              }`}>
                {step === 'success' ? '✓' : '3'}
              </div>
              <div className="truncate text-left leading-tight">
                <span className="block text-xs font-bold truncate">Specs & Package</span>
                <span className="hidden sm:block text-[10px] opacity-80 truncate">Commission Tier</span>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Multi-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* ========================================================================= */}
          {/* LEFT TELEMETRY CONSOLE (4 Cols on lg): Dynamic Persona Ambient Dossier */}
          {/* ========================================================================= */}
          <aside className="lg:col-span-4 flex flex-col gap-4 order-2 lg:order-1">
            
            {/* Persona Preview Card */}
            <div className="bg-white rounded-2xl p-5 border border-border-divider shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border-divider/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-active animate-pulse"></span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Workspace Dossier</h3>
                </div>
                <span className="text-[10px] font-mono-code font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {role.toUpperCase()} {role === 'owner' ? `(${ownerType.toUpperCase()})` : ''}
                </span>
              </div>

              {/* Dynamic Content based on selected role */}
              {role === 'owner' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text-primary">
                        {ownerType === 'individual' ? 'Individual Vehicle Owner' : 'Company / Fleet Enterprise'}
                      </h4>
                      <p className="text-[11px] text-text-secondary leading-snug">
                        {ownerType === 'individual' 
                          ? 'Hire verified chauffeurs or relief drivers for your private cars, luxury sedans, or single taxi.'
                          : 'Manage multi-vehicle transport fleets, heavy machinery, or bus lines needing certified operators.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-canvas-subtle p-3 rounded-xl border border-border-subtle space-y-2 text-xs">
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>Active Commission Package:</span>
                      <span className="font-bold text-primary">{activeOwnerPackageObj.name} ({activeOwnerPackageObj.commissionRatePercent}% fee)</span>
                    </div>
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>Proximity Radar:</span>
                      <span className="font-bold text-text-primary">15-60km Radius</span>
                    </div>
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>Operator Pool:</span>
                      <span className="font-bold text-status-active">Sarathi & Aadhaar Verified</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-text-secondary space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-status-active shrink-0" />
                      <span>Post express travel & duty shifts instantly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-status-active shrink-0" />
                      <span>Filter drivers by Innova, Tata Prima, JCB, CAT models</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-status-active shrink-0" />
                      <span>Escrow protection — Payout held safely until duty ends</span>
                    </div>
                  </div>
                </div>
              )}

              {role === 'driver' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-status-active/10 text-status-active flex items-center justify-center shrink-0">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-text-primary">
                        {driverSpecialization === 'machinery' ? 'Heavy Equipment Operator (HEMM)' : driverSpecialization === 'commercial' ? 'Commercial Truck & Bus Driver (HMV)' : 'VIP Chauffeur & Driver (LMV)'}
                      </h4>
                      <p className="text-[11px] text-text-secondary leading-snug">
                        Get hired by vehicle owners with your driving license, vehicle experience, and transparent package commission.
                      </p>
                    </div>
                  </div>

                  <div className="bg-canvas-subtle p-3 rounded-xl border border-border-subtle space-y-2 text-xs">
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>Active Operator Plan:</span>
                      <span className="font-bold text-status-active">{activeDriverPackageObj.name} ({activeDriverPackageObj.commissionRatePercent}% fee)</span>
                    </div>
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>National Sarathi DL:</span>
                      <span className="font-bold text-status-active">Verified & Validated</span>
                    </div>
                    <div className="flex justify-between items-center text-text-secondary">
                      <span>Direct UPI Payout:</span>
                      <span className="font-bold text-text-primary">Instant Escrow Release</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-text-secondary space-y-1.5 pt-1">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-status-active shrink-0" />
                      <span>Add vehicle models experience (Innova, JCB, Trucks)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-status-active shrink-0" />
                      <span>Direct phone calls & duty bookings from vehicle owners</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-status-active shrink-0" />
                      <span>Upgrade to Gold Pass (0% commission) anytime to keep 100% wages</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Quick Demo Role Auto-fill Bar */}
            <div className="bg-white rounded-2xl p-4 border border-border-divider shadow-xs text-left">
              <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider block mb-2">
                ⚡ 1-Click Fast Pre-fill Profiles
              </span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('owner_company')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors text-left flex items-center justify-between cursor-pointer ${
                    role === 'owner' && ownerType === 'company' ? 'bg-primary text-white border-primary' : 'bg-canvas-subtle text-text-secondary border-border-divider hover:bg-surface-container'
                  }`}
                >
                  <span>🏢 Rajesh Sharma (Company Fleet Owner)</span>
                  <span className="text-[10px] opacity-80">3% Commission</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('owner_ind')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors text-left flex items-center justify-between cursor-pointer ${
                    role === 'owner' && ownerType === 'individual' ? 'bg-primary text-white border-primary' : 'bg-canvas-subtle text-text-secondary border-border-divider hover:bg-surface-container'
                  }`}
                >
                  <span>🚗 Anand Verma (Individual Car Owner)</span>
                  <span className="text-[10px] opacity-80">8% Pay-as-you-go</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('driver_hemm')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors text-left flex items-center justify-between cursor-pointer ${
                    role === 'driver' && driverSpecialization === 'machinery' ? 'bg-status-active text-white border-status-active' : 'bg-canvas-subtle text-text-secondary border-border-divider hover:bg-surface-container'
                  }`}
                >
                  <span>🚜 Vikram Singh (HEMM Excavator Operator)</span>
                  <span className="text-[10px] opacity-80">5% Commission</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('driver_gold')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors text-left flex items-center justify-between cursor-pointer ${
                    role === 'driver' && driverSpecialization === 'chauffeur' ? 'bg-status-active text-white border-status-active' : 'bg-canvas-subtle text-text-secondary border-border-divider hover:bg-surface-container'
                  }`}
                >
                  <span>⭐ Sunil Patil (VIP Luxury Chauffeur)</span>
                  <span className="text-[10px] opacity-80">0% Gold VIP</span>
                </button>
              </div>
            </div>

            {/* Trust & Network Guarantee Badge */}
            <div className="bg-canvas-subtle p-3.5 rounded-2xl border border-border-divider text-[11px] text-text-secondary flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-status-active shrink-0 mt-0.5" />
              <div>
                <strong className="text-text-primary block font-semibold">Government Certified Verification</strong>
                <span>All operators validated against National Sarathi DL and CCTNS Police database. Payouts secured by Escrow.</span>
              </div>
            </div>

          </aside>

          {/* ========================================================================= */}
          {/* RIGHT INTERACTIVE FORM CONSOLE (8 Cols on lg) */}
          {/* ========================================================================= */}
          <section className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-border-divider shadow-sm order-1 lg:order-2 text-left">
            
            {/* --------------------------------------------------------------------- */}
            {/* STEP 1: SELECT YOUR ACCOUNT ROLE */}
            {/* --------------------------------------------------------------------- */}
            {step === 'role' && (
              <form onSubmit={handleProceedToOtp} className="space-y-6">
                
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary font-mono-code uppercase mb-1.5">
                    Step 01 • Account Purpose & Role
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                    Select Your Account Role
                  </h2>
                  <p className="text-xs text-text-secondary mt-1 max-w-lg">
                    Drivers Park connects vehicle owners and commercial companies with verified drivers and heavy equipment operators. Choose your account type to continue.
                  </p>
                </div>

                {/* Primary 2-Role Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Card 1: Vehicle Owner (Individual or Company) */}
                  <div
                    onClick={() => setRole('owner')}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                      role === 'owner'
                        ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary'
                        : 'border-border-divider bg-white hover:border-text-secondary hover:bg-canvas-subtle/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        role === 'owner' ? 'bg-primary text-white' : 'bg-canvas-subtle text-primary'
                      }`}>
                        🏢
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        role === 'owner' ? 'border-primary bg-primary text-white' : 'border-border-divider bg-white'
                      }`}>
                        {role === 'owner' && '✓'}
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-primary block">
                        I Have A Vehicle
                      </span>
                      <h3 className="font-bold text-base text-text-primary mt-0.5">Vehicle Owner / Fleet Company</h3>
                      <p className="text-xs text-text-secondary mt-1 leading-snug">
                        I own or manage vehicle(s) (private car, luxury sedan, truck, bus, or excavator) and need verified drivers or operators to drive/operate them.
                      </p>

                      <div className="mt-3.5 pt-3 border-t border-border-divider/60 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-text-tertiary uppercase">Commission:</span>
                        <span className="text-[11px] font-bold text-primary font-mono-code">1.5% to 8% as per package</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Driver / Operator */}
                  <div
                    onClick={() => setRole('driver')}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                      role === 'driver'
                        ? 'border-status-active bg-status-active/5 shadow-xs ring-1 ring-status-active'
                        : 'border-border-divider bg-white hover:border-text-secondary hover:bg-canvas-subtle/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        role === 'driver' ? 'bg-status-active text-white' : 'bg-canvas-subtle text-status-active'
                      }`}>
                        🚗
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                        role === 'driver' ? 'border-status-active bg-status-active text-white' : 'border-border-divider bg-white'
                      }`}>
                        {role === 'driver' && '✓'}
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-status-active block">
                        I Want A Driving Job
                      </span>
                      <h3 className="font-bold text-base text-text-primary mt-0.5">Driver / Equipment Operator</h3>
                      <p className="text-xs text-text-secondary mt-1 leading-snug">
                        I have a valid driving licence or machinery certification and need daily shifts, travel contracts, or permanent driving jobs with vehicle owners.
                      </p>

                      <div className="mt-3.5 pt-3 border-t border-border-divider/60 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-text-tertiary uppercase">Operator Fee:</span>
                        <span className="text-[11px] font-bold text-status-active font-mono-code">0% to 5% as per package</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Sub-type Selection for Chosen Role */}
                {role === 'owner' && (
                  <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider space-y-2">
                    <label className="text-xs font-bold text-text-primary block">
                      Select Vehicle Owner Entity Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setOwnerType('individual')}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          ownerType === 'individual'
                            ? 'bg-white border-primary shadow-xs ring-1 ring-primary'
                            : 'bg-white/60 border-border-divider text-text-secondary hover:bg-white'
                        }`}
                      >
                        <Car className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-xs text-text-primary block">Individual Vehicle Owner</span>
                          <span className="text-[10px] text-text-secondary leading-tight block mt-0.5">
                            Personal car, luxury sedan, SUV, single taxi, or private family van.
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOwnerType('company')}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          ownerType === 'company'
                            ? 'bg-white border-primary shadow-xs ring-1 ring-primary'
                            : 'bg-white/60 border-border-divider text-text-secondary hover:bg-white'
                        }`}
                      >
                        <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-xs text-text-primary block">Company / Logistics Fleet</span>
                          <span className="text-[10px] text-text-secondary leading-tight block mt-0.5">
                            Transport firm, heavy trucks, intercity bus operator, construction & mining machinery.
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {role === 'driver' && (
                  <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider space-y-2">
                    <label className="text-xs font-bold text-text-primary block">
                      Select Primary Driver Specialization
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setDriverSpecialization('chauffeur')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          driverSpecialization === 'chauffeur'
                            ? 'bg-white border-status-active shadow-xs ring-1 ring-status-active'
                            : 'bg-white/60 border-border-divider text-text-secondary hover:bg-white'
                        }`}
                      >
                        <span className="font-bold text-xs text-text-primary block">VIP Chauffeur (LMV)</span>
                        <span className="text-[10px] text-text-secondary block mt-0.5">Sedans, SUVs, luxury cars, personal travel</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDriverSpecialization('commercial')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          driverSpecialization === 'commercial'
                            ? 'bg-white border-status-active shadow-xs ring-1 ring-status-active'
                            : 'bg-white/60 border-border-divider text-text-secondary hover:bg-white'
                        }`}
                      >
                        <span className="font-bold text-xs text-text-primary block">Heavy Transport (HMV)</span>
                        <span className="text-[10px] text-text-secondary block mt-0.5">Multi-axle trucks, trailers, Volvo buses</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDriverSpecialization('machinery')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          driverSpecialization === 'machinery'
                            ? 'bg-white border-status-active shadow-xs ring-1 ring-status-active'
                            : 'bg-white/60 border-border-divider text-text-secondary hover:bg-white'
                        }`}
                      >
                        <span className="font-bold text-xs text-text-primary block">Machinery (HEMM)</span>
                        <span className="text-[10px] text-text-secondary block mt-0.5">JCB, CAT excavators, cranes, loaders</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* User Full Name & Contact Channel Configuration */}
                <div className="pt-2 border-t border-border-divider space-y-4">
                  
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-primary flex items-center justify-between">
                      <span>Full Legal Name (as per Government ID / DL)</span>
                      <span className="text-[11px] text-text-tertiary font-normal">Aadhaar / Driving License Matched</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        required
                        placeholder={role === 'owner' ? (ownerType === 'company' ? 'e.g. Rajesh Sharma (Fleet Manager)' : 'e.g. Anand Verma') : 'e.g. Vikram Singh'}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-canvas-subtle border border-border-divider rounded-xl text-xs font-bold text-text-primary focus:outline-none focus:border-primary focus:bg-white transition-all min-h-[44px]"
                      />
                    </div>
                  </div>

                  {/* Verification Channel Toggle */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-primary">
                      Select Verification Gateway Channel
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setContactMethod('sms')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all min-h-[40px] cursor-pointer ${
                          contactMethod === 'sms'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border-divider bg-canvas-subtle text-text-secondary hover:bg-surface-container'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>SMS Gateway</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactMethod('whatsapp')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all min-h-[40px] cursor-pointer ${
                          contactMethod === 'whatsapp'
                            ? 'border-status-active bg-status-active/10 text-status-active'
                            : 'border-border-divider bg-canvas-subtle text-text-secondary hover:bg-surface-container'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>WhatsApp Direct</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setContactMethod('email')}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all min-h-[40px] cursor-pointer ${
                          contactMethod === 'email'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border-divider bg-canvas-subtle text-text-secondary hover:bg-surface-container'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email ID</span>
                      </button>
                    </div>
                  </div>

                  {/* Contact Value Destination */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-primary">
                      {contactMethod === 'sms' ? 'Mobile Phone Number (+91)' : contactMethod === 'whatsapp' ? 'WhatsApp Mobile Number (+91)' : 'Email Address'}
                    </label>
                    <div className="relative">
                      {contactMethod === 'email' ? (
                        <Mail className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
                      ) : (
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono-code font-bold text-text-tertiary">
                          🇮🇳 +91
                        </span>
                      )}
                      <input 
                        type={contactMethod === 'email' ? 'email' : 'tel'}
                        required
                        placeholder={contactMethod === 'email' ? 'rajesh@fleetlogistics.com' : '98450 11029'}
                        value={contactVal}
                        onChange={(e) => setContactVal(e.target.value)}
                        className={`w-full ${contactMethod === 'email' ? 'pl-10' : 'pl-16'} pr-4 py-2.5 bg-canvas-subtle border border-border-divider rounded-xl text-xs font-mono-code font-bold text-text-primary focus:outline-none focus:border-primary focus:bg-white transition-all min-h-[44px]`}
                      />
                    </div>
                  </div>

                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-primary text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-primary-hover transition-all shadow-md cursor-pointer mt-4"
                >
                  <span>Verify Identity & Proceed to Step 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 2: SECURITY OTP VERIFICATION */}
            {/* --------------------------------------------------------------------- */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary font-mono-code uppercase mb-1.5">
                    Step 02 • Security Handshake
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                    Verify One-Time Security Code
                  </h2>
                  <p className="text-xs text-text-secondary mt-1">
                    A 6-digit authentication token has been dispatched via <strong>{contactMethod.toUpperCase()}</strong> to <span className="font-mono-code font-bold text-text-primary">{contactVal || '+91 98450 11029'}</span>.
                  </p>
                </div>

                {/* OTP Input and Timer Box */}
                <div className="p-6 rounded-2xl bg-canvas-subtle border border-border-divider flex flex-col items-center justify-center gap-4 text-center">
                  <span className="text-xs font-bold text-text-secondary">Enter 6-Digit One Time Password</span>

                  <input 
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="• • • • • •"
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value);
                      setOtpError('');
                    }}
                    className="w-48 text-center text-2xl font-mono-code tracking-[0.3em] font-black py-2.5 bg-white border-2 border-primary rounded-xl focus:outline-none shadow-sm"
                  />

                  {otpError && (
                    <span className="text-xs font-bold text-status-urgent">{otpError}</span>
                  )}

                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <span>Token expires in:</span>
                    <span className="font-mono-code font-bold text-text-primary">
                      {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Fast bypass trigger for demo */}
                  <button
                    type="button"
                    onClick={handleBypassOtp}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>⚡ Quick Auto-Fill OTP (123456)</span>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 h-12 rounded-xl bg-primary text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-primary-hover transition-all shadow-md cursor-pointer"
                  >
                    <span>Confirm OTP & Configure Profile</span>
                    <Check className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('role')}
                    className="w-full sm:w-auto h-12 px-4 rounded-xl border border-border-divider bg-canvas-subtle hover:bg-surface-container text-text-secondary text-xs font-bold transition-all cursor-pointer"
                  >
                    Change Number / Role
                  </button>
                </div>

              </form>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 3: DETAILS & PACKAGE / COMMISSION SELECTION */}
            {/* --------------------------------------------------------------------- */}
            {step === 'details' && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary font-mono-code uppercase mb-1.5">
                    Step 03 • Operations & Commission Package
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                    {role === 'owner' ? 'Vehicle Specifications & Commission Package' : 'Driving Credentials & Earnings Package'}
                  </h2>
                  <p className="text-xs text-text-secondary mt-1">
                    Select your commission package and enter your operating parameters to start connecting.
                  </p>
                </div>

                {/* ---------------- ROLE: OWNER DETAILS & ROUTE MATRIX ---------------- */}
                {role === 'owner' && (
                  <div className="space-y-5">
                    
                    {/* Part 1: Organization / Owner Profile */}
                    <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider space-y-3">
                      <span className="text-[10px] uppercase font-mono-code font-bold text-primary block">
                        1. {ownerType === 'company' ? 'Company / Fleet Information' : 'Individual Vehicle Owner Info'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-text-primary">
                            {ownerType === 'company' ? 'Company / Fleet Name' : 'Vehicle Owner Name / Tag'}
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder={ownerType === 'company' ? 'Fleet Logistics Ltd' : 'Anand Verma Private Vehicle'}
                            value={ownerDetails.fleetName}
                            onChange={(e) => setOwnerDetails({...ownerDetails, fleetName: e.target.value})}
                            className="bg-white border border-border-divider rounded-lg p-2.5 text-xs text-text-primary font-bold focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-text-primary">Payout UPI ID (VPA)</label>
                          <input 
                            type="text"
                            required
                            placeholder="fleet@okhdfcbank"
                            value={ownerDetails.vpa}
                            onChange={(e) => setOwnerDetails({...ownerDetails, vpa: e.target.value})}
                            className="bg-white border border-border-divider rounded-lg p-2.5 text-xs text-text-primary font-mono-code font-bold focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Part 2: Travelling Route Plan */}
                    <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono-code font-bold text-primary block">
                          2. Route Requirement (Where do you need the driver?)
                        </span>
                        <span className="text-[10px] font-bold text-badge-aadhaar-text bg-badge-aadhaar-bg px-2 py-0.5 rounded">
                          GPS Radar
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-text-primary" htmlFor="owner-origin-input">Pick-up / Depot Location (Origin)</label>
                            <button
                              type="button"
                              onClick={handleGeoLocate}
                              disabled={geoLocating}
                              className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              {geoLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3 text-status-urgent" />}
                              <span>{geoLocating ? 'Detecting...' : '📍 Auto GPS'}</span>
                            </button>
                          </div>
                          <input 
                            id="owner-origin-input"
                            type="text"
                            required
                            placeholder="Indiranagar Tech Park, Bengaluru"
                            value={ownerRequirement.from}
                            onChange={(e) => setOwnerRequirement({...ownerRequirement, from: e.target.value})}
                            className="bg-white border border-border-divider rounded-lg p-2.5 text-xs text-text-primary font-bold focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-text-primary" htmlFor="owner-dest-input">Destination / Operations Area</label>
                          <input 
                            id="owner-dest-input"
                            type="text"
                            required
                            placeholder="Kempegowda Int. Airport (KIA) Terminal-2"
                            value={ownerRequirement.to}
                            onChange={(e) => setOwnerRequirement({...ownerRequirement, to: e.target.value})}
                            className="bg-white border border-border-divider rounded-lg p-2.5 text-xs text-text-primary font-bold focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Part 3: Vehicle Class & Exact Target Model */}
                    <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider space-y-3">
                      <span className="text-[10px] uppercase font-mono-code font-bold text-primary block">
                        3. Vehicle Class & Target Vehicle Model
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-text-primary" htmlFor="owner-veh-class">Vehicle Category</label>
                          <select
                            id="owner-veh-class"
                            value={ownerRequirement.vehicleType}
                            onChange={(e) => handleVehicleTypeChange(e.target.value)}
                            className="bg-white border border-border-divider rounded-lg p-2.5 text-xs font-bold text-text-primary w-full focus:outline-none focus:border-primary"
                          >
                            <option value="LMV">🚗 LMV (Sedans, SUVs, Luxury Chauffeur)</option>
                            <option value="Truck">🚚 Heavy Commercial Trucks & Multi-Axle</option>
                            <option value="Bus">🚌 Passenger Coach & Sleeper Bus</option>
                            <option value="Machinery">🚜 HEMM Earthmoving Machinery (JCB/CAT)</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-text-primary" htmlFor="owner-veh-model">Exact Target Vehicle Model</label>
                          <select
                            id="owner-veh-model"
                            value={ownerRequirement.vehicleModel}
                            onChange={(e) => setOwnerRequirement({...ownerRequirement, vehicleModel: e.target.value})}
                            className="bg-white border border-border-divider rounded-lg p-2.5 text-xs font-bold text-text-primary w-full focus:outline-none focus:border-primary"
                          >
                            {(modelsByType[ownerRequirement.vehicleType] || []).map((m, idx) => (
                              <option key={idx} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Part 4: COMMISSION PACKAGE SELECTION FOR VEHICLE OWNER */}
                    <div className="p-4 rounded-xl bg-white border-2 border-primary/40 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono-code font-bold text-primary block">
                            4. Select Your Platform Commission Package
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            Drivers Park connects you with verified drivers. Choose your commission package:
                          </span>
                        </div>
                        <Percent className="w-5 h-5 text-primary" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        {OWNER_COMMISSION_PACKAGES.map((pkg) => {
                          const isSelected = selectedOwnerPackage === pkg.id;
                          return (
                            <div
                              key={pkg.id}
                              onClick={() => setSelectedOwnerPackage(pkg.id)}
                              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                                isSelected 
                                  ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary' 
                                  : 'border-border-divider bg-canvas-subtle hover:border-primary/50'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-[9px] font-bold font-mono-code px-2 py-0.5 rounded uppercase ${
                                    isSelected ? 'bg-primary text-white' : 'bg-canvas-subtle text-text-tertiary border border-border-divider'
                                  }`}>
                                    {pkg.badge || 'TIER'}
                                  </span>
                                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                                </div>
                                <h4 className="font-bold text-xs text-text-primary">{pkg.name}</h4>
                                <div className="mt-1 flex items-baseline gap-1">
                                  <span className="text-base font-extrabold text-primary font-mono-code">
                                    {pkg.commissionRatePercent}%
                                  </span>
                                  <span className="text-[10px] text-text-secondary">match fee</span>
                                </div>
                                <span className="text-[10px] text-text-tertiary block font-semibold mt-0.5">
                                  {pkg.pricePerMonth === 0 ? '₹0 / month' : `₹${pkg.pricePerMonth.toLocaleString()} / mo`}
                                </span>
                              </div>

                              <p className="text-[10px] text-text-secondary mt-2 pt-2 border-t border-border-divider leading-snug">
                                {pkg.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* ---------------- ROLE: DRIVER DETAILS & VEHICLE EXPERIENCE ---------------- */}
                {role === 'driver' && (
                  <div className="space-y-5">
                    
                    {/* Licensed Categories */}
                    <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider space-y-2.5">
                      <label className="text-[11px] font-bold text-text-primary block">
                        Licensed Vehicle Categories (Multi-select)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {[
                          { id: 'LMV', label: '🚗 LMV (Cars, Chauffeur, SUVs)' },
                          { id: 'HMV', label: '🚚 HMV (Heavy Multi-Axle Trucks, Buses)' },
                          { id: 'HEMM', label: '🚜 HEMM (JCB, Excavators, Cranes)' }
                        ].map((cat) => {
                          const active = driverDetails.licenseCategories.includes(cat.id);
                          return (
                            <button
                              type="button"
                              key={cat.id}
                              onClick={() => handleToggleLicenseCat(cat.id)}
                              className={`p-2.5 rounded-lg border text-xs font-bold transition-all text-center cursor-pointer ${
                                active 
                                  ? 'border-status-active bg-status-active text-white shadow-2xs' 
                                  : 'border-border-divider bg-white text-text-secondary hover:bg-surface-container'
                              }`}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* License Number & Years Experience */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-text-primary" htmlFor="drv-dl-num">Driving License Number</label>
                        <input 
                          id="drv-dl-num"
                          type="text"
                          required
                          placeholder="DL-KA04-2013-09884"
                          value={driverDetails.licenseNumber}
                          onChange={(e) => setDriverDetails({...driverDetails, licenseNumber: e.target.value})}
                          className="bg-canvas-subtle border border-border-divider rounded-lg p-2.5 text-xs text-text-primary font-mono-code font-bold focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-text-primary" htmlFor="drv-exp-years">Experience (Years Active)</label>
                        <select 
                          id="drv-exp-years"
                          value={driverDetails.experienceYears}
                          onChange={(e) => setDriverDetails({...driverDetails, experienceYears: e.target.value})}
                          className="bg-canvas-subtle border border-border-divider rounded-lg p-2.5 text-xs font-bold text-text-primary focus:outline-none"
                        >
                          <option value="2">2+ Years Driving</option>
                          <option value="5">5+ Years Driving</option>
                          <option value="8">8+ Years Operating</option>
                          <option value="12">12+ Years Operating (Master)</option>
                        </select>
                      </div>
                    </div>

                    {/* Vehicle Models Experience Portfolio */}
                    <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-[11px] font-bold text-text-primary block">
                            Vehicle Models Experience Portfolio
                          </label>
                          <span className="text-[10px] text-text-secondary">
                            Vehicle owners filter and match specifically by vehicle model.
                          </span>
                        </div>
                        <span className="text-[10px] font-mono-code font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {driverDetails.vehicleModelsExperience.length} Models Added
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                        {driverDetails.vehicleModelsExperience.map((model) => (
                          <span 
                            key={model}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-border-divider rounded-full text-xs font-bold text-text-primary shadow-2xs"
                          >
                            <span>{model}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveModelTag(model)}
                              className="text-text-tertiary hover:text-status-urgent p-0.5 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="text"
                          placeholder="e.g. Tata Prima 5530, Mercedes E-Class, CAT 320D..."
                          value={newModelTag}
                          onChange={(e) => setNewModelTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomModelTag();
                            }
                          }}
                          className="flex-1 bg-white border border-border-divider rounded-lg px-3 py-2 text-xs font-semibold text-text-primary focus:outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomModelTag}
                          className="h-9 px-3 rounded-lg bg-primary text-white text-xs font-bold flex items-center gap-1 hover:bg-primary-hover cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Rate Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-text-primary" htmlFor="drv-daily-rate">Daily Shift Rate (₹ / Day)</label>
                        <input 
                          id="drv-daily-rate"
                          type="number"
                          required
                          value={driverDetails.dailyRate}
                          onChange={(e) => setDriverDetails({...driverDetails, dailyRate: e.target.value})}
                          className="bg-canvas-subtle border border-border-divider rounded-lg p-2.5 text-xs text-text-primary font-mono-code font-bold"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-text-primary" htmlFor="drv-hourly-rate">Hourly Rate Card (₹ / Hr)</label>
                        <input 
                          id="drv-hourly-rate"
                          type="number"
                          required
                          value={driverDetails.hourlyRate}
                          onChange={(e) => setDriverDetails({...driverDetails, hourlyRate: e.target.value})}
                          className="bg-canvas-subtle border border-border-divider rounded-lg p-2.5 text-xs text-text-primary font-mono-code font-bold"
                        />
                      </div>
                    </div>

                    {/* DRIVER EARNINGS / COMMISSION PACKAGE SELECTION */}
                    <div className="p-4 rounded-xl bg-white border-2 border-status-active/40 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-mono-code font-bold text-status-active block">
                            Choose Your Operator Earnings Package
                          </span>
                          <span className="text-[11px] text-text-secondary">
                            How you want your earnings settled upon job completion:
                          </span>
                        </div>
                        <CreditCard className="w-5 h-5 text-status-active" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {DRIVER_COMMISSION_PACKAGES.map((pkg) => {
                          const isSelected = selectedDriverPackage === pkg.id;
                          return (
                            <div
                              key={pkg.id}
                              onClick={() => setSelectedDriverPackage(pkg.id)}
                              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                                isSelected 
                                  ? 'border-status-active bg-status-active/5 shadow-xs ring-1 ring-status-active' 
                                  : 'border-border-divider bg-canvas-subtle hover:border-status-active/50'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-[9px] font-bold font-mono-code px-2 py-0.5 rounded uppercase ${
                                    isSelected ? 'bg-status-active text-white' : 'bg-canvas-subtle text-text-tertiary border border-border-divider'
                                  }`}>
                                    {pkg.badge || 'PLAN'}
                                  </span>
                                  {isSelected && <Check className="w-4 h-4 text-status-active" />}
                                </div>
                                <h4 className="font-bold text-xs text-text-primary">{pkg.name}</h4>
                                <div className="mt-1 flex items-baseline gap-1">
                                  <span className="text-base font-extrabold text-status-active font-mono-code">
                                    {pkg.commissionRatePercent === 0 ? '0% Commission' : `${pkg.commissionRatePercent}% Fee`}
                                  </span>
                                </div>
                                <span className="text-[10px] text-text-tertiary block font-semibold mt-0.5">
                                  {pkg.pricePerMonth === 0 ? '₹0 Upfront Registration' : `₹${pkg.pricePerMonth} / Month Pass`}
                                </span>
                              </div>

                              <p className="text-[10px] text-text-secondary mt-2 pt-2 border-t border-border-divider leading-snug">
                                {pkg.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 h-12 rounded-xl bg-primary text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-primary-hover transition-all shadow-md cursor-pointer"
                  >
                    <span>Activate Account & Launch Workspace</span>
                    <Check className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('otp')}
                    className="w-full sm:w-auto h-12 px-4 rounded-xl border border-border-divider bg-canvas-subtle hover:bg-surface-container text-text-secondary text-xs font-bold transition-all cursor-pointer"
                  >
                    ← Back to OTP
                  </button>
                </div>

              </form>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* STEP 4: SUCCESS ACTIVATION SEQUENCE */}
            {/* --------------------------------------------------------------------- */}
            {step === 'success' && (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-5 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-status-active/10 border-2 border-status-active flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-12 h-12 text-status-active" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono-code font-bold text-status-active bg-status-active/10 px-3 py-1 rounded-full uppercase">
                    Exchange Handshake 200 OK
                  </span>
                  <h2 className="text-2xl font-black text-text-primary tracking-tight">
                    Account Initialized & Verified!
                  </h2>
                  <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
                    Connecting {fullName || (role === 'owner' ? 'Rajesh Sharma' : 'Vikram Singh')} as a verified {role === 'owner' ? 'Vehicle Owner' : 'Driver / Operator'}.
                  </p>
                </div>

                {/* Telemetry Checklist */}
                <div className="w-full max-w-sm bg-canvas-subtle p-4 rounded-xl border border-border-subtle text-left font-mono-code text-[11px] space-y-2">
                  <div className="flex items-center gap-2 text-status-active">
                    <span>✓</span>
                    <span>Role Activated: {role === 'owner' ? `Vehicle Owner (${ownerType})` : 'Driver / Operator'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-status-active">
                    <span>✓</span>
                    <span>Commission Package: {role === 'owner' ? `${activeOwnerPackageObj.name} (${activeOwnerPackageObj.commissionRatePercent}%)` : `${activeDriverPackageObj.name} (${activeDriverPackageObj.commissionRatePercent}%)`}</span>
                  </div>
                  <div className="flex items-center gap-2 text-status-active">
                    <span>✓</span>
                    <span>Escrow Settlement Framework Ready</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold animate-pulse">
                    <span>▶</span>
                    <span>Opening {role === 'owner' ? 'Fleet & Discovery' : 'Duty Console'} Workspace...</span>
                  </div>
                </div>

                <div className="w-48 h-1.5 bg-border-divider rounded-full overflow-hidden">
                  <div className="h-full bg-status-active animate-[progress_1.8s_ease-in-out_infinite]"></div>
                </div>
              </div>
            )}

          </section>

        </div>

      </main>

    </div>
  );
}
