import React, { useState } from 'react';
import { MOCK_DRIVERS } from '../data';
import { DriverProfile } from '../types';
import { ShieldCheck, FileText, Download, Flag, Eye, EyeOff, Check, AlertCircle, RefreshCw, Smartphone } from 'lucide-react';

export default function KycVerification() {
  const [selectedDriverIndex, setSelectedDriverIndex] = useState(0);
  const [drivers, setDrivers] = useState<DriverProfile[]>(MOCK_DRIVERS);
  const [unmaskAadhaar, setUnmaskAadhaar] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const activeDriver = drivers[selectedDriverIndex];

  const handleRecertify = (driverId: string) => {
    setVerifyingId(driverId);
    setTimeout(() => {
      setVerifyingId(null);
      setDrivers(prev => prev.map(d => {
        if (d.id === driverId) {
          return {
            ...d,
            aadhaarStatus: 'verified' as any,
            medicalFitness: "Grade A • Verified",
            policeClearance: "No Record Found (Cleared CCTNS)"
          };
        }
        return d;
      }));
    }, 1500);
  };

  const handleFlag = (driverId: string) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          aadhaarStatus: 'rejected' as any,
          policeClearance: "Flagged - Record Review Required"
        };
      }
      return d;
    }));
  };

  return (
    <div className="flex flex-col gap-6" id="kyc-matrix">
      
      {/* Top Trust Header */}
      <section className="bg-canvas-base rounded-xl p-6 shadow-sm border border-border-divider relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-badge-aadhaar-bg text-badge-aadhaar-text font-bold text-xs rounded-full self-start border border-badge-aadhaar-border">
              <ShieldCheck className="w-3.5 h-3.5" /> DigiLocker & Aadhaar XML Connected
            </div>
            <h1 className="text-xl font-bold text-text-primary">Compliance & Biometric Audit Hub</h1>
            <p className="text-xs text-text-secondary">
              Statutory Aadhaar secure XML verification, DGCA pilot medicals, ARAI autonomous telemetry audits, and automated DigiLocker API pipeline across Indian RTO checkpoints.
            </p>
          </div>

          <div className="bg-surface-container-low px-4 py-3 rounded-lg flex items-center gap-3 border border-border-divider">
            <div className="w-10 h-10 rounded-full bg-badge-aadhaar-bg flex items-center justify-center border border-badge-aadhaar-border">
              <ShieldCheck className="w-6 h-6 text-badge-aadhaar-text" />
            </div>
            <div>
              <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider">Audit Guarantee</span>
              <span className="text-xs font-bold text-text-primary">100% Identity Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Left Registry Log, Right Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Columns: Audit Log List */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Driver Ledger Registry</span>
            <span className="text-[10px] font-mono-code text-text-secondary bg-canvas-base border border-border-divider px-2 py-0.5 rounded-full">
              PostgreSQL 16 Spatial Table
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {drivers.map((drv, idx) => (
              <div 
                key={drv.id}
                onClick={() => setSelectedDriverIndex(idx)}
                className={`bg-canvas-base rounded-xl p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  selectedDriverIndex === idx ? 'border-primary ring-1 ring-primary/40' : 'border-border-divider'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img src={drv.avatarUrl} alt={drv.fullName} className="w-12 h-12 rounded-full object-cover border border-border-divider" />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-canvas-base ${
                      drv.aadhaarStatus === 'verified' ? 'bg-status-active' :
                      drv.aadhaarStatus === 'pending' ? 'bg-status-warning' : 'bg-status-urgent'
                    }`}></span>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-sm text-text-primary">{drv.fullName}</h3>
                      <span className={`text-[9px] font-bold px-1.5 py-0.25 rounded-full ${
                        drv.aadhaarStatus === 'verified' ? 'bg-badge-aadhaar-bg text-badge-aadhaar-text border border-badge-aadhaar-border' :
                        drv.aadhaarStatus === 'pending' ? 'bg-surface-container-high text-status-warning' : 'bg-error-container text-on-error-container'
                      }`}>
                        {drv.aadhaarStatus === 'verified' ? '✓ Certified' :
                         drv.aadhaarStatus === 'pending' ? 'Awaiting Biometrics' : 'Flagged Re-Audit'}
                      </span>
                    </div>
                    <span className="text-[11px] text-text-secondary font-mono-code font-medium mt-0.5">DL: {drv.licenseNumber}</span>
                    <div className="flex gap-1 mt-1.5">
                      {drv.licenseCategory.map((cat, ci) => (
                        <span key={ci} className="px-1.5 py-0.25 bg-badge-category-bg text-badge-category-text font-bold text-[9px] rounded font-mono-code">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right flex md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-border-divider/50 pt-2.5 md:pt-0">
                  <span className="text-xs text-text-secondary font-mono-code">SHA256: {drv.id.toUpperCase()}_HASH</span>
                  <span className="text-[10px] text-text-tertiary">DOB: {drv.dob}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Columns: Inspector Canvas */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          <div className="bg-canvas-base rounded-xl p-6 shadow-md border border-border-divider flex flex-col gap-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-divider">
              <span className="text-xs font-bold text-text-primary flex items-center gap-2 uppercase tracking-wide">
                <FileText className="w-4 h-4 text-primary" /> Document Verification Docket
              </span>
              <span className="text-[10px] font-mono-code text-badge-category-text bg-badge-category-bg px-2 py-0.5 rounded-full font-bold">
                {activeDriver.aadhaarStatus.toUpperCase()}
              </span>
            </div>

            {/* Profile strip */}
            <div className="flex items-center gap-4 bg-canvas-subtle p-3 rounded-lg border border-border-subtle">
              <img src={activeDriver.avatarUrl} alt={activeDriver.fullName} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-border-divider" />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-text-primary truncate">{activeDriver.fullName}</h4>
                <p className="text-xs text-text-secondary mt-0.5 truncate">{activeDriver.licenseCategory.join(' & ')} Certified Specialist</p>
                <span className="font-mono-code text-[11px] text-badge-category-text">{activeDriver.licenseNumber}</span>
              </div>
            </div>

            {/* Simulated Masked Government Card */}
            <div className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-xl p-4 border border-border-divider shadow-sm relative overflow-hidden flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-wider">Unique Identification Authority of India (UIDAI)</span>
                <span className="text-[9px] font-bold text-badge-aadhaar-text bg-badge-aadhaar-bg px-2 py-0.5 rounded">AADHAAR SECURE XML</span>
              </div>

              <div className="grid grid-cols-3 gap-3 items-center">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <span className="text-[10px] text-text-tertiary">Cryptographic Masked UID</span>
                  <span className="font-mono-code text-base font-bold text-text-primary tracking-widest block">
                    {unmaskAadhaar ? "4820 9912 4819" : "XXXX XXXX 4819"}
                  </span>
                  <span className="text-[10px] text-text-secondary">DOB: {activeDriver.dob} • Gender: {activeDriver.gender}</span>
                </div>
                
                <div className="col-span-1 flex flex-col items-center justify-center bg-canvas-base p-2 rounded-lg border border-border-divider shadow-xs">
                  <div className="w-12 h-12 bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAM5gRa14Sq5pzaGfHzF03HvkzuL_YbpwRIyBic0mD83EFBgrCMpfa-hK2PF6xRdUDkSBi4VyfthZXWrC2sUeo2W51NAsjzWp-LucrflhQOJOQ2PmyoANIkT6XjV87F768eczZZSjMpZOvkXr0wcB-QnChi_94_3-X40LDWbUTtFNHGbMPd0LoIK8lLUFlESUcLLHyr28tKUpEr_SNNeLgOeJHszV25xuSsxY0H4Y0w-9W6_Ze0sGg0Ug')` }} />
                  <span className="text-[8px] font-bold text-badge-category-text mt-1 uppercase font-mono-code">e-QR Token</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-text-secondary border-t border-border-divider/50 pt-2 font-mono-code">
                <button 
                  onClick={() => setUnmaskAadhaar(prev => !prev)}
                  className="flex items-center gap-1 text-primary hover:underline font-bold"
                >
                  {unmaskAadhaar ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{unmaskAadhaar ? "Mask UID" : "Unmask Credentials"}</span>
                </button>
                <span>SHA256: d82a_33b8_f20e</span>
              </div>
            </div>

            {/* Endorsements Checklist */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Statutory Verification Results</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-badge-aadhaar-bg flex items-center justify-center shrink-0">
                    <span className="text-xs">⚕️</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Medical Fitness</span>
                    <span className="text-xs font-semibold text-text-primary">{activeDriver.medicalFitness}</span>
                  </div>
                </div>

                <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-badge-aadhaar-bg flex items-center justify-center shrink-0">
                    <span className="text-xs">👮</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-text-tertiary block font-bold uppercase">Police Clearance</span>
                    <span className="text-xs font-semibold text-text-primary truncate block">{activeDriver.policeClearance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Actions Decks */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border-divider/50">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => alert(`IRN PDF export requested for operator ${activeDriver.fullName}. Download generated.`)}
                  className="h-10 px-4 rounded-full bg-canvas-subtle hover:bg-surface-container text-text-primary text-xs font-bold transition-all border border-border-subtle flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
                <button 
                  onClick={() => handleFlag(activeDriver.id)}
                  className="h-10 px-4 rounded-full bg-error-container hover:opacity-90 text-on-error-container text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Flag className="w-3.5 h-3.5" /> Flag Re-audit
                </button>
              </div>

              <button
                onClick={() => handleRecertify(activeDriver.id)}
                disabled={!!verifyingId}
                className="w-full h-11 px-4 rounded-full bg-status-active hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                {verifyingId ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>UIDAI Cross-Authentication in Progress...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Recertify Commercial Badge & Sync</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
