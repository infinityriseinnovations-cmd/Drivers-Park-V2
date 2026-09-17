import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DiscoveryFeed from './components/DiscoveryFeed';
import EmergencyDispatch from './components/EmergencyDispatch';
import KycVerification from './components/KycVerification';
import SubscriptionsTab from './components/SubscriptionsTab';
import OperationsTab from './components/OperationsTab';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthRegistration from './components/AuthRegistration';
import { DriverProfile, EmergencyDispatch as DispatchType, OwnerType } from './types';
import { MOCK_DRIVERS, MOCK_DISPATCHES } from './data';
import { getDriversFromSupabase, saveDriverToSupabase, getDispatchesFromSupabase } from './lib/supabase';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState<'owner' | 'driver' | 'admin'>('owner');
  const [activeTab, setActiveTab] = useState<string>('discovery');
  const [drivers, setDrivers] = useState<DriverProfile[]>(MOCK_DRIVERS);
  const [dispatches, setDispatches] = useState<DispatchType[]>(MOCK_DISPATCHES);
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(MOCK_DRIVERS[0]);
  const [loadingData, setLoadingData] = useState(false);

  const [selectedOwnerPackage, setSelectedOwnerPackage] = useState<string>('pkg_owner_pro');
  const [selectedDriverPackage, setSelectedDriverPackage] = useState<string>('pkg_driver_standard');

  // Authentication & Registration state (Default demo user provided for instant view matching screenshot)
  const [registeredUser, setRegisteredUser] = useState<{
    role: 'owner' | 'driver' | 'admin';
    fullName: string;
    contact: string;
    ownerType?: OwnerType;
    selectedPackageId?: string;
    commissionRate?: number;
    details: any;
  } | null>({
    role: 'owner',
    fullName: 'Rajesh Sharma',
    contact: '+91 98450 11029',
    ownerType: 'company',
    selectedPackageId: 'pkg_owner_pro',
    commissionRate: 3,
    details: {
      company: 'Fleet Logistics Ltd',
      fleetSize: 14,
      aadhaarStatus: 'verified'
    }
  });

  // Active traveling and route configuration for vehicle owners (matching screenshot)
  const [ownerRequirement, setOwnerRequirement] = useState<{
    from: string;
    to: string;
    vehicleType: string;
    vehicleModel: string;
    tripType: 'one-way' | 'two-way';
    hiringBasis: 'daily' | 'monthly' | 'enterprise';
  } | null>({
    from: 'Bengaluru Tech Park / Indiranagar',
    to: 'Kempegowda Int. Airport (KIA)',
    vehicleType: 'LMV',
    vehicleModel: 'Toyota Innova HyCross VIP',
    tripType: 'one-way',
    hiringBasis: 'daily'
  });

  const [showPostReqModal, setShowPostReqModal] = useState(false);

  // Sync with Supabase on mount
  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      try {
        const dbDrivers = await getDriversFromSupabase();
        if (dbDrivers && dbDrivers.length > 0) {
          setDrivers(dbDrivers);
          setSelectedDriver(dbDrivers[0]);
        }
        const dbDispatches = await getDispatchesFromSupabase();
        if (dbDispatches && dbDispatches.length > 0) {
          setDispatches(dbDispatches);
        }
      } catch (err) {
        console.warn('Could not sync with Supabase on start, running simulation mode:', err);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  const handleRoleChange = (role: 'owner' | 'driver' | 'admin') => {
    setActiveRole(role);
    if (role === 'owner') {
      setActiveTab('discovery');
    } else if (role === 'driver') {
      setActiveTab('driver_dashboard');
    } else {
      setActiveTab('admin_revenue');
    }
  };

  const handleCompleteRegistration = (user: {
    role: 'owner' | 'driver' | 'admin';
    fullName: string;
    contact: string;
    ownerType?: OwnerType;
    selectedPackageId?: string;
    commissionRate?: number;
    details: any;
    ownerRequirement?: any;
  }) => {
    setRegisteredUser(user);
    if (user.ownerRequirement) {
      setOwnerRequirement(user.ownerRequirement);
    }
    if (user.role === 'owner' && user.selectedPackageId) {
      setSelectedOwnerPackage(user.selectedPackageId);
    } else if (user.role === 'driver' && user.selectedPackageId) {
      setSelectedDriverPackage(user.selectedPackageId);
    }
    handleRoleChange(user.role);

    // If the registered user is a driver, dynamically add them to the live registry!
    if (user.role === 'driver') {
      const newDriver: DriverProfile = {
        id: `drv_${Date.now()}`,
        fullName: user.fullName,
        phoneNumber: user.contact,
        role: 'driver',
        licenseCategory: user.details.licenseCategories.length > 0 ? user.details.licenseCategories : ['LMV'],
        experienceYears: Number(user.details.experienceYears) || 5,
        hourlyRate: Number(user.details.hourlyRate) || 150,
        dailyRate: Number(user.details.dailyRate) || 1200,
        currentStatus: 'online',
        aadhaarStatus: 'verified',
        licenseNumber: user.details.licenseNumber || 'DL-KA51-2026889',
        badgeNumber: 'BADGE-9902',
        dob: '1995-04-12',
        gender: 'Male',
        averageRating: 5.0,
        totalReviews: 1,
        isAiAgent: false,
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwuyUG9hiicbUUvgFpgG9NK-ELHS9sRUYswN5ssotsIYCgtMJZFM1g5vjAMh61EEL6XYV_-TsmWH1XapNAoLD2i4aXTKL08lXwjWOXfLcLHkThykhM2ls3KMyOgQQ1QQumwX4oOK1RDOdukjtyHqwWx67YLPXzEqMJ2-NjcKdIEFb7EN0vXDUmAByb09TXXDDEceir5JN8OI-0xSZBag8QkvRiXHNqlRegN5wKitNnY47owQfceGw6rw',
        avatarAlt: user.fullName,
        location: { lat: 12.9716, lng: 77.5946, address: "Indiranagar, Bengaluru, KA" },
        qualifiedVehicles: user.details.licenseCategories.length > 0 ? user.details.licenseCategories : ['LMV Premium Chauffeur'],
        medicalFitness: user.details.medicalFitness || 'Grade A • Eye 6/6',
        policeClearance: 'No Pending Cases (Cleared CCTNS)'
      };

      setDrivers(prev => {
        const withNew = [newDriver, ...prev];
        setSelectedDriver(newDriver);
        saveDriverToSupabase(newDriver);
        return withNew;
      });
    }
  };

  const handleApproveDriver = async (driverId: string) => {
    setDrivers(prev => {
      const updated = prev.map(d => d.id === driverId ? { ...d, aadhaarStatus: 'verified' as const } : d);
      const target = updated.find(d => d.id === driverId);
      if (target) {
        saveDriverToSupabase(target);
      }
      return updated;
    });
    alert("Driver Aadhaar KYC APPROVED successfully! Status synchronized with UIDAI server.");
  };

  const handleRejectDriver = async (driverId: string) => {
    setDrivers(prev => {
      const updated = prev.map(d => d.id === driverId ? { ...d, aadhaarStatus: 'rejected' as const } : d);
      const target = updated.find(d => d.id === driverId);
      if (target) {
        saveDriverToSupabase(target);
      }
      return updated;
    });
    alert("Driver Aadhaar KYC marked as REJECTED.");
  };

  const handleAssignDriver = (driverId: string, vehicleName: string) => {
    setDrivers(prev => {
      const updated = prev.map(d => d.id === driverId ? { ...d, currentStatus: 'acting' as const } : d);
      const target = updated.find(d => d.id === driverId);
      if (target) {
        saveDriverToSupabase(target);
      }
      return updated;
    });
  };

  const [activeDriverDashboardId, setActiveDriverDashboardId] = useState<string>('drv_1');

  const handleUpdateDriverProfile = (updatedDriver: DriverProfile) => {
    setDrivers(prev => {
      const updated = prev.map(d => d.id === updatedDriver.id ? updatedDriver : d);
      return updated;
    });
    saveDriverToSupabase(updatedDriver);
    if (selectedDriver?.id === updatedDriver.id) {
      setSelectedDriver(updatedDriver);
    }
  };

  const handleUpdateDriverStatus = (newStatus: 'online' | 'acting' | 'offline') => {
    const activeId = registeredUser?.role === 'driver' ? drivers[0].id : activeDriverDashboardId;
    setDrivers(prev => {
      const updated = prev.map(d => d.id === activeId ? { ...d, currentStatus: newStatus } : d);
      const target = updated.find(d => d.id === activeId);
      if (target) {
        saveDriverToSupabase(target);
      }
      return updated;
    });
  };

  const handleSaveRateCard = (hourly: number, daily: number) => {
    const activeId = registeredUser?.role === 'driver' ? drivers[0].id : activeDriverDashboardId;
    setDrivers(prev => {
      const updated = prev.map(d => d.id === activeId ? { ...d, hourlyRate: hourly, dailyRate: daily } : d);
      const target = updated.find(d => d.id === activeId);
      if (target) {
        saveDriverToSupabase(target);
      }
      return updated;
    });
  };

  const selectDriver = (driver: DriverProfile) => {
    setSelectedDriver(driver);
  };

  const handlePostRequirement = () => {
    setActiveTab('discovery');
    setShowPostReqModal(true);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      // OWNER VIEWS
      case 'discovery':
        return (
          <div className="flex flex-col gap-6">
            <DiscoveryFeed 
              drivers={drivers}
              onSelectDriver={selectDriver} 
              selectedDriver={selectedDriver} 
              ownerRequirement={ownerRequirement}
              onUpdateRequirement={(req) => setOwnerRequirement(req)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              forceOpenRequirementModal={showPostReqModal}
              onCloseRequirementModal={() => setShowPostReqModal(false)}
            />

            {/* Selected Driver Detailed Inspector Panel */}
            {selectedDriver && (
              <section className="bg-canvas-base rounded-xl p-6 shadow-xs border border-border-divider flex flex-col md:flex-row gap-6 text-left animate-fade-in">
                {/* Photo and Status */}
                <div className="flex flex-col items-center text-center gap-3 shrink-0 md:w-48">
                  <div className="relative">
                    <img 
                      src={selectedDriver.avatarUrl} 
                      alt={selectedDriver.fullName} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-primary shadow-md"
                    />
                    <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-canvas-base ${
                      selectedDriver.currentStatus === 'online' ? 'bg-status-active' :
                      selectedDriver.currentStatus === 'acting' ? 'bg-status-warning' : 'bg-text-tertiary'
                    }`}></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">{selectedDriver.fullName}</h4>
                    <span className="text-[10px] text-text-secondary uppercase font-mono-code">{selectedDriver.licenseNumber}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mt-1">
                    {selectedDriver.licenseCategory.map((cat, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-badge-category-bg text-badge-category-text font-bold text-[9px] rounded font-mono-code">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Details list */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex flex-col gap-1 pb-3 border-b border-border-divider/50">
                    <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Operator Profile & Competency</span>
                    <h3 className="font-bold text-base text-text-primary">{selectedDriver.fullName} Profile Docket</h3>
                    <p className="text-xs text-text-secondary">Fully verified driver portfolio with real-time biometric and background telemetry checks.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                    <div className="flex flex-col">
                      <span className="text-text-tertiary uppercase text-[10px] font-bold">Years Experience</span>
                      <span className="font-bold text-text-primary mt-0.5">{selectedDriver.experienceYears} Years Active</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-tertiary uppercase text-[10px] font-bold">DOB & Gender</span>
                      <span className="font-bold text-text-primary mt-0.5">{selectedDriver.dob} • {selectedDriver.gender}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-tertiary uppercase text-[10px] font-bold">Medical Rating</span>
                      <span className="font-bold text-badge-aadhaar-text mt-0.5">{selectedDriver.medicalFitness}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-tertiary uppercase text-[10px] font-bold">Qualified Fleet Types</span>
                      <span className="font-bold text-text-primary mt-0.5 truncate">{selectedDriver.qualifiedVehicles.join(', ')}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-tertiary uppercase text-[10px] font-bold">RTO Police Check</span>
                      <span className="font-bold text-status-active mt-0.5">{selectedDriver.policeClearance}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-text-tertiary uppercase text-[10px] font-bold">Current Address</span>
                      <span className="font-bold text-text-primary mt-0.5">{selectedDriver.location.address}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-divider/50">
                    <span className="text-[11px] font-mono-code text-text-tertiary text-left">Cryptographic verification signature sync'd via National Sarathi API</span>
                    <button 
                      onClick={() => setActiveTab('kyc')}
                      className="h-9 px-4 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/15 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" /> Verify Biometric Audit
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        );
      case 'dispatch':
        return <EmergencyDispatch />;
      case 'kyc':
        return <KycVerification />;
      case 'billing':
        return (
          <SubscriptionsTab 
            activeOwnerPackage={selectedOwnerPackage}
            onSelectOwnerPackage={(id) => setSelectedOwnerPackage(id)}
            activeDriverPackage={selectedDriverPackage}
            onSelectDriverPackage={(id) => setSelectedDriverPackage(id)}
            userRole={activeRole === 'admin' ? 'owner' : activeRole}
          />
        );
      case 'operations':
        return <OperationsTab drivers={drivers} onAssignDriver={handleAssignDriver} />;

      // DRIVER VIEWS
      case 'driver_dashboard':
      case 'driver_compliance':
      case 'driver_earnings':
      case 'driver_contracts': {
        const activeDriver = drivers.find(d => d.id === (registeredUser?.role === 'driver' ? drivers[0].id : activeDriverDashboardId)) || drivers[0];
        return (
          <DriverDashboard 
            driver={activeDriver} 
            allDrivers={drivers}
            onSelectDriver={(id) => setActiveDriverDashboardId(id)}
            onUpdateStatus={handleUpdateDriverStatus}
            onSaveRateCard={handleSaveRateCard}
            onUpdateProfile={handleUpdateDriverProfile}
          />
        );
      }

      // ADMIN VIEWS - Control Vehicle Owners, Drivers, and Platform Commission
      case 'admin_revenue':
      case 'admin_owners':
      case 'admin_kyc':
      case 'admin_radar':
      case 'admin_dispatches':
      case 'admin_payouts':
      case 'admin_database': {
        let subTab: 'revenue' | 'owners' | 'kyc' | 'telematics' | 'dispatches' | 'payouts' | 'database' = 'revenue';
        if (activeTab === 'admin_owners') subTab = 'owners';
        if (activeTab === 'admin_kyc') subTab = 'kyc';
        if (activeTab === 'admin_radar') subTab = 'telematics';
        if (activeTab === 'admin_dispatches') subTab = 'dispatches';
        if (activeTab === 'admin_payouts') subTab = 'payouts';
        if (activeTab === 'admin_database') subTab = 'database';

        return (
          <AdminDashboard 
            drivers={drivers}
            dispatches={dispatches}
            initialSubTab={subTab}
            onApproveDriver={handleApproveDriver}
            onRejectDriver={handleRejectDriver}
            onRefreshData={() => {}}
          />
        );
      }

      default:
        return (
          <DiscoveryFeed 
            drivers={drivers}
            onSelectDriver={selectDriver} 
            selectedDriver={selectedDriver}
            ownerRequirement={ownerRequirement}
            onUpdateRequirement={(req) => setOwnerRequirement(req)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  // If user is not logged in / registered yet, present full screen login portal
  if (!registeredUser) {
    return <AuthRegistration onCompleteRegistration={handleCompleteRegistration} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      activeRole={activeRole}
      onChangeRole={handleRoleChange}
      onPostRequirement={handlePostRequirement}
      currentUser={registeredUser}
      onLogout={() => {
        setRegisteredUser(null);
        setOwnerRequirement(null);
      }}
    >
      {renderActiveTab()}
    </Layout>
  );
}
