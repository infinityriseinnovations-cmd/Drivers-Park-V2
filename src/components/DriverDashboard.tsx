import React, { useState } from 'react';
import { 
  ShieldCheck, MapPin, DollarSign, Clock, CheckCircle, RefreshCw, Smartphone, 
  Key, Navigation, User, FileText, AlertCircle, Phone, ArrowUpRight, 
  Edit3, Wrench, Sparkles, Tag, Car, Truck, Plus, ChevronDown, CheckCircle2, Search
} from 'lucide-react';
import { DriverProfile } from '../types';
import DriverProfileEditor from './DriverProfileEditor';

interface DriverDashboardProps {
  driver: DriverProfile;
  allDrivers?: DriverProfile[];
  onSelectDriver?: (driverId: string) => void;
  onUpdateStatus: (newStatus: 'online' | 'acting' | 'offline') => void;
  onSaveRateCard: (hourly: number, daily: number) => void;
  onUpdateProfile?: (updatedDriver: DriverProfile) => void;
}

export default function DriverDashboard({ 
  driver, 
  allDrivers, 
  onSelectDriver, 
  onUpdateStatus, 
  onSaveRateCard,
  onUpdateProfile
}: DriverDashboardProps) {
  const [hourlyInput, setHourlyInput] = useState(driver.hourlyRate.toString());
  const [dailyInput, setDailyInput] = useState(driver.dailyRate.toString());
  const [isUpdatingRate, setIsUpdatingRate] = useState(false);
  const [isRequestingPayout, setIsRequestingPayout] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [payoutLogs, setPayoutLogs] = useState<string[]>([
    "Today: ₹1,200 AutoPay Scheduled for 21:00 IST",
    "Yesterday: ₹1,500 Dispatched to UPI VPA (pay_drv_vikram@ybl)",
    "04 Sep: ₹2,400 Dispatched via Razorpay instant payout"
  ]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const [activeSubTab, setActiveSubTab] = useState<'console' | 'edit_profile' | 'radar' | 'compliance' | 'earnings' | 'contracts'>('console');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  // Active Trip simulation
  const [activeTrip, setActiveTrip] = useState<{
    id: string;
    ownerName: string;
    vehicle: string;
    origin: string;
    destination: string;
    payout: number;
    status: 'idle' | 'started' | 'completed';
    progress: number;
  }>({
    id: "TRIP-802",
    ownerName: "Rajesh Sharma",
    vehicle: "Mercedes E-Class (KA-01-AA-4820)",
    origin: "Indiranagar Core-2 Depot",
    destination: "Kempegowda Int'l Airport T2",
    payout: 950,
    status: 'idle',
    progress: 0
  });

  const [simulatingTrip, setSimulatingTrip] = useState(false);

  const startTripSimulation = () => {
    setActiveTrip(prev => ({ ...prev, status: 'started' }));
    onUpdateStatus('acting');
    setSimulatingTrip(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setSimulatingTrip(false);
        onUpdateStatus('online');
        setActiveTrip(prev => ({ ...prev, status: 'completed', progress: 100 }));
      } else {
        setActiveTrip(prev => ({ ...prev, progress: currentProgress }));
      }
    }, 1000);
  };

  const handleUpdateRates = () => {
    setIsUpdatingRate(true);
    setTimeout(() => {
      onSaveRateCard(Number(hourlyInput), Number(dailyInput));
      setIsUpdatingRate(false);
      showNotification("Rate card updated and synchronized to PostgreSQL & PostGIS successfully!");
    }, 1000);
  };

  const handleRequestPayout = () => {
    setIsRequestingPayout(true);
    setTimeout(() => {
      setIsRequestingPayout(false);
      const newAmt = Math.floor(Math.random() * 500 + 800);
      setPayoutLogs(prev => [`Just Now: ₹${newAmt} Dispatched via Razorpay Instant Payout`, ...prev]);
      showNotification(`₹${newAmt} instant payout completed successfully! Dispatched to UPI VPA.`);
    }, 1500);
  };

  const handleProfileSaved = (updated: DriverProfile) => {
    onUpdateProfile?.(updated);
    setHourlyInput(updated.hourlyRate.toString());
    setDailyInput(updated.dailyRate.toString());
    setActiveSubTab('console');
    showNotification("Operator profile & vehicle models experience updated successfully!");
  };

  // Mock live market demand requests from vehicle owners
  const liveOwnerRequests = [
    {
      id: "req_101",
      owner: "Rajesh Sharma • Fleet Logistics Ltd",
      vehicleTarget: "Toyota Innova HyCross",
      category: "LMV",
      location: "Indiranagar Core-2 Terminal (2.4 km away)",
      hiringBasis: "Daily Commercial Shift • ₹1,200/day",
      urgency: "Immediate Dispatch"
    },
    {
      id: "req_102",
      owner: "Peenya Heavy Mineral Quarries",
      vehicleTarget: "CAT 320D Excavator",
      category: "HEMM",
      location: "Peenya Industrial Segment (4.1 km away)",
      hiringBasis: "15-Day Project Contract • ₹1,800/day",
      urgency: "Starts Tomorrow 06:00 AM"
    },
    {
      id: "req_103",
      owner: "South Cargo Lines • Ashok Nagar",
      vehicleTarget: "Tata Prima 5530.S",
      category: "HMV",
      location: "Yeshwantpur Container Depot (5.8 km away)",
      hiringBasis: "Interstate Transit • ₹1,600/day",
      urgency: "Weekend Run"
    },
    {
      id: "req_104",
      owner: "KIA VIP Apron Ground Service",
      vehicleTarget: "Airbus A320 Pushback Tug (TLD TMX-150)",
      category: "Flight",
      location: "Kempegowda Int'l Airport (12 km away)",
      hiringBasis: "Airport Staff Contract • ₹2,500/day",
      urgency: "Verified Tarmac Pass Required"
    }
  ];

  return (
    <div className="flex flex-col gap-6" id="driver-dashboard">
      
      {/* IN-APP TOAST NOTIFICATION (No native alerts in iframe) */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm bg-white border-2 border-primary rounded-xl p-3.5 shadow-2xl flex items-start gap-3 animate-fade-in text-left">
          <CheckCircle className="w-5 h-5 text-status-active shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-xs font-bold text-text-primary block">Fleet System Update</span>
            <p className="text-xs text-text-secondary mt-0.5">{toastMessage}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-text-tertiary hover:text-text-primary cursor-pointer p-0.5"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Driver Header Summary */}
      <section className="bg-canvas-base rounded-xl p-6 shadow-sm border border-border-divider relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img src={driver.avatarUrl} alt={driver.fullName} className="w-16 h-16 rounded-full object-cover border-2 border-primary shadow" />
              <span className={`absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full border-2 border-canvas-base ${
                driver.currentStatus === 'online' ? 'bg-status-active' :
                driver.currentStatus === 'acting' ? 'bg-status-warning' : 'bg-text-tertiary'
              }`}></span>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-text-primary">{driver.fullName}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-badge-aadhaar-bg text-badge-aadhaar-text font-bold text-[10px] rounded-full border border-badge-aadhaar-border uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-badge-category-bg text-badge-category-text">
                  {driver.badgeNumber || 'OPERATOR-PASS'}
                </span>
              </div>
              <p className="text-xs text-text-secondary font-medium mt-1">
                {driver.licenseCategory.join(' / ')} Certified • {driver.experienceYears} Years Exp • DL: <span className="font-mono-code font-bold">{driver.licenseNumber}</span>
              </p>

              {/* Experienced Vehicle Models Chips */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                <span className="text-[10px] font-bold text-text-tertiary flex items-center gap-1">
                  <Car className="w-3 h-3 text-primary" /> Experienced Models ({driver.qualifiedVehicles.length}):
                </span>
                {driver.qualifiedVehicles.slice(0, 4).map((veh, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                    ✓ {veh}
                  </span>
                ))}
                {driver.qualifiedVehicles.length > 4 && (
                  <span className="text-[10px] font-bold text-text-tertiary">
                    +{driver.qualifiedVehicles.length - 4} more
                  </span>
                )}
                <button
                  onClick={() => setActiveSubTab('edit_profile')}
                  className="text-[10px] font-bold text-primary hover:underline ml-1 cursor-pointer flex items-center gap-0.5"
                >
                  <Plus className="w-2.5 h-2.5" /> Add / Edit Models
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto justify-end">
            
            {/* Operator Persona Switcher if multiple drivers exist */}
            {allDrivers && allDrivers.length > 1 && onSelectDriver && (
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-text-tertiary uppercase font-bold">Inspect Profile</span>
                <select
                  value={driver.id}
                  onChange={(e) => onSelectDriver(e.target.value)}
                  className="mt-1 bg-canvas-subtle border border-border-divider rounded-lg px-2 py-1 text-xs font-semibold text-text-primary focus:outline-none"
                >
                  {allDrivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.licenseCategory.join('/')})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Edit Profile Button */}
            <button
              onClick={() => setActiveSubTab(activeSubTab === 'edit_profile' ? 'console' : 'edit_profile')}
              className={`h-9 px-3.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                activeSubTab === 'edit_profile'
                  ? 'bg-status-active text-white'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{activeSubTab === 'edit_profile' ? 'Return to Console' : 'Edit Profile & Models'}</span>
            </button>

            {/* Availability State Select */}
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-text-tertiary uppercase font-bold">Availability State</span>
              <div className="flex items-center gap-2 mt-1">
                <select 
                  value={driver.currentStatus}
                  onChange={(e) => onUpdateStatus(e.target.value as any)}
                  className="bg-canvas-subtle border border-border-divider rounded-lg px-2.5 py-1.5 text-xs font-bold text-text-primary focus:outline-none"
                >
                  <option value="online">🟢 Online & Ready</option>
                  <option value="acting">🟡 On Assigned Trip</option>
                  <option value="offline">⚪ Off-duty / Idle</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs menu */}
        <div className="flex border-t border-border-divider mt-6 pt-1 gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveSubTab('console')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
              activeSubTab === 'console' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Duty Console & Navigation
          </button>

          <button 
            onClick={() => setActiveSubTab('edit_profile')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'edit_profile' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile & Fleet Experience ({driver.qualifiedVehicles.length})</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('radar')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'radar' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-status-warning" />
            <span>Vehicle Search Match Radar</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('compliance')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
              activeSubTab === 'compliance' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Aadhaar & Sarathi Credentials
          </button>

          <button 
            onClick={() => setActiveSubTab('earnings')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
              activeSubTab === 'earnings' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Earnings & Instant Payout
          </button>

          <button 
            onClick={() => setActiveSubTab('contracts')}
            className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 shrink-0 ${
              activeSubTab === 'contracts' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Hiring Handshake Contracts
          </button>
        </div>
      </section>

      {/* Dynamic Content Views */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* EDIT PROFILE TAB: Full Width Panel */}
        {activeSubTab === 'edit_profile' && (
          <div className="xl:col-span-12">
            <DriverProfileEditor 
              driver={driver} 
              onSave={handleProfileSaved} 
              onCancel={() => setActiveSubTab('console')} 
            />
          </div>
        )}

        {/* SEARCH MATCH RADAR TAB */}
        {activeSubTab === 'radar' && (
          <div className="xl:col-span-12 flex flex-col gap-6 text-left">
            <div className="bg-canvas-base rounded-2xl border border-border-divider p-6 shadow-sm flex flex-col gap-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-divider">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-status-warning" />
                    <h2 className="text-lg font-bold text-text-primary">
                      Live Vehicle Model Search Match Radar
                    </h2>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    See which vehicle owners are currently searching for drivers with your exact vehicle experience in the 15km PostGIS radius.
                  </p>
                </div>

                <button
                  onClick={() => setActiveSubTab('edit_profile')}
                  className="h-9 px-4 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add More Vehicle Models</span>
                </button>
              </div>

              {/* Status summary banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider flex flex-col">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Your Qualified Models</span>
                  <span className="text-2xl font-extrabold text-primary mt-1 font-mono-code">{driver.qualifiedVehicles.length} Models</span>
                  <span className="text-[10px] text-text-secondary mt-0.5">Search index synchronized with PostGIS</span>
                </div>

                <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider flex flex-col">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Live Owner Search Demands</span>
                  <span className="text-2xl font-extrabold text-status-active mt-1 font-mono-code">{liveOwnerRequests.length} Active Searches</span>
                  <span className="text-[10px] text-text-secondary mt-0.5">Within 15 km Bengaluru radius</span>
                </div>

                <div className="p-4 rounded-xl bg-canvas-subtle border border-border-divider flex flex-col">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Your Match Compatibility</span>
                  <span className="text-2xl font-extrabold text-status-warning mt-1 font-mono-code">
                    {Math.round(
                      (liveOwnerRequests.filter(req => 
                        driver.qualifiedVehicles.some(v => v.toLowerCase().includes(req.vehicleTarget.toLowerCase()) || req.vehicleTarget.toLowerCase().includes(v.toLowerCase()))
                      ).length / liveOwnerRequests.length) * 100
                    )}% High
                  </span>
                  <span className="text-[10px] text-text-secondary mt-0.5">Top-tier search priority rank</span>
                </div>
              </div>

              {/* Live Owner Requests Stream */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <Search className="w-4 h-4 text-primary" /> Active Owner Requisitions in PostGIS Zone
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveOwnerRequests.map(req => {
                    const isExactMatch = driver.qualifiedVehicles.some(v => 
                      v.toLowerCase().includes(req.vehicleTarget.toLowerCase()) || 
                      req.vehicleTarget.toLowerCase().includes(v.toLowerCase())
                    );
                    const isApplied = appliedJobs.includes(req.id);

                    return (
                      <div 
                        key={req.id} 
                        className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                          isExactMatch 
                            ? 'bg-status-active/5 border-status-active/40 shadow-xs' 
                            : 'bg-canvas-subtle border-border-divider'
                        }`}
                      >
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-bold text-xs text-text-primary">{req.owner}</span>
                            {isExactMatch ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-status-active text-white">
                                <CheckCircle2 className="w-3 h-3" /> Exact Model Match
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-canvas-base border border-border-divider text-text-secondary">
                                Model not in profile
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-extrabold text-primary font-mono-code bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                              Searching for: {req.vehicleTarget}
                            </span>
                            <span className="text-[10px] font-bold text-text-tertiary">
                              [{req.category}]
                            </span>
                          </div>

                          <p className="text-[11px] text-text-secondary mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-status-urgent" /> {req.location}
                          </p>
                          <p className="text-[11px] text-text-primary font-semibold">
                            💰 {req.hiringBasis} • <span className="text-status-warning font-bold">{req.urgency}</span>
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border-divider/50 flex items-center justify-between gap-2">
                          {isExactMatch ? (
                            <span className="text-[10px] text-status-active font-bold">
                              ✓ Your profile will be highlighted to this owner
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                onUpdateProfile?.({
                                  ...driver,
                                  qualifiedVehicles: [...driver.qualifiedVehicles, req.vehicleTarget]
                                });
                                alert(`Added "${req.vehicleTarget}" to your experienced vehicle models! Your profile now exact-matches this job.`);
                              }}
                              className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-0.5"
                            >
                              + Add {req.vehicleTarget} to your profile
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (!isApplied) {
                                setAppliedJobs(prev => [...prev, req.id]);
                                alert(`Direct application handshake sent to ${req.owner}! Your verified telemetry credentials were dispatched.`);
                              }
                            }}
                            disabled={isApplied}
                            className={`h-8 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isApplied 
                                ? 'bg-canvas-subtle border border-border-divider text-text-tertiary cursor-not-allowed' 
                                : isExactMatch
                                  ? 'bg-status-active hover:bg-emerald-700 text-white shadow-2xs'
                                  : 'bg-primary hover:bg-primary/90 text-white'
                            }`}
                          >
                            {isApplied ? "✓ Application Sent" : "Instant Handshake"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Main Console Tab Panel */}
        {activeSubTab !== 'edit_profile' && activeSubTab !== 'radar' && (
          <div className="xl:col-span-8 flex flex-col gap-6">
            {activeSubTab === 'console' && (
            <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-border-divider">
                <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <Navigation className="w-4.5 h-4.5 text-primary" /> Active Job Duty Console
                </h3>
                <span className="text-[10px] font-mono-code bg-badge-category-bg px-2 py-0.5 rounded text-badge-category-text font-bold">ST_DWithin</span>
              </div>

              {activeTrip.status === 'idle' && (
                <div className="p-5 rounded-xl border border-dashed border-border-divider bg-canvas-subtle text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Navigation className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">Next Assigned Duty Awaiting Launch</h4>
                    <p className="text-xs text-text-secondary max-w-md mt-1">
                      You are matched to <strong>{activeTrip.ownerName}</strong>'s request. Launch the duty below to begin turn-by-turn tracking coordinates.
                    </p>
                  </div>

                  <div className="w-full max-w-md mt-2 bg-canvas-base p-4 rounded-xl border border-border-divider text-left text-xs flex flex-col gap-2 shadow-xs">
                    <div className="flex justify-between font-bold text-text-primary">
                      <span>Vehicle Asset:</span>
                      <span>{activeTrip.vehicle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Origin Route:</span>
                      <span className="font-semibold text-text-primary truncate max-w-xs">{activeTrip.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target Point:</span>
                      <span className="font-semibold text-text-primary truncate max-w-xs">{activeTrip.destination}</span>
                    </div>
                    <div className="flex justify-between font-bold text-badge-aadhaar-text pt-2 border-t border-border-divider/50">
                      <span>Est. Payout Earnings:</span>
                      <span>₹{activeTrip.payout.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={startTripSimulation}
                    className="h-10 px-6 rounded-full bg-status-active hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 mt-3"
                  >
                    <CheckCircle className="w-4 h-4" /> Start Shift Navigation Duty
                  </button>
                </div>
              )}

              {activeTrip.status === 'started' && (
                <div className="flex flex-col gap-4">
                  <div className="bg-badge-aadhaar-bg text-badge-aadhaar-text p-3 rounded-lg border border-badge-aadhaar-border/40 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                    <Navigation className="w-4.5 h-4.5" />
                    <span>IN-TRANSIT: Telemetry coordinates syncing with National Sarathi database and Fleet dashboard.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative w-full h-48 rounded-xl border border-border-divider overflow-hidden bg-surface-dim">
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7jsLsbJEuCT4jdNmw0k3LHpIN1x-pbj5L3vHYxUAiSMlEvkAohQvKZtskTSdn2d2CF9q-CJ42TYDjRjk2BphX3N7aZwJXf4FYzLNt2iLN6cJrSI3qW5tQF61xC9S2Cd3KeAVHtTEs2F6I5FviEBBa05mKFzS1CWzFJc_6d5Q4iS8bXQ6sOqmqUjQQ0tf3uwI0lAaONqvk6ahIbc8vd_MUeCWtVJLmY1O1xX7SkVTDIkW9TzYC0wayqA')` }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <span className="px-3 py-1 bg-primary text-white rounded font-mono-code text-[11px] font-bold shadow animate-bounce">
                          📍 {activeTrip.progress}% Transit Coordinate
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between bg-canvas-subtle p-4 rounded-xl border border-border-subtle text-xs">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">OBD-II LIVE TELEMETRY</span>
                        <div className="flex justify-between border-b border-border-divider/50 pb-1">
                          <span>Target Client:</span>
                          <span className="font-bold text-text-primary">{activeTrip.ownerName}</span>
                        </div>
                        <div className="flex justify-between border-b border-border-divider/50 pb-1">
                          <span>GPS Speed Meter:</span>
                          <span className="font-bold text-text-primary">45 km/h</span>
                        </div>
                        <div className="flex justify-between border-b border-border-divider/50 pb-1">
                          <span>Satellite Sync Status:</span>
                          <span className="text-status-active font-bold">100% LOCK</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Security Code:</span>
                          <span className="font-mono-code font-bold text-primary">TRIP-V802</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 mt-4">
                        <span className="text-[10px] text-text-tertiary uppercase font-bold">DUTY PROGRESS</span>
                        <div className="w-full h-1.5 bg-border-divider rounded-full overflow-hidden">
                          <div className="h-full bg-status-active transition-all" style={{ width: `${activeTrip.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTrip.status === 'completed' && (
                <div className="p-6 rounded-xl border border-badge-aadhaar-border bg-badge-aadhaar-bg/30 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-status-active/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-status-active" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-status-active">Shift Duty Completed Successfully!</h4>
                    <p className="text-xs text-text-secondary max-w-md mt-1">
                      Your duty has been validated via OBD geo-fencing. The earnings of <strong>₹{activeTrip.payout}</strong> has been transferred into your Priority wallet.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setActiveTrip(prev => ({ ...prev, status: 'idle' }));
                      setActiveSubTab('earnings');
                    }}
                    className="h-9 px-4 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all"
                  >
                    Go to Earnings Ledger
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSubTab === 'compliance' && (
            <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-status-active" /> UIDAI & Sarathi Compliance Verified
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your credentials have been authenticated directly against the UIDAI Aadhaar registry database and the National Sarathi Vahan API portal. 
              </p>

              <div className="bg-gradient-to-br from-surface-dim to-canvas-subtle p-4 rounded-xl border border-border-divider shadow-inner flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border-divider/50 pb-2">
                  <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">Aadhaar XML Secure Vault</span>
                  <span className="px-2 py-0.5 bg-badge-aadhaar-bg text-badge-aadhaar-text font-bold text-[9px] rounded uppercase font-mono-code">✓ SECURE SYNCED</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col">
                    <span className="text-text-tertiary font-bold uppercase text-[9px]">Aadhaar Masked ID</span>
                    <span className="font-mono-code font-bold text-text-primary mt-1">XXXX XXXX 4819</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-tertiary font-bold uppercase text-[9px]">Police Clear (CCTNS)</span>
                    <span className="text-status-active font-bold mt-1">✓ No Pending Criminal Cases</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-tertiary font-bold uppercase text-[9px]">RTO Licensed Badge</span>
                    <span className="font-mono-code font-bold text-text-primary mt-1">{driver.badgeNumber || 'BADGE-HMV-8820'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-text-tertiary font-bold uppercase text-[9px]">Medical Fitness Cert</span>
                    <span className="text-badge-aadhaar-text font-bold mt-1">{driver.medicalFitness}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-canvas-subtle border border-border-subtle flex flex-col gap-2.5">
                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Re-upload credentials</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-dashed border-border-divider bg-canvas-base rounded-lg p-3 text-center cursor-pointer hover:bg-canvas-subtle transition-colors flex flex-col items-center justify-center gap-1.5">
                    <FileText className="w-5 h-5 text-text-tertiary" />
                    <span className="text-[10px] font-bold text-text-primary">Update Driving License</span>
                  </div>
                  <div className="border border-dashed border-border-divider bg-canvas-base rounded-lg p-3 text-center cursor-pointer hover:bg-canvas-subtle transition-colors flex flex-col items-center justify-center gap-1.5">
                    <FileText className="w-5 h-5 text-text-tertiary" />
                    <span className="text-[10px] font-bold text-text-primary">Update Medical Fitness</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'earnings' && (
            <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-sm flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-border-divider">
                <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <DollarSign className="w-4.5 h-4.5 text-primary" /> Earnings & Wallet Ledger
                </h3>
                <span className="text-xs text-text-tertiary">Direct Razorpay payout gateway</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-canvas-subtle p-5 rounded-xl border border-border-subtle flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Total Earned Payouts</span>
                    <h2 className="text-3xl font-extrabold text-text-primary mt-1 font-mono-code">₹24,500</h2>
                    <p className="text-[10px] text-text-secondary mt-1">All commissions are 0% for premium drivers.</p>
                  </div>
                  <button 
                    onClick={handleRequestPayout}
                    disabled={isRequestingPayout}
                    className="w-full h-10 rounded-full bg-status-active hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    {isRequestingPayout ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                    <span>Request Payout to UPI VPA</span>
                  </button>
                </div>

                <div className="bg-canvas-subtle p-5 rounded-xl border border-border-subtle flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Configure Rate Card</span>
                    <p className="text-xs text-text-secondary mt-1">Adjust your standard rates. Any dispatch in range matches this card.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-text-tertiary">HOURLY RATE (₹)</label>
                      <input 
                        type="number" 
                        value={hourlyInput}
                        onChange={(e) => setHourlyInput(e.target.value)}
                        className="bg-canvas-base border border-border-divider rounded-lg p-2 font-bold font-mono-code text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-text-tertiary">DAILY RATE (₹)</label>
                      <input 
                        type="number" 
                        value={dailyInput}
                        onChange={(e) => setDailyInput(e.target.value)}
                        className="bg-canvas-base border border-border-divider rounded-lg p-2 font-bold font-mono-code text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleUpdateRates}
                    disabled={isUpdatingRate}
                    className="w-full h-9 rounded-full bg-primary text-white hover:bg-primary-hover font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-xs"
                  >
                    {isUpdatingRate ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Save Rate Card</span>
                  </button>
                </div>
              </div>

              {/* Payout History logs */}
              <div className="flex flex-col gap-2 border-t border-border-divider/50 pt-4">
                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Payout History Ledger</span>
                <div className="flex flex-col gap-1.5 font-mono-code text-[11px] text-text-secondary">
                  {payoutLogs.map((log, index) => (
                    <div key={index} className="flex justify-between p-2 rounded bg-canvas-subtle border border-border-subtle/50">
                      <span>{log}</span>
                      <span className="text-status-active font-bold">✓ SETTLED</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'contracts' && (
            <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-primary" /> Active Hiring Contracts & Requests
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Logistics companies and vehicle owners within 15 km who have inspected your credentials or initiated connection handshakes.
              </p>

              <div className="flex flex-col gap-3">
                <div className="p-4 bg-canvas-subtle rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold font-mono-code">FL</div>
                    <div>
                      <h4 className="font-bold text-xs text-text-primary">Fleet Logistics Ltd • Rajesh Sharma</h4>
                      <p className="text-[11px] text-text-secondary">Requesting: LMV Premium Chauffeur • Bangalore Terminal</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="h-8 px-3 rounded-full bg-status-active hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm transition-all">Accept Contract</button>
                    <button className="h-8 px-3 rounded-full bg-canvas-base border border-border-divider text-text-secondary hover:text-text-primary font-bold text-[10px] transition-all">Reject</button>
                  </div>
                </div>

                <div className="p-4 bg-canvas-subtle rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold font-mono-code">MS</div>
                    <div>
                      <h4 className="font-bold text-xs text-text-primary">Meenakshi Stone Crushers • Mine Yard 2</h4>
                      <p className="text-[11px] text-text-secondary">Requesting: HEMM Excavator • Peenya Quarry Segment</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="h-8 px-3 rounded-full bg-status-active hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm transition-all">Accept Contract</button>
                    <button className="h-8 px-3 rounded-full bg-canvas-base border border-border-divider text-text-secondary hover:text-text-primary font-bold text-[10px] transition-all">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Sidebar Mini Column */}
        {activeSubTab !== 'edit_profile' && activeSubTab !== 'radar' && (
        <div className="xl:col-span-4 flex flex-col gap-5">
          
          {/* Quick Vehicle Models Card */}
          <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-sm flex flex-col gap-3 text-left">
            <div className="flex items-center justify-between border-b border-border-divider pb-2">
              <h4 className="font-bold text-xs text-text-primary uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-primary" /> Vehicle Models ({driver.qualifiedVehicles.length})
              </h4>
              <button
                onClick={() => setActiveSubTab('edit_profile')}
                className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <Edit3 className="w-2.5 h-2.5" /> Edit
              </button>
            </div>

            <p className="text-[11px] text-text-secondary">
              Vehicle owners get matched when their required model matches your qualified fleet list.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {driver.qualifiedVehicles.map((veh, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-canvas-subtle text-text-primary border border-border-subtle">
                  ✓ {veh}
                </span>
              ))}
            </div>

            <button
              onClick={() => setActiveSubTab('edit_profile')}
              className="mt-1 w-full h-8 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add More Vehicle Models</span>
            </button>
          </div>

          <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-xs text-text-primary uppercase tracking-wide border-b border-border-divider pb-2 flex items-center gap-1">
              ⭐ Driver Reviews ({driver.totalReviews})
            </h4>
            
            <div className="flex items-center gap-1 text-status-warning">
              <span className="text-3xl font-extrabold text-text-primary">{driver.averageRating}</span>
              <div className="flex flex-col ml-2 text-xs text-left">
                <span className="font-bold">Excellent Rating</span>
                <span className="text-text-tertiary">Based on client telematics</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 text-xs text-text-secondary text-left">
              <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle">
                <div className="flex justify-between items-center font-bold text-text-primary text-[11px]">
                  <span>Excellent vehicle handling</span>
                  <span className="text-status-warning">5.0 ★</span>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed">"Mastery over equipment controls and smooth operation. Highly professional certified operator."</p>
                <span className="block text-[9px] text-text-tertiary mt-1.5">— J.R. Minerals, Peenya</span>
              </div>

              <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle">
                <div className="flex justify-between items-center font-bold text-text-primary text-[11px]">
                  <span>Pristine and polite chauffeur</span>
                  <span className="text-status-warning">5.0 ★</span>
                </div>
                <p className="mt-1 text-[10px] leading-relaxed">"Perfect VIP executive pickup. Very punctual and great navigation skills."</p>
                <span className="block text-[9px] text-text-tertiary mt-1.5">— Rajesh S., Fleet Logistics</span>
              </div>
            </div>
          </div>
        </div>
        )}

      </div>

    </div>
  );
}
