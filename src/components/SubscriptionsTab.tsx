import React, { useState } from 'react';
import { MOCK_INVOICES, MOCK_OWNER } from '../data';
import { CreditCard, Wallet, ShieldCheck, Download, AlertCircle, RefreshCw, Smartphone, Award, FileText } from 'lucide-react';

export default function SubscriptionsTab() {
  const [activePlan, setActivePlan] = useState<'pro' | 'day' | 'enterprise'>('pro');
  const [invoices, setInvoices] = useState(MOCK_INVOICES);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownloadInvoice = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`IRN Tax Invoice ${id} downloaded successfully. (GST Annexure-1 Compliant)`);
    }, 1000);
  };

  const handleCancelMandate = () => {
    const confirm = window.confirm("Are you sure you want to pause or revoke this Razorpay UPI AutoPay recurring mandate?");
    if (confirm) {
      alert("Mandate pause request dispatched to Razorpay India PG. Settlement state paused.");
    }
  };

  return (
    <div className="flex flex-col gap-6" id="billing-hub">
      
      {/* Top Banner Ribbon */}
      <section className="relative overflow-hidden bg-canvas-base rounded-xl shadow-sm p-6 border border-border-divider">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-surface-container rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono-code font-bold text-primary bg-surface-container px-2.5 py-0.5 rounded-full">
                DP-BILLING v2.4
              </span>
              <span className="text-text-tertiary">/</span>
              <span className="text-xs font-bold text-text-secondary uppercase">Enterprise Fleet Operator Commerce</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary">Billing & Priority Subscription Gateway</h1>
            <p className="text-xs text-text-secondary">Manage zero-commission contact unlocks, direct verified telematics, and operator placement highlights.</p>
          </div>

          {/* Razorpay badge */}
          <div className="flex items-center gap-3 bg-canvas-subtle p-3 rounded-lg border border-border-subtle shadow-sm shrink-0">
            <div className="w-9 h-9 rounded-full bg-badge-category-bg flex items-center justify-center border border-badge-category-border">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-primary">Razorpay PG Standard</span>
              <span className="text-[10px] font-mono-code text-text-secondary">UPI AutoPay Framework Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Plan 1: Daily Quick Pass */}
        <div className="bg-canvas-base rounded-xl p-6 border border-border-divider shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] font-mono-code uppercase text-text-secondary bg-canvas-subtle px-2 py-0.5 rounded-full">Ad-Hoc / Emergency</span>
              <Award className="w-5 h-5 text-text-tertiary" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-text-primary">Daily Quick Pass</h2>
              <p className="text-xs text-text-secondary mt-1">Immediate short-window acting driver requirement for sudden driver absence or relocation shifts.</p>
            </div>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-3xl font-extrabold text-text-primary">₹199</span>
              <span className="text-xs text-text-secondary">/ 24 hours access</span>
            </div>
            
            <div className="flex flex-col gap-2.5 border-t border-border-divider/50 pt-4 text-xs text-text-secondary">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>5 Direct driver phone unlocks</strong> & WhatsApp contact reveals</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Realtime PostGIS live radius radar query (within 15km)</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Standard Aadhaar XML & driving license validities check</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActivePlan('day')}
            className={`w-full h-10 mt-6 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activePlan === 'day' 
                ? 'bg-status-active text-white shadow-sm'
                : 'bg-canvas-subtle hover:bg-surface-container text-primary border border-border-subtle'
            }`}
          >
            <span>{activePlan === 'day' ? 'Current Access Plan' : 'Select Day Pass'}</span>
          </button>
        </div>

        {/* Plan 2: Fleet Pro Monthly (Current Active) */}
        <div className="bg-canvas-base rounded-xl p-6 border-2 border-primary shadow-md flex flex-col justify-between hover:shadow-lg transition-all relative">
          <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold uppercase px-3 py-1 rounded-bl-lg font-mono-code tracking-wider">
            RECOMMENDED FOR OPERATORS
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] font-mono-code font-bold uppercase text-badge-category-text bg-badge-category-bg px-2.5 py-0.5 rounded-full">MOST POPULAR TIER</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-text-primary">Fleet Pro Monthly</h2>
              <p className="text-xs text-text-secondary mt-1">Continuous operational support for multi-vehicle owners, cargo hubs, and active logistics managers.</p>
            </div>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-3xl font-extrabold text-text-primary">₹1,499</span>
              <span className="text-xs text-text-secondary">/ month</span>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-border-divider/50 pt-4 text-xs text-text-secondary">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>Unlimited verified driver reveals</strong> (LMV, HMV, & HEMM Excavators)</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>Priority Emergency SOS Broadcasts</strong> with 0% dispatch cuts</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Direct DigiLocker secure legal compliance & Sarathi NOC syncs</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Automated WhatsApp driver dispatch bot (1-click coordinates)</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActivePlan('pro')}
            className={`w-full h-10 mt-6 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activePlan === 'pro' 
                ? 'bg-primary text-white shadow-sm'
                : 'bg-canvas-subtle hover:bg-surface-container text-primary border border-border-subtle'
            }`}
          >
            <span>{activePlan === 'pro' ? '🟢 Current Active Plan' : 'Select Fleet Pro'}</span>
          </button>
        </div>

        {/* Plan 3: Enterprise Logistics Suite */}
        <div className="bg-canvas-base rounded-xl p-6 border border-border-divider shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] font-mono-code uppercase text-badge-ai-text bg-badge-ai-bg px-2 py-0.5 rounded-full">MULTI-BRANCH AI SUITE</span>
              <Award className="w-5 h-5 text-badge-ai-text" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-text-primary">Enterprise Logistics</h2>
              <p className="text-xs text-text-secondary mt-1">Complete enterprise-grade telemetry streams, bulk verified driver dockets, and teleoperation safety desks.</p>
            </div>
            <div className="flex items-baseline gap-1 my-2">
              <span className="text-3xl font-extrabold text-text-primary">₹4,999</span>
              <span className="text-xs text-text-secondary">/ month</span>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-border-divider/50 pt-4 text-xs text-text-secondary">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span><strong>Unlimited branch dispatcher access</strong> (Up to 50 managers)</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Autonomous Teleoperated vehicle control center mapping integrations</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Dedicated fleet customer success manager (SLA &lt; 15 mins)</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setActivePlan('enterprise')}
            className={`w-full h-10 mt-6 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activePlan === 'enterprise' 
                ? 'bg-badge-ai-text text-white shadow-sm'
                : 'bg-canvas-subtle hover:bg-surface-container text-primary border border-border-subtle'
            }`}
          >
            <span>{activePlan === 'enterprise' ? 'Current Access Plan' : 'Select Enterprise'}</span>
          </button>
        </div>

      </div>

      {/* Trust Mandate Details & Autopay Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="lg:col-span-2 bg-canvas-base rounded-xl p-5 border border-border-divider shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-1.5 mb-4">
            <span className="text-[10px] text-text-tertiary uppercase font-mono-code font-bold">PostGIS Live Telemetry Pool</span>
            <h3 className="font-bold text-sm text-text-primary">Driver Pro Coverage vs Razorpay Mandates</h3>
            <p className="text-xs text-text-secondary leading-normal">
              Active spatial nodes ready for dispatch matching in the Indiranagar corridor. Direct calls authorized via secure encrypted VPA connection.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle">
              <span className="text-[10px] text-text-secondary block font-bold">LMV Operators</span>
              <span className="text-base font-bold text-text-primary font-mono-code">62 Online</span>
            </div>
            <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle">
              <span className="text-[10px] text-text-secondary block font-bold">HMV Trailer</span>
              <span className="text-base font-bold text-text-primary font-mono-code">58 Online</span>
            </div>
            <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle">
              <span className="text-[10px] text-text-secondary block font-bold">HEMM Excavators</span>
              <span className="text-base font-bold text-text-primary font-mono-code">22 Online</span>
            </div>
          </div>
        </div>

        {/* UPI AutoPay Mandate widget */}
        <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono-code font-bold text-text-secondary uppercase">E-Mandate Vault</span>
              <CreditCard className="w-5 h-5 text-status-active" />
            </div>
            <h3 className="font-bold text-sm text-text-primary">Razorpay UPI AutoPay</h3>
            
            <div className="bg-canvas-subtle p-3.5 rounded-lg border border-border-subtle flex flex-col gap-2 font-mono-code text-[11px] text-text-secondary">
              <div className="flex justify-between">
                <span>VPA ID:</span>
                <span className="text-text-primary font-bold">{MOCK_OWNER.vpa}</span>
              </div>
              <div className="flex justify-between">
                <span>AutoPay UMN:</span>
                <span>RAZ7899014529</span>
              </div>
              <div className="flex justify-between">
                <span>Authorized Cap:</span>
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
              className="h-9 w-full rounded-full bg-canvas-subtle hover:bg-surface-container text-primary font-bold text-xs border border-border-subtle"
            >
              Update Payment Method
            </button>
            <button 
              onClick={handleCancelMandate}
              className="text-[11px] font-bold text-status-urgent hover:underline text-center py-1"
            >
              Pause UPI Mandate
            </button>
          </div>
        </div>
      </div>

      {/* Invoice list table */}
      <div className="bg-canvas-base rounded-xl p-6 border border-border-divider shadow-sm flex flex-col gap-4 mt-2">
        <div>
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-primary" /> Invoice History (GST Tax Receipts)
          </h3>
          <p className="text-xs text-text-secondary mt-1">Download IRN-compliant receipts sync'd dynamically via Deno Edge Webhook.</p>
        </div>

        <div className="overflow-x-auto border border-border-subtle rounded-lg">
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
                      className="inline-flex items-center gap-1.5 text-primary hover:text-secondary font-bold hover:bg-surface-container px-2 py-1 rounded transition-colors text-[11px]"
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
