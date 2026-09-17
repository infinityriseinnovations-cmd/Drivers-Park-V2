import React, { useState, useEffect } from 'react';
import { MOCK_DRIVERS, MOCK_OWNER, MASTER_VEHICLE_CATALOG, INDUSTRY_TOP_MODELS_BY_CATEGORY } from '../data';
import { DriverProfile, AvailabilityStatus } from '../types';
import { 
  Search, MapPin, Star, ShieldCheck, Phone, CheckCircle, Sliders, RefreshCw, X, 
  Calendar, MessageSquare, Info, Filter, Check, Edit, CreditCard, Radio, ChevronRight, 
  ExternalLink, Clock, Plus, Minus, Maximize2, AlertTriangle, Cpu, Car, Truck, Anchor, 
  ArrowRight, ShieldAlert, Award, Compass, Send, Target, Sparkles, CheckCircle2,
  LocateFixed
} from 'lucide-react';

interface DiscoveryFeedProps {
  drivers?: DriverProfile[];
  onSelectDriver: (driver: DriverProfile) => void;
  selectedDriver: DriverProfile | null;
  ownerRequirement?: {
    from: string;
    to: string;
    vehicleType: string;
    vehicleModel: string;
    tripType: 'one-way' | 'two-way';
    hiringBasis: 'daily' | 'monthly' | 'enterprise';
  } | null;
  onUpdateRequirement?: (req: any) => void;
  onOpenRequirementModal?: () => void;
  onNavigateTab?: (tab: string) => void;
  forceOpenRequirementModal?: boolean;
  onCloseRequirementModal?: () => void;
}

