import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, MapPin, Database, Users, AlertTriangle, Check, X, RefreshCw, Terminal, 
  ArrowUpRight, Award, Key, Radio, Info, Eye, Download, Play, AlertCircle, FileText, 
  CheckCircle, Smartphone, Car, Truck, Compass, DollarSign, Zap, Phone, Lock, Filter, 
  Send, ChevronRight, Activity, Sliders, ExternalLink, Layers, Copy, ShieldAlert, 
  Cpu, Navigation, Clock, CheckCircle2, ChevronDown
} from 'lucide-react';
import { DriverProfile, EmergencyDispatch, OwnerProfile, MatchBooking } from '../types';
import { supabase, testSupabaseConnection } from '../lib/supabase';
import { MOCK_OWNERS, MOCK_MATCH_BOOKINGS } from '../data';

interface AdminDashboardProps {
  drivers: DriverProfile[];
  dispatches: EmergencyDispatch[];
  initialSubTab?: 'revenue' | 'owners' | 'kyc' | 'telematics' | 'dispatches' | 'payouts' | 'database';
  onApproveDriver: (driverId: string) => void;
  onRejectDriver: (driverId: string) => void;
  onRefreshData: () => void;
}

interface IncidentItem {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium';
  location: string;
  vehicleType: string;
  reportedTime: string;
  status: 'active' | 'investigating' | 'resolved';
  driverAssigned?: string;
  ownerName: string;
  description: string;
}

interface PayoutRecord {
  id: string;
  driverId: string;
  driverName: string;
  vpa: string;
  amount: number;
  status: 'SETTLED' | 'PROCESSING' | 'QUEUED';
  timestamp: string;
  utrNumber: string;
  tripId: string;
}

