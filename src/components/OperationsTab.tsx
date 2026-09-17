import React, { useState } from 'react';
import { DriverProfile } from '../types';
import { Truck, MapPin, User, ShieldCheck, Key, Check, Plus, AlertCircle, RefreshCw, Layers, Plane, Zap, Info } from 'lucide-react';

interface OperationsTabProps {
  drivers: DriverProfile[];
  onAssignDriver: (driverId: string, vehicleName: string) => void;
}

export default function OperationsTab({ drivers, onAssignDriver }: OperationsTabProps) {
  const [selectedVehicleIdx, setSelectedVehicleIdx] = useState(0);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  
  // Dynamic list of registered vehicles
  const [fleetVehicles, setFleetVehicles] = useState([
    { id: 'v_1', name: "Mahindra XUV700 AX7 Flagship AWD", category: "Indian Vehicle", plate: "KA-03-MR-9921", assignedDriver: "Sunil Patil", status: "In-Transit" },
    { id: 'v_2', name: "Tata Safari Kryotec Luxury ADAS", category: "Indian Vehicle", plate: "KA-51-EF-4820", assignedDriver: "Ananya Roy", status: "In-Transit" },
    { id: 'v_3', name: "HAL Dornier Do-228 Utility Flight", category: "Flight / Aviation", plate: "VT-HAL-2026 (Tail No)", assignedDriver: "Vikram Singh", status: "Immediate Ready" },
    { id: 'v_4', name: "CAT 320D Heavy Earthmoving Excavator", category: "Heavy Machinery", plate: "KA-04-MIN-201", assignedDriver: "None", status: "Idle Standby" },
    { id: 'v_5', name: "Tesla Model S Plaid Luxury Elite", category: "Global Vehicle", plate: "KA-01-TS-7711", assignedDriver: "None", status: "Idle Standby" },
  ]);

  const [assignmentLogs, setAssignmentLogs] = useState<string[]>([
    "Today: Driver Sunil Patil bound to Mahindra XUV700 AX7 (Fleet #1)",
    "Yesterday: Driver Ananya Roy bound to Tata Safari (Fleet #2)",
    "02 Sep: Pilot Vikram Singh bound to HAL Dornier Do-228 Flight (Fleet #3)"
  ]);

  // Catalog of elite global & Indian models available for registration
  const vehicleCatalog = [
    // Indian Vehicles
    { name: "Mahindra XUV700 AX7 Flagship AWD", category: "Indian Vehicle" },
    { name: "Tata Safari Kryotec Luxury ADAS", category: "Indian Vehicle" },
    { name: "Maruti Suzuki Grand Vitara Alpha+ Hybrid", category: "Indian Vehicle" },
    { name: "Ashok Leyland AVTR Multi-Axle Cargo", category: "Indian Vehicle" },
    { name: "Force Citiline Multi-mover Carrier", category: "Indian Vehicle" },
    
    // Industrial Machinery / HEMM
    { name: "JCB 3DX EcoXcellence Backhoe Loader", category: "Heavy Machinery" },
    { name: "CAT 320D Heavy Earthmoving Excavator", category: "Heavy Machinery" },
    { name: "Komatsu PC210 Heavy Mining Excavator", category: "Heavy Machinery" },
    { name: "BharatBenz 3528T Mining Tipper Truck", category: "Heavy Machinery" },
    
    // Aviation Flights
    { name: "HAL Dornier Do-228 Utility Flight", category: "Flight / Aviation" },
    { name: "Airbus A320neo Commercial Liner", category: "Flight / Aviation" },
    { name: "Boeing 737 MAX 8 regional Jetliner", category: "Flight / Aviation" },
    { name: "Cessna 172 Skyhawk Pilot Trainer", category: "Flight / Aviation" },

    // Global Luxury Models
    { name: "Tesla Model S Plaid Luxury Elite", category: "Global Vehicle" },
    { name: "Mercedes-Benz S-Class S500 Chauffeur", category: "Global Vehicle" },
    { name: "Rolls-Royce Ghost Luxury Yacht Suite", category: "Global Vehicle" }
  ];

  // Forms for adding a new vehicle
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicleModel, setNewVehicleModel] = useState(vehicleCatalog[0].name);
  const [newVehiclePlate, setNewVehiclePlate] = useState('');

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId) {
      alert("Please select a verified driver from the operator pool first.");
      return;
    }
    const driverObj = drivers.find(d => d.id === selectedDriverId);
    if (!driverObj) return;

    const vehicle = fleetVehicles[selectedVehicleIdx];
    onAssignDriver(selectedDriverId, vehicle.name);
    
    // Update local vehicle state to show assigned driver
    setFleetVehicles(prev => prev.map((v, idx) => {
      if (idx === selectedVehicleIdx) {
        return { ...v, assignedDriver: driverObj.fullName, status: 'In-Transit' };
      }
      return v;
    }));

    setAssignmentLogs(prev => [
      `Just Now: Bound operator ${driverObj.fullName} to ${vehicle.name} (${vehicle.plate})`,
      ...prev
    ]);
    alert(`Success! Operator ${driverObj.fullName} is now bound to vehicle ${vehicle.name}. Telematic handshake complete.`);
    setSelectedDriverId('');
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehiclePlate) {
      alert("Please provide a license plate or aircraft tail number.");
      return;
    }
    const selectedModelObj = vehicleCatalog.find(v => v.name === newVehicleModel);
    if (!selectedModelObj) return;

    const newAsset = {
      id: `v_${Date.now()}`,
      name: selectedModelObj.name,
      category: selectedModelObj.category,
      plate: newVehiclePlate,
      assignedDriver: 'None',
      status: 'Idle Standby'
    };

    setFleetVehicles(prev => [...prev, newAsset]);
    setAssignmentLogs(prev => [
      `Just Now: Added new ${selectedModelObj.category} [${selectedModelObj.name}] with Plate/Tail No: ${newVehiclePlate}`,
      ...prev
    ]);

    alert(`Successfully registered ${selectedModelObj.name} to your fleet!`);
    setNewVehiclePlate('');
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-col gap-6" id="operations-hub">
      
      {/* Top operational banner */}
      <section className="bg-canvas-base rounded-xl p-6 shadow-sm border border-border-divider">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-2xl text-left">
            <span className="text-[10px] font-mono-code font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase self-start">
              Operations & Fleet Desk
            </span>
            <h1 className="text-xl font-bold text-text-primary">Global Fleet Registry</h1>
            <p className="text-xs text-text-secondary">
              Telemetry binding panel for fleet owners. Manage premium Indian automobiles, heavy mining machinery, and commercial flight assets around the globe.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="h-10 px-4 rounded-xl bg-status-active hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Register New Asset
            </button>
            <div className="bg-canvas-subtle px-4 py-2 rounded-lg flex items-center gap-2.5 border border-border-divider">
              <Layers className="w-5 h-5 text-badge-aadhaar-text" />
              <div className="text-left">
                <span className="text-[9px] text-text-tertiary block font-bold uppercase tracking-wider">Fleet Registry</span>
                <span className="text-xs font-bold text-text-primary font-mono-code">{fleetVehicles.length} Active Assets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic register modal form */}
      {showAddForm && (
        <div className="bg-canvas-base rounded-xl p-5 border-2 border-[#10B981] shadow-md text-left flex flex-col gap-4">
          <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-1.5">
            🛠️ Asset Registration Portal (Indian, Machinery, & Flights Focus)
          </h3>
          <p className="text-xs text-text-secondary">Deploy elite models from the Global Registry with instant telematic transponder linkage.</p>

          <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-secondary">Select Top Model Catalog</label>
              <select
                value={newVehicleModel}
                onChange={(e) => setNewVehicleModel(e.target.value)}
                className="bg-canvas-subtle border border-border-divider rounded-lg p-2.5 text-xs font-bold text-text-primary focus:outline-none"
              >
                {vehicleCatalog.map((v, i) => (
                  <option key={i} value={v.name}>
                    [{v.category}] {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-secondary">Plate / Flight Tail Number</label>
              <input
                type="text"
                required
                placeholder="e.g. KA-03-EM-9921 or VT-IXA"
                value={newVehiclePlate}
                onChange={(e) => setNewVehiclePlate(e.target.value)}
                className="bg-canvas-subtle border border-border-divider rounded-lg p-2.5 text-xs font-mono-code font-bold text-text-primary focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="h-10 px-5 rounded-lg bg-[#0F62FE] hover:bg-[#0043CE] text-white text-xs font-extrabold flex-1 transition-all shadow-sm"
              >
                Deploy Active Asset
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="h-10 px-4 rounded-lg bg-canvas-subtle text-text-secondary border border-border-divider hover:text-text-primary text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Operations Panel Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Fleet Asset Registry */}
        <div className="xl:col-span-7 flex flex-col gap-4 text-left">
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider px-1">Registered Fleet Assets ({fleetVehicles.length} Assets)</span>
          
          <div className="flex flex-col gap-3">
            {fleetVehicles.map((vehicle, idx) => (
              <div 
                key={vehicle.id}
                onClick={() => setSelectedVehicleIdx(idx)}
                className={`bg-canvas-base rounded-xl p-4 shadow-sm border hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  selectedVehicleIdx === idx ? 'border-primary ring-1 ring-primary/40' : 'border-border-divider'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-11 h-11 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 border border-primary/20">
                    {vehicle.category === "Flight / Aviation" ? (
                      <Plane className="w-6 h-6 text-primary" />
                    ) : (
                      <Truck className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 text-left">
                    <span className="text-[9px] font-bold text-text-tertiary uppercase font-mono-code">{vehicle.category}</span>
                    <h4 className="font-extrabold text-sm text-text-primary truncate mt-0.5">{vehicle.name}</h4>
                    <span className="text-[11px] font-mono-code text-text-secondary mt-0.5">{vehicle.plate}</span>
                    <span className="text-[10px] text-text-tertiary mt-1">Assigned Operator: <strong className="text-text-primary font-bold">{vehicle.assignedDriver}</strong></span>
                  </div>
                </div>

                <div className="text-right flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 border-border-divider/50 pt-2.5 sm:pt-0">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    vehicle.status === 'Idle Standby' ? 'bg-amber-100 text-amber-800' : 'bg-badge-aadhaar-bg text-badge-aadhaar-text'
                  }`}>
                    {vehicle.status}
                  </span>
                  <span className="text-[10px] font-mono-code text-text-tertiary">GPS ID: {vehicle.id.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Binder Console */}
        <div className="xl:col-span-5 flex flex-col gap-4 text-left">
          <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-sm text-text-primary flex items-center gap-1.5 border-b border-border-divider pb-3">
              <Key className="w-4.5 h-4.5 text-primary" /> Operator Telemetry Binder
            </h3>

            <div className="p-3 bg-canvas-subtle rounded-lg border border-border-subtle flex flex-col gap-1 text-xs">
              <span className="text-[10px] text-text-tertiary uppercase font-bold">Selected Asset For Binding</span>
              <span className="font-bold text-text-primary">{fleetVehicles[selectedVehicleIdx].name}</span>
              <span className="font-mono-code text-[11px] text-primary">{fleetVehicles[selectedVehicleIdx].plate}</span>
            </div>

            <form onSubmit={handleAssign} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-secondary" htmlFor="operator-select">Select Online Verified Operator</label>
                <select 
                  id="operator-select"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="bg-canvas-subtle border border-border-divider rounded-lg p-2.5 text-xs font-bold text-text-primary focus:outline-none focus:ring-1 focus:ring-primary w-full"
                >
                  <option value="">-- Select Verified Operator --</option>
                  {drivers.filter(d => d.currentStatus === 'online' && d.aadhaarStatus === 'verified').map(d => (
                    <option key={d.id} value={d.id}>
                      {d.fullName} ({d.licenseCategory.join(', ')}) • 4.9★
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-text-tertiary">Only online, Aadhaar-verified operators are available for immediate binding.</span>
              </div>

              <button 
                type="submit"
                className="w-full h-11 rounded-full bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
              >
                <Key className="w-4 h-4" /> Bind Operator to Vehicle
              </button>
            </form>

            {/* Assignment logs */}
            <div className="flex flex-col gap-2 border-t border-border-divider/50 pt-4 mt-2">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">OBD-II Signal Bind Logs</span>
              <div className="flex flex-col gap-1.5 font-mono-code text-[10px] text-text-secondary">
                {assignmentLogs.map((log, index) => (
                  <div key={index} className="p-2 rounded bg-canvas-subtle border border-border-subtle flex justify-between">
                    <span>{log}</span>
                    <span className="text-status-active font-bold shrink-0">✓ LINKED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
