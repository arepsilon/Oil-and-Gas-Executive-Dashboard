"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { Circle as CircleIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import WellDetailModal from './WellDetailModal';
import { useFilters, basinMap, statusMap, liftMap, operatorMap, commodityMap } from '@/context/FilterContext';

// Dynamically import Leaflet components with SSR disabled
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const CircleMarker = dynamic(
    () => import('react-leaflet').then((mod) => mod.CircleMarker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

// Well data with lat/lng coordinates and ALL filter dimensions
const allWells = [
    // Permian Basin (West Texas) - around 31.8°N, 102.5°W
    { id: 'W001', name: 'Permian-ESP-001', basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', boe: 120, lat: 31.82, lng: -102.45 },
    { id: 'W002', name: 'Permian-RP-002', basin: 'Permian', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Oil', boe: 95, lat: 31.75, lng: -102.38 },
    { id: 'W003', name: 'Permian-GL-003', basin: 'Permian', status: 'Producing', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Both', boe: 110, lat: 31.88, lng: -102.55 },
    { id: 'W004', name: 'Permian-SI-004', basin: 'Permian', status: 'Shut-in', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', boe: 0, lat: 31.70, lng: -102.60 },
    { id: 'W005', name: 'Permian-WO-005', basin: 'Permian', status: 'Workover', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', boe: 0, lat: 31.92, lng: -102.35 },
    { id: 'W006', name: 'Permian-ESP-006', basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil', boe: 130, lat: 31.78, lng: -102.50 },
    // Eagle Ford (South Texas) - around 28.5°N, 99°W
    { id: 'W007', name: 'EagleFord-ESP-001', basin: 'Eagle Ford', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', boe: 90, lat: 28.52, lng: -98.95 },
    { id: 'W008', name: 'EagleFord-GL-002', basin: 'Eagle Ford', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas', boe: 85, lat: 28.58, lng: -99.10 },
    { id: 'W009', name: 'EagleFord-DN-003', basin: 'Eagle Ford', status: 'Down', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', boe: 0, lat: 28.45, lng: -99.05 },
    { id: 'W010', name: 'EagleFord-RP-004', basin: 'Eagle Ford', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Gas', boe: 75, lat: 28.65, lng: -98.85 },
    { id: 'W011', name: 'EagleFord-WO-005', basin: 'Eagle Ford', status: 'Workover', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas', boe: 0, lat: 28.40, lng: -99.20 },
    // Bakken (North Dakota) - around 48°N, 103°W
    { id: 'W012', name: 'Bakken-RP-001', basin: 'Bakken', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', boe: 100, lat: 48.12, lng: -103.15 },
    { id: 'W013', name: 'Bakken-ESP-002', basin: 'Bakken', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil', boe: 95, lat: 48.20, lng: -103.05 },
    { id: 'W014', name: 'Bakken-SI-003', basin: 'Bakken', status: 'Shut-in', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Gas', boe: 0, lat: 48.05, lng: -103.25 },
    { id: 'W015', name: 'Bakken-PL-004', basin: 'Bakken', status: 'Producing', liftType: 'Plunger', operator: 'Partner B', commodity: 'Gas', boe: 80, lat: 48.25, lng: -102.95 },
    // DJ Basin (Colorado) - around 40°N, 104.5°W
    { id: 'W016', name: 'DJBasin-PL-001', basin: 'DJ Basin', status: 'Producing', liftType: 'Plunger', operator: 'DGP Operated', commodity: 'Gas', boe: 60, lat: 40.15, lng: -104.55 },
    { id: 'W017', name: 'DJBasin-GL-002', basin: 'DJ Basin', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner A', commodity: 'Both', boe: 55, lat: 40.22, lng: -104.45 },
    { id: 'W018', name: 'DJBasin-WO-003', basin: 'DJ Basin', status: 'Workover', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', boe: 0, lat: 40.08, lng: -104.65 },
    { id: 'W019', name: 'DJBasin-RP-004', basin: 'DJ Basin', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Both', boe: 50, lat: 40.28, lng: -104.35 },
];

const getStatusColor = (status: string): string => {
    switch (status) {
        case 'Producing': return '#10b981';
        case 'Shut-in': return '#f59e0b';
        case 'Workover': return '#3b82f6';
        case 'Down': return '#ef4444';
        default: return '#71717a';
    }
};

const AssetMap = () => {
    const [selectedWell, setSelectedWell] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const { filters } = useFilters();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter wells based on ALL active filters
    const filteredWells = useMemo(() => {
        return allWells.filter(well => {
            if (filters.basin !== 'all' && well.basin !== basinMap[filters.basin]) return false;
            if (filters.wellStatus !== 'all' && well.status !== statusMap[filters.wellStatus]) return false;
            if (filters.liftType !== 'all' && well.liftType !== liftMap[filters.liftType]) return false;
            if (filters.operator !== 'all' && well.operator !== operatorMap[filters.operator]) return false;
            if (filters.commodity !== 'all') {
                const selectedCommodity = commodityMap[filters.commodity];
                if (selectedCommodity === 'Oil' && well.commodity !== 'Oil' && well.commodity !== 'Both') return false;
                if (selectedCommodity === 'Gas' && well.commodity !== 'Gas' && well.commodity !== 'Both') return false;
                if (selectedCommodity === 'Both' && well.commodity !== 'Both') return false;
            }
            return true;
        });
    }, [filters]);

    const isFiltered = filters.basin !== 'all' || filters.wellStatus !== 'all' || filters.liftType !== 'all'
        || filters.operator !== 'all' || filters.commodity !== 'all';

    return (
        <>
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-1 px-1">
                    <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                        Asset Map
                        {isFiltered && (
                            <span className="text-[10px] font-normal text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{filteredWells.length} wells</span>
                        )}
                    </h3>
                </div>

                <div className="flex-1 relative rounded-lg overflow-hidden border border-zinc-200">
                    {mounted ? (
                        <MapContainer
                            center={[39, -98]}
                            zoom={4}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                            zoomControl={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                            />
                            {filteredWells.map((well) => (
                                <CircleMarker
                                    key={well.id}
                                    center={[well.lat, well.lng]}
                                    radius={6}
                                    fillColor={getStatusColor(well.status)}
                                    color="#ffffff"
                                    weight={2}
                                    fillOpacity={0.9}
                                    eventHandlers={{
                                        click: () => setSelectedWell(well.id),
                                    }}
                                >
                                    <Popup>
                                        <div className="text-xs min-w-[120px]">
                                            <div className="font-bold text-zinc-800 mb-1">{well.name}</div>
                                            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-zinc-600">
                                                <span>Status:</span><span className="font-medium">{well.status}</span>
                                                <span>Basin:</span><span className="font-medium">{well.basin}</span>
                                                <span>Lift:</span><span className="font-medium">{well.liftType}</span>
                                                <span>BOE/d:</span><span className="font-medium">{well.boe}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-zinc-100">
                            <div className="text-xs text-zinc-500">Loading map...</div>
                        </div>
                    )}

                    {/* Legend */}
                    <div className="absolute bottom-1 left-1 bg-white/95 backdrop-blur-sm rounded p-1.5 text-[8px] shadow-sm border border-zinc-200 z-[1000]">
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                            <div className="flex items-center gap-1"><CircleIcon size={6} fill="#10b981" color="#10b981" /> Producing</div>
                            <div className="flex items-center gap-1"><CircleIcon size={6} fill="#f59e0b" color="#f59e0b" /> Shut-in</div>
                            <div className="flex items-center gap-1"><CircleIcon size={6} fill="#3b82f6" color="#3b82f6" /> Workover</div>
                            <div className="flex items-center gap-1"><CircleIcon size={6} fill="#ef4444" color="#ef4444" /> Down</div>
                        </div>
                    </div>
                </div>
            </div>

            <WellDetailModal
                isOpen={selectedWell !== null}
                onClose={() => setSelectedWell(null)}
                wellId={selectedWell || ''}
            />
        </>
    );
};

export default AssetMap;
