import React from 'react';
import { Compass, ShieldCheck, CreditCard, Send, Smartphone, Activity, Bell, User, Star } from 'lucide-react';
import { MOCK_OWNER } from '../data';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const navItems = [
    { id: 'discovery', label: 'Discovery Feed', icon: Compass },
    { id: 'dispatch', label: 'Emergency Dispatch', icon: Send },
    { id: 'kyc', label: 'KYC & Verification', icon: ShieldCheck },
    { id: 'billing', label: 'Subscriptions & Billing', icon: CreditCard },
    { id: 'architecture', label: 'Mobile Expo Code', icon: Smartphone },
  ];

  return (
    <div className="bg-canvas-subtle min-h-screen text-text-primary antialiased flex flex-col justify-between">
      
      {/* Dynamic Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-canvas-base shadow-sm border-b border-border-divider h-16">
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo & Search Container */}
          <div className="flex items-center gap-6 shrink-0">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab('discovery'); }}
              className="flex items-center gap-2"
            >
              {/* Custom Branded SVG logo as requested */}
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                P
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-sm tracking-tight text-primary">Drivers<span className="text-secondary">Park</span></span>
                <span className="text-[9px] text-text-tertiary uppercase font-bold tracking-widest mt-0.5">Verified Mobility</span>
              </div>
            </a>

            {/* Quick search input */}
            <div className="hidden md:flex items-center bg-canvas-subtle rounded-full border border-border-divider px-3 py-1.5 gap-2 w-64 lg:w-80">
              <Compass className="w-4 h-4 text-text-tertiary shrink-0" />
              <input 
                type="text" 
                placeholder="Search verified drivers, locations..." 
                disabled
                className="bg-transparent w-full text-xs text-text-primary focus:outline-none placeholder:text-text-tertiary cursor-not-allowed"
              />
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    activeTab === item.id
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'text-text-secondary hover:bg-surface-container-low hover:text-text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* Live postGIS tracking heartbeat */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-badge-aadhaar-bg rounded-full border border-badge-aadhaar-border">
              <span className="w-1.5 h-1.5 rounded-full bg-status-active animate-pulse"></span>
              <span className="text-[10px] font-mono-code font-bold text-badge-aadhaar-text">
                PostGIS: 842 Drivers Active
              </span>
            </div>

            {/* Notification Heartbeat */}
            <button className="relative p-1.5 rounded-full bg-canvas-subtle hover:bg-surface-container border border-border-divider text-text-secondary transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-status-urgent rounded-full"></span>
            </button>

            {/* Owner Profile thumbnail */}
            <div className="flex items-center gap-2 pl-2 border-l border-border-divider">
              <img 
                src={MOCK_OWNER.avatarUrl} 
                alt={MOCK_OWNER.fullName} 
                className="w-8 h-8 rounded-full object-cover border border-border-divider"
              />
              <div className="hidden xl:flex flex-col text-left leading-none">
                <span className="text-xs font-bold text-text-primary">{MOCK_OWNER.fullName}</span>
                <span className="text-[9px] text-badge-category-text uppercase font-bold mt-0.5">Enterprise Fleet</span>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Main Container View */}
      <main className="w-full pt-16 flex-1 flex flex-col justify-start">
        
        {/* Mobile Navigation Tabs (Shown on mobile only) */}
        <div className="lg:hidden bg-canvas-base border-b border-border-divider px-4 py-2 flex items-center gap-1.5 overflow-x-auto w-full sticky top-16 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 flex items-center gap-1 ${
                  activeTab === item.id
                    ? 'bg-primary-container text-on-primary font-semibold'
                    : 'text-text-secondary hover:bg-canvas-subtle'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Inner Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
          {children}
        </div>
      </main>

      {/* Platform Compliance Footer */}
      <footer className="w-full bg-canvas-base border-t border-border-divider py-6 mt-12 shadow-sm shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-primary tracking-tight">Drivers<span className="text-secondary">Park</span></span>
            <span className="text-xs text-text-tertiary">— Next-Gen Driver Discovery & Operations platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-text-secondary flex-wrap">
            <button onClick={() => setActiveTab('discovery')} className="hover:text-primary transition-colors">Find Drivers</button>
            <button onClick={() => setActiveTab('kyc')} className="hover:text-primary transition-colors">Aadhaar Verification</button>
            <button onClick={() => setActiveTab('billing')} className="hover:text-primary transition-colors">Fleet Billing</button>
            <button onClick={() => setActiveTab('dispatch')} className="hover:text-primary transition-colors">SOS Dispatch</button>
            <button onClick={() => setActiveTab('architecture')} className="hover:text-primary transition-colors">Mobile Expo SDK</button>
          </div>

          <p className="text-xs text-text-tertiary text-center md:text-right">
            © 2026 Drivers Park Technologies India Pvt Ltd. MIT Licensed.
          </p>
        </div>
      </footer>

    </div>
  );
}
