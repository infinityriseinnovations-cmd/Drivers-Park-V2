import React, { useState } from 'react';
import { 
  MOCK_INVOICES, 
  MOCK_OWNER, 
  OWNER_COMMISSION_PACKAGES, 
  DRIVER_COMMISSION_PACKAGES, 
  MOCK_MATCH_BOOKINGS 
} from '../data';
import { 
  CreditCard, 
  ShieldCheck, 
  Download, 
  RefreshCw, 
  Award, 
  FileText, 
  Percent, 
  Calculator, 
  ArrowRight, 
  Check, 
  Sliders, 
  CheckCircle2, 
  Building2, 
  Car, 
  HardHat, 
  Layers, 
  Zap,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface SubscriptionsTabProps {
  activeOwnerPackage?: string;
  onSelectOwnerPackage?: (id: string) => void;
  activeDriverPackage?: string;
  onSelectDriverPackage?: (id: string) => void;
  userRole?: 'owner' | 'driver';
}

export default function SubscriptionsTab({
  activeOwnerPackage = 'pkg_owner_pro',
  onSelectOwnerPackage,
  activeDriverPackage = 'pkg_driver_standard',
  onSelectDriverPackage,
  userRole = 'owner'
}: SubscriptionsTabProps) {
  // Toggle between viewing Owner Packages or Driver Packages
  const [selectedRoleView, setSelectedRoleView] = useState<'owner' | 'driver'>(userRole);
  const [currentOwnerPkg, setCurrentOwnerPkg] = useState<string>(activeOwnerPackage);
  const [currentDriverPkg, setCurrentDriverPkg] = useState<string>(activeDriverPackage);

  // Invoices state
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Interactive Commission & Wage Simulator state
  const [simDailyWage, setSimDailyWage] = useState<number>(1200);
  const [simDays, setSimDays] = useState<number>(7);
  const [simDriversCount, setSimDriversCount] = useState<number>(2);

  // Calculate total gross wage
  const totalGrossWage = simDailyWage * simDays * simDriversCount;

  // Find active package objects
  const activeOwnerObj = OWNER_COMMISSION_PACKAGES.find(p => p.id === currentOwnerPkg) || OWNER_COMMISSION_PACKAGES[1];
  const activeDriverObj = DRIVER_COMMISSION_PACKAGES.find(p => p.id === currentDriverPkg) || DRIVER_COMMISSION_PACKAGES[0];

  // Calculate commission amounts
  const ownerCommissionAmount = (totalGrossWage * activeOwnerObj.commissionRatePercent) / 100;
  const paygCommissionAmount = (totalGrossWage * 8) / 100;
  const ownerMonthlySavings = Math.max(0, paygCommissionAmount - ownerCommissionAmount);

  const driverCommissionDeduction = (totalGrossWage * activeDriverObj.commissionRatePercent) / 100;
  const driverNetEarnings = totalGrossWage - driverCommissionDeduction;

  const handleDownloadInvoice = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`IRN Tax Invoice ${id} downloaded successfully. (GST Annexure-1 Compliant)`);
    }, 900);
  };

  const handleCancelMandate = () => {
    const confirm = window.confirm("Are you sure you want to pause or revoke this Razorpay UPI AutoPay recurring mandate?");
    if (confirm) {
      alert("Mandate pause request dispatched to Razorpay India PG. Settlement state paused.");
    }
  };

  const handleSelectPackage = (pkgId: string, role: 'owner' | 'driver') => {
    if (role === 'owner') {
      setCurrentOwnerPkg(pkgId);
      if (onSelectOwnerPackage) onSelectOwnerPackage(pkgId);
    } else {
      setCurrentDriverPkg(pkgId);
      if (onSelectDriverPackage) onSelectDriverPackage(pkgId);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left" id="billing-hub">
      
      {/* ========================================================================= */}
      {/* TOP BANNER RIBBON: COMMISSION PLATFORM MODEL */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-canvas-base rounded-2xl shadow-xs p-6 border border-border-divider">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono-code font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                COMMISSION ENGINE v3.0
              </span>
              <span className="text-text-tertiary">/</span>
              <span className="text-xs font-bold text-text-secondary uppercase">
                Owner & Operator Handshake Exchange
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              Packages & Platform Commission
            </h1>
            <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
              Drivers Park connects vehicle owners and commercial companies with verified drivers and heavy machinery operators. Our platform earns transparent match commission per hire or via low-rate monthly packages.
            </p>
          </div>

          {/* Role Package Switcher */}
          <div className="flex items-center gap-2 bg-canvas-subtle p-1.5 rounded-xl border border-border-divider shrink-0">
            <button
              onClick={() => setSelectedRoleView('owner')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedRoleView === 'owner'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Vehicle Owner Packages</span>
            </button>
            <button
              onClick={() => setSelectedRoleView('driver')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                selectedRoleView === 'driver'
                  ? 'bg-status-active text-white shadow-xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Driver / Operator Plans</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PACKAGES GRID */}
      {/* ========================================================================= */}
      {selectedRoleView === 'owner' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Vehicle Owner & Fleet Company Packages
              </h2>
              <p className="text-xs text-text-secondary">
                Lower matching commissions for higher hiring volumes. Select a tier suited for your fleet scale:
              </p>
            </div>
            <span className="text-[11px] font-mono-code font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              Active Tier: {activeOwnerObj.name} ({activeOwnerObj.commissionRatePercent}%)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {OWNER_COMMISSION_PACKAGES.map((pkg) => {
              const isCurrent = currentOwnerPkg === pkg.id;
              return (
                <div 
                  key={pkg.id}
                  className={`bg-canvas-base rounded-2xl p-6 border-2 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                    isCurrent 
                      ? 'border-primary ring-1 ring-primary' 
                      : 'border-border-divider hover:border-text-secondary'
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[10px] font-mono-code font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        isCurrent ? 'bg-primary text-white' : 'bg-canvas-subtle text-text-secondary'
                      }`}>
                        {pkg.badge || 'PLAN'}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-status-active bg-status-active/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{pkg.name}</h3>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Commission Rate & Pricing */}
                    <div className="p-3.5 rounded-xl bg-canvas-subtle border border-border-subtle flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-text-tertiary block">Match Commission</span>
                        <span className="text-2xl font-black text-primary font-mono-code">
                          {pkg.commissionRatePercent}%
                        </span>
                        <span className="text-[10px] text-text-secondary"> per matched duty</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-text-tertiary block">Monthly Fee</span>
                        <span className="text-lg font-extrabold text-text-primary font-mono-code">
                          {pkg.pricePerMonth === 0 ? '₹0' : `₹${pkg.pricePerMonth.toLocaleString()}`}
                        </span>
                        <span className="text-[10px] text-text-secondary"> / month</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-col gap-2.5 border-t border-border-divider/60 pt-4 text-xs text-text-secondary">
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPackage(pkg.id, 'owner')}
                    className={`w-full h-11 mt-6 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-canvas-subtle hover:bg-surface-container text-primary border border-border-subtle'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Active Package' : `Switch to ${pkg.name}`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Driver & Machine Operator Earnings Plans
              </h2>
              <p className="text-xs text-text-secondary">
                Select your payout structure. Upgrade to Gold VIP to keep 100% of your earnings with zero commission deductions:
              </p>
            </div>
            <span className="text-[11px] font-mono-code font-bold text-status-active bg-status-active/10 px-2.5 py-1 rounded-full">
              Active Tier: {activeDriverObj.name} ({activeDriverObj.commissionRatePercent}% fee)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl">
            {DRIVER_COMMISSION_PACKAGES.map((pkg) => {
              const isCurrent = currentDriverPkg === pkg.id;
              return (
                <div 
                  key={pkg.id}
                  className={`bg-canvas-base rounded-2xl p-6 border-2 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                    isCurrent 
                      ? 'border-status-active ring-1 ring-status-active' 
                      : 'border-border-divider hover:border-text-secondary'
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-2">
                      <span className={`text-[10px] font-mono-code font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        isCurrent ? 'bg-status-active text-white' : 'bg-canvas-subtle text-text-secondary'
                      }`}>
                        {pkg.badge || 'PLAN'}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-status-active bg-status-active/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-text-primary">{pkg.name}</h3>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Commission Rate & Pricing */}
                    <div className="p-3.5 rounded-xl bg-canvas-subtle border border-border-subtle flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-text-tertiary block">Platform Commission</span>
                        <span className="text-2xl font-black text-status-active font-mono-code">
                          {pkg.commissionRatePercent === 0 ? '0%' : `${pkg.commissionRatePercent}%`}
                        </span>
                        <span className="text-[10px] text-text-secondary"> {pkg.commissionRatePercent === 0 ? 'deduction' : 'on payout'}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-text-tertiary block">Pass Fee</span>
                        <span className="text-lg font-extrabold text-text-primary font-mono-code">
                          {pkg.pricePerMonth === 0 ? '₹0' : `₹${pkg.pricePerMonth}`}
                        </span>
                        <span className="text-[10px] text-text-secondary"> / month</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="flex flex-col gap-2.5 border-t border-border-divider/60 pt-4 text-xs text-text-secondary">
                      {pkg.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-status-active shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPackage(pkg.id, 'driver')}
                    className={`w-full h-11 mt-6 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-status-active text-white shadow-xs'
                        : 'bg-canvas-subtle hover:bg-surface-container text-status-active border border-border-subtle'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Active Plan' : `Activate ${pkg.name}`}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE COMMISSION & EARNINGS SIMULATOR */}
      {/* ========================================================================= */}
      <section className="bg-canvas-base rounded-2xl p-6 border border-border-divider shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-border-divider">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary">
                Real-Time Package Commission & Savings Calculator
              </h3>
              <p className="text-xs text-text-secondary">
                Simulate driver daily rates, shifts, and team size to visualize platform commissions and monthly savings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary">Calculation Basis:</span>
            <span className="text-xs font-bold font-mono-code text-primary bg-surface-container px-2.5 py-1 rounded-md">
              {simDriversCount} Driver(s) × {simDays} Day(s) @ ₹{simDailyWage}/day
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-border-divider">
          
          {/* Slider 1: Driver Daily Wage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-text-primary">Driver Daily Rate</span>
              <span className="font-mono-code font-bold text-primary">₹{simDailyWage.toLocaleString()} / day</span>
            </div>
            <input 
              type="range"
              min={600}
              max={3000}
              step={50}
              value={simDailyWage}
              onChange={(e) => setSimDailyWage(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-tertiary font-mono-code">
              <span>₹600 (LMV)</span>
              <span>₹1,500 (Truck)</span>
              <span>₹3,000 (HEMM)</span>
            </div>
          </div>

          {/* Slider 2: Shift Days */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-text-primary">Duration (Duty Days)</span>
              <span className="font-mono-code font-bold text-primary">{simDays} Days</span>
            </div>
            <input 
              type="range"
              min={1}
              max={30}
              step={1}
              value={simDays}
              onChange={(e) => setSimDays(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-tertiary font-mono-code">
              <span>1 Day (Spot)</span>
              <span>7 Days (Weekly)</span>
              <span>30 Days (Monthly)</span>
            </div>
          </div>

          {/* Slider 3: Number of Vehicles / Drivers */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-text-primary">Fleet Scale (Drivers Needed)</span>
              <span className="font-mono-code font-bold text-primary">{simDriversCount} Drivers / Vehicles</span>
            </div>
            <input 
              type="range"
              min={1}
              max={15}
              step={1}
              value={simDriversCount}
              onChange={(e) => setSimDriversCount(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-tertiary font-mono-code">
              <span>1 Vehicle</span>
              <span>5 Vehicles</span>
              <span>15 Fleet Units</span>
            </div>
          </div>

        </div>

        {/* Live Metrics Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          
          <div className="p-4 rounded-xl bg-canvas-subtle border border-border-subtle">
            <span className="text-[10px] font-mono-code uppercase font-bold text-text-tertiary block">Gross Driver Wages</span>
            <span className="text-xl font-black text-text-primary font-mono-code mt-1 block">
              ₹{totalGrossWage.toLocaleString()}
            </span>
            <span className="text-[11px] text-text-secondary mt-0.5 block">Held safely in Escrow until completion</span>
          </div>

          <div className="p-4 rounded-xl bg-canvas-subtle border border-border-subtle">
            <span className="text-[10px] font-mono-code uppercase font-bold text-primary block">
              Platform Fee ({activeOwnerObj.name})
            </span>
            <span className="text-xl font-black text-primary font-mono-code mt-1 block">
              ₹{ownerCommissionAmount.toLocaleString()}
            </span>
            <span className="text-[11px] text-text-secondary mt-0.5 block">
              Calculated @ {activeOwnerObj.commissionRatePercent}% match commission
            </span>
          </div>

          <div className="p-4 rounded-xl bg-badge-aadhaar-bg/50 border border-badge-aadhaar-border">
            <span className="text-[10px] font-mono-code uppercase font-bold text-badge-aadhaar-text block">
              Owner Package Savings
            </span>
            <span className="text-xl font-black text-badge-aadhaar-text font-mono-code mt-1 block">
              ₹{ownerMonthlySavings.toLocaleString()} Saved
            </span>
            <span className="text-[11px] text-text-secondary mt-0.5 block">
              vs standard 8% Pay-As-You-Go rate
            </span>
          </div>

          <div className="p-4 rounded-xl bg-status-active/10 border border-status-active/20">
            <span className="text-[10px] font-mono-code uppercase font-bold text-status-active block">
              Net Driver Take-Home
            </span>
            <span className="text-xl font-black text-status-active font-mono-code mt-1 block">
              ₹{driverNetEarnings.toLocaleString()}
            </span>
            <span className="text-[11px] text-text-secondary mt-0.5 block">
              Dispatched via UPI upon shift sign-off
            </span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* MATCH BOOKINGS & COMMISSION LEDGER */}
      {/* ========================================================================= */}
      <section className="bg-canvas-base rounded-2xl p-6 border border-border-divider shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-divider">
          <div>
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              Live Match Bookings & Commission Ledger
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Audit log of vehicle owners and drivers united through the platform with transparent fee itemization.
            </p>
          </div>
          <span className="text-[10px] font-mono-code font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0">
            {MOCK_MATCH_BOOKINGS.length} Handshakes Logged
          </span>
        </div>

        <div className="overflow-x-auto mt-4 border border-border-subtle rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas-subtle text-text-secondary font-mono-code text-[10px] uppercase border-b border-border-divider">
                <th className="py-3 px-4 font-bold">Booking ID</th>
                <th className="py-3 px-4 font-bold">Vehicle Owner</th>
                <th className="py-3 px-4 font-bold">Assigned Operator</th>
                <th className="py-3 px-4 font-bold">Vehicle Model</th>
                <th className="py-3 px-4 font-bold">Duration</th>
                <th className="py-3 px-4 font-bold">Gross Wage</th>
                <th className="py-3 px-4 font-bold text-primary">Platform Commission</th>
                <th className="py-3 px-4 font-bold">Escrow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {MOCK_MATCH_BOOKINGS.map((bk) => (
                <tr key={bk.id} className="hover:bg-canvas-subtle/50 transition-colors text-xs">
                  <td className="py-3.5 px-4 font-mono-code font-bold text-text-primary">
                    {bk.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-text-primary block">{bk.ownerName}</span>
                    <span className="text-[10px] text-text-tertiary capitalize">{bk.ownerType} owner</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-text-primary block">{bk.driverName}</span>
                    <span className="text-[10px] font-mono-code text-text-tertiary">{bk.driverPhone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-text-primary block">{bk.vehicleModel}</span>
                    <span className="text-[10px] font-mono-code bg-canvas-subtle px-1.5 py-0.5 rounded border border-border-divider text-text-secondary">
                      {bk.vehicleCategory}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary font-mono-code">
                    {bk.durationUnits} {bk.hiringBasis === 'daily' ? 'Days' : bk.hiringBasis}
                  </td>
                  <td className="py-3.5 px-4 font-bold font-mono-code text-text-primary">
                    ₹{bk.grossWage.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-primary font-mono-code block">
                      +₹{bk.totalPlatformCommission.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-text-tertiary">
                      Owner ({bk.ownerCommissionRate}%) + Drv ({bk.driverCommissionRate}%)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      bk.escrowStatus === 'released' 
                        ? 'bg-status-active/10 text-status-active' 
                        : 'bg-status-warning/10 text-status-warning'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {bk.escrowStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TRUST MANDATE DETAILS & AUTOPAY STATUS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-canvas-base rounded-2xl p-5 border border-border-divider shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-1.5 mb-4">
            <span className="text-[10px] text-text-tertiary uppercase font-mono-code font-bold">
              Mobility Escrow Protection Framework
            </span>
            <h3 className="font-bold text-sm text-text-primary">
              Triple-Locked Escrow & Instant UPI Settlement
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              When a vehicle owner books a driver or operator, the gross duty wage is deposited into the Drivers Park Escrow. Funds are released directly to the driver's UPI upon shift sign-off, with the platform commission automatically reconciled.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-canvas-subtle p-3 rounded-xl border border-border-subtle">
              <span className="text-[10px] text-text-secondary block font-bold">LMV Operators</span>
              <span className="text-base font-bold text-text-primary font-mono-code">62 Online</span>
            </div>
            <div className="bg-canvas-subtle p-3 rounded-xl border border-border-subtle">
              <span className="text-[10px] text-text-secondary block font-bold">HMV Trucks & Bus</span>
              <span className="text-base font-bold text-text-primary font-mono-code">58 Online</span>
            </div>
            <div className="bg-canvas-subtle p-3 rounded-xl border border-border-subtle">
              <span className="text-[10px] text-text-secondary block font-bold">HEMM Excavators</span>
              <span className="text-base font-bold text-text-primary font-mono-code">22 Online</span>
            </div>
          </div>
        </div>

        {/* UPI AutoPay Mandate widget */}
        <div className="bg-canvas-base rounded-2xl p-5 border border-border-divider shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono-code font-bold text-text-secondary uppercase">
                E-Mandate Vault
              </span>
              <CreditCard className="w-5 h-5 text-status-active" />
            </div>
            <h3 className="font-bold text-sm text-text-primary">Razorpay UPI AutoPay</h3>
            
            <div className="bg-canvas-subtle p-3.5 rounded-xl border border-border-subtle flex flex-col gap-2 font-mono-code text-[11px] text-text-secondary">
              <div className="flex justify-between">
                <span>Linked VPA:</span>
                <span className="text-text-primary font-bold">{MOCK_OWNER.vpa}</span>
              </div>
              <div className="flex justify-between">
                <span>AutoPay UMN:</span>
                <span>RAZ7899014529</span>
              </div>
              <div className="flex justify-between">
                <span>Max Cycle Cap:</span>
                <span className="text-text-primary font-bold">₹5,000/cycle</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-status-active font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-active animate-pulse"></span> ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 mt-4">
            <button 
              onClick={() => alert("Redirecting to Razorpay credentials authorization popup...")}
              className="h-9 w-full rounded-xl bg-canvas-subtle hover:bg-surface-container text-primary font-bold text-xs border border-border-subtle cursor-pointer"
            >
              Update Payment Method
            </button>
            <button 
              onClick={handleCancelMandate}
              className="text-[11px] font-bold text-status-urgent hover:underline text-center py-1 cursor-pointer"
            >
              Pause UPI Mandate
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INVOICE HISTORY (GST TAX RECEIPTS) */}
      {/* ========================================================================= */}
      <div className="bg-canvas-base rounded-2xl p-6 border border-border-divider shadow-xs flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" /> Invoice History (GST Tax Receipts)
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            Download IRN-compliant tax invoices for monthly packages and matching commissions.
          </p>
        </div>

        <div className="overflow-x-auto border border-border-subtle rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-canvas-subtle text-text-secondary font-mono-code text-[10px] uppercase border-b border-border-divider">
                <th className="py-3 px-4 font-bold">Invoice Number</th>
                <th className="py-3 px-4 font-bold">Billing Plan</th>
                <th className="py-3 px-4 font-bold">Date & Time</th>
                <th className="py-3 px-4 font-bold">VPA / Reference ID</th>
                <th className="py-3 px-4 font-bold">Amount</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-right font-bold">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-canvas-subtle/50 transition-colors text-xs">
                  <td className="py-3.5 px-4 font-bold font-mono-code text-text-primary">{inv.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-text-primary">{inv.plan}</span>
                    <span className="block text-[10px] text-text-tertiary mt-0.5">{inv.type}</span>
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">{inv.date}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono-code text-text-primary">{inv.vpa}</span>
                    <span className="block text-[10px] text-text-tertiary font-mono-code mt-0.5">{inv.paymentId}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold font-mono-code text-text-primary">₹{inv.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 bg-badge-aadhaar-bg text-badge-aadhaar-text font-bold text-[10px] px-2 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-status-active"></span> {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      disabled={downloadingId === inv.id}
                      className="inline-flex items-center gap-1.5 text-primary hover:text-secondary font-bold hover:bg-surface-container px-2 py-1 rounded transition-colors text-[11px] cursor-pointer"
                    >
                      {downloadingId === inv.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
