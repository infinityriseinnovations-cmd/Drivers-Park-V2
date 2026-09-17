import React, { useState } from 'react';
import { 
  CheckCircle, Plus, X, ShieldCheck, Car, Truck, Wrench, Plane, Bus, Zap, 
  Sparkles, Save, RotateCcw, Info, Search, Tag, Eye
} from 'lucide-react';
import { DriverProfile, LicenseCategory } from '../types';
import { MASTER_VEHICLE_CATALOG, VehicleModelItem } from '../data';

interface DriverProfileEditorProps {
  driver: DriverProfile;
  onSave: (updatedDriver: DriverProfile) => void;
  onCancel?: () => void;
}

export default function DriverProfileEditor({ driver, onSave, onCancel }: DriverProfileEditorProps) {
  // Personal & Contact Info
  const [fullName, setFullName] = useState(driver.fullName);
  const [phoneNumber, setPhoneNumber] = useState(driver.phoneNumber);
  const [address, setAddress] = useState(driver.location.address);
  const [experienceYears, setExperienceYears] = useState(driver.experienceYears.toString());
  const [dob, setDob] = useState(driver.dob || '1990-05-15');
  const [gender, setGender] = useState(driver.gender || 'Male');

  // Rates
  const [hourlyRate, setHourlyRate] = useState(driver.hourlyRate.toString());
  const [dailyRate, setDailyRate] = useState(driver.dailyRate.toString());

  // Credentials
  const [licenseNumber, setLicenseNumber] = useState(driver.licenseNumber);
  const [badgeNumber, setBadgeNumber] = useState(driver.badgeNumber || '');
  const [medicalFitness, setMedicalFitness] = useState(driver.medicalFitness);
  const [policeClearance, setPoliceClearance] = useState(driver.policeClearance);

  // License Categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(driver.licenseCategory);

  // Qualified Vehicle Models
  const [qualifiedVehicles, setQualifiedVehicles] = useState<string[]>([...driver.qualifiedVehicles]);
  const [customModelInput, setCustomModelInput] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<'all' | 'popular' | 'LMV' | 'HMV' | 'HEMM' | 'Bus' | 'Flight'>('popular');
  const [catalogSearch, setCatalogSearch] = useState('');

  // UI state
  const [showPreview, setShowPreview] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAddVehicle = (vehicleName: string) => {
    const trimmed = vehicleName.trim();
    if (!trimmed) return;
    if (!qualifiedVehicles.some(v => v.toLowerCase() === trimmed.toLowerCase())) {
      setQualifiedVehicles(prev => [...prev, trimmed]);
    }
    setCustomModelInput('');
  };

  const handleRemoveVehicle = (vehicleName: string) => {
    setQualifiedVehicles(prev => prev.filter(v => v !== vehicleName));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DriverProfile = {
      ...driver,
      fullName: fullName.trim() || driver.fullName,
      phoneNumber: phoneNumber.trim() || driver.phoneNumber,
      experienceYears: Number(experienceYears) || driver.experienceYears,
      hourlyRate: Number(hourlyRate) || driver.hourlyRate,
      dailyRate: Number(dailyRate) || driver.dailyRate,
      licenseNumber: licenseNumber.trim() || driver.licenseNumber,
      badgeNumber: badgeNumber.trim() || driver.badgeNumber,
      medicalFitness: medicalFitness.trim() || driver.medicalFitness,
      policeClearance: policeClearance.trim() || driver.policeClearance,
      dob,
      gender,
      location: {
        ...driver.location,
        address: address.trim() || driver.location.address
      },
      licenseCategory: selectedCategories.length > 0 ? (selectedCategories as any) : driver.licenseCategory,
      qualifiedVehicles: qualifiedVehicles.length > 0 ? qualifiedVehicles : driver.qualifiedVehicles
    };

    onSave(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
    }, 4000);
  };

  // Filter catalog items
  const filteredCatalog = MASTER_VEHICLE_CATALOG.filter(item => {
    const matchesCategory = 
      catalogCategoryFilter === 'all' ? true :
      catalogCategoryFilter === 'popular' ? (item.popular === true) :
      item.category === catalogCategoryFilter;

    const matchesQuery = catalogSearch === '' || 
      item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.brand.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(catalogSearch.toLowerCase());

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="bg-canvas-base rounded-2xl border border-border-divider p-6 shadow-sm text-left relative overflow-hidden" id="driver-profile-editor">
      
      {/* Top Banner with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-divider">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">
              <Wrench className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-text-primary">Edit Driver Profile & Vehicle Experience</h2>
              <p className="text-xs text-text-secondary">
                Keep your operator credentials and experienced vehicle models up to date to get matched by fleet & vehicle owners.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="h-9 px-3.5 rounded-lg border border-border-divider text-text-secondary hover:text-text-primary bg-canvas-subtle hover:bg-surface-dim font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-primary" />
            <span>{showPreview ? "Hide Preview" : "Preview Match Card"}</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-9 px-4 rounded-lg border border-border-divider text-text-secondary hover:text-text-primary font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="h-9 px-5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveSuccessNotice && (
        <div className="mt-4 p-4 rounded-xl bg-status-active/10 border border-status-active/30 text-status-active text-xs font-semibold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5 text-status-active shrink-0" />
            <span>Profile and {qualifiedVehicles.length} experienced vehicle models updated successfully! Vehicle owners searching in your PostGIS radius can now find you for exact model matches.</span>
          </div>
          <button onClick={() => setSaveSuccessNotice(false)} className="text-text-tertiary hover:text-text-primary">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Live Match Card Preview Modal / Drawer */}
      {showPreview && (
        <div className="mt-4 p-4 rounded-xl bg-surface-container-low/50 border border-primary/30 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Live Owner Discovery Preview
            </span>
            <span className="text-[10px] bg-badge-aadhaar-bg text-badge-aadhaar-text font-mono-code font-bold px-2 py-0.5 rounded">
              PostGIS Search Radar Simulation
            </span>
          </div>

          <div className="bg-canvas-base p-4 rounded-xl border border-border-divider shadow-xs flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <img src={driver.avatarUrl} alt={fullName} className="w-12 h-12 rounded-full object-cover border border-primary ring-1 ring-primary/20" />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-text-primary">{fullName}</h4>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text">
                    <ShieldCheck className="w-2.5 h-2.5 mr-0.5" /> Aadhaar Verified
                  </span>
                  <span className="text-[10px] font-mono-code bg-badge-category-bg text-badge-category-text px-1.5 py-0.2 rounded font-bold">
                    {badgeNumber || 'BADGE-CERTIFIED'}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  {selectedCategories.join(' & ')} Certified • {experienceYears} Years Exp • {address}
                </p>

                {/* Qualified Vehicles Chips Preview */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-text-tertiary">Experienced Models:</span>
                  {qualifiedVehicles.map((veh, idx) => (
                    <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      ✓ {veh}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-right sm:shrink-0">
              <span className="text-base font-extrabold text-text-primary font-mono-code">₹{Number(dailyRate).toLocaleString()}</span>
              <span className="text-[10px] text-text-tertiary block">Daily Wage</span>
              <span className="text-[10px] font-mono-code text-secondary block font-semibold">₹{hourlyRate}/hr shift</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Fields */}
      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-8">
        
        {/* SECTION 1: Experienced Vehicle Models (PRIMARY FOCUS) */}
        <div className="bg-canvas-subtle rounded-xl p-5 border-2 border-primary/20 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-divider pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Tag className="w-4.5 h-4.5 text-primary" />
                <h3 className="font-bold text-sm text-text-primary">
                  Experienced Vehicle Models & Machinery Catalog
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                  {qualifiedVehicles.length} Models Added
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Vehicle owners search by exact model (e.g. <em>Toyota Innova HyCross, CAT 320D Excavator, Tata Prima 5530.S</em>). Drivers with matched models rank highest in discovery feeds.
              </p>
            </div>
          </div>

          {/* Current Active Tags */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              Currently Listed in Your Profile ({qualifiedVehicles.length})
            </span>
            <div className="flex flex-wrap items-center gap-2 p-3 bg-canvas-base rounded-xl border border-border-divider min-h-[48px]">
              {qualifiedVehicles.length === 0 ? (
                <span className="text-xs text-text-tertiary italic">
                  No vehicle models added yet. Click on suggestions below or type custom models to add them.
                </span>
              ) : (
                qualifiedVehicles.map((vehicle, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/30 hover:border-primary transition-all shadow-2xs group"
                  >
                    <span>{vehicle}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVehicle(vehicle)}
                      className="text-primary/60 hover:text-status-urgent p-0.5 rounded-full hover:bg-status-urgent/10 transition-colors cursor-pointer"
                      title={`Remove ${vehicle}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Custom Model Input */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={customModelInput}
                onChange={(e) => setCustomModelInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddVehicle(customModelInput);
                  }
                }}
                placeholder="Type any other vehicle make/model (e.g. BharatBenz 3528C, Tata Ultra T.7, Komatsu D85, BMW 7-Series)..."
                className="w-full h-10 px-3.5 bg-canvas-base border border-border-divider rounded-lg text-xs font-medium text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddVehicle(customModelInput)}
              disabled={!customModelInput.trim()}
              className="h-10 px-5 w-full sm:w-auto rounded-lg bg-primary disabled:opacity-50 hover:bg-primary/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Model</span>
            </button>
          </div>

          {/* Quick-Add 1-Click Suggestions from Master Catalog */}
          <div className="flex flex-col gap-3 pt-2 border-t border-border-divider/70">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-status-warning" /> 1-Click Quick Add from Industry Master Catalog
              </span>

              {/* Search catalog */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search catalog models..."
                  className="w-full h-7 pl-8 pr-2.5 bg-canvas-base border border-border-divider rounded-md text-[11px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {[
                { id: 'popular', label: '⭐ Top Demanded', icon: Sparkles },
                { id: 'all', label: 'All Catalog', icon: Car },
                { id: 'LMV', label: '🚗 LMV & Executive', icon: Car },
                { id: 'HMV', label: '🚛 Heavy Trucks (HMV)', icon: Truck },
                { id: 'HEMM', label: '🚜 Earthmoving (HEMM)', icon: Wrench },
                { id: 'Bus', label: '🚌 Buses & Transit', icon: Bus },
                { id: 'Flight', label: '✈️ Aviation Flights', icon: Plane }
              ].map(tab => {
                const isSelected = catalogCategoryFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCatalogCategoryFilter(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-primary text-white shadow-2xs' 
                        : 'bg-canvas-base border border-border-divider text-text-secondary hover:text-text-primary hover:bg-surface-dim'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              {filteredCatalog.map((item, idx) => {
                const isAlreadyAdded = qualifiedVehicles.some(v => v.toLowerCase() === item.name.toLowerCase());
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-left flex items-start justify-between gap-2 transition-all ${
                      isAlreadyAdded 
                        ? 'bg-status-active/5 border-status-active/30' 
                        : 'bg-canvas-base border-border-divider hover:border-primary/50 hover:bg-surface-dim/40'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-text-primary truncate">{item.name}</h4>
                        {item.popular && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded shrink-0">
                            High Demand
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-secondary truncate mt-0.5">
                        {item.brand} • {item.description}
                      </p>
                    </div>

                    {isAlreadyAdded ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveVehicle(item.name)}
                        className="h-6 px-2 rounded bg-status-active/10 text-status-active hover:bg-status-urgent/10 hover:text-status-urgent font-bold text-[10px] shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Click to remove from your profile"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Added</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddVehicle(item.name)}
                        className="h-6 px-2 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-[10px] shrink-0 flex items-center gap-0.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: Personal Details & Contact */}
        <div className="bg-canvas-subtle rounded-xl p-5 border border-border-divider flex flex-col gap-4">
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-2 border-b border-border-divider pb-2">
            <ShieldCheck className="w-4.5 h-4.5 text-primary" /> Personal & Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-9 px-3 bg-canvas-base border border-border-divider rounded-lg font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Phone Number (WhatsApp Verified)</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="h-9 px-3 bg-canvas-base border border-border-divider rounded-lg font-mono-code text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Active Commercial Experience (Years)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                required
                className="h-9 px-3 bg-canvas-base border border-border-divider rounded-lg font-bold font-mono-code text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="font-bold text-text-secondary text-[11px]">Operating Base Yard / Stationed Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="h-9 px-3 bg-canvas-base border border-border-divider rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="h-9 px-2 bg-canvas-base border border-border-divider rounded-lg font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: License & Regulatory Accreditation */}
        <div className="bg-canvas-subtle rounded-xl p-5 border border-border-divider flex flex-col gap-4">
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-2 border-b border-border-divider pb-2">
            <ShieldCheck className="w-4.5 h-4.5 text-status-active" /> License Categories & Regulatory Credentials
          </h3>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-text-secondary text-[11px]">Certified License Categories</label>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'LMV', label: 'LMV (Light Motor Vehicles / Chauffeur / SUVs)' },
                { id: 'HMV', label: 'HMV (Heavy Motor Vehicles / Lorries / Multi-Axle)' },
                { id: 'HEMM', label: 'HEMM (Heavy Earthmoving Mining Machinery)' },
                { id: 'PILOT', label: 'PILOT / Aviation Ground Support' },
                { id: 'Bus', label: 'Commercial Passenger Bus / Coach' },
                { id: 'EV', label: 'Electric & ADAS Autonomous Fleet' }
              ].map(cat => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-primary text-white shadow-2xs' 
                        : 'bg-canvas-base border border-border-divider text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs mt-2">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Driving License Number</label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                required
                className="h-9 px-3 bg-canvas-base border border-border-divider rounded-lg font-mono-code font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Badge / Operator ID</label>
              <input
                type="text"
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="e.g. HEMM-MINING-449"
                className="h-9 px-3 bg-canvas-base border border-border-divider rounded-lg font-mono-code font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Medical Fitness Grade</label>
              <input
                type="text"
                value={medicalFitness}
                onChange={(e) => setMedicalFitness(e.target.value)}
                className="h-9 px-3 bg-canvas-base border border-border-divider rounded-lg font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Police Clearance</label>
              <input
                type="text"
                value={policeClearance}
                onChange={(e) => setPoliceClearance(e.target.value)}
                className="h-9 px-3 bg-canvas-base border border-border-divider rounded-lg font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Rate Card & Payout Configuration */}
        <div className="bg-canvas-subtle rounded-xl p-5 border border-border-divider flex flex-col gap-4">
          <h3 className="font-bold text-sm text-text-primary flex items-center gap-2 border-b border-border-divider pb-2">
            <Zap className="w-4.5 h-4.5 text-primary" /> Wage Rates & Payout Card
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Standard Hourly Rate (₹ / hr)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono-code font-bold text-text-tertiary">₹</span>
                <input
                  type="number"
                  min="50"
                  max="10000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  required
                  className="w-full h-9 pl-7 pr-3 bg-canvas-base border border-border-divider rounded-lg font-mono-code font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <span className="text-[10px] text-text-tertiary">Calculated for ad-hoc shift duties and overtime</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-text-secondary text-[11px]">Standard Daily Rate (₹ / 8-hr shift)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono-code font-bold text-text-tertiary">₹</span>
                <input
                  type="number"
                  min="200"
                  max="50000"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  required
                  className="w-full h-9 pl-7 pr-3 bg-canvas-base border border-border-divider rounded-lg font-mono-code font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <span className="text-[10px] text-text-tertiary">Standard wage for full day hiring contracts</span>
            </div>
          </div>
        </div>

        {/* Bottom Submission Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-divider">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="h-10 px-5 rounded-lg border border-border-divider text-text-secondary hover:text-text-primary font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="h-10 px-7 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Profile Updates</span>
          </button>
        </div>

      </form>

    </div>
  );
}