export default function DiscoveryFeed({ 
  drivers: externalDrivers,
  onSelectDriver, 
  selectedDriver, 
  ownerRequirement, 
  onUpdateRequirement,
  onOpenRequirementModal,
  onNavigateTab,
  forceOpenRequirementModal,
  onCloseRequirementModal
}: DiscoveryFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleModelFilter, setVehicleModelFilter] = useState<string>('');
  const [exactModelOnly, setExactModelOnly] = useState(false);
  const [radius, setRadius] = useState(15);
  const [aadhaarOnly, setAadhaarOnly] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['LMV', 'HMV', 'HEMM', 'Flight']);
  const [selectedDutyMode, setSelectedDutyMode] = useState<'all' | 'acting' | 'contract' | 'emergency'>('all');
  const [sortBy, setSortBy] = useState<'exact_match' | 'nearest' | 'rating' | 'rate'>('exact_match');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Source drivers pool (from props or fallback to mock)
  const sourceDrivers = externalDrivers && externalDrivers.length > 0 ? externalDrivers : MOCK_DRIVERS;

  // Interactive Radar State
  const [radarZoom, setRadarZoom] = useState(1);
  const [radarHoverDriver, setRadarHoverDriver] = useState<string | null>(null);

  // Modal triggers
  const [callModalDriver, setCallModalDriver] = useState<DriverProfile | null>(null);
  const [licenseModalDriver, setLicenseModalDriver] = useState<DriverProfile | null>(null);
  const [bookingModalDriver, setBookingModalDriver] = useState<DriverProfile | null>(null);
  const [teleopModalDriver, setTeleopModalDriver] = useState<DriverProfile | null>(null);
  const [showRequirementModal, setShowRequirementModal] = useState(false);

  // Geolocation state for 'Travelling From'
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Local state for Express Requirement form inside modal
  const [reqFrom, setReqFrom] = useState(ownerRequirement?.from || 'Indiranagar Tech Park, Bengaluru');
  const [reqTo, setReqTo] = useState(ownerRequirement?.to || 'Kempegowda Int. Airport (KIA)');
  const [reqVehicleType, setReqVehicleType] = useState(ownerRequirement?.vehicleType || 'LMV');
  const [reqVehicleModel, setReqVehicleModel] = useState(ownerRequirement?.vehicleModel || 'Toyota Innova HyCross');
  const [reqTripType, setReqTripType] = useState<'one-way' | 'two-way'>(ownerRequirement?.tripType || 'one-way');
  const [reqHiringBasis, setReqHiringBasis] = useState<'daily' | 'monthly' | 'enterprise'>(ownerRequirement?.hiringBasis || 'daily');

  // Sync modal trigger
  useEffect(() => {
    if (forceOpenRequirementModal) {
      setShowRequirementModal(true);
    }
  }, [forceOpenRequirementModal]);

  const handleCloseRequirementModal = () => {
    setShowRequirementModal(false);
    if (onCloseRequirementModal) onCloseRequirementModal();
  };

  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus({ message: 'GPS Geolocation is not supported by your browser', type: 'error' });
      return;
    }

    setIsDetectingLocation(true);
    setLocationStatus({ message: 'Acquiring device GPS coordinates...', type: 'info' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        let resolvedAddress = '';

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
            {
              headers: { 'Accept': 'application/json' },
              signal: controller.signal
            }
          );
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || '';
            const city = data.address?.city || data.address?.town || data.address?.state_district || data.address?.county || 'Bengaluru';
            const state = data.address?.state || 'KA';
            const locality = road ? `${road}, ${city}` : `${city}, ${state}`;
            resolvedAddress = `${locality} (GPS: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`;
          }
        } catch {
          // Fallback if reverse geocoding times out or restricted
        }

        if (!resolvedAddress) {
          resolvedAddress = `GPS Pin: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (±${Math.round(accuracy)}m)`;
        }

        setReqFrom(resolvedAddress);
        setLocationStatus({ 
          message: `Current location locked via GPS (±${Math.round(accuracy)}m accuracy)`, 
          type: 'success' 
        });
        setIsDetectingLocation(false);
        setTimeout(() => setLocationStatus(null), 5000);
      },
      (error) => {
        console.warn('Geolocation acquisition warning:', error);
        setIsDetectingLocation(false);
        const fallbackLocation = "Indiranagar Tech Corridor, Bengaluru (Current GPS Hub)";
        setReqFrom(fallbackLocation);
        setLocationStatus({
          message: error.code === error.PERMISSION_DENIED 
            ? "GPS permission denied. Assigned current network hub." 
            : "GPS signal timed out. Assigned current regional hub.",
          type: 'info'
        });
        setTimeout(() => setLocationStatus(null), 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 30000
      }
    );
  };

  // Booking modal form state
  const [bookingDays, setBookingDays] = useState(1);
  const [bookingStartDate, setBookingStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingSuccessToast, setBookingSuccessToast] = useState<string | null>(null);

  // Sync state with active owner requirements if available on load
  useEffect(() => {
    if (ownerRequirement) {
      const type = ownerRequirement.vehicleType;
      const isEnterprise = ownerRequirement.hiringBasis === 'enterprise';
      if (isEnterprise) {
        setSelectedCategories(['LMV', 'HMV', 'HEMM', 'Flight']);
      } else {
        if (type === 'LMV') {
          setSelectedCategories(['LMV']);
        } else if (type === 'Truck' || type === 'Bus') {
          setSelectedCategories(['HMV']);
        } else if (type === 'Machinery') {
          setSelectedCategories(['HEMM']);
        } else if (type === 'Flight') {
          setSelectedCategories(['Flight']);
        }
      }
    }
  }, [ownerRequirement]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Check if driver matches target vehicle model
  const getDriverMatchedModel = (driver: DriverProfile): string | null => {
    const target = vehicleModelFilter.trim() || ownerRequirement?.vehicleModel?.trim() || '';
    if (!target) return null;
    const term = target.toLowerCase();
    const found = driver.qualifiedVehicles.find(v => 
      v.toLowerCase().includes(term) || term.includes(v.toLowerCase())
    );
    return found || null;
  };

  const resetFilters = () => {
    setRadius(15);
    setAadhaarOnly(true);
    setSelectedCategories(['LMV', 'HMV', 'HEMM', 'Flight']);
    setSelectedDutyMode('all');
    setSearchQuery('');
    setVehicleModelFilter('');
    setExactModelOnly(false);
    setSortBy('exact_match');
  };

  // Dynamically calculate matching results based on criteria
  const filteredDrivers = sourceDrivers.filter(driver => {
    // 1. Category filter
    const matchesCategory = driver.licenseCategory.some(cat => selectedCategories.includes(cat));
    
    // 2. Aadhaar verification check
    const matchesAadhaar = !aadhaarOnly || driver.aadhaarStatus === 'verified';

    // 3. Exact vehicle model filter if active
    const matchedModel = getDriverMatchedModel(driver);
    if (exactModelOnly && !matchedModel) {
      return false;
    }
    
    // 4. Vehicle model filter match (if specific model filter is chosen)
    if (vehicleModelFilter && !matchedModel) {
      return false;
    }
    
    // 5. Text search query check
    const matchesSearch = !searchQuery || 
                          driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          driver.qualifiedVehicles.some(v => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          driver.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          driver.licenseCategory.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 6. Radius mathematical distance (simulated PostGIS ST_Distance)
    const estimatedDistance = driver.id === 'drv_2' ? 2.4 :
                              driver.id === 'drv_3' ? 1.1 :
                              driver.id === 'drv_7' ? 4.8 :
                              driver.id === 'drv_1' ? 3.6 :
                              driver.id === 'drv_4' ? 3.8 :
                              driver.id === 'drv_5' ? 6.1 :
                              driver.id === 'drv_6' ? 5.2 : 4.2;

    const matchesRadius = estimatedDistance <= radius;

    return matchesCategory && matchesAadhaar && matchesSearch && matchesRadius;
  }).sort((a, b) => {
    const distA = a.id === 'drv_2' ? 2.4 : a.id === 'drv_3' ? 1.1 : a.id === 'drv_7' ? 4.8 : 3.6;
    const distB = b.id === 'drv_2' ? 2.4 : b.id === 'drv_3' ? 1.1 : b.id === 'drv_7' ? 4.8 : 3.6;

    if (sortBy === 'exact_match') {
      const matchA = getDriverMatchedModel(a) ? 1 : 0;
      const matchB = getDriverMatchedModel(b) ? 1 : 0;
      if (matchA !== matchB) return matchB - matchA; // Prioritize exact model matches!
      return distA - distB;
    }
    if (sortBy === 'nearest') return distA - distB;
    if (sortBy === 'rating') return b.averageRating - a.averageRating;
    if (sortBy === 'rate') return a.dailyRate - b.dailyRate;
    return 0;
  });

  const handleSaveRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateRequirement) {
      onUpdateRequirement({
        from: reqFrom,
        to: reqTo,
        vehicleType: reqVehicleType,
        vehicleModel: reqVehicleModel,
        tripType: reqTripType,
        hiringBasis: reqHiringBasis
      });
    }
    handleCloseRequirementModal();
  };

  const handleConfirmBooking = () => {
    if (!bookingModalDriver) return;
    const driverName = bookingModalDriver.fullName;
    const totalWage = bookingModalDriver.dailyRate * bookingDays;
    setBookingModalDriver(null);
    setBookingSuccessToast(`Booking Confirmed! ₹${totalWage.toLocaleString()} held in Razorpay Escrow for ${driverName}. Verification code dispatched.`);
    setTimeout(() => setBookingSuccessToast(null), 5000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 w-full max-w-full min-w-0 items-start" id="discovery-matrix">
      
      {/* SUCCESS TOAST NOTIFICATION */}
      {bookingSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-white border-2 border-status-active rounded-xl p-4 shadow-2xl flex items-start gap-3 animate-fade-in text-left">
          <CheckCircle className="w-5 h-5 text-status-active shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-xs text-text-primary">Escrow Handshake Secured</h4>
            <p className="text-xs text-text-secondary mt-0.5">{bookingSuccessToast}</p>
          </div>
          <button onClick={() => setBookingSuccessToast(null)} className="text-text-tertiary hover:text-text-primary cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MOBILE QUICK FILTER & VEHICLE MODEL DISCOVERY BAR (Phone & Tablet Friendly) */}
      <div className="lg:hidden col-span-12 w-full max-w-full min-w-0 bg-white rounded-xl shadow-xs border border-border-divider p-3 sm:p-4 flex flex-col gap-3 overflow-hidden">
        <div className="flex items-center gap-2 w-full min-w-0">
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              placeholder="Search driver, vehicle model, DL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-canvas-subtle border border-border-divider rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:border-primary min-w-0"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`h-9 px-3 sm:px-3.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors min-h-[40px] ${
              showMobileFilters || vehicleModelFilter || aadhaarOnly || selectedCategories.length < 4
                ? 'bg-primary text-white border-primary'
                : 'bg-canvas-subtle text-text-secondary border-border-divider hover:bg-surface-container'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Filters</span>
            {(vehicleModelFilter ? 1 : 0) + (selectedCategories.length < 4 ? 1 : 0) + (exactModelOnly ? 1 : 0) > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-primary text-[10px] font-extrabold flex items-center justify-center">
                {(vehicleModelFilter ? 1 : 0) + (selectedCategories.length < 4 ? 1 : 0) + (exactModelOnly ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Quick Model Finder Pills for Mobile & Tablet */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full max-w-full min-w-0">
          <span className="text-[10px] font-bold text-text-tertiary shrink-0">Model:</span>
          {['Innova HyCross', 'Fortuner 4x4', 'JCB 3DX', 'CAT 320D', 'Tata Prima', 'Mercedes E-Class'].map((m) => {
            const isSelected = vehicleModelFilter.toLowerCase().includes(m.toLowerCase());
            return (
              <button
                key={m}
                onClick={() => {
                  if (isSelected) {
                    setVehicleModelFilter('');
                  } else {
                    setVehicleModelFilter(m);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold shrink-0 transition-all cursor-pointer min-h-[32px] ${
                  isSelected 
                    ? 'bg-primary text-white shadow-xs' 
                    : 'bg-canvas-subtle text-text-secondary border border-border-subtle hover:bg-surface-container'
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEFT COLUMN (lg:col-span-3): OWNER ENTITY DOCKET & FILTER RADAR */}
      {/* ========================================================================= */}
      <aside className="lg:col-span-3 flex flex-col gap-5 text-left w-full min-w-0 max-w-full">
        
        {/* Profile Card of Rajesh Sharma (Enterprise Fleet) - Exactly matching screenshot */}
        <div className="bg-white rounded-xl shadow-xs border border-border-divider overflow-hidden" id="owner-profile-card">
          {/* Gradient Banner */}
          <div className="h-20 bg-gradient-to-r from-primary to-secondary relative">
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs font-mono-code">
                PORTAL: ENTERPRISE
              </span>
            </div>
          </div>

          <div className="pt-0 px-4 pb-4 relative">
            {/* Avatar overlapping banner with green status beacon */}
            <div className="-mt-10 mb-3 flex items-end justify-between">
              <div className="relative">
                <img 
                  alt="Rajesh Sharma Avatar" 
                  className="w-16 h-16 rounded-full border-2 border-white object-cover shadow-sm bg-surface-container" 
                  referrerPolicy="no-referrer"
                  src={MOCK_OWNER.avatarUrl}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-status-active border-2 border-white rounded-full"></span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold text-status-active flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-active"></span> KYC Level 3
                </span>
              </div>
            </div>

            {/* Owner Info */}
            <h3 className="font-bold text-base text-text-primary leading-snug">{MOCK_OWNER.fullName}</h3>
            <p className="text-xs text-text-secondary mt-0.5">{MOCK_OWNER.company}</p>
            
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-secondary">
                Fleet Size: {MOCK_OWNER.fleetSize} Vehicles
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-badge-aadhaar-bg text-badge-aadhaar-text">
                100% KYC
              </span>
            </div>

            {/* Stats row */}
            <div className="mt-4 pt-4 border-t border-border-subtle grid grid-cols-2 gap-2 text-center">
              <div className="bg-canvas-subtle p-2 rounded-lg border border-border-subtle">
                <span className="text-[10px] text-text-tertiary block font-semibold uppercase">Assigned</span>
                <span className="text-sm font-extrabold text-text-primary font-mono-code">{MOCK_OWNER.assignedDrivers} Drivers</span>
              </div>
              <div className="bg-canvas-subtle p-2 rounded-lg border border-border-subtle">
                <span className="text-[10px] text-text-tertiary block font-semibold uppercase">Razorpay Credits</span>
                <span className="text-sm font-extrabold text-primary font-mono-code">₹{MOCK_OWNER.credits.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Route Requirement Box (if active) */}
        {ownerRequirement && (
          <div className="bg-white rounded-xl p-4 shadow-xs border-2 border-primary/40 relative overflow-hidden text-left animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-border-divider mb-3">
              <span className="text-[10px] font-bold text-primary bg-surface-container px-2 py-0.5 rounded uppercase">
                Active Requirement
              </span>
              <button 
                onClick={() => setShowRequirementModal(true)}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-status-active"></span>
                <span className="text-text-secondary truncate">From: <strong>{ownerRequirement.from}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="text-text-primary truncate">To: <strong>{ownerRequirement.to}</strong></span>
              </div>
            </div>

            <div className="bg-canvas-subtle p-2 rounded-lg border border-border-subtle text-[11px] mt-2.5 space-y-1">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Fleet Model:</span>
                <span className="font-bold text-text-primary">{ownerRequirement.vehicleModel} ({ownerRequirement.vehicleType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Contract Mode:</span>
                <span className="font-bold text-status-active uppercase">{ownerRequirement.hiringBasis}</span>
              </div>
            </div>
          </div>
        )}

        {/* Spatial Discovery Filter Radar Panel */}
        <div 
          className={`${showMobileFilters ? 'block ring-2 ring-primary' : 'hidden lg:block'} bg-white rounded-xl shadow-xs border border-border-divider p-4 transition-all`} 
          id="filter-radar-card"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border-divider">
            <h4 className="font-bold text-sm text-text-primary flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-primary" /> Filter Radar
            </h4>
            <div className="flex items-center gap-2">
              <button 
                onClick={resetFilters}
                className="text-xs text-text-tertiary hover:text-primary transition-colors font-medium cursor-pointer"
              >
                Reset
              </button>
              {showMobileFilters && (
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="lg:hidden p-1 rounded-md text-text-tertiary hover:bg-canvas-subtle cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4 mt-3">
            {/* Geolocation Anchor */}
            <div>
              <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block mb-1">
                PostGIS Anchor
              </label>
              <div className="flex items-center space-x-2 bg-canvas-subtle p-2 rounded-lg border border-border-subtle">
                <MapPin className="w-3.5 h-3.5 text-status-urgent shrink-0" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-text-primary block truncate">
                    {ownerRequirement?.from || 'Bengaluru Tech Park / Indiranagar'}
                  </span>
                  <span className="text-[10px] text-text-tertiary font-mono-code block">EPSG:4326 (12.9716° N, 77.5946° E)</span>
                </div>
              </div>
            </div>

            {/* Proximity Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-text-primary" htmlFor="proximity-range">Search Radius</label>
                <span className="text-xs font-mono-code px-2 py-0.5 bg-badge-category-bg text-badge-category-text rounded font-bold">
                  {radius} km
                </span>
              </div>
              <input 
                id="proximity-range"
                type="range" 
                min="3" 
                max="60" 
                value={radius} 
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-text-tertiary font-mono-code mt-1">
                <span>3 km</span>
                <span>15 km</span>
                <span>60 km</span>
              </div>
            </div>

            {/* Aadhaar Verification Toggle */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-status-active shrink-0" />
                <div>
                  <span className="text-xs font-bold text-text-primary block">Aadhaar Verified Only</span>
                  <span className="text-[10px] text-text-tertiary block">UIDAI & eKYC Cleared</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={aadhaarOnly} 
                  onChange={() => setAadhaarOnly(!aadhaarOnly)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-border-divider peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-divider after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {/* License Class Authority Pool */}
            <div className="pt-2 border-t border-border-subtle">
              <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block mb-2">
                License Class
              </label>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes('LMV')}
                      onChange={() => toggleCategory('LMV')}
                      className="rounded border-border-divider text-primary focus:ring-primary w-4 h-4 accent-primary"
                    />
                    <span className="text-text-primary font-medium">Light Motor Vehicle (LMV)</span>
                  </div>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-badge-category-bg text-badge-category-text font-bold">342</span>
                </label>

                <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes('HMV')}
                      onChange={() => toggleCategory('HMV')}
                      className="rounded border-border-divider text-primary focus:ring-primary w-4 h-4 accent-primary"
                    />
                    <span className="text-text-primary font-medium">Heavy Motor Vehicle (HMV)</span>
                  </div>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-badge-category-bg text-badge-category-text font-bold">188</span>
                </label>

                <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes('HEMM')}
                      onChange={() => toggleCategory('HEMM')}
                      className="rounded border-border-divider text-primary focus:ring-primary w-4 h-4 accent-primary"
                    />
                    <span className="text-text-primary font-medium">Heavy Machinery (HEMM)</span>
                  </div>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-badge-category-bg text-badge-category-text font-bold">64</span>
                </label>

                <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes('Flight')}
                      onChange={() => toggleCategory('Flight')}
                      className="rounded border-border-divider text-primary focus:ring-primary w-4 h-4 accent-primary"
                    />
                    <span className="text-text-primary font-medium">Autonomous / Tele-Op AI</span>
                  </div>
                  <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-badge-ai-bg text-badge-ai-text font-bold">18</span>
                </label>
              </div>
            </div>

            {/* Duty Availability Filter */}
            <div className="pt-2 border-t border-border-subtle">
              <label className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider block mb-2">
                Duty Availability
              </label>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedDutyMode('acting')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedDutyMode === 'acting' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:bg-canvas-subtle'
                  }`}
                >
                  <span>Immediate Acting Shift</span>
                  <span className={`w-2 h-2 rounded-full ${selectedDutyMode === 'acting' ? 'bg-white' : 'bg-status-active'}`}></span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDutyMode('contract')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedDutyMode === 'contract' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:bg-canvas-subtle'
                  }`}
                >
                  <span>Full-time Contract</span>
                  <span className="text-[10px] font-mono-code">Monthly</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDutyMode('emergency')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedDutyMode === 'emergency' ? 'bg-primary text-white font-semibold' : 'text-text-secondary hover:bg-canvas-subtle'
                  }`}
                >
                  <span>Emergency Replacement</span>
                  <span className="text-[10px] font-bold text-status-urgent">24/7</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* CENTER COLUMN (lg:col-span-6): FEED & CERTIFIED DRIVER CARDS */}
      {/* ========================================================================= */}
      <main className="lg:col-span-6 flex flex-col gap-4 text-left w-full min-w-0 max-w-full">
        
        {/* Instant Requirement Creation Prompt - Matching screenshot top box */}
        <div className="bg-white rounded-xl shadow-xs border border-border-divider p-3.5 sm:p-4 w-full min-w-0 max-w-full overflow-hidden">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <img 
              alt="Owner Mini Avatar" 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-1 ring-border-divider shrink-0" 
              referrerPolicy="no-referrer"
              src={MOCK_OWNER.avatarUrl}
            />
            <button 
              onClick={() => setShowRequirementModal(true)}
              className="flex-1 min-w-0 bg-canvas-subtle hover:bg-surface-container text-left text-xs text-text-tertiary px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-border-divider hover:border-primary transition-all cursor-pointer truncate"
            >
              Post an acting requirement or contract in 15 mins...
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs text-text-secondary">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <button 
                onClick={() => {
                  setReqVehicleType('Machinery');
                  setReqVehicleModel('CAT 320D Excavator');
                  setShowRequirementModal(true);
                }}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-surface-container text-secondary font-medium text-[10px] sm:text-[11px] hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
              >
                + Heavy HEMM
              </button>
              <button 
                onClick={() => {
                  setReqVehicleType('LMV');
                  setReqVehicleModel('BMW iX / Mercedes E-Class');
                  setShowRequirementModal(true);
                }}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-surface-container text-secondary font-medium text-[10px] sm:text-[11px] hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
              >
                + Luxury EV LMV
              </button>
              <button 
                onClick={() => {
                  setReqVehicleType('Machinery');
                  setReqVehicleModel('Automated Yard Tugger');
                  setShowRequirementModal(true);
                }}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-surface-container text-secondary font-medium text-[10px] sm:text-[11px] hover:bg-surface-container-high transition-colors cursor-pointer shrink-0"
              >
                + ADS Tele-Op
              </button>
            </div>
            <button 
              onClick={() => setShowRequirementModal(true)}
              className="text-primary font-bold hover:underline flex items-center gap-0.5 text-xs cursor-pointer shrink-0 ml-auto sm:ml-0"
            >
              Express Form <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* VEHICLE SEARCH MATCH RADAR & EXACT MODEL FINDER (Owner Search Feature) */}
        <div className="bg-white rounded-xl shadow-xs border border-border-divider p-3.5 sm:p-4 space-y-3 w-full min-w-0 max-w-full overflow-hidden" id="vehicle-search-match-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-border-divider">
            <div className="flex items-start sm:items-center space-x-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5 sm:mt-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-text-primary flex items-center gap-1.5 flex-wrap">
                  <span>Vehicle Search Match Radar</span>
                  <span className="px-1.5 py-0.5 rounded bg-status-active/10 text-status-active font-mono-code text-[10px] font-bold">
                    Direct Fleet Match
                  </span>
                </h3>
                <p className="text-[11px] text-text-secondary leading-tight mt-0.5">Find operators with verified operating experience on your exact vehicle model</p>
              </div>
            </div>

            {/* Exact Match Only Toggle */}
            <label className="inline-flex items-center space-x-2 cursor-pointer self-start sm:self-auto bg-canvas-subtle px-2.5 py-1.5 rounded-lg border border-border-subtle hover:border-primary/40 transition-colors shrink-0">
              <input 
                type="checkbox"
                checked={exactModelOnly}
                onChange={(e) => setExactModelOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-primary rounded border-border-divider focus:ring-primary accent-primary cursor-pointer"
              />
              <span className="text-[11px] font-bold text-text-primary select-none flex items-center gap-1 whitespace-nowrap">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Exact Model Experience Only
              </span>
            </label>
          </div>

          {/* Model Search Input Bar */}
          <div className="relative w-full min-w-0">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              value={vehicleModelFilter}
              onChange={(e) => setVehicleModelFilter(e.target.value)}
              placeholder="Search vehicle model (Tata Ace, Innova, CAT 320D, Tata Prima)..."
              className="w-full pl-9 pr-8 py-2 bg-canvas-subtle border border-border-divider rounded-lg text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:bg-white transition-all font-medium min-w-0"
            />
            {vehicleModelFilter && (
              <button 
                onClick={() => setVehicleModelFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5 cursor-pointer"
                title="Clear vehicle filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Model Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none w-full max-w-full min-w-0">
            <span className="text-[10px] uppercase font-bold text-text-tertiary shrink-0">Popular:</span>
            <button
              onClick={() => setVehicleModelFilter('')}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer text-[11px] shrink-0 ${
                !vehicleModelFilter 
                  ? 'bg-primary text-white font-bold' 
                  : 'bg-canvas-subtle text-text-secondary hover:bg-surface-container border border-border-subtle'
              }`}
            >
              All Models
            </button>
            {[
              'Tata Ace Gold',
              'Toyota Innova HyCross',
              'CAT 320D Hydraulic Excavator',
              'Tata Prima 5530.S',
              'Komatsu PC210-10 Crawler',
              'Volvo FH16 750 Puller',
              'Mercedes-Benz E-Class',
              'JCB 3DX Super EcoXcellence'
            ].map((modelName) => {
              const isActive = vehicleModelFilter.toLowerCase() === modelName.toLowerCase();
              return (
                <button
                  key={modelName}
                  onClick={() => setVehicleModelFilter(isActive ? '' : modelName)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer text-[11px] flex items-center gap-1 shrink-0 ${
                    isActive 
                      ? 'bg-emerald-700 text-white font-bold shadow-xs' 
                      : 'bg-canvas-subtle text-text-secondary hover:bg-surface-container border border-border-subtle'
                  }`}
                >
                  {isActive && <Check className="w-3 h-3 text-white shrink-0" />}
                  {modelName}
                </button>
              );
            })}
          </div>

          {/* Active filter notification if applied */}
          {(vehicleModelFilter || ownerRequirement?.vehicleModel) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 w-full min-w-0">
              <span className="flex items-center gap-1.5 font-medium truncate">
                <Target className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                Target Fleet Model: <strong className="truncate">{vehicleModelFilter || ownerRequirement?.vehicleModel}</strong>
              </span>
              <span className="font-mono-code font-bold text-emerald-900 shrink-0">
                {filteredDrivers.filter(d => getDriverMatchedModel(d)).length} exact matching drivers
              </span>
            </div>
          )}
        </div>

        {/* Results count & Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-secondary px-1 w-full min-w-0">
          <span className="font-medium">
            Showing <strong className="text-text-primary">{filteredDrivers.length} live certified operators</strong> matching criteria
          </span>
          <div className="flex items-center space-x-2 self-start sm:self-auto min-w-0 max-w-full">
            <span className="text-text-tertiary shrink-0">Sort:</span>
            <select 
              value={sortBy} 
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-xs text-text-primary font-semibold border-none focus:outline-none cursor-pointer max-w-[240px] sm:max-w-none truncate"
            >
              <option value="exact_match">Exact Vehicle Model Experience</option>
              <option value="nearest">Nearest (PostGIS ST_Distance)</option>
              <option value="rating">Highest Rating</option>
              <option value="rate">Lowest Commercial Rate</option>
            </select>
          </div>
        </div>

        {/* DRIVERS STREAM */}
        <div className="space-y-4">
          {filteredDrivers.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-border-divider text-center flex flex-col items-center justify-center gap-2">
              <Info className="w-8 h-8 text-text-tertiary" />
              <h4 className="font-bold text-text-primary text-sm">No Matching Drivers Found</h4>
              <p className="text-xs text-text-secondary max-w-sm">
                No operator matches your selected vehicle model "{vehicleModelFilter}". Try searching with a broader keyword or toggle off "Exact Model Experience Only".
              </p>
              <button 
                onClick={resetFilters}
                className="mt-2 px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredDrivers.map((driver, idx) => {
              const isVikram = driver.id === 'drv_2';
              const isAnanya = driver.id === 'drv_3';
              const isCyberMotion = driver.id === 'drv_7';
              const isSelected = selectedDriver?.id === driver.id;
              const distanceKm = isVikram ? 2.4 : isAnanya ? 1.1 : isCyberMotion ? 4.8 : 3.6;
              const matchedModelName = getDriverMatchedModel(driver);

              return (
                <article 
                  key={`${driver.id}_${idx}`}
                  onClick={() => onSelectDriver(driver)}
                  className={`bg-white rounded-xl shadow-xs border transition-all cursor-pointer overflow-hidden text-left w-full min-w-0 max-w-full ${
                    isSelected ? 'border-primary ring-2 ring-primary/20 bg-surface-container-low/30' : 'border-border-divider hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  <div className="p-4 sm:p-5 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start space-x-3 min-w-0 flex-1">
                        <div className="relative shrink-0">
                          <img 
                            alt={driver.fullName} 
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-border-divider" 
                            referrerPolicy="no-referrer"
                            src={driver.avatarUrl}
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-status-active border-2 border-white rounded-full"></span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-sm sm:text-base text-text-primary">{driver.fullName}</h3>
                            {matchedModelName && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <Target className="w-3 h-3 mr-1 text-emerald-700 shrink-0" />
                                <span className="truncate max-w-[140px] sm:max-w-none">{matchedModelName}</span>
                              </span>
                            )}
                            {driver.aadhaarStatus === 'verified' && (
                              <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text shrink-0">
                                <ShieldCheck className="w-3 h-3 mr-1 shrink-0" /> Aadhaar Verified
                              </span>
                            )}
                            {isCyberMotion ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-badge-ai-bg text-badge-ai-text border border-badge-ai-border shrink-0">
                                Autonomous AI Agent
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono-code font-bold bg-badge-category-bg text-badge-category-text shrink-0">
                                {driver.badgeNumber}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-text-secondary mt-1 line-clamp-2 sm:line-clamp-none">
                            {isVikram && "HEMM Excavator Specialist • Mining & Infrastructure"}
                            {isAnanya && "Executive LMV Chauffeur • Luxury EV & ADAS Certified Pilot"}
                            {isCyberMotion && "Teleoperated Autonomous LMV / Heavy Tractor System"}
                            {!isVikram && !isAnanya && !isCyberMotion && `${driver.licenseCategory.join(' & ')} Certified Commercial Specialist`}
                            {" "}• <strong className="text-text-primary">{driver.experienceYears}y Exp</strong>
                          </p>

                          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-text-tertiary">
                            <span className="flex items-center text-text-secondary shrink-0">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-status-urgent shrink-0" /> {distanceKm} km away
                            </span>
                            <span className="flex items-center text-text-secondary shrink-0">
                              <Star className="w-3.5 h-3.5 mr-1 fill-amber-500 text-amber-500 shrink-0" />
                              <strong className="text-text-primary mr-1">{driver.averageRating}</strong> ({driver.totalReviews} reviews)
                            </span>
                            {isCyberMotion && (
                              <span className="flex items-center text-status-active font-mono-code font-bold shrink-0">
                                Latency: 14ms (WebSockets)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Pricing block - Responsive on Mobile & Tab */}
                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start pt-2.5 sm:pt-0 border-t sm:border-t-0 border-border-subtle shrink-0">
                        {isCyberMotion ? (
                          <div className="flex items-baseline gap-1 sm:block sm:text-right">
                            <span className="text-base sm:text-lg font-extrabold text-primary font-mono-code">₹{driver.hourlyRate}/hr</span>
                            <span className="text-[11px] text-text-tertiary block">Flat Metered API</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-baseline gap-1 sm:block sm:text-right">
                              <span className="text-base sm:text-lg font-extrabold text-text-primary font-mono-code">₹{driver.dailyRate.toLocaleString()}</span>
                              <span className="text-[11px] text-text-tertiary block sm:inline ml-1 sm:ml-0">Wage / Day Basis</span>
                            </div>
                            <span className="text-[10px] font-mono-code text-secondary block font-semibold sm:mt-0.5">₹{driver.hourlyRate}/hr shift</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Specialized Fleet Badges */}
                    <div className="mt-3 sm:mt-4 pt-3 border-t border-border-subtle flex flex-wrap items-center gap-1.5 w-full min-w-0">
                      <span className="text-[11px] font-bold text-text-tertiary mr-1 shrink-0">
                        {isCyberMotion ? "Fleet Hardware:" : isAnanya ? "Luxury & EV:" : "Fleet Experience:"}
                      </span>
                      {driver.qualifiedVehicles.map((veh, idx) => {
                        const isMatch = matchedModelName && (
                          veh.toLowerCase().includes(matchedModelName.toLowerCase()) || 
                          matchedModelName.toLowerCase().includes(veh.toLowerCase())
                        );
                        return (
                          <span 
                            key={idx} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setVehicleModelFilter(veh);
                            }}
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                              isMatch 
                                ? 'bg-emerald-600 text-white font-bold shadow-xs ring-1 ring-emerald-500 hover:bg-emerald-700' 
                                : 'bg-canvas-subtle text-text-secondary border border-border-subtle hover:border-primary/50'
                            }`}
                            title={`Click to filter by ${veh}`}
                          >
                            {isMatch && <CheckCircle2 className="w-3 h-3 mr-1 text-white shrink-0" />}
                            {veh}
                          </span>
                        );
                      })}
                    </div>

                    {/* CyberMotion Telemetry Preview Box if AI */}
                    {isCyberMotion && (
                      <div className="mt-3 p-3 bg-surface-container rounded-lg border border-border-divider text-xs w-full min-w-0">
                        <div className="flex items-center justify-between font-mono-code text-[11px] mb-1">
                          <span className="text-primary font-bold flex items-center">
                            <Radio className="w-3 h-3 mr-1 text-status-active animate-pulse shrink-0" /> Live Telemetry Stream
                          </span>
                          <span className="text-status-active font-bold">99.98% Safety Score</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[10px] text-text-secondary">
                          <div>LiDAR: <strong className="text-text-primary">100% OK</strong></div>
                          <div>5G Uplink: <strong className="text-text-primary">1.2 Gbps</strong></div>
                          <div>Fail-Safe: <strong className="text-status-active">Locked</strong></div>
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 w-full min-w-0">
                      <span className="text-[11px] text-text-tertiary font-mono-code truncate">
                        DL: {driver.licenseNumber} • {driver.policeClearance}
                      </span>

                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                        {isCyberMotion ? (
                          <>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeleopModalDriver(driver);
                              }}
                              className="col-span-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg border border-primary text-primary text-xs font-bold hover:bg-surface-container transition-colors cursor-pointer text-center min-h-[38px] sm:min-h-0"
                            >
                              Inspect Telemetry
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setTeleopModalDriver(driver);
                              }}
                              className="col-span-1 sm:flex-none px-4 py-2 sm:py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs cursor-pointer text-center min-h-[38px] sm:min-h-0"
                            >
                              Initiate Tele-op Session
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setCallModalDriver(driver);
                              }}
                              className="col-span-1 sm:flex-none px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg border border-border-divider text-text-secondary text-xs font-semibold hover:bg-canvas-subtle hover:text-text-primary transition-colors flex items-center justify-center gap-1 cursor-pointer min-h-[38px] sm:min-h-0"
                            >
                              <Phone className="w-3.5 h-3.5 shrink-0" />
                              <span>Call / WhatsApp</span>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setLicenseModalDriver(driver);
                              }}
                              className="col-span-1 sm:flex-none px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg border border-border-divider text-text-secondary text-xs font-semibold hover:bg-canvas-subtle hover:text-text-primary transition-colors flex items-center justify-center cursor-pointer min-h-[38px] sm:min-h-0"
                            >
                              <span>View License</span>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookingModalDriver(driver);
                              }}
                              className="col-span-2 sm:col-span-1 sm:flex-none px-3.5 sm:px-4 py-2 sm:py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-xs flex items-center justify-center cursor-pointer min-h-[40px] sm:min-h-0"
                            >
                              <span>Instant Book Shift</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </article>
              );
            })
          )}

          {/* Load Next Pagination Simulation */}
          <div className="text-center pt-2">
            <button 
              onClick={() => {
                setRadius(prev => prev + 10);
                alert("Extended PostGIS scan by 10km. 12 additional certified operators loaded into cache.");
              }}
              className="px-5 py-2.5 rounded-full border border-border-divider bg-white text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-canvas-subtle transition-colors shadow-xs cursor-pointer"
            >
              Load Next 12 Drivers Near Indiranagar
            </button>
          </div>
        </div>

      </main>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN (lg:col-span-3): SPATIAL RADAR & FLEET COMMERCE WIDGETS */}
      {/* ========================================================================= */}
      <aside className="lg:col-span-3 flex flex-col gap-5 text-left w-full min-w-0 max-w-full">
        
        {/* Interactive Spatial PostGIS Radar Widget - Exactly matching screenshot */}
        <div className="bg-white rounded-xl shadow-xs border border-border-divider p-4" id="postgis-radar-widget">
          <div className="flex items-center justify-between pb-2 border-b border-border-divider">
            <div>
              <h4 className="font-bold text-sm text-text-primary flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-primary" /> PostGIS Radar
              </h4>
              <p className="text-[10px] text-text-tertiary">ST_DWithin Dynamic Proximity Mesh</p>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-badge-aadhaar-bg text-status-active">
              LIVE ST_DWithin
            </span>
          </div>

          <p className="text-xs text-text-secondary mt-2">
            Visual density around Indiranagar / Koramangala tech hub corridor.
          </p>

          {/* Interactive Vector Radar Canvas */}
          <div className="mt-3 relative w-full h-56 bg-slate-900 rounded-lg overflow-hidden border border-border-divider flex items-center justify-center select-none">
            {/* Concentric Distance Circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-44 h-44 rounded-full border border-emerald-500/20"></div>
              <div className="w-32 h-32 rounded-full border border-emerald-500/30"></div>
              <div className="w-20 h-20 rounded-full border border-emerald-500/40"></div>
              {/* Crosshairs */}
              <div className="absolute w-full h-[1px] bg-emerald-500/20"></div>
              <div className="absolute h-full w-[1px] bg-emerald-500/20"></div>
            </div>

            {/* Pulsating Sweeping Radar Animation */}
            <div className="absolute inset-0 pointer-events-none opacity-30 origin-center animate-spin" style={{ animationDuration: '6s' }}>
              <div className="w-full h-1/2 bg-gradient-to-r from-transparent to-emerald-400/40 rounded-tl-full origin-bottom-right"></div>
            </div>

            {/* Radar Center (You / HQ) */}
            <div className="absolute z-10 flex flex-col items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse"></div>
              <span className="text-[9px] font-mono-code font-bold text-white bg-blue-900/80 px-1 rounded mt-0.5">HQ</span>
            </div>

            {/* Pin 1: Vikram Singh (HEMM - 2.4 km) */}
            <div 
              onClick={() => {
                const vikram = MOCK_DRIVERS.find(d => d.id === 'drv_2');
                if (vikram) onSelectDriver(vikram);
              }}
              onMouseEnter={() => setRadarHoverDriver('Vikram Singh (HEMM • 2.4km)')}
              onMouseLeave={() => setRadarHoverDriver(null)}
              className="absolute top-12 right-14 z-20 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-amber-400 border border-white group-hover:scale-150 transition-transform"></div>
                <span className="absolute -top-4 -left-6 bg-slate-800 text-amber-400 text-[9px] font-mono-code font-bold px-1 rounded whitespace-nowrap shadow">
                  Vikram S. (2.4km)
                </span>
              </div>
            </div>

            {/* Pin 2: Ananya Roy (LMV - 1.1 km) */}
            <div 
              onClick={() => {
                const ananya = MOCK_DRIVERS.find(d => d.id === 'drv_3');
                if (ananya) onSelectDriver(ananya);
              }}
              onMouseEnter={() => setRadarHoverDriver('Ananya Roy (VIP LMV • 1.1km)')}
              onMouseLeave={() => setRadarHoverDriver(null)}
              className="absolute bottom-16 left-16 z-20 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-400 border border-white group-hover:scale-150 transition-transform"></div>
                <span className="absolute -bottom-4 -left-6 bg-slate-800 text-emerald-400 text-[9px] font-mono-code font-bold px-1 rounded whitespace-nowrap shadow">
                  Ananya R. (1.1km)
                </span>
              </div>
            </div>

            {/* Pin 3: CyberMotion Node #042 (Tele-Op - 4.8 km) */}
            <div 
              onClick={() => {
                const cyber = MOCK_DRIVERS.find(d => d.id === 'drv_7');
                if (cyber) onSelectDriver(cyber);
              }}
              onMouseEnter={() => setRadarHoverDriver('CyberMotion #042 (Tele-Op • 4.8km)')}
              onMouseLeave={() => setRadarHoverDriver(null)}
              className="absolute top-10 left-12 z-20 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-purple-400 border border-white group-hover:scale-150 transition-transform animate-ping"></div>
                <div className="w-3 h-3 rounded-full bg-purple-400 border border-white absolute inset-0"></div>
                <span className="absolute -top-4 -left-6 bg-slate-800 text-purple-300 text-[9px] font-mono-code font-bold px-1 rounded whitespace-nowrap shadow">
                  AI Node #042
                </span>
              </div>
            </div>

            {/* Radar Controls: Zoom +/- */}
            <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-30">
              <button 
                onClick={() => setRadius(r => Math.max(3, r - 5))}
                className="w-6 h-6 bg-slate-800/80 hover:bg-slate-700 text-white rounded flex items-center justify-center text-xs font-bold cursor-pointer"
                title="Zoom In"
              >
                +
              </button>
              <button 
                onClick={() => setRadius(r => Math.min(60, r + 5))}
                className="w-6 h-6 bg-slate-800/80 hover:bg-slate-700 text-white rounded flex items-center justify-center text-xs font-bold cursor-pointer"
                title="Zoom Out"
              >
                -
              </button>
            </div>

            {/* Proximity Ring Label */}
            <div className="absolute bottom-2 left-2 text-[10px] font-mono-code text-emerald-400 bg-slate-900/80 px-1.5 py-0.5 rounded">
              ST_Cluster: {radius}km Ring
            </div>
          </div>

          {/* Radar Marker Legend */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px] text-text-secondary border-t border-border-subtle pt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>HEMM Heavy (64)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>LMV Acting (342)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>ADS Tele-Op (18)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Current Origin</span>
            </div>
          </div>
        </div>

        {/* Razorpay Enterprise Fleet Subscription Status Card */}
        <div className="bg-white rounded-xl shadow-xs border border-border-divider p-4" id="fleet-billing-widget">
          <div className="flex items-center justify-between pb-2 border-b border-border-divider">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <h4 className="font-bold text-sm text-text-primary">Fleet Subscription</h4>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono-code font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text">
              ACTIVE
            </span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-text-primary">Enterprise Unlimited Pass</span>
              <span className="text-xs font-mono-code text-primary font-bold">22 Days Left</span>
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              Direct driver calling & verified background telemetry check unlocked via Razorpay Billing.
            </p>

            <div className="w-full bg-surface-container rounded-full h-1.5 mt-3">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '74%' }}></div>
            </div>

            <div className="flex justify-between text-[10px] text-text-tertiary mt-1">
              <span>AutoPay: UPI Mandate Active</span>
              <span>48 Calls Made This Month</span>
            </div>

            <button 
              onClick={() => {
                if (onNavigateTab) onNavigateTab('billing');
              }}
              className="w-full mt-3 py-1.5 rounded-lg border border-border-divider text-xs font-bold text-text-primary hover:bg-canvas-subtle transition-colors cursor-pointer"
            >
              Manage Fleet Billing
            </button>
          </div>
        </div>

        {/* Urgent Shift In-Demand Hotspots Ticker */}
        <div className="bg-white rounded-xl shadow-xs border border-border-divider p-4" id="emergency-hotspots-widget">
          <div className="flex items-center justify-between pb-2 border-b border-border-divider">
            <h4 className="font-bold text-sm text-text-primary flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-status-warning" /> Urgent Hotspots
            </h4>
            <span className="text-[10px] font-mono-code text-status-urgent font-bold">LIVE DISPATCH</span>
          </div>

          <div className="space-y-2.5 mt-3 text-xs">
            <div className="p-2.5 rounded-lg bg-surface-container-low border border-border-subtle">
              <div className="flex justify-between items-start">
                <span className="font-bold text-text-primary text-[11px]">Volvo B11R Multi-Axle</span>
                <span className="font-mono-code font-bold text-primary">₹2,800/shift</span>
              </div>
              <p className="text-[10px] text-text-secondary mt-0.5">Majestic Interstate • Needed within 45 mins</p>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-low border border-border-subtle">
              <div className="flex justify-between items-start">
                <span className="font-bold text-text-primary text-[11px]">JCB 432ZX Wheel Loader</span>
                <span className="font-mono-code font-bold text-primary">₹1,800/shift</span>
              </div>
              <p className="text-[10px] text-text-secondary mt-0.5">Peenya Industrial Area • Mining Batch #4</p>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-low border border-border-subtle">
              <div className="flex justify-between items-start">
                <span className="font-bold text-text-primary text-[11px]">VIP Mercedes S-Class Chauffeur</span>
                <span className="font-mono-code font-bold text-primary">₹1,500/day</span>
              </div>
              <p className="text-[10px] text-text-secondary mt-0.5">Whitefield ITPL • 8-Hour Acting Shift</p>
            </div>
          </div>

          <button 
            onClick={() => {
              if (onNavigateTab) onNavigateTab('dispatch');
            }}
            className="w-full mt-3 py-1.5 rounded-lg bg-status-urgent/10 hover:bg-status-urgent/15 text-status-urgent text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Broadcast Emergency Request
          </button>
        </div>

        {/* Compliance Guarantee Mini-Card */}
        <div className="bg-canvas-subtle rounded-xl p-3.5 border border-border-subtle text-[11px] text-text-secondary flex flex-col gap-1.5">
          <span className="font-bold text-text-primary flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-primary" /> Safety & Legal Guarantee
          </span>
          <p className="text-[10px] leading-relaxed">
            All duty dispatches are covered under the Central Motor Vehicles Act 2019 framework with biometric Aadhaar audit and Escrow protection.
          </p>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MODAL 1: DIRECT CALL & WHATSAPP VIRTUAL MASK DIALER */}
      {/* ========================================================================= */}
      {callModalDriver && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 text-left flex flex-col gap-4 shadow-2xl border border-border-divider animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-mono-code font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text px-2 py-0.5 rounded uppercase">
                Direct Telephony Bridge Active
              </span>
              <button onClick={() => setCallModalDriver(null)} className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2 flex flex-col items-center gap-2">
              <img 
                src={callModalDriver.avatarUrl} 
                alt={callModalDriver.fullName} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-primary shadow-md"
              />
              <div>
                <h3 className="font-extrabold text-text-primary text-base">{callModalDriver.fullName}</h3>
                <p className="text-xs text-text-secondary">Licensed {callModalDriver.licenseCategory.join(' / ')} Operator</p>
                <span className="text-[11px] font-mono-code text-status-active font-bold block mt-1">
                  Masked Number: +91 80 4719 •••• (Exotel Shield)
                </span>
              </div>
            </div>

            <div className="bg-canvas-subtle p-3.5 rounded-xl border border-border-subtle space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Official Contact:</span>
                <strong className="text-text-primary font-mono-code">{callModalDriver.phoneNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Standard Rate:</span>
                <strong className="text-primary font-mono-code">₹{callModalDriver.dailyRate.toLocaleString()} / Day</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Police Clearance:</span>
                <strong className="text-status-active">{callModalDriver.policeClearance}</strong>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-1">
              <a 
                href={`tel:${callModalDriver.phoneNumber}`}
                onClick={() => {
                  alert(`Direct VoIP Call connected to ${callModalDriver.fullName} via DriversPark secure mask.`);
                  setCallModalDriver(null);
                }}
                className="h-11 bg-status-active hover:bg-status-active/90 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer text-center px-1"
              >
                <Phone className="w-4 h-4 shrink-0" /> <span className="truncate">Dial Virtual</span>
              </a>
              <a 
                href={`https://wa.me/91${callModalDriver.phoneNumber.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(callModalDriver.fullName)},%20we%20have%20an%20urgent%20driver%20requirement%20via%20DriversPark.`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setCallModalDriver(null)}
                className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer text-center px-1"
              >
                <MessageSquare className="w-4 h-4 shrink-0" /> <span className="truncate">WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: VERIFIED DRIVING LICENSE & RTO SARATHI DOCKET */}
      {/* ========================================================================= */}
      {licenseModalDriver && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 text-left flex flex-col gap-4 shadow-2xl border border-border-divider animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-border-divider">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-text-primary">National Sarathi Registry Verification</h3>
                  <p className="text-[10px] text-text-secondary">Ministry of Road Transport and Highways (MoRTH)</p>
                </div>
              </div>
              <button onClick={() => setLicenseModalDriver(null)} className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Digital Smart Card Simulation */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden border border-slate-700">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <img 
                    src={licenseModalDriver.avatarUrl} 
                    alt={licenseModalDriver.fullName} 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border-2 border-emerald-400 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono-code uppercase tracking-wider text-emerald-400 font-bold block">
                      Indian Driving Licence
                    </span>
                    <h4 className="font-bold text-sm text-white truncate">{licenseModalDriver.fullName}</h4>
                    <span className="text-xs font-mono-code text-slate-300 font-bold block mt-0.5 truncate">
                      {licenseModalDriver.licenseNumber}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono-code bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    VALID TILL 2038
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/80 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">DOB / Gender</span>
                  <span className="font-semibold">{licenseModalDriver.dob} • {licenseModalDriver.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Badge Number</span>
                  <span className="font-mono-code font-semibold text-amber-300 truncate block">{licenseModalDriver.badgeNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">Authorised Pool</span>
                  <span className="font-bold text-emerald-400 truncate block">{licenseModalDriver.licenseCategory.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Biometric Verification Checks */}
            <div className="bg-canvas-subtle p-3.5 rounded-xl border border-border-subtle space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-status-active shrink-0" /> UIDAI Biometric Fingerprint / Iris:
                </span>
                <strong className="text-status-active font-mono-code">Matched (Score: 99.4%)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-status-active shrink-0" /> CCTNS Police Criminal Background:
                </span>
                <strong className="text-status-active">{licenseModalDriver.policeClearance}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-status-active shrink-0" /> Medical & Eye Examination:
                </span>
                <strong className="text-text-primary">{licenseModalDriver.medicalFitness}</strong>
              </div>
            </div>

            <button 
              onClick={() => {
                alert(`Official cryptographic verification certificate for ${licenseModalDriver.fullName} downloaded.`);
                setLicenseModalDriver(null);
              }}
              className="w-full h-10 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer"
            >
              Download Verified Carrier Certificate (PDF)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: INSTANT BOOK SHIFT / ESCROW DEPOSIT */}
      {/* ========================================================================= */}
      {bookingModalDriver && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-6 text-left flex flex-col gap-4 shadow-2xl border border-border-divider animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-border-divider">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-text-primary">Instant Booking & Escrow Handshake</h3>
                  <p className="text-[10px] text-text-secondary">Protected by Razorpay India Mobility Escrow</p>
                </div>
              </div>
              <button onClick={() => setBookingModalDriver(null)} className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-canvas-subtle rounded-xl border border-border-subtle">
              <img 
                src={bookingModalDriver.avatarUrl} 
                alt={bookingModalDriver.fullName} 
                className="w-12 h-12 rounded-full object-cover border border-border-divider shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-text-primary truncate">{bookingModalDriver.fullName}</h4>
                <p className="text-[11px] text-text-secondary truncate">{bookingModalDriver.licenseCategory.join(', ')} Specialist • {bookingModalDriver.experienceYears}y Exp</p>
                <span className="text-[10px] font-mono-code text-primary font-bold">₹{bookingModalDriver.dailyRate.toLocaleString()} / Day</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-text-tertiary uppercase block mb-1">Start Date of Duty</label>
                <input 
                  type="date" 
                  value={bookingStartDate} 
                  onChange={(e) => setBookingStartDate(e.target.value)}
                  className="w-full h-10 px-3 bg-canvas-subtle border border-border-divider rounded-lg font-mono-code text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-text-tertiary uppercase block">Shift Duration</label>
                  <span className="font-bold font-mono-code text-primary">{bookingDays} Day{bookingDays > 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 3, 7, 30].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setBookingDays(days)}
                      className={`h-8 rounded-lg text-xs font-bold border transition-colors ${
                        bookingDays === days ? 'bg-primary text-white border-primary' : 'bg-canvas-subtle text-text-secondary border-border-subtle hover:bg-surface-container'
                      }`}
                    >
                      {days === 30 ? '1 Month' : `${days}d`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payout calculation */}
              <div className="p-3 rounded-xl bg-surface-container border border-border-divider space-y-1.5 font-mono-code text-xs">
                <div className="flex justify-between text-text-secondary">
                  <span>Wage Calculation:</span>
                  <span>₹{bookingModalDriver.dailyRate} × {bookingDays}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>DriversPark Platform Fee:</span>
                  <span className="text-status-active font-bold">₹0 (Enterprise Pass)</span>
                </div>
                <div className="flex justify-between font-bold text-text-primary pt-1.5 border-t border-border-divider text-sm">
                  <span>Total Escrow Deposit:</span>
                  <span className="text-primary font-extrabold">₹{(bookingModalDriver.dailyRate * bookingDays).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfirmBooking}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" /> Deposit Escrow & Dispatch Booking
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CYBERMOTION #042 TELE-OP REAL-TIME COCKPIT */}
      {/* ========================================================================= */}
      {teleopModalDriver && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 text-left flex flex-col gap-4 shadow-2xl border border-slate-700 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
                <div>
                  <h3 className="font-bold text-sm text-white">CyberMotion ADS Tele-Op Remote Console</h3>
                  <p className="text-[10px] text-slate-400 font-mono-code">Node ID: ARAI-ADS-2025-DP09 • Hesai LiDAR Active</p>
                </div>
              </div>
              <button onClick={() => setTeleopModalDriver(null)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Camera Simulation */}
            <div className="relative w-full h-52 sm:h-64 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/80 px-2 py-1 rounded font-mono-code text-[10px] sm:text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="truncate">CAM_FORWARD_STEREO_1080P</span>
              </div>
              <div className="absolute top-3 right-3 font-mono-code text-[10px] sm:text-[11px] text-amber-400 bg-slate-900/80 px-2 py-1 rounded">
                PING: 14ms (5G)
              </div>

              {/* Simulated HUD Lines */}
              <div className="w-40 sm:w-48 h-28 sm:h-32 border-2 border-emerald-500/40 rounded-lg flex items-center justify-center pointer-events-none">
                <div className="text-center font-mono-code text-[10px] text-emerald-400/80">
                  <span>ST_PATH: STABLE</span>
                  <div className="text-xs font-bold text-white mt-1">SPEED: 18 km/h</div>
                </div>
              </div>

              <div className="absolute bottom-3 left-3 text-[10px] font-mono-code text-slate-400 truncate max-w-[200px] sm:max-w-none">
                TARGET VEHICLE: Tata Prima EV Tugger #04
              </div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono-code text-emerald-400">
                BATTERY: 92%
              </div>
            </div>

            {/* Telemetry Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono-code text-xs">
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                <span className="text-[9px] text-slate-400 uppercase block">LiDAR Point Cloud</span>
                <span className="font-bold text-emerald-400">128-Beam Sync</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                <span className="text-[9px] text-slate-400 uppercase block">Steering Angle</span>
                <span className="font-bold text-white">+2.4° Centered</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                <span className="text-[9px] text-slate-400 uppercase block">Brake Pressure</span>
                <span className="font-bold text-white">0.0 PSI (Cruise)</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                <span className="text-[9px] text-slate-400 uppercase block">Billing Rate</span>
                <span className="font-bold text-emerald-400">₹350 / hr</span>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <button 
                onClick={() => {
                  alert("E-STOP Triggered! Hydraulic failsafe brakes deployed to CyberMotion Node.");
                }}
                className="flex-1 h-11 rounded-xl bg-status-urgent hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" /> Emergency E-Stop
              </button>
              <button 
                onClick={() => {
                  alert("Tele-operation session handed off to your local steering rig.");
                  setTeleopModalDriver(null);
                }}
                className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                Engage Remote Driving
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: EXPRESS REQUIREMENT CREATION FORM */}
      {/* ========================================================================= */}
      {showRequirementModal && (() => {
        const currentCategoryTopModels = INDUSTRY_TOP_MODELS_BY_CATEGORY[reqVehicleType] || INDUSTRY_TOP_MODELS_BY_CATEGORY['LMV'] || [];
        const activeModelMeta = currentCategoryTopModels.find(
          m => m.name.toLowerCase().trim() === reqVehicleModel.toLowerCase().trim()
        );

        return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
            <form onSubmit={handleSaveRequirement} className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 text-left flex flex-col gap-4 shadow-2xl border border-border-divider animate-fade-in max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-start pb-3 border-b border-border-divider">
                <div>
                  <h3 className="font-bold text-base text-text-primary">Post Fleet Requirement</h3>
                  <p className="text-xs text-text-secondary">Instant PostGIS GPS matching with certified drivers</p>
                </div>
                <button type="button" onClick={handleCloseRequirementModal} className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer rounded-lg hover:bg-canvas-subtle transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Route From / To with Geolocation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-text-tertiary uppercase">Travelling From</label>
                      <button 
                        type="button"
                        onClick={handleDetectCurrentLocation}
                        disabled={isDetectingLocation}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-full"
                        title="Detect and use current device GPS location"
                      >
                        {isDetectingLocation ? (
                          <>
                            <RefreshCw className="w-2.5 h-2.5 animate-spin text-primary shrink-0" />
                            <span>Locating...</span>
                          </>
                        ) : (
                          <>
                            <LocateFixed className="w-2.5 h-2.5 text-primary shrink-0" />
                            <span>GPS Location</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={reqFrom} 
                        onChange={(e) => setReqFrom(e.target.value)}
                        placeholder="Origin city / terminal / hub"
                        required
                        className="w-full h-10 pl-3 pr-9 bg-canvas-subtle border border-border-divider rounded-lg text-xs font-semibold focus:outline-none focus:border-primary text-text-primary"
                      />
                      <button
                        type="button"
                        onClick={handleDetectCurrentLocation}
                        disabled={isDetectingLocation}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-primary transition-colors cursor-pointer rounded"
                        title="Auto-detect current location via GPS"
                      >
                        {isDetectingLocation ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                        ) : (
                          <LocateFixed className="w-4 h-4 text-primary hover:scale-110 transition-transform" />
                        )}
                      </button>
                    </div>

                    {locationStatus && (
                      <div className={`flex items-center gap-1.5 text-[10px] mt-1 font-medium animate-fade-in ${
                        locationStatus.type === 'success' ? 'text-status-active' :
                        locationStatus.type === 'error' ? 'text-status-urgent' : 'text-primary'
                      }`}>
                        {locationStatus.type === 'success' ? (
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                        ) : locationStatus.type === 'error' ? (
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                        ) : (
                          <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
                        )}
                        <span className="truncate">{locationStatus.message}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-text-tertiary uppercase">Destination To</label>
                      <span className="text-[10px] text-text-tertiary">Drop-off Point</span>
                    </div>
                    <input 
                      type="text" 
                      value={reqTo} 
                      onChange={(e) => setReqTo(e.target.value)}
                      placeholder="Destination point / airport / yard"
                      required
                      className="w-full h-10 px-3 bg-canvas-subtle border border-border-divider rounded-lg text-xs font-semibold focus:outline-none focus:border-primary text-text-primary"
                    />
                  </div>
                </div>

                {/* Vehicle Classification & Top Specific Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-tertiary uppercase block mb-1">Vehicle Category</label>
                    <select 
                      value={reqVehicleType} 
                      onChange={(e) => {
                        const newType = e.target.value;
                        setReqVehicleType(newType);
                        const topList = INDUSTRY_TOP_MODELS_BY_CATEGORY[newType];
                        if (topList && topList.length > 0) {
                          setReqVehicleModel(topList[0].name);
                        }
                      }}
                      className="w-full h-10 px-3 bg-canvas-subtle border border-border-divider rounded-lg text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer text-text-primary"
                    >
                      <option value="LMV">LMV (Cars, Sedans, SUVs, Luxury & EV)</option>
                      <option value="Truck">Truck / Commercial Hauler (HMV)</option>
                      <option value="Bus">Passenger Bus / Coach (HMV)</option>
                      <option value="Machinery">Heavy Earthmoving / Excavator (HEMM)</option>
                      <option value="Flight">Air / Helicopter Pilot & Drone Fleet</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-text-tertiary uppercase">Specific Model</label>
                      <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" /> Industry Benchmark
                      </span>
                    </div>
                    <input 
                      type="text" 
                      value={reqVehicleModel} 
                      onChange={(e) => setReqVehicleModel(e.target.value)}
                      placeholder="e.g. Toyota Innova HyCross, CAT 320D"
                      required
                      list="category-top-models-datalist"
                      className="w-full h-10 px-3 bg-canvas-subtle border border-border-divider rounded-lg text-xs font-semibold focus:outline-none focus:border-primary text-text-primary"
                    />
                    <datalist id="category-top-models-datalist">
                      {currentCategoryTopModels.map((item) => (
                        <option key={item.name} value={item.name}>
                          {item.brand} — {item.description}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Top Industry Models Selection Matrix */}
                <div className="bg-canvas-subtle p-3 rounded-xl border border-border-subtle space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="text-[11px] font-bold text-text-primary">
                        Top Industry Models for {reqVehicleType}:
                      </span>
                    </div>
                    <span className="text-[10px] text-text-tertiary">
                      Tap model to select
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                    {currentCategoryTopModels.map((modelItem) => {
                      const isSelected = reqVehicleModel.toLowerCase().trim() === modelItem.name.toLowerCase().trim();
                      return (
                        <button
                          key={modelItem.name}
                          type="button"
                          onClick={() => setReqVehicleModel(modelItem.name)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected 
                              ? 'bg-primary text-white font-bold shadow-xs ring-1 ring-primary' 
                              : 'bg-white hover:bg-surface-container text-text-secondary hover:text-text-primary border border-border-divider'
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                          ) : modelItem.isIndustryLeader ? (
                            <Sparkles className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                          ) : null}
                          <span className="truncate">{modelItem.name}</span>
                          {modelItem.isIndustryLeader && (
                            <span className={`text-[8px] px-1 py-0.2 rounded font-mono-code font-bold uppercase tracking-tight ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                            }`}>
                              Top
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Model Description Pill */}
                  {activeModelMeta && (
                    <div className="flex items-center gap-1.5 text-[10px] text-text-secondary pt-1 border-t border-border-subtle">
                      <span className="font-bold text-primary shrink-0">{activeModelMeta.brand}:</span>
                      <span className="truncate">{activeModelMeta.description}</span>
                    </div>
                  )}
                </div>

                {/* Trip Type & Contract Basis */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-text-tertiary uppercase block mb-1">Trip Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setReqTripType('one-way')}
                        className={`h-9 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          reqTripType === 'one-way' ? 'bg-primary text-white border-primary' : 'bg-canvas-subtle text-text-secondary border-border-subtle'
                        }`}
                      >
                        One-Way
                      </button>
                      <button
                        type="button"
                        onClick={() => setReqTripType('two-way')}
                        className={`h-9 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          reqTripType === 'two-way' ? 'bg-primary text-white border-primary' : 'bg-canvas-subtle text-text-secondary border-border-subtle'
                        }`}
                      >
                        Two-Way (Round)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-text-tertiary uppercase block mb-1">Hiring Basis</label>
                    <select 
                      value={reqHiringBasis} 
                      onChange={(e: any) => setReqHiringBasis(e.target.value)}
                      className="w-full h-9 px-3 bg-canvas-subtle border border-border-divider rounded-lg text-xs font-semibold focus:outline-none focus:border-primary cursor-pointer text-text-primary"
                    >
                      <option value="daily">Per Day Wage Basis</option>
                      <option value="monthly">Monthly Salary Basis</option>
                      <option value="enterprise">Enterprise Logistics (All Fleet)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <CheckCircle className="w-4 h-4" /> Save & Broadcast to Nearby Drivers
              </button>
            </form>
          </div>
        );
      })()}

    </div>
  );
}
