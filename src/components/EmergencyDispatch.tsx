import React, { useState } from 'react';
import { MOCK_DISPATCHES, MOCK_DRIVERS } from '../data';
import { EmergencyDispatch as DispatchType, DriverProfile } from '../types';
import { Radio, MapPin, Truck, ShieldCheck, Zap, Phone, AlertOctagon, Terminal, RefreshCw, Check, Key } from 'lucide-react';

export default function EmergencyDispatch() {
  const [dispatches, setDispatches] = useState<DispatchType[]>(MOCK_DISPATCHES);
  const [broadcastingId, setBroadcastingId] = useState<string | null>(null);
  const [payoutInput, setPayoutInput] = useState('1700');
  
  // Custom action logger terminal simulated
  const [logs, setLogs] = useState<string[]>([
    "19:42:01 [SMS Gateway] Dispatched fast-broadcast payload to 48 LMV/HMV operators.",
    "19:42:15 [WhatsApp] Direct CTA interactive message accepted by +91 98450-XXXXX.",
    "19:44:03 [Audit] Driver Ramesh Kumar PIN generation request validated (UIDAI Auth 200).",
    "19:45:20 [GPS Ping] OBD-II telemetry live on Vehicle #KA-05-NN-4411 (Lat: 12.9716, Lng: 77.5946)."
  ]);

  const addLog = (text: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`${time} ${text}`, ...prev]);
  };

  const handleBroadcast = () => {
    setBroadcastingId('broadcasting');
    addLog(`[Broadcast] Initiating low-latency search circle: ST_DWithin(geom, 8000m)`);
    
    setTimeout(() => {
      setBroadcastingId(null);
      addLog(`[Gateway] Push payload successfully delivered to 48 off-duty drivers via Twilio.`);
      
      // Upgrade first draft to active if found
      setDispatches(prev => prev.map(d => {
        if (d.id === 'DP-8924') {
          return {
            ...d,
            payout: Number(payoutInput),
            status: 'broadcasting' as any
          };
        }
        return d;
      }));
    }, 1500);
  };

  const acceptDriver = (dispatchId: string, driver: DriverProfile) => {
    setDispatches(prev => prev.map(d => {
      if (d.id === dispatchId) {
        return {
          ...d,
          status: 'active' as any,
          assignedDriver: driver,
          eta: '12 mins'
        };
      }
      return d;
    }));
    addLog(`[Dispatch] Operator ${driver.fullName} assigned to dispatch ${dispatchId}. Transaction Pin Generated.`);
  };

  return (
    <div className="flex flex-col gap-6" id="dispatch-matrix">
      
      {/* Top Urgent Dispatch Hero Panel */}
      <section className="relative overflow-hidden rounded-xl bg-canvas-base shadow-sm p-6 md:p-8 border border-border-divider">
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-error/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-72 h-72 rounded-full bg-primary/5 blur-2xl pointer-events-none"></div>
        
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-on-error-container">
                <span className="w-2.5 h-2.5 rounded-full bg-status-urgent animate-ping"></span>
                <span className="font-bold text-xs uppercase tracking-wider">Priority SOS Channel</span>
              </div>
              <span className="font-mono-code text-[11px] text-text-secondary">POSTGIS RADIUS: 8.0 KM [ST_DWithin active]</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-status-active"></span>
              <span className="text-xs text-status-active font-semibold">Active Standby Dispatch Desk</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
            
            {/* Vehicle Fleet Select */}
            <div className="lg:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-secondary flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-primary" /> Standby Asset / Vehicle
              </label>
              <div className="relative bg-surface-container-low rounded-lg p-3 flex items-center justify-between border border-border-divider shadow-inner">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-text-primary truncate">Tata Prima 4028 HMV</span>
                    <span className="font-mono-code text-[10px] text-text-tertiary">#KA-01-MJ-9281 • Heavy Hauler</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Points */}
            <div className="lg:col-span-5 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-secondary flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-status-urgent" /> Route Coordinates (PostGIS Polygons)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-surface-container-low rounded-lg px-3 py-2 flex items-center gap-2 border border-border-divider shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-status-active"></span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-text-tertiary uppercase font-bold">Origin</span>
                    <span className="text-xs text-text-primary font-bold truncate">Indiranagar Depot #4</span>
                  </div>
                </div>
                <div className="bg-surface-container-low rounded-lg px-3 py-2 flex items-center gap-2 border border-border-divider shadow-inner">
                  <span className="w-2 h-2 rounded-full bg-status-urgent"></span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] text-text-tertiary uppercase font-bold">Destination</span>
                    <span className="text-xs text-text-primary font-bold truncate">Electronic City Logistics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Spot Payout Rate */}
            <div className="lg:col-span-3 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-secondary flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-status-warning" /> Spot Rate & surge
              </label>
              <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between border border-border-divider shadow-inner">
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-base font-bold text-text-primary">₹</span>
                    <input 
                      type="number" 
                      value={payoutInput}
                      onChange={(e) => setPayoutInput(e.target.value)}
                      className="w-16 font-bold text-base text-text-primary bg-transparent focus:outline-none focus:ring-1 focus:ring-primary/20"
                    />
                    <span className="text-[10px] text-text-tertiary font-normal">/shift</span>
                  </div>
                  <span className="text-[10px] text-badge-aadhaar-text font-bold">+₹200 Surge Active</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-badge-category-bg font-mono-code text-[10px] text-badge-category-text font-bold">T+45m</span>
              </div>
            </div>

          </div>

          {/* Action Trigger Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border-divider/50">
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              <Radio className="w-4 h-4 text-badge-ai-text shrink-0" />
              <span>Spatial Mesh: <strong>Indiranagar Sector 2</strong> • 48 matching drivers found</span>
            </div>
            
            <button
              onClick={handleBroadcast}
              disabled={!!broadcastingId}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-status-urgent text-white hover:bg-red-700 transition-all shadow-md flex items-center justify-center gap-2 font-bold text-xs"
            >
              {broadcastingId ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transmitting ST_DWithin Proximity Radar...</span>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Broadcast to 48 Nearby Off-Duty Drivers</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Active Stream */}
        <div className="xl:col-span-7 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-text-primary">Live Incident Dispatch Board</span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-mono-code font-bold">{dispatches.length} Total</span>
            </div>
            <span className="text-[10px] text-text-tertiary flex items-center gap-1 font-mono-code"><RefreshCw className="w-3 h-3 text-status-active" /> Realtime Sync Active</span>
          </div>

          <div className="flex flex-col gap-4">
            {dispatches.map((disp) => (
              <article key={disp.id} className="bg-canvas-base rounded-xl border border-border-divider shadow-sm overflow-hidden flex flex-col">
                {/* Heading Bar */}
                <div className="p-4 bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-divider">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-mono-code text-[11px] font-bold">
                      {disp.id}
                    </span>
                    <h3 className="font-bold text-sm text-text-primary leading-tight">{disp.title}</h3>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    disp.status === 'broadcasting' ? 'bg-error-container text-on-error-container animate-pulse' :
                    disp.status === 'active' ? 'bg-badge-aadhaar-bg text-badge-aadhaar-text' : 'bg-canvas-subtle text-text-secondary'
                  }`}>
                    {disp.status === 'broadcasting' ? '📡 Active Broadcast' : '🟢 Dispatched & In-Transit'}
                  </span>
                </div>

                <div className="p-4 flex flex-col gap-4">
                  
                  {/* Mission Details Metadata Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-canvas-subtle p-3 rounded-lg border border-border-subtle text-xs">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-tertiary uppercase font-bold">Quarry Location</span>
                      <span className="font-bold text-text-primary mt-0.5 truncate">{disp.origin}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-tertiary uppercase font-bold">Asset Class</span>
                      <span className="font-bold text-text-primary mt-0.5 truncate">{disp.vehicle}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-tertiary uppercase font-bold">Surge Payout</span>
                      <span className="font-bold text-badge-aadhaar-text mt-0.5">₹{disp.payout.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-tertiary uppercase font-bold">Trigger Window</span>
                      <span className="font-mono-code text-text-secondary mt-0.5">{disp.timestamp}</span>
                    </div>
                  </div>

                  {/* If broadcasting, display responding driver pool */}
                  {disp.status === 'broadcasting' && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-badge-aadhaar-text bg-badge-aadhaar-bg/60 p-2.5 rounded-lg border border-badge-aadhaar-border/30">
                        <AlertOctagon className="w-4 h-4 shrink-0" />
                        <span><strong>{disp.respondingDrivers.length} verified drivers responded</strong>. Accept to generate dispatch PIN code.</span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {disp.respondingDrivers.map((resp) => (
                          <div key={resp.id} className="p-3 bg-surface-container-low rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-border-divider/50 hover:bg-surface-container transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={resp.avatarUrl} alt={resp.fullName} className="w-10 h-10 rounded-full object-cover shrink-0 border border-border-divider" />
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs text-text-primary">{resp.fullName}</span>
                                  <span className="px-1.5 py-0.25 bg-badge-aadhaar-bg text-badge-aadhaar-text text-[9px] rounded font-bold">Aadhaar KYC</span>
                                </div>
                                <span className="text-[10px] text-text-secondary font-mono-code">DL: {resp.licenseNumber} • {resp.experienceYears} Years Exp • 4.9★</span>
                              </div>
                            </div>

                            <button
                              onClick={() => acceptDriver(disp.id, resp)}
                              className="w-full md:w-auto h-8 px-4 rounded-full bg-primary-container text-on-primary font-bold text-[11px] hover:bg-primary transition-all flex items-center justify-center gap-1 shadow-sm"
                            >
                              <Key className="w-3 h-3" />
                              <span>Dispatch & PIN</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* If active, display assigned driver with simulated HUD telemetry */}
                  {disp.status === 'active' && disp.assignedDriver && (
                    <div className="flex flex-col gap-4 border-t border-border-divider/50 pt-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={disp.assignedDriver.avatarUrl} alt={disp.assignedDriver.fullName} className="w-11 h-11 rounded-full object-cover border border-border-divider" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-text-primary">{disp.assignedDriver.fullName}</span>
                              <span className="px-1.5 py-0.25 bg-badge-category-bg text-badge-category-text text-[9px] rounded font-bold font-mono-code">ACTIVE SHIFT</span>
                            </div>
                            <span className="text-[11px] text-text-secondary block">Assigned to: {disp.vehicle}</span>
                          </div>
                        </div>

                        {/* Real-time Telemetry Values */}
                        <div className="flex items-center gap-4 bg-canvas-subtle px-4 py-2 rounded-lg border border-border-subtle w-full sm:w-auto justify-around">
                          <div className="flex flex-col text-center">
                            <span className="text-[9px] font-mono-code text-text-tertiary">GPS SPEED</span>
                            <span className="text-sm font-bold text-text-primary">42 <span className="text-[10px] font-normal text-text-secondary">km/h</span></span>
                          </div>
                          <div className="w-px h-6 bg-border-divider"></div>
                          <div className="flex flex-col text-center">
                            <span className="text-[9px] font-mono-code text-text-tertiary">ETA PROXIMITY</span>
                            <span className="text-sm font-bold text-status-active">8 mins</span>
                          </div>
                          <div className="flex flex-col text-center">
                            <span className="text-[9px] font-mono-code text-text-tertiary">ODOMETER</span>
                            <span className="text-sm font-bold text-text-primary">3.4 <span className="text-[10px] font-normal text-text-secondary">km</span></span>
                          </div>
                        </div>
                      </div>

                      {/* Animated Progress Tracker Route Line */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] text-text-secondary font-medium">
                          <span>Origin: {disp.origin}</span>
                          <span className="text-badge-category-text font-bold">Destination: {disp.destination}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                          <div className="h-full bg-primary rounded-full w-2/3 transition-all duration-1000"></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-text-secondary flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 font-mono-code">
                          <span>DISPATCH PIN: <strong className="text-text-primary tracking-widest text-xs">7729-ACT</strong></span>
                          <span>•</span>
                          <span className="text-status-active flex items-center gap-0.5"><span className="w-1.5 h-1.5 rounded-full bg-status-active animate-ping"></span> OBD-II Connected</span>
                        </div>
                        <span className="text-text-tertiary">UMN Token: {disp.assignedDriver.id.toUpperCase()}_DISP</span>
                      </div>
                    </div>
                  )}

                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right column: Notification Logs Terminal */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          <div className="bg-canvas-base rounded-xl border border-border-divider shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-badge-ai-text" />
                <h3 className="font-bold text-sm text-text-primary">Telemetry Server Logs</h3>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 bg-badge-ai-bg text-badge-ai-text rounded font-bold">Supabase Webhooks</span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Real-time cellular dispatch logs generated during driver matching, SMS delivery, and vehicle OBD telemetry signals.
            </p>

            {/* Simulated Live Console */}
            <div className="bg-slate-950 text-slate-300 rounded-lg p-4 font-mono-code text-[11px] h-64 overflow-y-auto flex flex-col gap-2 border border-slate-900 shadow-inner">
              {logs.map((log, idx) => (
                <div key={idx} className="flex gap-2 text-left leading-normal">
                  <span className="text-status-active font-bold shrink-0">{log.substring(0, 8)}</span>
                  <span className="text-slate-400 shrink-0">{log.substring(9, log.indexOf(']') + 1)}</span>
                  <span className="text-slate-200 truncate">{log.substring(log.indexOf(']') + 2)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center border-t border-border-divider pt-4">
              <div className="bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle">
                <span className="text-[10px] text-text-tertiary block font-bold">Broadcast SLA</span>
                <span className="text-base font-bold text-badge-aadhaar-text">99.4%</span>
              </div>
              <div className="bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle">
                <span className="text-[10px] text-text-tertiary block font-bold">Mean Response</span>
                <span className="text-base font-bold text-text-primary">3.2m</span>
              </div>
              <div className="bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle">
                <span className="text-[10px] text-text-tertiary block font-bold">Accept Ratio</span>
                <span className="text-base font-bold text-badge-category-text">88.2%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