export default function AdminDashboard({ 
  drivers, 
  dispatches, 
  initialSubTab = 'kyc',
  onApproveDriver, 
  onRejectDriver, 
  onRefreshData 
}: AdminDashboardProps) {
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [selectedSubTab, setSelectedSubTab] = useState<'revenue' | 'owners' | 'kyc' | 'telematics' | 'dispatches' | 'payouts' | 'database'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setSelectedSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Vehicle Owners & Transporters Control State
  const [ownersList, setOwnersList] = useState<OwnerProfile[]>(MOCK_OWNERS);
  const [ownerFilter, setOwnerFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');
  const [inspectingOwner, setInspectingOwner] = useState<OwnerProfile | null>(null);
  const [editingCommissionOwnerId, setEditingCommissionOwnerId] = useState<string | null>(null);
  const [tempCommissionRate, setTempCommissionRate] = useState<number>(3.0);

  // Platform Commission & Revenue Master State (The Most Critical Option)
  const [platformOwnerTakeRate, setPlatformOwnerTakeRate] = useState<number>(3.0); // % fee charged to fleet owners
  const [platformDriverTakeRate, setPlatformDriverTakeRate] = useState<number>(5.0); // % fee charged to standard drivers
  const [sosSurgeMultiplier, setSosSurgeMultiplier] = useState<number>(1.25); // emergency dispatch multiplier
  const [matchLedger, setMatchLedger] = useState<MatchBooking[]>(MOCK_MATCH_BOOKINGS);
  const [ledgerSearch, setLedgerSearch] = useState<string>('');
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'held' | 'released' | 'active'>('all');
  
  // Inspection Modal state for Deep Document Review
  const [inspectingDriver, setInspectingDriver] = useState<DriverProfile | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<'aadhaar' | 'dl' | 'medical' | 'cctns'>('dl');
  const [auditRemark, setAuditRemark] = useState('');
  const [auditActionFeedback, setAuditActionFeedback] = useState<string | null>(null);

  // Telematics & Radar State
  const [selectedRadarDriver, setSelectedRadarDriver] = useState<DriverProfile | null>(drivers[0] || null);
  const [telematicsCategoryFilter, setTelematicsCategoryFilter] = useState<string>('all');
  const [simulatedPing, setSimulatedPing] = useState(14);

  // Payouts Ledger State
  const [payoutsBatchRunning, setPayoutsBatchRunning] = useState(false);
  const [payoutsList, setPayoutsList] = useState<PayoutRecord[]>([
    {
      id: "PO-2026-901",
      driverId: "drv_2",
      driverName: "Vikram Singh",
      vpa: "vikram.singh@okaxis",
      amount: 4800,
      status: "SETTLED",
      timestamp: "Today, 11:42 AM",
      utrNumber: "UPI-AXIS-992104881",
      tripId: "DISP-SOS-774"
    },
    {
      id: "PO-2026-902",
      driverId: "drv_3",
      driverName: "Ananya Roy",
      vpa: "ananya.roy@okhdfc",
      amount: 3200,
      status: "SETTLED",
      timestamp: "Today, 10:15 AM",
      utrNumber: "UPI-HDFC-339108422",
      tripId: "DISP-VIP-881"
    },
    {
      id: "PO-2026-903",
      driverId: "drv_1",
      driverName: "Rajesh Verma",
      vpa: "rajesh.verma@sbi",
      amount: 2200,
      status: "QUEUED",
      timestamp: "Today, 01:05 PM",
      utrNumber: "PENDING_EXECUTION",
      tripId: "DISP-HMV-302"
    },
    {
      id: "PO-2026-904",
      driverId: "drv_6",
      driverName: "Sunil Patil",
      vpa: "sunil.patil@icici",
      amount: 1700,
      status: "QUEUED",
      timestamp: "Today, 01:20 PM",
      utrNumber: "PENDING_EXECUTION",
      tripId: "DISP-LMV-551"
    }
  ]);

  // Incidents list
  const [incidents, setIncidents] = useState<IncidentItem[]>([
    {
      id: "INC-889",
      title: "Caterpillar 320D Hydraulic Pressure Drop",
      severity: "critical",
      location: "Peenya Industrial Area, Gate 4",
      vehicleType: "CAT 320D Excavator",
      reportedTime: "8 mins ago",
      status: "active",
      ownerName: "Rajesh Sharma (Fleet Logistics)",
      description: "Operator Vikram Singh detected sudden hydraulic line fluctuation. Requires master technician inspection or immediate standby operator switch."
    },
    {
      id: "INC-890",
      title: "Chauffeur Flight Delay Runway Diversion",
      severity: "medium",
      location: "KIA Devanahalli VIP Terminal 2",
      vehicleType: "Mercedes-Benz E-Class",
      reportedTime: "24 mins ago",
      status: "investigating",
      driverAssigned: "Ananya Roy",
      ownerName: "Prestige Corporate Travels",
      description: "Inbound private charter diverted to Terminal 2 apron. Chauffeur route modified via PostGIS spatial corridor."
    }
  ]);

  // SQL Studio state
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT id, full_name, aadhaar_status, hourly_rate, rating FROM drivers ORDER BY rating DESC LIMIT 5;");
  const [sqlResultRows, setSqlResultRows] = useState<any[]>([]);
  const [sqlExecuting, setSqlExecuting] = useState(false);
  const [sqlExecTime, setSqlExecTime] = useState<number | null>(null);

  const [queryConsoleLogs, setQueryConsoleLogs] = useState<string[]>([
    "INIT: Connecting to PostgreSQL 16 schema client (PostGIS 3.4 enabled)...",
    "AUTH: JWT Token handshake accepted for system_admin role.",
    "SYNC: 4 tables detected (drivers, dispatches, invoices, spatial_telematics)."
  ]);

  const [kycFilter, setKycFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');

  // Active KYC list based on state and filter
  const activeKycRequests = drivers.filter(d => {
    if (kycFilter === 'all') return true;
    if (kycFilter === 'pending') return d.aadhaarStatus === 'pending';
    if (kycFilter === 'verified') return d.aadhaarStatus === 'verified';
    if (kycFilter === 'rejected') return d.aadhaarStatus === 'rejected';
    return true;
  });

  const runConnectionTest = async () => {
    setTestingConnection(true);
    const start = Date.now();
    try {
      const isOk = await testSupabaseConnection();
      const end = Date.now();
      const timeMs = end - start;
      setLatency(timeMs);
      setDbConnected(isOk);
      setQueryConsoleLogs(prev => [
        `[${new Date().toLocaleTimeString()}] SELECT COUNT(*) FROM drivers; => Latency: ${timeMs}ms • 200 OK`,
        `[${new Date().toLocaleTimeString()}] POSTGIS HEALTH: ST_ClusterWithin() spatial engine online.`,
        ...prev
      ]);
    } catch (err) {
      setDbConnected(false);
      setQueryConsoleLogs(prev => [
        `[${new Date().toLocaleTimeString()}] CONNECTION NOTICE: Local cached telemetry active.`,
        ...prev
      ]);
    } finally {
      setTestingConnection(false);
    }
  };

  useEffect(() => {
    runConnectionTest();
    executePredefinedSql("SELECT id, full_name, aadhaar_status, hourly_rate, rating FROM drivers ORDER BY rating DESC LIMIT 5;");
  }, []);

  const handleApprove = (id: string) => {
    onApproveDriver(id);
    setAuditActionFeedback(`Driver #${id} approved! Digital QR Badge issued & synced to Sarathi registry.`);
    setTimeout(() => setAuditActionFeedback(null), 4000);
    setQueryConsoleLogs(prev => [
      `[${new Date().toLocaleTimeString()}] UPDATE drivers SET aadhaar_status = 'verified', badge_issued = true WHERE id = '${id}'`,
      `[${new Date().toLocaleTimeString()}] WEBHOOK: Dispatched verified credential to MoRTH Sarathi API.`,
      ...prev
    ]);
    if (inspectingDriver?.id === id) {
      setInspectingDriver(prev => prev ? { ...prev, aadhaarStatus: 'verified' } : null);
    }
  };

  const handleReject = (id: string, reason?: string) => {
    onRejectDriver(id);
    const msg = reason ? `Flagged: ${reason}` : 'Rejected application';
    setAuditActionFeedback(`Driver #${id} flagged: ${msg}`);
    setTimeout(() => setAuditActionFeedback(null), 4000);
    setQueryConsoleLogs(prev => [
      `[${new Date().toLocaleTimeString()}] UPDATE drivers SET aadhaar_status = 'rejected', audit_note = '${msg}' WHERE id = '${id}'`,
      ...prev
    ]);
    if (inspectingDriver?.id === id) {
      setInspectingDriver(prev => prev ? { ...prev, aadhaarStatus: 'rejected' } : null);
    }
  };

  // Run Batch UPI Payouts
  const handleExecuteBatchPayouts = () => {
    setPayoutsBatchRunning(true);
    setTimeout(() => {
      setPayoutsList(prev => prev.map(p => ({
        ...p,
        status: 'SETTLED',
        utrNumber: p.utrNumber === 'PENDING_EXECUTION' ? `UPI-RZP-${Math.floor(100000000 + Math.random() * 900000000)}` : p.utrNumber
      })));
      setPayoutsBatchRunning(false);
      setQueryConsoleLogs(prev => [
        `[${new Date().toLocaleTimeString()}] RAZORPAY BATCH PAYOUT: 2 queued payouts settled directly to operator UPI VPAs. Total: ₹3,900. 0% Fee Deducted.`,
        ...prev
      ]);
    }, 1500);
  };

  // Execute SQL Studio Query
  const executePredefinedSql = (query: string) => {
    setSqlExecuting(true);
    setSqlQuery(query);
    const start = performance.now();
    setTimeout(() => {
      let rows: any[] = [];
      if (query.includes('drivers')) {
        rows = drivers.map(d => ({
          id: d.id,
          full_name: d.fullName,
          aadhaar_status: d.aadhaarStatus,
          hourly_rate: `₹${d.hourlyRate}/hr`,
          rating: `${d.averageRating} ★`,
          vehicles: d.qualifiedVehicles.slice(0, 2).join(', ')
        }));
      } else if (query.includes('dispatches')) {
        rows = dispatches.map(disp => ({
          id: disp.id,
          title: disp.title,
          vehicle: disp.vehicle,
          payout: `₹${disp.payout}`,
          status: disp.status,
          eta: disp.eta || '12 mins'
        }));
      } else if (query.includes('payouts')) {
        rows = payoutsList.map(p => ({
          payout_id: p.id,
          driver: p.driverName,
          vpa: p.vpa,
          amount: `₹${p.amount}`,
          status: p.status,
          utr: p.utrNumber
        }));
      } else {
        rows = [
          { srid: 4326, auth_name: "EPSG", auth_srid: 4326, proj4text: "+proj=longlat +datum=WGS84 +no_defs", cluster_metric: "ST_DWithin" },
          { srid: 3857, auth_name: "EPSG", auth_srid: 3857, proj4text: "+proj=merc +a=6378137 +b=6378137", cluster_metric: "WebMercator" }
        ];
      }
      const end = performance.now();
      setSqlExecTime(Math.round(end - start) + 11);
      setSqlResultRows(rows);
      setSqlExecuting(false);
      setQueryConsoleLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ${query} => ${rows.length} rows returned in ${Math.round(end - start) + 11}ms`,
        ...prev
      ]);
    }, 400);
  };

  // Owner & Transporter Management Handlers
  const handleApproveOwner = (ownerId: string) => {
    setOwnersList(prev => prev.map(o => {
      if (o.id === ownerId) {
        return {
          ...o,
          accountStatus: 'active' as const,
          rcVerificationStatus: 'verified' as const,
          commercialPermitStatus: 'verified' as const,
          aadhaarStatus: 'verified' as const
        };
      }
      return o;
    }));
    const target = ownersList.find(o => o.id === ownerId);
    setAuditActionFeedback(`Transporter ${target?.companyName || target?.fullName} (${target?.fleetSize || 0} vehicles) approved and activated for live matches!`);
    setTimeout(() => setAuditActionFeedback(null), 4000);
  };

  const handleToggleOwnerSuspend = (ownerId: string) => {
    setOwnersList(prev => prev.map(o => {
      if (o.id === ownerId) {
        const nextStatus = o.accountStatus === 'suspended' ? ('active' as const) : ('suspended' as const);
        return { ...o, accountStatus: nextStatus };
      }
      return o;
    }));
    const target = ownersList.find(o => o.id === ownerId);
    const isNowSuspended = target?.accountStatus !== 'suspended';
    setAuditActionFeedback(`Transporter account ${isNowSuspended ? 'suspended' : 'reactivated'}: ${target?.companyName || target?.fullName}`);
    setTimeout(() => setAuditActionFeedback(null), 4000);
  };

  const handleSaveOwnerCommission = (ownerId: string) => {
    setOwnersList(prev => prev.map(o => {
      if (o.id === ownerId) {
        return { ...o, commissionRate: tempCommissionRate };
      }
      return o;
    }));
    setEditingCommissionOwnerId(null);
    setAuditActionFeedback(`Special commission rate updated to ${tempCommissionRate}% for transporter.`);
    setTimeout(() => setAuditActionFeedback(null), 4000);
  };

  // Commission & Revenue Handlers
  const handleReleaseBookingEscrow = (bookingId: string) => {
    setMatchLedger(prev => prev.map(m => {
      if (m.id === bookingId) {
        return { ...m, escrowStatus: 'released' as const, status: 'completed' as const };
      }
      return m;
    }));
    setAuditActionFeedback(`Escrow released for ${bookingId}. Driver payout auto-triggered via UPI.`);
    setTimeout(() => setAuditActionFeedback(null), 4000);
  };

  const handleHoldBookingEscrow = (bookingId: string) => {
    setMatchLedger(prev => prev.map(m => {
      if (m.id === bookingId) {
        return { ...m, escrowStatus: 'held' as const };
      }
      return m;
    }));
    setAuditActionFeedback(`Escrow frozen for ${bookingId} pending dispute investigation.`);
    setTimeout(() => setAuditActionFeedback(null), 4000);
  };

  const handleApplyMasterCommissionRates = () => {
    setAuditActionFeedback(`Master Commission Rates applied across network: ${platformOwnerTakeRate}% Owner match fee, ${platformDriverTakeRate}% Driver settlement fee, ${sosSurgeMultiplier}x Emergency surge.`);
    setTimeout(() => setAuditActionFeedback(null), 4000);
  };

  return (
    <div className="flex flex-col gap-6" id="admin-dashboard">
      
      {/* Toast Feedback banner */}
      {auditActionFeedback && (
        <div className="bg-primary text-white px-4 py-3 rounded-xl shadow-lg flex items-center justify-between text-xs font-bold animate-fade-in border border-primary-hover">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white shrink-0" />
            <span>{auditActionFeedback}</span>
          </div>
          <button onClick={() => setAuditActionFeedback(null)} className="p-1 hover:bg-white/20 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Admin Stats Strip & Global Operations Header */}
      <section className="bg-canvas-base rounded-xl p-4 sm:p-6 shadow-xs border border-border-divider">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono-code font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase">
                Platform Admin Command HUD
              </span>
              <span className="text-[10px] font-mono-code bg-status-active/10 text-status-active font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-active animate-ping"></span>
                PostgreSQL 16 & PostGIS Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Global Operations Command</h1>
            <p className="text-xs text-text-secondary max-w-2xl">
              Centralized platform supervisory cockpit: review real-time Sarathi DL/UIDAI eKYC approvals, supervise low-latency PostGIS live telematics, oversee instant UPI escrow settlements, and execute live PostgreSQL spatial queries.
            </p>
          </div>

          {/* Database Connection Indicator */}
          <div className="flex items-center gap-3 bg-canvas-subtle p-3.5 rounded-xl border border-border-subtle shrink-0">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${
              dbConnected ? 'bg-badge-aadhaar-bg border-badge-aadhaar-border text-badge-aadhaar-text' : 'bg-emerald-100 border-emerald-300 text-emerald-700'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                Supabase Schema Status 
                <span className="inline-block w-2 h-2 rounded-full bg-status-active"></span>
              </span>
              <span className="text-[10px] font-mono-code text-text-secondary">
                jwonxlkhiupouusslyqa ({latency ?? 14}ms)
              </span>
            </div>
            <button 
              onClick={runConnectionTest}
              disabled={testingConnection}
              title="Force Database Probe"
              className="p-2 rounded-lg bg-canvas-base hover:bg-surface-container border border-border-divider text-text-secondary transition-colors cursor-pointer min-h-[36px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin text-primary' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Operational Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-border-divider/50">
          <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle text-left">
            <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider">Active Operators</span>
            <span className="text-lg sm:text-xl font-bold text-text-primary font-mono-code">842 Ready</span>
            <span className="text-[9px] text-status-active block mt-0.5">● 612 in BLR Zone</span>
          </div>

          <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle text-left">
            <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider">KYC Certified</span>
            <span className="text-lg sm:text-xl font-bold text-badge-aadhaar-text font-mono-code">
              {drivers.filter(d => d.aadhaarStatus === 'verified').length} / {drivers.length}
            </span>
            <span className="text-[9px] text-amber-700 block mt-0.5">
              {drivers.filter(d => d.aadhaarStatus === 'pending').length} In Queue
            </span>
          </div>

          <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle text-left">
            <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider">SOS Dispatches</span>
            <span className="text-lg sm:text-xl font-bold text-status-urgent font-mono-code">
              {dispatches.filter(d => d.status === 'broadcasting').length} Live
            </span>
            <span className="text-[9px] text-text-secondary block mt-0.5">Avg response: 3.2m</span>
          </div>

          <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle text-left">
            <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider">Escrow Protected</span>
            <span className="text-lg sm:text-xl font-bold text-primary font-mono-code">₹4,82,500</span>
            <span className="text-[9px] text-status-active block mt-0.5">0% Platform Fee</span>
          </div>

          <div className="col-span-2 md:col-span-1 bg-canvas-subtle p-3 rounded-lg border border-border-subtle text-left">
            <span className="text-[10px] text-text-tertiary block font-bold uppercase tracking-wider">PostGIS Health SLA</span>
            <span className="text-lg sm:text-xl font-bold text-primary font-mono-code">99.98%</span>
            <span className="text-[9px] text-text-secondary block mt-0.5 font-mono-code">Ping: 12ms</span>
          </div>
        </div>

        {/* Industry-Leading Sub-Tab Navigation Bar */}
        <div className="flex gap-1 sm:gap-2 border-t border-border-divider mt-6 pt-1 overflow-x-auto scrollbar-none">
          <button 
            onClick={() => setSelectedSubTab('revenue')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer min-h-[44px] ${
              selectedSubTab === 'revenue' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
            Commission & Revenue Master (Platform Core)
          </button>

          <button 
            onClick={() => setSelectedSubTab('owners')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer min-h-[44px] ${
              selectedSubTab === 'owners' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-primary" />
            Vehicle Owners & Transporters ({ownersList.length})
          </button>

          <button 
            onClick={() => setSelectedSubTab('kyc')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer min-h-[44px] ${
              selectedSubTab === 'kyc' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Drivers & Operators KYC ({drivers.filter(d => d.aadhaarStatus === 'pending').length})
          </button>

          <button 
            onClick={() => setSelectedSubTab('telematics')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer min-h-[44px] ${
              selectedSubTab === 'telematics' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-status-active animate-pulse" />
            Fleet Telematics & Radar HUD
          </button>

          <button 
            onClick={() => setSelectedSubTab('dispatches')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer min-h-[44px] ${
              selectedSubTab === 'dispatches' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-status-urgent" />
            Emergency SOS Incident Room
          </button>

          <button 
            onClick={() => setSelectedSubTab('payouts')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer min-h-[44px] ${
              selectedSubTab === 'payouts' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
            Instant Payouts & Escrow
          </button>

          <button 
            onClick={() => setSelectedSubTab('database')}
            className={`px-3 sm:px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 cursor-pointer min-h-[44px] ${
              selectedSubTab === 'database' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            PostgreSQL SQL Studio
          </button>
        </div>
      </section>

      {/* SUBTAB 0A: PLATFORM COMMISSION & REVENUE MASTER CONTROL (THE MOST CRITICAL OPTION) */}
      {selectedSubTab === 'revenue' && (
        <div className="flex flex-col gap-6 text-left animate-fade-in">
          {/* Revenue Master Headline Strip */}
          <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <DollarSign className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-base text-text-primary">Platform Commission & Revenue Master Hub</h3>
                <span className="text-[10px] font-mono-code font-bold bg-badge-aadhaar-bg text-badge-aadhaar-text px-2 py-0.5 rounded-full">
                  Core Monetization Engine
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Control platform commission margins on vehicle owner hires and driver matches, manage the escrow guarantee vault, and audit GST tax invoices.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyMasterCommissionRates}
                className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Save & Broadcast Commission Rates
              </button>
            </div>
          </div>

          {/* Real-Time Financial Ledger Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-canvas-base p-4 rounded-xl border border-border-divider shadow-xs">
              <span className="text-[11px] font-bold text-text-tertiary block uppercase tracking-wider">Total Platform Commission</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-primary font-mono-code">₹1,84,320</span>
                <span className="text-[11px] font-bold text-status-active bg-status-active/10 px-1.5 py-0.5 rounded">+18.4% MoM</span>
              </div>
              <span className="text-[10px] text-text-secondary block mt-1">Net earned from 248 match hires (avg 3.2% take-rate)</span>
            </div>

            <div className="bg-canvas-base p-4 rounded-xl border border-border-divider shadow-xs">
              <span className="text-[11px] font-bold text-text-tertiary block uppercase tracking-wider">Gross Match GMV</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-text-primary font-mono-code">₹18,42,000</span>
                <span className="text-[11px] font-bold text-text-tertiary">Across Fleet</span>
              </div>
              <span className="text-[10px] text-text-secondary block mt-1">LMV Chauffeur, HMV Hauler & HEMM Excavator contracts</span>
            </div>

            <div className="bg-canvas-base p-4 rounded-xl border border-border-divider shadow-xs">
              <span className="text-[11px] font-bold text-text-tertiary block uppercase tracking-wider">Active Escrow in Vault</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-amber-600 font-mono-code">₹4,82,500</span>
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-700 px-1.5 py-0.5 rounded">HELD</span>
              </div>
              <span className="text-[10px] text-text-secondary block mt-1">Locked in ICICI Bank Trustee node until shift completion</span>
            </div>

            <div className="bg-canvas-base p-4 rounded-xl border border-border-divider shadow-xs">
              <span className="text-[11px] font-bold text-text-tertiary block uppercase tracking-wider">Disbursed to Drivers via UPI</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-extrabold text-emerald-700 font-mono-code">₹16,57,680</span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">99.8% INSTANT</span>
              </div>
              <span className="text-[10px] text-text-secondary block mt-1">Settled directly to driver VPAs via RazorpayX / IMPS</span>
            </div>
          </div>

          {/* Dynamic Platform Take-Rate Configurator */}
          <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-xs flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-border-divider">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-primary" />
                <h4 className="font-bold text-sm text-text-primary">Master Commission Rate & Tariff Controller</h4>
              </div>
              <span className="text-[11px] font-mono-code text-text-secondary">Updates take effect instantly across mobile client & backend APIs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Owner Match Fee Slider */}
              <div className="bg-canvas-subtle p-4 rounded-xl border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">Vehicle Owner Match Commission</span>
                  <span className="text-xs font-mono-code font-extrabold bg-primary text-white px-2 py-0.5 rounded">
                    {platformOwnerTakeRate}%
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary">
                  Percentage deducted or billed to vehicle owners / fleet companies when an operator is matched.
                </p>
                <input 
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={platformOwnerTakeRate}
                  onChange={(e) => setPlatformOwnerTakeRate(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono-code text-text-tertiary">
                  <span>1.0% (Enterprise)</span>
                  <span>3.0% (Pro Fleet)</span>
                  <span>8.0% (Pay-As-You-Go)</span>
                  <span>12.0% (Max)</span>
                </div>
              </div>

              {/* Driver Deduction Fee Slider */}
              <div className="bg-canvas-subtle p-4 rounded-xl border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">Driver Settlement Commission</span>
                  <span className="text-xs font-mono-code font-extrabold bg-emerald-700 text-white px-2 py-0.5 rounded">
                    {platformDriverTakeRate}%
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary">
                  Standard non-VIP driver fee deducted upon duty completion (Gold VIP pass drivers always pay 0%).
                </p>
                <input 
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={platformDriverTakeRate}
                  onChange={(e) => setPlatformDriverTakeRate(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono-code text-text-tertiary">
                  <span>0% (VIP Zero Cut)</span>
                  <span>5% (Standard)</span>
                  <span>10% (High Surge)</span>
                </div>
              </div>

              {/* SOS Surge Multiplier */}
              <div className="bg-canvas-subtle p-4 rounded-xl border border-border-subtle flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-primary">Emergency SOS Surge Multiplier</span>
                  <span className="text-xs font-mono-code font-extrabold bg-amber-600 text-white px-2 py-0.5 rounded">
                    {sosSurgeMultiplier}x
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary">
                  Highway breakdown & emergency reliever dispatch commission multiplier applied during high-demand night shifts.
                </p>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[1.0, 1.25, 1.5].map((mult) => (
                    <button
                      key={mult}
                      onClick={() => setSosSurgeMultiplier(mult)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        sosSurgeMultiplier === mult 
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs' 
                          : 'bg-white text-text-secondary border-border-divider hover:text-text-primary'
                      }`}
                    >
                      {mult}x Surge
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Match Handshakes & Commission Ledger Table */}
          <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-divider">
              <div>
                <h4 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Live Commission & Match Handshake Ledger
                </h4>
                <p className="text-[11px] text-text-secondary mt-0.5">Real-time breakdown of owner fees, operator wage escrow, and platform commission earned.</p>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <input 
                  type="text" 
                  placeholder="Search booking ID, owner, driver..." 
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  className="h-8 px-3 rounded-lg bg-canvas-subtle border border-border-divider text-xs text-text-primary focus:outline-none placeholder:text-text-tertiary w-56"
                />
                <div className="flex items-center gap-1 bg-canvas-subtle p-0.5 rounded-lg border border-border-subtle text-xs">
                  {(['all', 'held', 'released', 'active'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setLedgerFilter(filter)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                        ledgerFilter === filter ? 'bg-white text-primary shadow-xs' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border-divider text-text-tertiary uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Booking / Date</th>
                    <th className="py-2.5 px-3">Vehicle Owner / Fleet</th>
                    <th className="py-2.5 px-3">Assigned Operator</th>
                    <th className="py-2.5 px-3">Vehicle & Duty</th>
                    <th className="py-2.5 px-3">Gross Wage</th>
                    <th className="py-2.5 px-3">Platform Cut</th>
                    <th className="py-2.5 px-3">Escrow Status</th>
                    <th className="py-2.5 px-3 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-divider/60">
                  {matchLedger
                    .filter(m => {
                      if (ledgerFilter === 'held') return m.escrowStatus === 'held';
                      if (ledgerFilter === 'released') return m.escrowStatus === 'released';
                      if (ledgerFilter === 'active') return m.status === 'active';
                      return true;
                    })
                    .filter(m => {
                      if (!ledgerSearch) return true;
                      const q = ledgerSearch.toLowerCase();
                      return m.id.toLowerCase().includes(q) || 
                             m.ownerName.toLowerCase().includes(q) || 
                             m.driverName.toLowerCase().includes(q) ||
                             m.vehicleModel.toLowerCase().includes(q);
                    })
                    .map((booking) => (
                      <tr key={booking.id} className="hover:bg-canvas-subtle/50 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-mono-code font-bold text-text-primary block">{booking.id}</span>
                          <span className="text-[10px] text-text-tertiary">{booking.bookingDate}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-text-primary block">{booking.ownerName}</span>
                          <span className="text-[10px] text-text-secondary capitalize">{booking.ownerType} account</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-text-primary block">{booking.driverName}</span>
                          <span className="text-[10px] font-mono-code text-text-secondary">{booking.driverPhone}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-text-primary block">{booking.vehicleModel}</span>
                          <span className="text-[10px] text-text-secondary">{booking.vehicleCategory} • {booking.hiringBasis}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-text-primary font-mono-code">₹{booking.grossWage}</span>
                          <span className="text-[10px] text-text-tertiary block">Paid by owner: ₹{booking.totalPaidByOwner}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-extrabold text-primary font-mono-code block">₹{booking.totalPlatformCommission}</span>
                          <span className="text-[10px] font-mono-code text-status-active">
                            ({booking.ownerCommissionRate}% + {booking.driverCommissionRate}%)
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono-code ${
                            booking.escrowStatus === 'released' 
                              ? 'bg-status-active/10 text-status-active' 
                              : 'bg-amber-500/10 text-amber-700'
                          }`}>
                            {booking.escrowStatus === 'released' ? '✓ RELEASED' : '🔒 HELD IN ESCROW'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {booking.escrowStatus === 'held' ? (
                              <button
                                onClick={() => handleReleaseBookingEscrow(booking.id)}
                                className="px-2.5 py-1 rounded bg-status-active/10 text-status-active hover:bg-status-active/20 font-bold text-[11px] transition-colors cursor-pointer"
                                title="Approve duty completion and disburse funds to driver via UPI"
                              >
                                Release Escrow
                              </button>
                            ) : (
                              <button
                                onClick={() => handleHoldBookingEscrow(booking.id)}
                                className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 font-bold text-[11px] transition-colors cursor-pointer"
                                title="Hold payout for dispute investigation"
                              >
                                Freeze
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setAuditActionFeedback(`IRN GST Tax Invoice generated for ${booking.id}: GSTIN SAC 9967. Download complete.`);
                                setTimeout(() => setAuditActionFeedback(null), 3500);
                              }}
                              className="p-1 rounded bg-canvas-subtle hover:bg-surface-container text-text-secondary border border-border-divider cursor-pointer"
                              title="Download GST Invoice"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 0B: VEHICLE OWNERS & FLEET TRANSPORTERS CONTROL CONSOLE */}
      {selectedSubTab === 'owners' && (
        <div className="flex flex-col gap-6 text-left animate-fade-in">
          {/* Owners Console Header */}
          <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Vehicle Owners & Transporters Control
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Verify transport companies and vehicle owners, approve fleet registration certificates (RC books), and set custom commission tiers.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-canvas-subtle p-1 rounded-lg border border-border-subtle self-start sm:self-auto text-xs">
              {(['all', 'pending', 'active', 'suspended'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOwnerFilter(filter)}
                  className={`px-3 py-1.5 rounded-md font-bold capitalize transition-colors cursor-pointer ${
                    ownerFilter === filter 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {filter} ({filter === 'all' 
                    ? ownersList.length 
                    : filter === 'pending'
                    ? ownersList.filter(o => o.accountStatus === 'pending_approval').length
                    : ownersList.filter(o => o.accountStatus === filter).length
                  })
                </button>
              ))}
            </div>
          </div>

          {/* Transporters & Owners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownersList
              .filter(owner => {
                if (ownerFilter === 'all') return true;
                if (ownerFilter === 'pending') return owner.accountStatus === 'pending_approval';
                return owner.accountStatus === ownerFilter;
              })
              .map((owner) => (
                <div 
                  key={owner.id}
                  className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-xs flex flex-col justify-between gap-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex flex-col gap-3">
                    {/* Top Row: Avatar/Icon, Name, Status Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg ${
                          owner.ownerType === 'company' 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {owner.ownerType === 'company' ? '🏢' : '🚗'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-text-primary flex items-center gap-1.5">
                            {owner.companyName || owner.fullName}
                            {owner.accountStatus === 'active' && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-status-active" />
                            )}
                          </h4>
                          <span className="text-[11px] text-text-secondary block">
                            Contact: {owner.fullName} • {owner.city}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        owner.accountStatus === 'active' 
                          ? 'bg-status-active/10 text-status-active' 
                          : owner.accountStatus === 'pending_approval'
                          ? 'bg-amber-500/10 text-amber-700'
                          : 'bg-status-urgent/10 text-status-urgent'
                      }`}>
                        {owner.accountStatus === 'pending_approval' ? 'Pending Approval' : owner.accountStatus}
                      </span>
                    </div>

                    {/* Fleet & Vehicles Details */}
                    <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle flex flex-col gap-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary text-[11px]">Registered Fleet Size:</span>
                        <span className="font-bold text-text-primary font-mono-code">{owner.fleetSize} Vehicles Active</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {owner.vehicles.map((v, i) => (
                          <span key={i} className="text-[10px] font-medium bg-white px-2 py-0.5 rounded border border-border-divider text-text-secondary">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Verification Badges Grid */}
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div className="p-2 rounded bg-canvas-subtle border border-border-subtle flex flex-col">
                        <span className="text-text-tertiary">Vehicle RC</span>
                        <span className={`font-bold mt-0.5 ${owner.rcVerificationStatus === 'verified' ? 'text-status-active' : 'text-amber-600'}`}>
                          {owner.rcVerificationStatus === 'verified' ? '✓ Parivahan Valid' : '⏳ Pending Scan'}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-canvas-subtle border border-border-subtle flex flex-col">
                        <span className="text-text-tertiary">Commercial Permit</span>
                        <span className={`font-bold mt-0.5 ${owner.commercialPermitStatus === 'verified' ? 'text-status-active' : 'text-amber-600'}`}>
                          {owner.commercialPermitStatus === 'verified' ? '✓ All-India Valid' : '⏳ In Review'}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-canvas-subtle border border-border-subtle flex flex-col">
                        <span className="text-text-tertiary">Company GSTIN</span>
                        <span className="font-bold mt-0.5 text-text-primary truncate">
                          {owner.gstin ? '✓ Verified' : 'N/A (Individual)'}
                        </span>
                      </div>
                    </div>

                    {/* Assigned Commission Plan & Special Margin */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container border border-border-subtle text-xs">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 text-primary" />
                        <div>
                          <span className="font-bold text-text-primary block text-[11px]">Assigned Platform Commission</span>
                          <span className="text-[10px] text-text-secondary font-mono-code">{owner.commissionRate}% per matched driver</span>
                        </div>
                      </div>

                      {editingCommissionOwnerId === owner.id ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="number"
                            step="0.5"
                            min="1"
                            max="10"
                            value={tempCommissionRate}
                            onChange={(e) => setTempCommissionRate(Number(e.target.value))}
                            className="w-14 h-7 px-1.5 text-xs font-mono-code border border-primary rounded bg-white"
                          />
                          <button
                            onClick={() => handleSaveOwnerCommission(owner.id)}
                            className="h-7 px-2 rounded bg-primary text-white text-[10px] font-bold cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingCommissionOwnerId(owner.id);
                            setTempCommissionRate(owner.commissionRate);
                          }}
                          className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                        >
                          Change %
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-divider">
                    <button
                      onClick={() => setInspectingOwner(owner)}
                      className="px-3 py-1.5 rounded-lg bg-canvas-subtle hover:bg-surface-container border border-border-divider text-xs font-bold text-text-secondary flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect RC Book
                    </button>

                    <div className="flex items-center gap-2">
                      {owner.accountStatus === 'pending_approval' ? (
                        <button
                          onClick={() => handleApproveOwner(owner.id)}
                          className="h-8 px-3.5 rounded-lg bg-status-active text-white text-xs font-bold hover:bg-status-active/90 transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Transporter
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleOwnerSuspend(owner.id)}
                          className={`h-8 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            owner.accountStatus === 'suspended'
                              ? 'bg-status-active/10 text-status-active border-status-active/30 hover:bg-status-active/20'
                              : 'bg-status-urgent/10 text-status-urgent border-status-urgent/30 hover:bg-status-urgent/20'
                          }`}
                        >
                          {owner.accountStatus === 'suspended' ? 'Reactivate Fleet' : 'Suspend Account'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Owner Document Inspection Modal */}
          {inspectingOwner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in text-left">
              <div className="bg-canvas-base rounded-2xl max-w-lg w-full p-6 border border-border-divider shadow-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-border-divider">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-bold text-sm text-text-primary">{inspectingOwner.companyName || inspectingOwner.fullName}</h4>
                      <span className="text-[10px] text-text-secondary font-mono-code">Fleet RC Audit • {inspectingOwner.city}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setInspectingOwner(null)}
                    className="p-1 rounded-full text-text-tertiary hover:bg-canvas-subtle"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-canvas-subtle p-4 rounded-xl border border-border-subtle flex flex-col gap-3 text-xs">
                  <div className="flex justify-between border-b border-border-divider/50 pb-2">
                    <span className="text-text-secondary">Vehicle Registration Cert (RC):</span>
                    <span className="font-bold font-mono-code text-text-primary">KA-51-MB-2024-VIP</span>
                  </div>
                  <div className="flex justify-between border-b border-border-divider/50 pb-2">
                    <span className="text-text-secondary">Chassis / Engine Number:</span>
                    <span className="font-bold font-mono-code text-text-primary">MAT612984M029810</span>
                  </div>
                  <div className="flex justify-between border-b border-border-divider/50 pb-2">
                    <span className="text-text-secondary">Commercial All-India Permit:</span>
                    <span className="font-bold text-status-active">VALID TILL DEC 2028 (AIP-9902)</span>
                  </div>
                  <div className="flex justify-between border-b border-border-divider/50 pb-2">
                    <span className="text-text-secondary">Comprehensive Insurance:</span>
                    <span className="font-bold text-text-primary">ICICI Lombard Goods/Passenger</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">GSTIN Tax Registration:</span>
                    <span className="font-mono-code font-bold text-primary">{inspectingOwner.gstin || 'Individual (Exempt)'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-divider">
                  <button
                    onClick={() => setInspectingOwner(null)}
                    className="px-4 py-2 rounded-lg bg-canvas-subtle text-text-secondary text-xs font-bold hover:bg-surface-container"
                  >
                    Close Audit
                  </button>
                  {inspectingOwner.accountStatus === 'pending_approval' && (
                    <button
                      onClick={() => {
                        handleApproveOwner(inspectingOwner.id);
                        setInspectingOwner(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90"
                    >
                      Approve & Grant Live Fleet Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 1: KYC & CREDENTIALS AUDIT ROOM */}
      {selectedSubTab === 'kyc' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Main KYC List */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            <div className="bg-canvas-base rounded-xl p-4 sm:p-5 border border-border-divider shadow-xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-divider">
                <div>
                  <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Driver Credential Verification Queue
                  </h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">UIDAI e-KYC XML Vault + MoRTH Sarathi RTO Driving License Sync</p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 bg-canvas-subtle p-1 rounded-lg border border-border-subtle self-start sm:self-auto text-xs">
                  <button 
                    onClick={() => setKycFilter('pending')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer text-xs ${
                      kycFilter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Pending Review ({drivers.filter(d => d.aadhaarStatus === 'pending').length})
                  </button>
                  <button 
                    onClick={() => setKycFilter('verified')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer text-xs ${
                      kycFilter === 'verified' ? 'bg-status-active text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Certified ({drivers.filter(d => d.aadhaarStatus === 'verified').length})
                  </button>
                  <button 
                    onClick={() => setKycFilter('all')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer text-xs ${
                      kycFilter === 'all' ? 'bg-primary text-white shadow-xs' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    All Records ({drivers.length})
                  </button>
                </div>
              </div>

              {activeKycRequests.length === 0 ? (
                <div className="p-8 text-center bg-canvas-subtle rounded-xl border border-dashed border-border-divider flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-10 h-10 text-status-active" />
                  <h4 className="font-bold text-sm text-text-primary">No Pending Applications in Filter</h4>
                  <p className="text-xs text-text-secondary max-w-sm">All driver credentials in this segment are fully compliant and synchronized with the National Sarathi database.</p>
                  <button 
                    onClick={() => setKycFilter('all')} 
                    className="mt-2 px-3.5 py-1.5 rounded-full bg-primary text-white text-xs font-bold"
                  >
                    View All Verified Drivers
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {activeKycRequests.map((req) => (
                    <div 
                      key={req.id} 
                      className={`p-4 bg-canvas-subtle rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        inspectingDriver?.id === req.id ? 'border-primary ring-1 ring-primary shadow-xs' : 'border-border-subtle hover:border-border-divider'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img 
                          src={req.avatarUrl} 
                          alt={req.fullName} 
                          className="w-12 h-12 rounded-full object-cover border border-border-divider shrink-0 shadow-xs" 
                        />
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-text-primary">{req.fullName}</span>
                            <span className={`px-2 py-0.5 text-[9px] rounded font-mono-code font-bold uppercase ${
                              req.aadhaarStatus === 'verified' 
                                ? 'bg-badge-aadhaar-bg text-badge-aadhaar-text border border-badge-aadhaar-border'
                                : req.aadhaarStatus === 'pending'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}>
                              {req.aadhaarStatus.toUpperCase()}
                            </span>
                            {req.isAiAgent && (
                              <span className="px-1.5 py-0.5 bg-badge-ai-bg text-badge-ai-text text-[9px] rounded font-bold">
                                Autonomous Node
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-text-secondary mt-1 font-mono-code">
                            <span>DL: <strong>{req.licenseNumber}</strong></span>
                            <span>•</span>
                            <span>{req.experienceYears} Yrs Experience</span>
                            <span>•</span>
                            <span>Cat: {req.licenseCategory.join(', ')}</span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] text-text-tertiary mt-1">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-status-active" /> {req.policeClearance}
                            </span>
                            <span>•</span>
                            <span>{req.medicalFitness}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <button 
                          onClick={() => setInspectingDriver(req)}
                          className="h-9 px-3 rounded-lg bg-canvas-base hover:bg-surface-container border border-border-divider text-text-primary font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Open Document Dossier"
                        >
                          <Eye className="w-3.5 h-3.5 text-primary" /> Inspect Dossier
                        </button>

                        {req.aadhaarStatus !== 'verified' && (
                          <button 
                            onClick={() => handleApprove(req.id)}
                            className="h-9 px-3.5 rounded-lg bg-status-active hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve KYC
                          </button>
                        )}

                        {req.aadhaarStatus !== 'rejected' && (
                          <button 
                            onClick={() => handleReject(req.id, "Requires high-resolution Sarathi RTO re-scan")}
                            className="h-9 px-3 rounded-lg bg-status-urgent/10 hover:bg-status-urgent hover:text-white text-status-urgent font-bold text-xs flex items-center justify-center gap-1 border border-status-urgent/30 transition-all cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Flag
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Side Dossier Inspector Drawer */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            {inspectingDriver ? (
              <div className="bg-canvas-base rounded-xl p-5 border border-primary shadow-sm flex flex-col gap-4 text-left animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-border-divider">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <h4 className="font-bold text-xs text-text-primary uppercase tracking-wide">
                      Digital Credential Dossier
                    </h4>
                  </div>
                  <button 
                    onClick={() => setInspectingDriver(null)}
                    className="text-text-tertiary hover:text-text-primary p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Candidate Overview */}
                <div className="flex items-center gap-3 bg-canvas-subtle p-3 rounded-lg border border-border-subtle">
                  <img 
                    src={inspectingDriver.avatarUrl} 
                    alt={inspectingDriver.fullName} 
                    className="w-11 h-11 rounded-full object-cover border border-border-divider shrink-0" 
                  />
                  <div>
                    <span className="font-bold text-xs text-text-primary block">{inspectingDriver.fullName}</span>
                    <span className="text-[10px] text-text-secondary font-mono-code">{inspectingDriver.phoneNumber}</span>
                    <span className="text-[10px] text-text-tertiary block mt-0.5">{inspectingDriver.location.address}</span>
                  </div>
                </div>

                {/* Document Selector Pills */}
                <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
                  {[
                    { id: 'dl', label: 'Sarathi DL' },
                    { id: 'aadhaar', label: 'UIDAI XML' },
                    { id: 'medical', label: 'Medical' },
                    { id: 'cctns', label: 'CCTNS Police' }
                  ].map((doc) => (
                    <button 
                      key={doc.id}
                      onClick={() => setSelectedDocType(doc.id as any)}
                      className={`py-1.5 rounded text-center transition-colors cursor-pointer ${
                        selectedDocType === doc.id ? 'bg-primary text-white font-bold' : 'bg-canvas-subtle text-text-secondary hover:bg-surface-container'
                      }`}
                    >
                      {doc.label}
                    </button>
                  ))}
                </div>

                {/* Smart Card Document Preview */}
                <div className="bg-canvas-subtle rounded-xl p-4 border border-border-divider flex flex-col gap-2.5 text-xs">
                  {selectedDocType === 'dl' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[11px] font-bold text-primary border-b border-border-divider pb-1">
                        <span>UNION OF INDIA • DRIVING LICENCE</span>
                        <span className="font-mono-code text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.25 rounded">VALID</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">DL No:</span>
                        <span className="font-bold text-text-primary">{inspectingDriver.licenseNumber}</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Badge No:</span>
                        <span className="font-bold text-text-primary">{inspectingDriver.badgeNumber || 'SARATHI-VERIFIED-009'}</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Endorsement:</span>
                        <span className="font-bold text-text-primary">{inspectingDriver.licenseCategory.join(' • ')}</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Qualified Vehicles:</span>
                        <span className="font-bold text-text-primary text-right truncate max-w-[170px]">
                          {inspectingDriver.qualifiedVehicles.join(', ')}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedDocType === 'aadhaar' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[11px] font-bold text-emerald-700 border-b border-border-divider pb-1">
                        <span>UIDAI e-KYC VERIFICATION VAULT</span>
                        <span className="font-mono-code text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.25 rounded">AUTHENTICATED</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Aadhaar Number:</span>
                        <span className="font-bold text-text-primary">XXXX XXXX 4819</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Biometric Match:</span>
                        <span className="font-bold text-status-active">98.9% Facial AI Confidence</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">DOB / Gender:</span>
                        <span className="font-bold text-text-primary">{inspectingDriver.dob} • {inspectingDriver.gender}</span>
                      </div>
                    </div>
                  )}

                  {selectedDocType === 'medical' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[11px] font-bold text-primary border-b border-border-divider pb-1">
                        <span>FORM 1-A MEDICAL FITNESS</span>
                        <span className="font-mono-code text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.25 rounded">CERTIFIED</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Medical Status:</span>
                        <span className="font-bold text-text-primary">{inspectingDriver.medicalFitness}</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Audiometry & Vision:</span>
                        <span className="font-bold text-status-active">6/6 Clear • Normal</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Physician Reg:</span>
                        <span className="font-bold text-text-primary">KMC-BLR-489012</span>
                      </div>
                    </div>
                  )}

                  {selectedDocType === 'cctns' && (
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[11px] font-bold text-primary border-b border-border-divider pb-1">
                        <span>CCTNS NATIONAL POLICE DATABASE</span>
                        <span className="font-mono-code text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.25 rounded">CLEARED</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Record Audit:</span>
                        <span className="font-bold text-status-active">Zero Infractions Found</span>
                      </div>
                      <div className="flex justify-between font-mono-code text-[11px]">
                        <span className="text-text-tertiary">Jurisdiction:</span>
                        <span className="font-bold text-text-primary">{inspectingDriver.policeClearance}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Audit Action Panel */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border-divider">
                  <span className="text-[10px] font-bold text-text-tertiary uppercase">Officer Verdict Action</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(inspectingDriver.id)}
                      className="flex-1 h-9 rounded-lg bg-status-active hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve & Issue Badge
                    </button>
                    <button 
                      onClick={() => handleReject(inspectingDriver.id, "Flagged via admin document inspection")}
                      className="flex-1 h-9 rounded-lg bg-status-urgent/10 hover:bg-status-urgent hover:text-white text-status-urgent font-bold text-xs flex items-center justify-center gap-1 border border-status-urgent/30 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject / Flag
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-canvas-base rounded-xl p-6 border border-border-divider shadow-xs text-center flex flex-col items-center justify-center gap-3">
                <FileText className="w-10 h-10 text-text-tertiary" />
                <div>
                  <h4 className="font-bold text-xs text-text-primary">No Dossier Selected</h4>
                  <p className="text-[11px] text-text-secondary mt-1">Click "Inspect Dossier" on any driver candidate to review their verified Sarathi RTO license and UIDAI biometric data.</p>
                </div>
              </div>
            )}

            {/* Platform Audit Logs Stream */}
            <div className="bg-canvas-base rounded-xl p-4 border border-border-divider shadow-xs flex flex-col gap-2 text-left">
              <span className="text-[10px] font-mono-code font-bold text-text-tertiary uppercase">UIDAI Webhook Stream</span>
              <div className="bg-slate-950 text-slate-300 p-3 rounded-lg font-mono-code text-[10px] h-36 overflow-y-auto space-y-1 border border-slate-900 shadow-inner">
                {queryConsoleLogs.slice(0, 5).map((log, idx) => (
                  <div key={idx} className="flex gap-1.5 leading-snug">
                    <span className="text-status-active shrink-0">&gt;&gt;</span>
                    <span className="text-slate-200">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: REAL-TIME FLEET TELEMATICS & SPATIAL RADAR HUD */}
      {selectedSubTab === 'telematics' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Interactive Spatial Radar Canvas */}
          <div className="xl:col-span-8 bg-canvas-base rounded-xl p-4 sm:p-5 border border-border-divider shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-divider">
              <div>
                <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <Radio className="w-4 h-4 text-status-active animate-pulse" />
                  PostGIS Live Telematics Radar (Indiranagar & Bengaluru Corridor)
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Spatial cluster query: <code className="font-mono-code text-primary bg-primary/5 px-1 py-0.5 rounded">ST_ClusterWithin(coordinates, 4200)</code>
                </p>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1 scrollbar-none">
                {['all', 'LMV', 'HMV', 'HEMM', 'PILOT'].map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setTelematicsCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full font-bold text-xs transition-colors cursor-pointer whitespace-nowrap ${
                      telematicsCategoryFilter === cat ? 'bg-primary text-white' : 'bg-canvas-subtle text-text-secondary hover:bg-surface-container'
                    }`}
                  >
                    {cat === 'all' ? 'All Classes' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Radar Visual Canvas */}
            <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4 select-none">
              {/* Radar circular rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-24 h-24 rounded-full border border-emerald-500/20"></div>
                <div className="w-48 h-48 rounded-full border border-emerald-500/20"></div>
                <div className="w-72 h-72 rounded-full border border-emerald-500/15"></div>
                <div className="w-96 h-96 rounded-full border border-emerald-500/10"></div>
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-emerald-500/10"></div>
                <div className="absolute h-full w-[1px] bg-emerald-500/10"></div>
                {/* Radar Sweep Effect */}
                <div className="absolute w-48 h-48 rounded-full border-r-2 border-emerald-400/30 animate-spin origin-center"></div>
              </div>

              {/* Radar Hub Center Landmark */}
              <div className="absolute z-10 flex flex-col items-center pointer-events-none">
                <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_rgba(37,99,235,0.8)] border border-white"></div>
                <span className="text-[9px] font-mono-code text-slate-400 mt-1 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">
                  Bengaluru Hub Center (12.9716°N, 77.5946°E)
                </span>
              </div>

              {/* Driver Coordinate Nodes Placed on Spatial Grid */}
              {drivers
                .filter(d => telematicsCategoryFilter === 'all' || d.licenseCategory.includes(telematicsCategoryFilter as any))
                .map((driver, idx) => {
                  // Mathematical layout around center
                  const offsets = [
                    { top: '32%', left: '42%' },
                    { top: '56%', left: '64%' },
                    { top: '24%', left: '72%' },
                    { top: '70%', left: '30%' },
                    { top: '40%', left: '80%' },
                    { top: '65%', left: '50%' },
                    { top: '18%', left: '38%' },
                  ];
                  const pos = offsets[idx % offsets.length];
                  const isSelected = selectedRadarDriver?.id === driver.id;

                  return (
                    <button
                      key={driver.id}
                      onClick={() => setSelectedRadarDriver(driver)}
                      style={{ top: pos.top, left: pos.left }}
                      className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-125 focus:outline-none`}
                    >
                      <div className="relative flex flex-col items-center">
                        {/* Node Beacon */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all shadow-md ${
                          isSelected 
                            ? 'bg-primary border-white ring-4 ring-primary/40 scale-110' 
                            : driver.isAiAgent 
                            ? 'bg-cyan-500 border-cyan-200' 
                            : driver.licenseCategory.includes('HEMM')
                            ? 'bg-amber-500 border-amber-200'
                            : 'bg-emerald-500 border-emerald-200'
                        }`}>
                          {driver.isAiAgent ? (
                            <Cpu className="w-3.5 h-3.5 text-white" />
                          ) : driver.licenseCategory.includes('HEMM') ? (
                            <Truck className="w-3.5 h-3.5 text-white" />
                          ) : driver.licenseCategory.includes('HMV') ? (
                            <Truck className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Car className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>

                        {/* Node Tooltip Label */}
                        <div className="mt-1 px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[9px] font-mono-code text-white whitespace-nowrap opacity-80 group-hover:opacity-100 flex items-center gap-1 shadow-xs">
                          <span className={`w-1.5 h-1.5 rounded-full ${driver.currentStatus === 'online' ? 'bg-status-active' : 'bg-status-warning'}`}></span>
                          {driver.fullName.split(' ')[0]}
                          <span className="text-slate-400">({driver.hourlyRate}₹)</span>
                        </div>
                      </div>
                    </button>
                  );
                })}

              {/* Bottom Radar Status HUD */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono-code text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-status-active animate-ping"></span>
                  <span>Spatial Mesh Active</span>
                  <span>•</span>
                  <span>Geodesic Drift: &lt; 0.4m</span>
                </div>
                <div>PostGIS Latency: <strong>{simulatedPing}ms</strong></div>
              </div>
            </div>

            {/* Radar Quick Stats & Category Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border-divider text-xs">
              <div className="flex items-center gap-2 p-2 rounded bg-canvas-subtle border border-border-subtle">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-[11px] font-medium text-text-secondary">LMV Chauffeurs ({drivers.filter(d => d.licenseCategory.includes('LMV')).length})</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-canvas-subtle border border-border-subtle">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                <span className="text-[11px] font-medium text-text-secondary">HEMM Heavy Equip ({drivers.filter(d => d.licenseCategory.includes('HEMM')).length})</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-canvas-subtle border border-border-subtle">
                <span className="w-3 h-3 rounded-full bg-cyan-500 shrink-0"></span>
                <span className="text-[11px] font-medium text-text-secondary">AI Autonomous ({drivers.filter(d => d.isAiAgent).length})</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-canvas-subtle border border-border-subtle">
                <span className="w-3 h-3 rounded-full bg-primary shrink-0"></span>
                <span className="text-[11px] font-medium text-text-secondary">HMV Commercial Trucks ({drivers.filter(d => d.licenseCategory.includes('HMV')).length})</span>
              </div>
            </div>
          </div>

          {/* Telematics Driver Telemetry Detail Card */}
          <div className="xl:col-span-4 flex flex-col gap-4 text-left">
            {selectedRadarDriver ? (
              <div className="bg-canvas-base rounded-xl p-5 border border-primary shadow-xs flex flex-col gap-4 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-border-divider">
                  <span className="text-[10px] font-mono-code font-bold text-primary uppercase">Live Node Telemetry</span>
                  <span className="text-[10px] font-mono-code bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    ONLINE • GPS LOCKED
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-canvas-subtle p-3 rounded-xl border border-border-subtle">
                  <img 
                    src={selectedRadarDriver.avatarUrl} 
                    alt={selectedRadarDriver.fullName} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary shrink-0" 
                  />
                  <div>
                    <h4 className="font-bold text-xs text-text-primary">{selectedRadarDriver.fullName}</h4>
                    <span className="text-[10px] text-text-secondary font-mono-code block mt-0.5">{selectedRadarDriver.phoneNumber}</span>
                    <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                      Rate: ₹{selectedRadarDriver.hourlyRate}/hr • ₹{selectedRadarDriver.dailyRate}/day
                    </span>
                  </div>
                </div>

                {/* Simulated Telematics Readings */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle">
                    <span className="text-[10px] text-text-tertiary block font-bold">CURRENT SPEED</span>
                    <span className="text-base font-bold text-text-primary font-mono-code">
                      {selectedRadarDriver.currentStatus === 'online' ? '34 km/h' : '0 km/h (Parked)'}
                    </span>
                  </div>
                  <div className="bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle">
                    <span className="text-[10px] text-text-tertiary block font-bold">BATTERY / FUEL</span>
                    <span className="text-base font-bold text-status-active font-mono-code">92% Optimal</span>
                  </div>
                  <div className="bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle">
                    <span className="text-[10px] text-text-tertiary block font-bold">POSTGIS DISTANCE</span>
                    <span className="text-base font-bold text-primary font-mono-code">
                      {selectedRadarDriver.id === 'drv_2' ? '2.4 km' : selectedRadarDriver.id === 'drv_3' ? '1.1 km' : '3.6 km'}
                    </span>
                  </div>
                  <div className="bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle">
                    <span className="text-[10px] text-text-tertiary block font-bold">GEOFENCE STATUS</span>
                    <span className="text-base font-bold text-emerald-700 font-mono-code">Permitted Area</span>
                  </div>
                </div>

                {/* Qualified Fleet Badges */}
                <div>
                  <span className="text-[10px] font-bold text-text-tertiary uppercase block mb-1">Fleet Endorsements</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedRadarDriver.qualifiedVehicles.map((v, i) => (
                      <span key={i} className="text-[10px] font-medium bg-canvas-subtle px-2 py-0.5 rounded border border-border-subtle">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instant Actions */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border-divider">
                  <button 
                    onClick={() => {
                      alert(`Emergency Radio Ping dispatched to ${selectedRadarDriver.fullName} via Drivers Park Push API.`);
                    }}
                    className="w-full h-9 rounded-lg bg-primary text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary-hover shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Dispatch Emergency Radio Ping
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Dialing verified contact ${selectedRadarDriver.phoneNumber}...`);
                    }}
                    className="w-full h-9 rounded-lg bg-canvas-subtle hover:bg-surface-container border border-border-divider font-bold text-xs text-text-primary flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-status-active" /> Connect Operator Voice Line
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-canvas-base rounded-xl p-6 border border-border-divider text-center flex flex-col items-center justify-center gap-2">
                <Compass className="w-8 h-8 text-text-tertiary" />
                <h4 className="font-bold text-xs text-text-primary">Click on any Radar Node</h4>
                <p className="text-[11px] text-text-secondary">Select an operator on the spatial map to view their live GPS speed, battery, and telemetry link.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: EMERGENCY SOS INCIDENT ROOM */}
      {selectedSubTab === 'dispatches' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 flex flex-col gap-4">
            <div className="bg-canvas-base rounded-xl p-4 sm:p-5 border border-border-divider shadow-xs flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-divider">
                <div>
                  <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                    <Radio className="w-4 h-4 text-status-urgent animate-pulse" /> Emergency SOS Incident Escalation Center
                  </h3>
                  <p className="text-[11px] text-text-secondary mt-0.5">Real-time incident resolution with automated PostGIS re-routing & police liaison</p>
                </div>
                <span className="text-xs font-mono-code font-bold bg-error-container text-on-error-container px-2.5 py-1 rounded-full self-start sm:self-auto">
                  {incidents.filter(i => i.status === 'active').length} Active Incidents
                </span>
              </div>

              {/* Incidents Feed */}
              <div className="flex flex-col gap-3">
                {incidents.map((inc) => (
                  <div key={inc.id} className="p-4 bg-canvas-subtle rounded-xl border border-border-subtle flex flex-col gap-3 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono-code text-[10px] font-bold uppercase ${
                          inc.severity === 'critical' ? 'bg-status-urgent text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {inc.severity.toUpperCase()} ALERT
                        </span>
                        <h4 className="font-bold text-xs text-text-primary">{inc.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono-code text-text-tertiary">{inc.reportedTime}</span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed bg-white/60 p-2.5 rounded-lg border border-border-subtle">
                      {inc.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 border-t border-border-divider/60">
                      <div className="flex items-center gap-3 text-text-tertiary">
                        <span>Vehicle: <strong className="text-text-primary">{inc.vehicleType}</strong></span>
                        <span>•</span>
                        <span>Location: <strong className="text-text-primary">{inc.location}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            alert(`PostGIS algorithm re-assigning nearest standby operator to incident #${inc.id}...`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Auto-Assign Nearest Operator
                        </button>
                        <button 
                          onClick={() => {
                            setIncidents(prev => prev.map(i => i.id === inc.id ? { ...i, status: 'resolved' } : i));
                            alert(`Incident #${inc.id} marked resolved.`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-canvas-base hover:bg-surface-container border border-border-divider font-bold text-xs text-text-primary cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Broadcast Dispatches Monitor */}
            <div className="bg-canvas-base rounded-xl p-4 sm:p-5 border border-border-divider shadow-xs flex flex-col gap-3 text-left">
              <h4 className="font-bold text-xs text-text-primary uppercase tracking-wide border-b border-border-divider pb-2">
                Active Owner Dispatches in High-Velocity Ring
              </h4>
              <div className="flex flex-col gap-2">
                {dispatches.map((disp) => (
                  <div key={disp.id} className="p-3 bg-canvas-subtle rounded-lg border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code font-bold text-primary">{disp.id}</span>
                        <span className="font-bold text-text-primary">{disp.title}</span>
                      </div>
                      <span className="text-[11px] text-text-secondary block mt-0.5">
                        {disp.origin} ➔ {disp.destination} • Required: {disp.vehicle}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono-code font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                        ₹{disp.payout.toLocaleString()}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container animate-pulse uppercase">
                        {disp.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Escalation Protocol Sidebar */}
          <div className="xl:col-span-4 flex flex-col gap-4 text-left">
            <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-xs flex flex-col gap-3">
              <h4 className="font-bold text-xs text-text-primary uppercase tracking-wide border-b border-border-divider pb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-status-urgent" /> 24x7 Rapid Escalation Desk
              </h4>

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="p-3 rounded-lg bg-canvas-subtle border border-border-subtle">
                  <span className="font-bold text-text-primary block">NHAI Highway Road Assist</span>
                  <span className="text-text-secondary text-[11px]">Emergency Towing & Heavy Recovery Crane</span>
                  <button 
                    onClick={() => alert("Calling NHAI Highway Patrol Hotline (1033)...")} 
                    className="mt-2 w-full py-1.5 rounded bg-primary text-white font-bold text-xs hover:bg-primary/90 cursor-pointer"
                  >
                    Call NHAI Helpline (1033)
                  </button>
                </div>

                <div className="p-3 rounded-lg bg-canvas-subtle border border-border-subtle">
                  <span className="font-bold text-text-primary block">Bengaluru Traffic Police (BTP)</span>
                  <span className="text-text-secondary text-[11px]">Direct integration with Traffic Command Center</span>
                  <button 
                    onClick={() => alert("Dialing Police Emergency (112)...")} 
                    className="mt-2 w-full py-1.5 rounded bg-canvas-base border border-border-divider text-text-primary font-bold text-xs hover:bg-surface-container cursor-pointer"
                  >
                    Dial Police Control Room (112)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: INSTANT PAYOUTS & ESCROW LEDGER */}
      {selectedSubTab === 'payouts' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start text-left">
          <div className="xl:col-span-8 bg-canvas-base rounded-xl p-4 sm:p-5 border border-border-divider shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-divider">
              <div>
                <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-700" /> Razorpay UPI Instant Payouts & Escrow Ledger
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Automated disbursement pipeline with 0% platform deductions guarantee
                </p>
              </div>

              <button 
                onClick={handleExecuteBatchPayouts}
                disabled={payoutsBatchRunning}
                className="h-9 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Zap className={`w-3.5 h-3.5 ${payoutsBatchRunning ? 'animate-spin' : ''}`} />
                {payoutsBatchRunning ? 'Executing Batch Payout...' : 'Disburse All Queued Payouts'}
              </button>
            </div>

            {/* Payouts Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-border-divider text-text-tertiary font-bold uppercase text-[10px]">
                    <th className="pb-2">Payout ID</th>
                    <th className="pb-2">Operator</th>
                    <th className="pb-2">UPI VPA</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">UTR Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {payoutsList.map((p) => (
                    <tr key={p.id} className="hover:bg-canvas-subtle/50 transition-colors">
                      <td className="py-2.5 font-mono-code font-bold text-text-primary">{p.id}</td>
                      <td className="py-2.5 font-bold text-text-primary">{p.driverName}</td>
                      <td className="py-2.5 font-mono-code text-text-secondary">{p.vpa}</td>
                      <td className="py-2.5 font-mono-code font-bold text-emerald-700">₹{p.amount.toLocaleString()}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.status === 'SETTLED' ? 'bg-badge-aadhaar-bg text-badge-aadhaar-text' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono-code text-[11px] text-text-tertiary">{p.utrNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-xs flex flex-col gap-3">
              <span className="text-[10px] font-mono-code font-bold text-text-tertiary uppercase">Escrow Vault Summary</span>
              <div className="bg-canvas-subtle p-3 rounded-lg border border-border-subtle flex flex-col gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Disbursed Today:</span>
                  <span className="font-mono-code font-bold text-status-active">₹1,48,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Held in Active Escrow:</span>
                  <span className="font-mono-code font-bold text-text-primary">₹3,34,300</span>
                </div>
                <div className="flex justify-between border-t border-border-divider/50 pt-1.5">
                  <span className="text-text-secondary">Platform Deductions:</span>
                  <span className="font-mono-code font-bold text-emerald-700">₹0.00 (0% Promo)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: POSTGRESQL 16 REAL-TIME SQL STUDIO */}
      {selectedSubTab === 'database' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start text-left">
          <div className="xl:col-span-8 bg-canvas-base rounded-xl p-4 sm:p-5 border border-border-divider shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-divider">
              <div>
                <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" /> PostgreSQL 16 Real-Time SQL Studio
                </h3>
                <p className="text-[11px] text-text-secondary mt-0.5">
                  Direct client query execution with PostGIS spatial geometry inspection
                </p>
              </div>

              {sqlExecTime && (
                <span className="text-[11px] font-mono-code bg-canvas-subtle px-2.5 py-1 rounded border border-border-subtle text-status-active font-bold">
                  Latency: {sqlExecTime}ms
                </span>
              )}
            </div>

            {/* Quick SQL Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-[10px] uppercase font-bold text-text-tertiary shrink-0">Presets:</span>
              <button
                onClick={() => executePredefinedSql("SELECT id, full_name, aadhaar_status, hourly_rate, rating FROM drivers ORDER BY rating DESC LIMIT 5;")}
                className="px-2.5 py-1 rounded bg-canvas-subtle hover:bg-surface-container border border-border-subtle text-text-secondary font-mono-code text-[10px] whitespace-nowrap cursor-pointer"
              >
                drivers (top rated)
              </button>
              <button
                onClick={() => executePredefinedSql("SELECT id, title, vehicle, payout, status FROM dispatches;")}
                className="px-2.5 py-1 rounded bg-canvas-subtle hover:bg-surface-container border border-border-subtle text-text-secondary font-mono-code text-[10px] whitespace-nowrap cursor-pointer"
              >
                dispatches (active)
              </button>
              <button
                onClick={() => executePredefinedSql("SELECT id, driver_name, amount, status FROM payouts_ledger;")}
                className="px-2.5 py-1 rounded bg-canvas-subtle hover:bg-surface-container border border-border-subtle text-text-secondary font-mono-code text-[10px] whitespace-nowrap cursor-pointer"
              >
                payouts_ledger
              </button>
              <button
                onClick={() => executePredefinedSql("SELECT srid, auth_name, proj4text FROM spatial_ref_sys WHERE srid IN (4326, 3857);")}
                className="px-2.5 py-1 rounded bg-canvas-subtle hover:bg-surface-container border border-border-subtle text-text-secondary font-mono-code text-[10px] whitespace-nowrap cursor-pointer"
              >
                PostGIS ST_SRID
              </button>
            </div>

            {/* SQL Input Terminal */}
            <div className="relative">
              <textarea 
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={3}
                className="w-full p-3 font-mono-code text-xs bg-slate-950 text-emerald-400 rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
              />
              <button 
                onClick={() => executePredefinedSql(sqlQuery)}
                disabled={sqlExecuting}
                className="absolute right-3 bottom-3 px-3 py-1 bg-primary hover:bg-primary-hover text-white rounded font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Play className="w-3 h-3" /> Run Query
              </button>
            </div>

            {/* Result Table */}
            <div className="bg-canvas-subtle rounded-xl p-3 border border-border-subtle overflow-x-auto">
              <span className="text-[10px] font-mono-code font-bold text-text-tertiary block mb-2 uppercase">
                Query Result ({sqlResultRows.length} records)
              </span>
              {sqlResultRows.length > 0 ? (
                <table className="w-full text-[11px] font-mono-code">
                  <thead>
                    <tr className="border-b border-border-divider text-text-tertiary">
                      {Object.keys(sqlResultRows[0]).map((key) => (
                        <th key={key} className="pb-1.5 pr-3 text-left font-bold uppercase">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle/50">
                    {sqlResultRows.map((row, i) => (
                      <tr key={i} className="hover:bg-white/40">
                        {Object.values(row).map((val: any, j) => (
                          <td key={j} className="py-1.5 pr-3 text-text-primary whitespace-nowrap">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-xs text-text-tertiary">No rows returned.</div>
              )}
            </div>
          </div>

          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="bg-canvas-base rounded-xl p-5 border border-border-divider shadow-xs flex flex-col gap-3">
              <h4 className="font-bold text-xs text-text-primary uppercase tracking-wide border-b border-border-divider pb-2">
                PostgreSQL Schema Health
              </h4>
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between items-center bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle font-mono-code">
                  <span className="font-semibold text-text-primary">drivers</span>
                  <span className="text-status-active font-bold">842 rows</span>
                </div>
                <div className="flex justify-between items-center bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle font-mono-code">
                  <span className="font-semibold text-text-primary">emergency_dispatches</span>
                  <span className="text-status-active font-bold">14 rows</span>
                </div>
                <div className="flex justify-between items-center bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle font-mono-code">
                  <span className="font-semibold text-text-primary">payouts_ledger</span>
                  <span className="text-status-active font-bold">342 rows</span>
                </div>
                <div className="flex justify-between items-center bg-canvas-subtle p-2.5 rounded-lg border border-border-subtle font-mono-code">
                  <span className="font-semibold text-text-primary">spatial_telematics</span>
                  <span className="text-status-active font-bold">PostGIS 3.4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
