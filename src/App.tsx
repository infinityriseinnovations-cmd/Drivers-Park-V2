import React, { useState } from 'react';
import Layout from './components/Layout';
import DiscoveryFeed from './components/DiscoveryFeed';
import EmergencyDispatch from './components/EmergencyDispatch';
import KycVerification from './components/KycVerification';
import SubscriptionsTab from './components/SubscriptionsTab';
import ExpoArchitecture from './components/ExpoArchitecture';
import { DriverProfile } from './types';
import { MOCK_DRIVERS } from './data';
import { Compass, ShieldCheck, MapPin, Star, Award, CheckCircle, Smartphone, Mail, Globe, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('discovery');
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(MOCK_DRIVERS[0]);

  const selectDriver = (driver: DriverProfile) => {
    setSelectedDriver(driver);
    // Auto-scroll to selected driver details if needed
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'discovery':
        return (
          <div className="flex flex-col gap-6">
            {/* Direct Broadcast Banner */}
            <div className="bg-gradient-to-r from-primary-container to-secondary text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-xl">
                <span className="text-[10px] font-mono-code font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase text-primary-fixed-dim">PostGIS Spatial Mesh</span>
                <h3 className="text-base font-bold mt-1">Instant Proximity Driver Dispatch Active</h3>
                <p className="text-xs opacity-90 mt-0.5">Need a replacement driver, executive chauffeur or HEMM operator within 45 minutes? Broadcast with our zero-commission SOS channel.</p>
              </div>
              <button 
                onClick={() => setActiveTab('dispatch')}
                className="h-10 px-5 rounded-full bg-white text-primary text-xs font-extrabold hover:bg-slate-100 transition-all flex items-center justify-center gap-1 shrink-0 shadow-sm"
              >
                <span>Launch SOS Channel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              <div className="xl:col-span-12">
                <DiscoveryFeed onSelectDriver={selectDriver} selectedDriver={selectedDriver} />
              </div>
            </div>

            {/* Selected Driver Detailed Inspector Panel */}
            {selectedDriver && (
              <section className="bg-canvas-base rounded-xl p-6 shadow-md border border-border-divider flex flex-col md:flex-row gap-6 mt-2">
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
                    <span className="text-[11px] font-mono-code text-text-tertiary">Cryptographic verification signature sync'd via National Sarathi API</span>
                    <button 
                      onClick={() => setActiveTab('kyc')}
                      className="h-9 px-4 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/15 transition-all flex items-center gap-1"
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
        return <SubscriptionsTab />;
      case 'architecture':
        return <ExpoArchitecture />;
      default:
        return <DiscoveryFeed onSelectDriver={selectDriver} selectedDriver={selectedDriver} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveTab()}
    </Layout>
  );
}
