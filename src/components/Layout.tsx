import React, { useState } from 'react';
import { 
  Compass, ShieldCheck, CreditCard, Send, Smartphone, Activity, Bell, User, Star, 
  ChevronDown, Layers, Terminal, AlertCircle, MapPin, Radio, Check, LogOut, DollarSign, 
  AlertTriangle, X, Menu, Sliders, Users, ShieldAlert, Cpu
} from 'lucide-react';
import { MOCK_OWNER } from '../data';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: 'owner' | 'driver' | 'admin';
  onChangeRole: (role: 'owner' | 'driver' | 'admin') => void;
  onPostRequirement: () => void;
  currentUser?: {
    fullName: string;
    role: string;
    contact: string;
    ownerType?: string;
  } | null;
  onLogout?: () => void;
}

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  activeRole, 
  onChangeRole, 
  onPostRequirement,
  currentUser,
  onLogout
}: LayoutProps) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showRoleMobileSheet, setShowRoleMobileSheet] = useState(false);
  const [showMobileMenuDrawer, setShowMobileMenuDrawer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic Navigation tabs based on active role
  const ownerNavItems = [
    { id: 'discovery', label: 'Discovery Feed', icon: Compass, desc: 'Browse verified drivers & heavy operators' },
    { id: 'dispatch', label: 'Emergency Dispatch', icon: Send, badge: 'Live', desc: 'Instant breakdown & SOS reliever call' },
    { id: 'kyc', label: 'KYC & Verification', icon: ShieldCheck, desc: 'Vehicle RC, permits & insurance audit' },
    { id: 'billing', label: 'Packages & Commission', icon: CreditCard, desc: 'Subscription plans & savings calculator' },
    { id: 'operations', label: 'Operations & Fleet', icon: Layers, desc: 'Manage vehicles & assigned drivers' },
  ];

  const driverNavItems = [
    { id: 'driver_dashboard', label: 'Duty Console', icon: Compass, desc: 'Active bookings & hourly rate card' },
    { id: 'driver_compliance', label: 'Aadhaar Compliance', icon: ShieldCheck, desc: 'UIDAI biometric & Sarathi license' },
    { id: 'driver_earnings', label: 'Earnings Wallet', icon: CreditCard, desc: 'Instant UPI payouts & trip ledger' },
    { id: 'billing', label: 'Commission Passes', icon: DollarSign, desc: 'Standard 5% vs Gold VIP 0% Pass' },
  ];

  const adminNavItems = [
    { id: 'admin_revenue', label: 'Commission & Revenue', icon: DollarSign, badge: 'Core', desc: 'Master take-rate % & escrow vault' },
    { id: 'admin_owners', label: 'Vehicle Owners', icon: Users, desc: 'Approve fleets, RC books & custom rates' },
    { id: 'admin_kyc', label: 'Drivers KYC', icon: ShieldCheck, desc: 'Biometric UIDAI & Sarathi driving licenses' },
    { id: 'admin_radar', label: 'Live Radar', icon: Radio, desc: 'PostGIS telemetry & spatial clustering' },
    { id: 'admin_dispatches', label: 'SOS Incidents', icon: AlertTriangle, desc: 'Highway emergency dispatch triage' },
    { id: 'admin_payouts', label: 'Escrow Payouts', icon: CreditCard, desc: 'RazorpayX UPI disbursements ledger' },
    { id: 'admin_database', label: 'SQL Studio', icon: Terminal, desc: 'PostgreSQL spatial query console' },
  ];

  const navItems = activeRole === 'owner' 
    ? ownerNavItems 
    : activeRole === 'driver' 
    ? driverNavItems 
    : adminNavItems;

  const currentRoleLabel = activeRole === 'owner' 
    ? (currentUser?.ownerType === 'company' ? 'Fleet Transporter' : 'Vehicle Owner')
    : activeRole === 'driver'
    ? 'Verified Driver / Operator'
    : 'Platform Master Admin';

  const currentRoleName = currentUser?.fullName || (
    activeRole === 'owner' ? MOCK_OWNER.fullName : activeRole === 'driver' ? 'Vikram Singh' : 'Central Admin Console'
  );

  const currentRoleAvatar = activeRole === 'owner' ? MOCK_OWNER.avatarUrl
                          : activeRole === 'driver'
                          ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwuyUG9hiicbUUvgFpgG9NK-ELHS9sRUYswN5ssotsIYCgtMJZFM1g5vjAMh61EEL6XYV_-TsmWH1XapNAoLD2i4aXTKL08lXwjWOXfLcLHkThykhM2ls3KMyOgQQ1QQumwX4oOK1RDOdukjtyHqwWx67YLPXzEqMJ2-NjcKdIEFb7EN0vXDUmAByb09TXXDDEceir5JN8OI-0xSZBag8QkvRiXHNqlRegN5wKitNnY47owQfceGw6rw'
                          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';

  const handleRoleSelect = (role: 'owner' | 'driver' | 'admin') => {
    onChangeRole(role);
    setShowRoleDropdown(false);
    setShowRoleMobileSheet(false);
    setShowMobileMenuDrawer(false);
  };

  // Mobile Bottom App Bar Items (Ergonomic 4 primary tabs + menu trigger)
  const mobileNavTabs = activeRole === 'owner' ? [
    { id: 'discovery', label: 'Drivers', icon: Compass },
    { id: 'dispatch', label: 'SOS Call', icon: Send, badge: 'Live' },
    { id: 'billing', label: 'Packages', icon: CreditCard },
    { id: 'operations', label: 'Fleet', icon: Layers },
  ] : activeRole === 'driver' ? [
    { id: 'driver_dashboard', label: 'Duty', icon: Compass },
    { id: 'driver_compliance', label: 'eKYC', icon: ShieldCheck },
    { id: 'driver_earnings', label: 'Wallet', icon: CreditCard },
    { id: 'billing', label: 'Plans', icon: DollarSign },
  ] : [
    { id: 'admin_revenue', label: 'Revenue', icon: DollarSign, badge: 'Core' },
    { id: 'admin_owners', label: 'Owners', icon: Users },
    { id: 'admin_kyc', label: 'KYC', icon: ShieldCheck },
    { id: 'admin_radar', label: 'Radar', icon: Radio },
  ];

  return (
    <div className="bg-canvas-subtle min-h-screen text-text-primary antialiased flex flex-col justify-between">
      
      {/* FIXED PLATFORM HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border-divider shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Logo & Mobile Menu Button */}
            <div className="flex items-center space-x-3 sm:space-x-6 shrink-0">
              {/* Prominent Mobile Menu Hamburger Button */}
              <button
                onClick={() => setShowMobileMenuDrawer(true)}
                className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-xs cursor-pointer min-h-[40px]"
                id="mobile-main-menu-button"
                aria-label="Open full mobile navigation menu"
              >
                <Menu className="w-4 h-4" />
                <span>Menu</span>
              </button>

              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setActiveTab(activeRole === 'owner' ? 'discovery' : activeRole === 'driver' ? 'driver_dashboard' : 'admin_revenue'); 
                }}
                className="flex items-center space-x-2"
                id="platform-logo"
              >
                <img 
                  alt="Drivers Park Brand Logo" 
                  className="h-8 w-auto object-contain" 
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VJc6nZCoYqgXvhXEa77OBMqe8h61Z7SwswNm1ILPzRM-_gydX9kbsA6p1m_C8eSeaDuEM47KJ4MYS66Xj3iyZNU3I8x_kcFqDA8wOB96EK7S0gxCcundR1dgLGwY8RSmVQRx3GiAuZUlodUiMi-fQee3iEp93-iAhWLGJdFRKe0Z_lACttRrXdUALcZOf7I_3JcqAM6pJ9H1I2Qn7hU2Ryc-5HvKYgfl5tK-Fi6ur8wrRleZ5oFzdxHk-2"
                />
                <span className="text-primary tracking-tight font-bold text-base hidden xs:inline-block">Drivers Park</span>
              </a>

              {/* Quick search input (Desktop) */}
              <div className="hidden lg:flex items-center bg-canvas-subtle rounded-full px-3.5 py-1.5 border border-border-divider w-60 xl:w-72">
                <Compass className="w-3.5 h-3.5 text-text-tertiary mr-2 shrink-0" />
                <input 
                  type="text" 
                  placeholder={activeRole === 'admin' ? "Search ledger, owner, or driver..." : "Search verified drivers, machinery..."}
                  className="bg-transparent text-xs text-text-primary focus:outline-none w-full placeholder:text-text-tertiary"
                />
              </div>
            </div>

            {/* Center Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1" id="header-nav-matrix">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-canvas-subtle'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {'badge' in item && item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white text-primary' : 'bg-status-active text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Header controls: Live status, bell, post requirements button, persona switcher */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              
              {/* Role badge in header for mobile & desktop */}
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setShowRoleMobileSheet(true);
                  } else {
                    setShowRoleDropdown(!showRoleDropdown);
                  }
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                  activeRole === 'owner' 
                    ? 'bg-primary/10 text-primary border-primary/20' 
                    : activeRole === 'driver'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                <span>{activeRole === 'owner' ? '🏢 Owner' : activeRole === 'driver' ? '🚗 Driver' : '🛠️ Admin'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-canvas-subtle transition-colors border border-border-divider/50 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title="System Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-urgent rounded-full ring-2 ring-white"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-border-divider p-3 z-50 text-left animate-fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-border-divider">
                      <span className="text-xs font-bold text-text-primary">Fleet Notifications</span>
                      <span className="text-[10px] font-mono-code bg-surface-container text-primary px-1.5 py-0.5 rounded font-bold">3 New</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-2 text-xs">
                      <div className="p-2 rounded-lg bg-surface-container-low border border-border-subtle">
                        <span className="font-bold text-text-primary block text-[11px]">Vikram Singh (HEMM)</span>
                        <span className="text-text-secondary text-[10px]">Cleared Kolar mining quarry shift. Ready for instant dispatch.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-badge-aadhaar-bg/60 border border-badge-aadhaar-border/40">
                        <span className="font-bold text-badge-aadhaar-text block text-[11px]">eKYC Re-verification Approved</span>
                        <span className="text-text-secondary text-[10px]">Ananya Roy UIDAI biometric audit synced successfully.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-canvas-subtle border border-border-subtle">
                        <span className="font-bold text-text-primary block text-[11px]">Platform Commission Deposited</span>
                        <span className="text-text-secondary text-[10px]">₹1,890 platform take-rate settled to escrow node.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Post Requirement Button - Shown for owners on desktop */}
              {activeRole === 'owner' && (
                <button 
                  onClick={onPostRequirement}
                  className="hidden xl:flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
                >
                  Post Requirement
                </button>
              )}

              {/* Profile Selector (Persona dropdown switcher) */}
              <div className="relative">
                <button 
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setShowRoleMobileSheet(true);
                    } else {
                      setShowRoleDropdown(!showRoleDropdown);
                    }
                  }}
                  className="flex items-center space-x-2 pl-2 border-l border-border-divider py-1 select-none cursor-pointer min-h-[44px]"
                  id="persona-switcher-trigger"
                >
                  <img 
                    src={currentRoleAvatar} 
                    alt={currentRoleName} 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-border-divider"
                  />
                  <div className="hidden xl:flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-text-primary flex items-center gap-0.5">
                      {currentRoleName}
                      <ChevronDown className="w-3 h-3 text-text-tertiary" />
                    </span>
                    <span className="text-[10px] text-text-secondary mt-0.5">{currentRoleLabel}</span>
                  </div>
                </button>

                {/* Persona Selector Dropdown Popup (Desktop) */}
                {showRoleDropdown && (
                  <div className="hidden md:block absolute right-0 mt-2.5 w-64 rounded-xl bg-white border border-border-divider shadow-xl py-2 z-50 animate-fade-in text-left">
                    <span className="block px-4 py-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                      Switch Role & Persona
                    </span>
                    
                    <button 
                      onClick={() => handleRoleSelect('owner')}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-canvas-subtle transition-colors cursor-pointer ${
                        activeRole === 'owner' ? 'bg-primary/5 text-primary' : 'text-text-secondary'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">🏢 Rajesh Sharma</span>
                        <span className="text-[10px] text-text-tertiary">Fleet Logistics Ltd • Vehicle Owner</span>
                      </div>
                      {activeRole === 'owner' && <span className="text-[9px] font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text px-1.5 py-0.5 rounded">Active</span>}
                    </button>

                    <button 
                      onClick={() => handleRoleSelect('driver')}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-canvas-subtle transition-colors cursor-pointer ${
                        activeRole === 'driver' ? 'bg-primary/5 text-primary' : 'text-text-secondary'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">🚗 Vikram Singh</span>
                        <span className="text-[10px] text-text-tertiary">HEMM Heavy Excavator Operator</span>
                      </div>
                      {activeRole === 'driver' && <span className="text-[9px] font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text px-1.5 py-0.5 rounded">Active</span>}
                    </button>

                    <button 
                      onClick={() => handleRoleSelect('admin')}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-canvas-subtle transition-colors cursor-pointer ${
                        activeRole === 'admin' ? 'bg-primary/5 text-primary' : 'text-text-secondary'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">🛠️ Platform Super Admin</span>
                        <span className="text-[10px] text-text-tertiary">Commission, Owners, Radar & Escrow</span>
                      </div>
                      {activeRole === 'admin' && <span className="text-[9px] font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text px-1.5 py-0.5 rounded">Active</span>}
                    </button>

                    <div className="border-t border-border-divider mt-2 pt-2 px-2">
                      <button 
                        onClick={() => {
                          setShowRoleDropdown(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-status-urgent hover:bg-status-urgent/10 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Register New Account / Re-verify
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* TOP DYNAMIC RIBBON: PostGIS High Spatial Velocity Zone */}
      <section className="bg-surface-container border-b border-border-divider py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-secondary font-medium truncate">
            <Radio className="w-4 h-4 text-primary shrink-0 animate-pulse" />
            <span className="truncate">
              <strong>PostGIS Live Spatial Radar:</strong> Bengaluru Corridor <span className="font-mono-code bg-white/70 px-1.5 py-0.5 rounded text-primary text-[10px]">(ST_ClusterWithin 4.2km)</span> • <span className="text-status-active font-bold">842 Operators Online</span>
            </span>
            <span className="hidden md:inline text-text-tertiary">| Instant matching for vehicle owners and licensed operators with escrow guarantee.</span>
          </div>
          <div className="flex items-center space-x-3 text-text-tertiary shrink-0 ml-2">
            <span className="font-mono-code text-[11px] flex items-center">
              <span className="w-2 h-2 rounded-full bg-status-active inline-block mr-1.5 animate-ping"></span> Ping: 12ms
            </span>
          </div>
        </div>
      </section>

      {/* Mobile Horizontal Sub-Navigation Bar - ALWAYS VISIBLE ON MOBILE */}
      <div className="md:hidden bg-white border-b border-border-divider px-3 py-2 flex items-center space-x-1.5 overflow-x-auto sticky top-16 z-30 scrollbar-none shadow-2xs">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer min-h-[36px] flex items-center gap-1.5 ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-secondary bg-canvas-subtle hover:bg-surface-container border border-border-subtle'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {'badge' in item && item.badge && (
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white text-primary' : 'bg-status-active text-white'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Content Frame with safe padding for Mobile Bottom Bar */}
      <main className="w-full flex-1 flex flex-col justify-start pb-24 md:pb-8 min-w-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 w-full flex-1 min-w-0">
          {children}
        </div>
      </main>

      {/* MOBILE & TABLET FIXED BOTTOM APP BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border-divider shadow-lg flex items-center justify-around h-16 px-1 safe-area-pb">
        {mobileNavTabs.slice(0, 4).map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 transition-colors relative cursor-pointer ${
                isActive ? 'text-primary font-bold' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="relative">
                <IconComponent className={`w-5 h-5 ${isActive ? 'scale-110 text-primary' : ''}`} />
                {'badge' in tab && tab.badge && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-status-urgent animate-pulse"></span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[64px]">{tab.label}</span>
              {isActive && <span className="w-4 h-0.5 bg-primary rounded-full absolute bottom-1.5"></span>}
            </button>
          );
        })}

        {/* 5th Tab: All Options / Menu button in bottom bar */}
        <button
          onClick={() => setShowMobileMenuDrawer(true)}
          className="flex flex-col items-center justify-center flex-1 h-full min-h-[48px] py-1 text-primary hover:text-primary-hover transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
            <Menu className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold text-primary">
            All Menu
          </span>
        </button>
      </nav>

      {/* FULL MOBILE MENU DRAWER (Fixes mobile visibility issue completely) */}
      {showMobileMenuDrawer && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/60 backdrop-blur-xs animate-fade-in text-left">
          <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl animate-slide-in overflow-y-auto">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-border-divider flex items-center justify-between bg-surface-container/50 sticky top-0 z-10">
              <div className="flex items-center space-x-2">
                <img 
                  alt="Drivers Park Brand Logo" 
                  className="h-7 w-auto object-contain" 
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VJc6nZCoYqgXvhXEa77OBMqe8h61Z7SwswNm1ILPzRM-_gydX9kbsA6p1m_C8eSeaDuEM47KJ4MYS66Xj3iyZNU3I8x_kcFqDA8wOB96EK7S0gxCcundR1dgLGwY8RSmVQRx3GiAuZUlodUiMi-fQee3iEp93-iAhWLGJdFRKe0Z_lACttRrXdUALcZOf7I_3JcqAM6pJ9H1I2Qn7hU2Ryc-5HvKYgfl5tK-Fi6ur8wrRleZ5oFzdxHk-2"
                />
                <div>
                  <span className="font-extrabold text-sm text-primary block leading-tight">Drivers Park</span>
                  <span className="text-[10px] text-text-tertiary">Verified Mobility & Fleet Connect</span>
                </div>
              </div>
              <button
                onClick={() => setShowMobileMenuDrawer(false)}
                className="p-2 rounded-full bg-canvas-subtle hover:bg-surface-container text-text-secondary cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Persona Switcher Block in Drawer */}
            <div className="p-4 border-b border-border-divider bg-canvas-subtle/70 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                Current Operating Role
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleRoleSelect('owner')}
                  className={`py-2 px-1 rounded-lg text-center border text-[11px] font-bold transition-all cursor-pointer ${
                    activeRole === 'owner' 
                      ? 'bg-primary text-white border-primary shadow-xs' 
                      : 'bg-white text-text-secondary border-border-divider'
                  }`}
                >
                  <span className="block text-sm mb-0.5">🏢</span>
                  <span>Owner</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('driver')}
                  className={`py-2 px-1 rounded-lg text-center border text-[11px] font-bold transition-all cursor-pointer ${
                    activeRole === 'driver' 
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' 
                      : 'bg-white text-text-secondary border-border-divider'
                  }`}
                >
                  <span className="block text-sm mb-0.5">🚗</span>
                  <span>Driver</span>
                </button>

                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`py-2 px-1 rounded-lg text-center border text-[11px] font-bold transition-all cursor-pointer ${
                    activeRole === 'admin' 
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
                      : 'bg-white text-text-secondary border-border-divider'
                  }`}
                >
                  <span className="block text-sm mb-0.5">🛠️</span>
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Main Navigation Items List */}
            <div className="flex-1 p-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary px-2 pb-1 block">
                {activeRole === 'owner' ? 'Vehicle Owner & Fleet Menu' : activeRole === 'driver' ? 'Driver & Operator Console' : 'Platform Super Admin Controls'}
              </span>

              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMobileMenuDrawer(false);
                    }}
                    className={`w-full p-3 rounded-xl flex items-start gap-3 text-left transition-colors cursor-pointer min-h-[52px] ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                        : 'hover:bg-canvas-subtle text-text-primary'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isActive ? 'bg-primary text-white' : 'bg-surface-container text-text-secondary'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold truncate">{item.label}</span>
                        {'badge' in item && item.badge && (
                          <span className="text-[9px] font-mono-code font-bold bg-status-urgent text-white px-1.5 py-0.2 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {'desc' in item && (
                        <p className="text-[10px] text-text-secondary truncate mt-0.5">{item.desc}</p>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Admin Direct Quick Access Section (if not already in admin mode) */}
              {activeRole !== 'admin' && (
                <div className="border-t border-border-divider mt-4 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary px-2 pb-1.5 block">
                    Admin Quick Switch
                  </span>
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className="w-full p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 text-amber-900 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                      <div className="text-left">
                        <span className="font-bold text-xs block">Commission & Revenue Admin</span>
                        <span className="text-[10px] text-amber-700">Platform take-rate, owners & escrow control</span>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 -rotate-90 text-amber-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-border-divider bg-surface-container/30 flex flex-col gap-2">
              {activeRole === 'owner' && (
                <button
                  onClick={() => {
                    setShowMobileMenuDrawer(false);
                    onPostRequirement();
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Post Requirement
                </button>
              )}

              <button
                onClick={() => {
                  setShowMobileMenuDrawer(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-2.5 rounded-xl bg-status-urgent/10 hover:bg-status-urgent/20 text-status-urgent text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Switch Account / Logout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MOBILE PERSONA & ROLE SWITCHER BOTTOM SHEET */}
      {showRoleMobileSheet && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div 
            className="bg-white rounded-t-2xl p-5 border-t border-border-divider shadow-2xl flex flex-col gap-4 animate-slide-up max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border-divider">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-text-primary">Select Operating Persona</h3>
              </div>
              <button 
                onClick={() => setShowRoleMobileSheet(false)}
                className="p-1.5 rounded-full bg-canvas-subtle hover:bg-surface-container text-text-secondary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-text-secondary">
              Seamlessly toggle between vehicle fleet owner management, operator duty tracking, or platform compliance super-admin:
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => handleRoleSelect('owner')}
                className={`p-3.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer min-h-[56px] ${
                  activeRole === 'owner' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border-divider bg-canvas-subtle'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                    🏢
                  </div>
                  <div>
                    <span className="font-bold text-xs text-text-primary block">Rajesh Sharma (Fleet Owner)</span>
                    <span className="text-[11px] text-text-secondary">Hire operators, post SOS dispatches, fleet tracking</span>
                  </div>
                </div>
                {activeRole === 'owner' && (
                  <span className="text-[10px] font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text px-2 py-0.5 rounded">Active</span>
                )}
              </button>

              <button
                onClick={() => handleRoleSelect('driver')}
                className={`p-3.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer min-h-[56px] ${
                  activeRole === 'driver' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border-divider bg-canvas-subtle'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base">
                    🚗
                  </div>
                  <div>
                    <span className="font-bold text-xs text-text-primary block">Vikram Singh (HEMM Operator)</span>
                    <span className="text-[11px] text-text-secondary">Duty console, rate card editor, UPI payouts wallet</span>
                  </div>
                </div>
                {activeRole === 'driver' && (
                  <span className="text-[10px] font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text px-2 py-0.5 rounded">Active</span>
                )}
              </button>

              <button
                onClick={() => handleRoleSelect('admin')}
                className={`p-3.5 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer min-h-[56px] ${
                  activeRole === 'admin' ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-600' : 'border-border-divider bg-canvas-subtle'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base">
                    🛠️
                  </div>
                  <div>
                    <span className="font-bold text-xs text-text-primary block">Platform Master Admin</span>
                    <span className="text-[11px] text-text-secondary">Commission revenue, fleet owner approval, escrow release</span>
                  </div>
                </div>
                {activeRole === 'admin' && (
                  <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded">Active</span>
                )}
              </button>
            </div>

            <div className="border-t border-border-divider pt-2 mt-1">
              <button
                onClick={() => {
                  setShowRoleMobileSheet(false);
                  if (onLogout) onLogout();
                }}
                className="w-full py-3 rounded-xl bg-status-urgent/10 hover:bg-status-urgent hover:text-white text-status-urgent font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
              >
                <LogOut className="w-4 h-4" /> Register New Account / Re-verify Phone
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-border-divider py-8 shadow-xs mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <img 
                alt="Drivers Park Brand Logo" 
                className="h-6 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida/AEtjO1VJc6nZCoYqgXvhXEa77OBMqe8h61Z7SwswNm1ILPzRM-_gydX9kbsA6p1m_C8eSeaDuEM47KJ4MYS66Xj3iyZNU3I8x_kcFqDA8wOB96EK7S0gxCcundR1dgLGwY8RSmVQRx3GiAuZUlodUiMi-fQee3iEp93-iAhWLGJdFRKe0Z_lACttRrXdUALcZOf7I_3JcqAM6pJ9H1I2Qn7hU2Ryc-5HvKYgfl5tK-Fi6ur8wrRleZ5oFzdxHk-2"
              />
              <span className="font-extrabold text-sm text-primary tracking-tight">Drivers Park</span>
              <span className="text-xs text-text-tertiary">— Verified Mobility & Fleet Dispatch Operations</span>
            </div>

            <div className="flex items-center gap-5 text-xs text-text-secondary flex-wrap justify-center">
              <span className="text-text-secondary hover:text-primary transition-colors cursor-pointer">UIDAI Verification Protocol</span>
              <span className="text-text-secondary hover:text-primary transition-colors cursor-pointer">Motor Vehicles Act 2019</span>
              <span className="text-text-secondary hover:text-primary transition-colors cursor-pointer">Safety Escrow Guarantee</span>
              <span className="text-text-secondary hover:text-primary transition-colors cursor-pointer">PostGIS Latency SLA</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-tertiary border-t border-border-subtle pt-4">
            <p>© 2026 Drivers Park Technologies India Pvt Ltd. All rights reserved.</p>
            <p className="font-mono-code text-[11px]">PostgreSQL 16 Spatial Extension Enabled (ST_DWithin)</p>
          </div>
        </div>
      </footer>

    </div>
  );
}


