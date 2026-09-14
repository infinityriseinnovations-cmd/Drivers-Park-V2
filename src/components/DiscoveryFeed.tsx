import React, { useState } from 'react';
import { MOCK_DRIVERS, MOCK_OWNER } from '../data';
import { DriverProfile, LicenseCategory, AvailabilityStatus } from '../types';
import { Search, MapPin, Star, ShieldCheck, Phone, CheckCircle, Sliders, RefreshCw, X, Calendar, MessageSquare, Info } from 'lucide-react';

interface DiscoveryFeedProps {
  onSelectDriver: (driver: DriverProfile) => void;
  selectedDriver: DriverProfile | null;
}

export default function DiscoveryFeed({ onSelectDriver, selectedDriver }: DiscoveryFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState(15);
  const [aadhaarOnly, setAadhaarOnly] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<LicenseCategory[]>(['LMV', 'HMV', 'HEMM']);
  const [selectedStatus, setSelectedStatus] = useState<AvailabilityStatus | 'all'>('all');
  
  // Call modal trigger state
  const [callModalDriver, setCallModalDriver] = useState<DriverProfile | null>(null);

  const toggleCategory = (cat: LicenseCategory) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const resetFilters = () => {
    setRadius(15);
    setAadhaarOnly(true);
    setSelectedCategories(['LMV', 'HMV', 'HEMM']);
    setSelectedStatus('all');
    setSearchQuery('');
  };

  // Dynamically calculate fake distance based on a baseline offset, or filter based on simulated PostGIS rules
  const filteredDrivers = MOCK_DRIVERS.filter(driver => {
    // 1. Category check
    const matchesCategory = driver.licenseCategory.some(cat => selectedCategories.includes(cat)) || 
                            (selectedCategories.includes('PILOT' as any) && driver.licenseCategory.includes('PILOT'));
    
    // 2. Aadhaar verification check
    const matchesAadhaar = !aadhaarOnly || driver.aadhaarStatus === 'verified';
    
    // 3. Availability check
    const matchesStatus = selectedStatus === 'all' || driver.currentStatus === selectedStatus;
    
    // 4. Text search query check
    const matchesSearch = driver.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          driver.qualifiedVehicles.some(v => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          driver.location.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 5. Radius mathematical distance (simulated PostGIS ST_Distance)
    // We map each driver to a logical distance:
    // Rajesh Verma: 2.4km, Vikram Singh: 3.1km, Ananya Roy: 1.1km, Marcus Vance: 4.8km, Sandeep Yadav: 25.4km (outside 15km), Sunil Patil: 1.8km, CyberMotion: 4.8km
    const estimatedDistance = driver.id === 'drv_1' ? 2.4 :
                              driver.id === 'drv_2' ? 3.1 :
                              driver.id === 'drv_3' ? 1.1 :
                              driver.id === 'drv_4' ? 4.8 :
                              driver.id === 'drv_5' ? 25.4 :
                              driver.id === 'drv_6' ? 1.8 : 4.8;

    const matchesRadius = estimatedDistance <= radius;

    return matchesCategory && matchesAadhaar && matchesStatus && matchesSearch && matchesRadius;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start" id="discovery-matrix">
      
      {/* LEFT SIDEBAR: PROFILE & POSTGIS RADAR FILTERS */}
      <aside className="lg:col-span-3 flex flex-col gap-5">
        
        {/* Fleet Owner Profile Widget */}
        <div className="bg-canvas-base rounded-xl p-5 shadow-sm border border-border-divider relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-primary to-secondary"></div>
          <div className="relative pt-6 flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img 
                className="w-16 h-16 rounded-full object-cover shadow-md bg-canvas-base p-0.5"
                src={MOCK_OWNER.avatarUrl} 
                alt={MOCK_OWNER.fullName}
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-status-active rounded-full ring-2 ring-canvas-base"></span>
            </div>
            <h2 className="font-bold text-text-primary text-base">{MOCK_OWNER.fullName}</h2>
            <p className="text-xs text-text-secondary">{MOCK_OWNER.company}</p>
            
            <div className="mt-4 w-full pt-3 flex justify-between items-center text-left bg-canvas-subtle rounded-lg p-2.5 px-3">
              <div>
                <span className="block text-[10px] text-text-tertiary uppercase font-bold tracking-wider">Fleet Assets</span>
                <span className="text-base font-bold text-primary">{MOCK_OWNER.fleetSize} Vehicles</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] text-text-tertiary uppercase font-bold tracking-wider">eKYC Ledger</span>
                <span className="inline-flex items-center text-badge-aadhaar-text text-xs font-bold bg-badge-aadhaar-bg px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 mr-0.5 text-status-active" /> 100% Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spatial Discovery Filter Panel */}
        <div className="bg-canvas-base rounded-xl p-5 shadow-sm border border-border-divider flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" /> Radar Configuration
            </h3>
            <button 
              onClick={resetFilters}
              className="text-xs text-text-tertiary hover:text-primary transition-colors font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Current Geolocation Anchor */}
          <div className="flex flex-col gap-1 bg-canvas-subtle p-3 rounded-lg border border-border-subtle">
            <span className="text-[10px] text-text-tertiary flex items-center gap-1 font-bold uppercase tracking-wider">
              <MapPin className="w-3 h-3 text-status-urgent" /> Active PostGIS Anchor
            </span>
            <span className="text-xs font-semibold text-text-primary truncate">Indiranagar Tech Corridor</span>
            <span className="text-[10px] font-mono-code text-text-tertiary">EPSG:4326 (12.9716° N, 77.5946° E)</span>
          </div>

          {/* ST_DWithin Proximity Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-text-primary" htmlFor="radius-range">Search Proximity</label>
              <span className="text-xs font-mono-code px-2 py-0.5 bg-badge-category-bg text-badge-category-text rounded font-bold">
                {radius} km
              </span>
            </div>
            <input 
              id="radius-range"
              type="range" 
              min="2" 
              max="30" 
              value={radius} 
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono-code text-text-tertiary">
              <span>2 km</span>
              <span>15 km (Default)</span>
              <span>30 km</span>
            </div>
          </div>

          {/* Aadhaar Compliance Switch */}
          <div className="flex items-center justify-between bg-badge-aadhaar-bg/60 p-3 rounded-lg border border-badge-aadhaar-border/40">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-badge-aadhaar-text shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-badge-aadhaar-text leading-tight">Aadhaar KYC Only</span>
                <span className="text-[10px] text-text-secondary">UIDAI Vault verified</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={aadhaarOnly}
                onChange={() => setAadhaarOnly(prev => !prev)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-outline-variant rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-status-active"></div>
            </label>
          </div>

          {/* Vehicle Classification Multi-Select */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">License Authority Pool</span>
            
            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes('LMV')}
                  onChange={() => toggleCategory('LMV')}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-xs text-text-primary font-medium">Light LMV (Cars/SUV)</span>
              </div>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-badge-category-bg text-badge-category-text font-bold">342</span>
            </label>

            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes('HMV')}
                  onChange={() => toggleCategory('HMV')}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-xs text-text-primary font-medium">Commercial HMV (Haulers)</span>
              </div>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-badge-category-bg text-badge-category-text font-bold">188</span>
            </label>

            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes('HEMM')}
                  onChange={() => toggleCategory('HEMM')}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-xs text-text-primary font-medium">Heavy Earthmoving (HEMM)</span>
              </div>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-badge-category-bg text-badge-category-text font-bold">64</span>
            </label>

            <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-canvas-subtle cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes('PILOT' as any)}
                  onChange={() => toggleCategory('PILOT' as any)}
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-xs text-text-primary font-medium">Air & Helicopter Pilot</span>
              </div>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded-full bg-badge-category-bg text-badge-category-text font-bold">8</span>
            </label>
          </div>

          {/* Duty Mode Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Duty Availability</span>
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => setSelectedStatus('all')}
                className={`text-xs text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                  selectedStatus === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-canvas-subtle text-text-secondary'
                }`}
              >
                <span>All Statuses</span>
                <span className="text-[10px] font-mono-code bg-canvas-base/80 border border-border-divider px-1.5 py-0.25 rounded">{MOCK_DRIVERS.length}</span>
              </button>
              <button 
                onClick={() => setSelectedStatus('online')}
                className={`text-xs text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                  selectedStatus === 'online' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-canvas-subtle text-text-secondary'
                }`}
              >
                <span>Online & Ready</span>
                <span className="w-1.5 h-1.5 rounded-full bg-status-active"></span>
              </button>
              <button 
                onClick={() => setSelectedStatus('acting')}
                className={`text-xs text-left px-3 py-2 rounded-lg font-medium flex items-center justify-between ${
                  selectedStatus === 'acting' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-canvas-subtle text-text-secondary'
                }`}
              >
                <span>On Trip</span>
                <span className="w-1.5 h-1.5 rounded-full bg-status-warning"></span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER COLUMN: LIVE DISCOVERY FEED */}
      <main className="lg:col-span-6 flex flex-col gap-4">
        
        {/* Rapid Search Input & Status Ribbon */}
        <div className="bg-canvas-base rounded-xl p-4 shadow-sm border border-border-divider flex flex-col gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search verified drivers, specialized machinery experience..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-canvas-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:bg-canvas-base focus:ring-2 focus:ring-primary border border-border-subtle"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Query Results: <strong>{filteredDrivers.length} verified operators</strong> within <strong>{radius} km</strong></span>
            <span className="flex items-center gap-1 font-mono-code text-[11px]"><RefreshCw className="w-3 h-3 text-status-active animate-spin" /> PostGIS Core Ready</span>
          </div>
        </div>

        {/* Drivers Cards Stream */}
        {filteredDrivers.length === 0 ? (
          <div className="bg-canvas-base rounded-xl p-8 shadow-sm border border-border-divider text-center flex flex-col items-center justify-center gap-2">
            <Info className="w-8 h-8 text-text-tertiary" />
            <h4 className="font-bold text-text-primary text-sm">No Nearby Matches in PostGIS Circle</h4>
            <p className="text-xs text-text-secondary max-w-sm">Try expanding the proximity radius slider or toggle off categories to see more available operators.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredDrivers.map((driver) => {
              // Estimate simulated distance again
              const estimatedDistance = driver.id === 'drv_1' ? 2.4 :
                                        driver.id === 'drv_2' ? 3.1 :
                                        driver.id === 'drv_3' ? 1.1 :
                                        driver.id === 'drv_4' ? 4.8 :
                                        driver.id === 'drv_5' ? 25.4 :
                                        driver.id === 'drv_6' ? 1.8 : 4.8;

              return (
                <article 
                  key={driver.id}
                  onClick={() => onSelectDriver(driver)}
                  className={`bg-canvas-base rounded-xl p-5 shadow-sm hover:shadow-md transition-all border flex flex-col gap-4 cursor-pointer relative ${
                    selectedDriver?.id === driver.id ? 'border-primary ring-1 ring-primary/40' : 'border-border-divider'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <img 
                          src={driver.avatarUrl} 
                          alt={driver.avatarAlt} 
                          className="w-14 h-14 rounded-full object-cover shadow-sm border border-border-divider"
                        />
                        <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-canvas-base ${
                          driver.currentStatus === 'online' ? 'bg-status-active' :
                          driver.currentStatus === 'acting' ? 'bg-status-warning' : 'bg-text-tertiary'
                        }`}></span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-text-primary text-base leading-snug">{driver.fullName}</h3>
                          {driver.aadhaarStatus === 'verified' && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-badge-aadhaar-bg text-badge-aadhaar-text font-bold text-[10px] rounded-full border border-badge-aadhaar-border">
                              <ShieldCheck className="w-3 h-3" /> Aadhaar KYC
                            </span>
                          )}
                          {driver.isAiAgent && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-badge-ai-bg text-badge-ai-text font-bold text-[10px] rounded-full border border-badge-ai-border">
                              🤖 L4 ADS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5 font-medium">{driver.licenseCategory.join(', ')} Specialist • {driver.experienceYears} Years Exp</p>
                        
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap text-text-secondary text-xs">
                          <span className="flex items-center gap-0.5 text-status-warning font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" /> {driver.averageRating}
                            <span className="text-text-tertiary font-normal text-[10px]">({driver.totalReviews})</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 font-semibold text-primary font-mono-code">
                            <MapPin className="w-3.5 h-3.5" /> {estimatedDistance} km away
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rate Indicator */}
                    <div className="text-right shrink-0 bg-canvas-subtle p-2 px-3 rounded-lg border border-border-subtle">
                      <span className="block font-bold text-sm text-primary">₹{driver.dailyRate.toLocaleString()}<span className="text-[10px] text-text-secondary font-normal">/day</span></span>
                      <span className="block text-[10px] font-mono-code text-text-tertiary">₹{driver.hourlyRate}/hr shift</span>
                    </div>
                  </div>

                  {/* Qualified Machinery Badges */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Certified Machines & Vehicles</span>
                    <div className="flex flex-wrap gap-1.5">
                      {driver.qualifiedVehicles.map((v, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-badge-category-bg text-badge-category-text font-bold text-[10px] rounded border border-badge-category-border">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* License Info snippet */}
                  <div className="p-2 px-3 bg-canvas-subtle rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs text-text-secondary">
                    <div className="flex items-center gap-3 flex-wrap font-mono-code text-[11px]">
                      <span>DL: {driver.licenseNumber}</span>
                      <span>•</span>
                      <span className="text-status-active font-semibold">CCTNS Background: Clear</span>
                    </div>
                    <span className="text-badge-aadhaar-text font-bold text-[10px] uppercase">Spot Instant Dispatch</span>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCallModalDriver(driver);
                        }}
                        className="h-9 px-4 rounded-full bg-primary-container text-on-primary text-xs font-bold hover:bg-primary transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" /> Direct Call / WhatsApp
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDriver(driver);
                        }}
                        className="h-9 px-3 rounded-full bg-canvas-subtle hover:bg-surface-container text-text-primary text-xs font-bold transition-all border border-border-subtle"
                      >
                        Inspect Docket
                      </button>
                    </div>
                    <span className="text-[11px] font-mono-code text-text-tertiary">UMN: {driver.id.toUpperCase()}_ACT</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* RIGHT RAIL: POSTGIS VISUALIZER MAP & LEGEND */}
      <aside className="lg:col-span-3 flex flex-col gap-5">
        <div className="bg-canvas-base rounded-xl p-5 shadow-sm border border-border-divider flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Active PostGIS Radar
            </h3>
            <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-badge-category-bg text-badge-category-text font-bold">ST_DWithin</span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Live geographic rendering of verified operators near Indiranagar corridor computed via PostgreSQL 16 PostGIS spatial index.
          </p>

          {/* Interactive Simulated Map */}
          <div className="relative w-full h-56 rounded-xl overflow-hidden border border-border-divider bg-surface-dim">
            <div 
              className="w-full h-full bg-cover bg-center transition-all duration-300"
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7jsLsbJEuCT4jdNmw0k3LHpIN1x-pbj5L3vHYxUAiSMlEvkAohQvKZtskTSdn2d2CF9q-CJ42TYDjRjk2BphX3N7aZwJXf4FYzLNt2iLN6cJrSI3qW5tQF61xC9S2Cd3KeAVHtTEs2F6I5FviEBBa05mKFzS1CWzFJc_6d5Q4iS8bXQ6sOqmqUjQQ0tf3uwI0lAaONqvk6ahIbc8vd_MUeCWtVJLmY1O1xX7SkVTDIkW9TzYC0wayqA')` }}
            ></div>

            {/* Simulated Concentric Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full border border-primary/20 bg-primary/5 animate-pulse"></div>
              <div className="w-28 h-28 rounded-full border border-primary/30 bg-primary/10 absolute"></div>
              <div className="w-3 h-3 bg-status-urgent rounded-full absolute shadow-md ring-4 ring-status-urgent/30"></div>
            </div>

            {/* Dynamic Map Pins */}
            {filteredDrivers.map((driver, index) => {
              // Plot markers based on simulated coordinates
              const offsets = [
                { top: '25%', left: '30%' },
                { top: '40%', left: '70%' },
                { top: '75%', left: '45%' },
                { top: '50%', left: '20%' },
                { top: '80%', left: '80%' },
                { top: '15%', left: '60%' },
                { top: '60%', left: '75%' },
              ];
              const pos = offsets[index % offsets.length];

              return (
                <div 
                  key={driver.id}
                  onClick={() => onSelectDriver(driver)}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                >
                  <div className="relative">
                    <span className={`w-7 h-7 rounded-full text-white flex items-center justify-center shadow-lg ring-2 ring-canvas-base hover:scale-115 transition-all ${
                      driver.licenseCategory.includes('HEMM') ? 'bg-primary' : 
                      driver.isAiAgent ? 'bg-badge-ai-text' : 'bg-status-active'
                    }`}>
                      <span className="text-[10px] font-bold">
                        {driver.licenseCategory.includes('HEMM') ? '🚜' : 
                         driver.isAiAgent ? '🤖' : '🚗'}
                      </span>
                    </span>
                    <span className="absolute -top-7 hidden group-hover:block bg-text-primary text-text-inverted font-mono-code text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-20">
                      {driver.fullName}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code text-text-secondary border-t border-border-divider pt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span>
              <span>HEMM Heavy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-status-active shrink-0"></span>
              <span>LMV/HMV Shift</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-badge-ai-text shrink-0"></span>
              <span>ADS Tele-Op</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-status-urgent shrink-0"></span>
              <span>Your Depot</span>
            </div>
          </div>
        </div>

        {/* Hotspots Panel */}
        <div className="bg-canvas-base rounded-xl p-5 shadow-sm border border-border-divider flex flex-col gap-3">
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-urgent animate-ping shrink-0"></span> Urgent Hotspots
          </h3>
          <div className="flex flex-col gap-2 mt-1">
            <div className="p-2.5 rounded-lg bg-canvas-subtle hover:bg-surface-container border border-border-subtle transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-primary">Volvo B11R Multi-Axle</span>
                <span className="text-[10px] font-bold text-status-urgent">₹2,800/shift</span>
              </div>
              <span className="block text-[10px] text-text-secondary mt-0.5">Majestic Terminal • Needed in 45m</span>
            </div>
            <div className="p-2.5 rounded-lg bg-canvas-subtle hover:bg-surface-container border border-border-subtle transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-primary">JCB 432ZX Loader</span>
                <span className="text-[10px] font-bold text-primary">₹1,800/shift</span>
              </div>
              <span className="block text-[10px] text-text-secondary mt-0.5">Peenya Industrial Area • Mining Shift</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RAZORPAY CALL MODAL */}
      {callModalDriver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-canvas-base rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 border border-border-divider">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-status-active">
                <Phone className="w-5 h-5 fill-current" />
                <span className="font-bold text-sm text-text-primary">Call Operator Directly</span>
              </div>
              <button 
                onClick={() => setCallModalDriver(null)}
                className="text-text-tertiary hover:text-text-primary p-1 rounded-full hover:bg-canvas-subtle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-canvas-subtle flex flex-col gap-2 text-center border border-border-subtle">
              <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">Unmasked Contact Authorization</span>
              <span className="font-bold text-lg text-text-primary">{callModalDriver.fullName}</span>
              <span className="font-mono-code text-xl text-primary font-bold tracking-wide">{callModalDriver.phoneNumber}</span>
              <span className="inline-flex items-center justify-center gap-1 text-badge-aadhaar-text font-bold text-xs mt-1">
                <CheckCircle className="w-3.5 h-3.5" /> UIDAI Aadhaar Cleared • KYC Token Active
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <a 
                href={`tel:${callModalDriver.phoneNumber.replace(/\s+/g, '')}`}
                className="w-full h-11 rounded-full bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" /> Open Cellular Dialer
              </a>
              <a 
                href={`https://wa.me/${callModalDriver.phoneNumber.replace(/\D+/g, '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full h-11 rounded-full bg-badge-aadhaar-bg text-badge-aadhaar-text font-bold text-xs flex items-center justify-center gap-2 hover:bg-badge-aadhaar-border transition-all border border-badge-aadhaar-border"
              >
                <MessageSquare className="w-4 h-4" /> Open WhatsApp Dispatch
              </a>
            </div>

            <p className="text-[10px] text-text-tertiary text-center leading-normal mt-1">
              *Razorpay Enterprise Fleet Owner Pass: 0 commissions applied. Call logged for security protocol under the Motor Vehicles Act 2019.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
