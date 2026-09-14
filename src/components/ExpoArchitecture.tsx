import React, { useState } from 'react';
import { Copy, Check, Code, Smartphone, Database, Zap } from 'lucide-react';

export default function ExpoArchitecture() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'map' | 'postgis' | 'webhook' | 'appjson'>('map');

  const triggerCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const codeSnippets = {
    map: {
      title: "React Native / Expo Map Component",
      description: "Custom Map component using react-native-maps targeting Android & iOS with dynamic, color-coded custom marker pins.",
      filename: "src/components/DriverRadarMap.tsx",
      code: `import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { DriverProfile } from '../types';

interface MapProps {
  drivers: DriverProfile[];
  ownerLocation: { latitude: number; longitude: number };
  searchRadiusKm: number;
}

export default function DriverRadarMap({ drivers, ownerLocation, searchRadiusKm }: MapProps) {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: ownerLocation.latitude,
          longitude: ownerLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Proximity Radius Circle */}
        <Circle
          center={ownerLocation}
          radius={searchRadiusKm * 1000}
          strokeColor="rgba(10, 102, 194, 0.4)"
          fillColor="rgba(10, 102, 194, 0.08)"
          strokeWidth={2}
        />

        {/* Current User Origin Marker */}
        <Marker coordinate={ownerLocation} title="You Are Here">
          <View style={styles.originMarker}>
            <View style={styles.originInner} />
          </View>
        </Marker>

        {/* Nearby Drivers Pin Markers */}
        {drivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: driver.location.lat,
              longitude: driver.location.lng,
            }}
            title={driver.fullName}
            description={\`\${driver.licenseCategory.join(', ')} • \${driver.experienceYears} yrs experience\`}
          >
            <View style={[
              styles.driverPin,
              driver.licenseCategory.includes('HEMM') ? styles.hemmPin : 
              driver.isAiAgent ? styles.aiPin : styles.lmvPin
            ]}>
              <Text style={styles.pinText}>
                {driver.licenseCategory.includes('PILOT') ? '✈️' :
                 driver.licenseCategory.includes('HEMM') ? '🚜' :
                 driver.isAiAgent ? '🤖' : '🚗'}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  originMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D11124',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  originInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  driverPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
  },
  lmvPin: { backgroundColor: '#057642' },
  hemmPin: { backgroundColor: '#0A66C2' },
  aiPin: { backgroundColor: '#6929C4' },
  pinText: { fontSize: 16 },
});`
    },
    postgis: {
      title: "Supabase PostGIS Custom Hook",
      description: "Custom React Hook utilizing Supabase client RPC to invoke get_nearby_drivers based on spatial locations.",
      filename: "src/hooks/useNearbyDrivers.ts",
      code: `import { useState, useEffect } from 'react';
import { supabase } from '../api/supabaseClient';
import { DriverProfile } from '../types';

export function useNearbyDrivers(
  latitude: number,
  longitude: number,
  radiusMeters: number,
  category?: string
) {
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchNearby() {
      try {
        setLoading(true);
        const { data, error: rpcError } = await supabase.rpc('get_nearby_drivers', {
          owner_lat: latitude,
          owner_long: longitude,
          max_distance_meters: radiusMeters,
          req_availability: 'online'
        });

        if (rpcError) throw rpcError;

        if (isMounted) {
          // If a category filter is active, refine results locally
          const filtered = category 
            ? (data as DriverProfile[]).filter(d => d.licenseCategory.includes(category as any))
            : (data as DriverProfile[]);
          setDrivers(filtered || []);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error fetching nearby drivers');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchNearby();

    // Subscribe to realtime location modifications
    const channel = supabase
      .channel('driver-location-stream')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'driver_profiles' },
        (payload) => {
          fetchNearby(); // Hot reload driver coordinates matching PostGIS criteria
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [latitude, longitude, radiusMeters, category]);

  return { drivers, loading, error };
}`
    },
    webhook: {
      title: "Supabase Deno Edge Function (Razorpay Webhook)",
      description: "Deno-based serverless typescript function deployed to Supabase to handle transactional Razorpay subscription updates.",
      filename: "supabase/functions/razorpay-webhook/index.ts",
      code: `import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req) => {
  try {
    const signature = req.headers.get("X-Razorpay-Signature");
    const bodyText = await req.text();

    if (!signature) {
      return new Response("Missing cryptographic signature", { status: 400 });
    }

    // Dynamic state evaluation
    const payload = JSON.parse(bodyText);
    const event = payload.event;
    
    console.log(\`[Razorpay Webhook] Received Event: \${event}\`);

    if (event === "subscription.charged") {
      const subscription = payload.payload.subscription.entity;
      const payment = payload.payload.payment.entity;

      const razorpaySubscriptionId = subscription.id;
      const periodEnd = new Date(subscription.current_end * 1000).toISOString();
      const customerEmail = payment.email;

      // Update local database record to enable instant premium access
      const { data: profile, error: prfError } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone_number", payment.contact)
        .single();

      if (profile) {
        const { error: subError } = await supabase
          .from("subscriptions")
          .upsert({
            user_id: profile.id,
            razorpay_subscription_id: razorpaySubscriptionId,
            tier: "pro_unlimited",
            status: "active",
            current_period_end: periodEnd,
          }, { onConflict: "razorpay_subscription_id" });

        if (subError) throw subError;
        console.log(\`Successfully activated subscription for User ID: \${profile.id}\`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook processing failed:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});`
    },
    appjson: {
      title: "Expo app.json Config (Cross-Platform)",
      description: "Multiplatform Android, iOS and Web configuration for Google Maps APIs, PostGIS permissions, and standalone builds.",
      filename: "app.json",
      code: `{
  "expo": {
    "name": "Drivers Park",
    "slug": "drivers-park",
    "version": "2.4.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.driverspark.app",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Drivers Park requires access to your coordinates to calculate real-time proximity to nearby on-duty drivers.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "Drivers Park requires location credentials to compute PostGIS radius metrics for fast driver-owner matches."
      }
    },
    "android": {
      "package": "com.driverspark.app",
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE"
      ],
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSy..." 
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      [
        "expo-location",
        {
          "locationAlwaysPermission": "Allow Drivers Park to calculate active PostGIS distances while the app runs in the background."
        }
      ]
    ]
  }
}`
    }
  };

  return (
    <div className="flex flex-col gap-6" id="architecture-hub">
      {/* Intro Header */}
      <div className="bg-canvas-base rounded-xl p-6 shadow-sm border border-border-divider relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-badge-category-bg flex items-center justify-center text-primary shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-badge-ai-bg text-badge-ai-text font-mono-code text-xs rounded-full mb-2">
              <Zap className="w-3.5 h-3.5" /> Ready for Expo SDK 50+
            </div>
            <h2 className="text-xl font-bold text-text-primary">Cross-Platform Mobile Architecture</h2>
            <p className="text-sm text-text-secondary mt-1 max-w-3xl">
              Drivers Park relies on a shared, unified codebase targeting **Android, iOS, and Web** utilizing Expo. 
              The backend architecture is anchored on Supabase with PostGIS spatial calculations and Razorpay 
              for seamless merchant settlements and user micro-transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Code Snippets Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Navigation Buttons */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider px-2">Core Code Modules</span>
          
          <button
            onClick={() => setActiveCodeTab('map')}
            className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
              activeCodeTab === 'map'
                ? 'bg-primary text-on-primary shadow-md shadow-primary/10'
                : 'bg-canvas-base hover:bg-canvas-subtle text-text-secondary'
            }`}
          >
            <Smartphone className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-sm">React Native Map Component</span>
              <span className={`text-xs block mt-1 ${activeCodeTab === 'map' ? 'text-primary-fixed-dim' : 'text-text-tertiary'}`}>
                Custom map markers, search circles, and Google Maps integration.
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveCodeTab('postgis')}
            className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
              activeCodeTab === 'postgis'
                ? 'bg-primary text-on-primary shadow-md shadow-primary/10'
                : 'bg-canvas-base hover:bg-canvas-subtle text-text-secondary'
            }`}
          >
            <Database className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-sm">Supabase PostGIS Hook</span>
              <span className={`text-xs block mt-1 ${activeCodeTab === 'postgis' ? 'text-primary-fixed-dim' : 'text-text-tertiary'}`}>
                Custom RPC call fetching nearby verified drivers with realtime updates.
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveCodeTab('webhook')}
            className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
              activeCodeTab === 'webhook'
                ? 'bg-primary text-on-primary shadow-md shadow-primary/10'
                : 'bg-canvas-base hover:bg-canvas-subtle text-text-secondary'
            }`}
          >
            <Code className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-sm">Razorpay Webhook Deno Function</span>
              <span className={`text-xs block mt-1 ${activeCodeTab === 'webhook' ? 'text-primary-fixed-dim' : 'text-text-tertiary'}`}>
                Supabase serverless edge function updating subscription tiers upon payment.
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveCodeTab('appjson')}
            className={`flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
              activeCodeTab === 'appjson'
                ? 'bg-primary text-on-primary shadow-md shadow-primary/10'
                : 'bg-canvas-base hover:bg-canvas-subtle text-text-secondary'
            }`}
          >
            <Zap className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-sm">Expo app.json Setup</span>
              <span className={`text-xs block mt-1 ${activeCodeTab === 'appjson' ? 'text-primary-fixed-dim' : 'text-text-tertiary'}`}>
                Android & iOS location descriptions, Google Maps keys, plugin parameters.
              </span>
            </div>
          </button>
        </div>

        {/* Right Side Code Viewer */}
        <div className="lg:col-span-8 bg-inverse-surface rounded-xl overflow-hidden shadow-md flex flex-col border border-slate-800">
          {/* Header Code Title */}
          <div className="bg-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-xs text-slate-400 font-mono-code ml-2 truncate">
                {codeSnippets[activeCodeTab].filename}
              </span>
            </div>
            <button
              onClick={() => triggerCopy(activeCodeTab, codeSnippets[activeCodeTab].code)}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-all"
            >
              {copiedSection === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-status-active" />
                  <span className="text-status-active">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Subtext info */}
          <div className="bg-slate-900/40 p-4 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">{codeSnippets[activeCodeTab].title}</h3>
            <p className="text-xs text-slate-400 mt-1">{codeSnippets[activeCodeTab].description}</p>
          </div>

          {/* Actual Code Area */}
          <div className="p-4 overflow-x-auto overflow-y-auto max-h-[500px]">
            <pre className="text-xs font-mono-code text-slate-200 text-left leading-relaxed">
              <code>{codeSnippets[activeCodeTab].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
