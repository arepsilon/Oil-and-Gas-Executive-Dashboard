"use client";

import React, { useState } from 'react';
import { X, Activity, DollarSign, TrendingDown, Droplets, Flame, AlertCircle, ChevronRight } from 'lucide-react';
import WellDetailModal from './WellDetailModal';

interface Well {
    id: string;
    name: string;
    status: 'Producing' | 'Shut-in' | 'Down' | 'Workover';
    liftType: 'ESP' | 'Rod Pump' | 'Gas Lift' | 'Plunger';
    boe: number;
    oil: number;
    gas: number;
    decline: number;
    loe: number;
    health: 'good' | 'warning' | 'critical';
}

interface BasinDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    basinName: string;
}

// Mock well data by basin
const wellDataByBasin: Record<string, Well[]> = {
    'Permian': [
        { id: 'P-101', name: 'Permian Well 101', status: 'Producing', liftType: 'ESP', boe: 520, oil: 380, gas: 140, decline: -6.2, loe: 7.80, health: 'good' },
        { id: 'P-102', name: 'Permian Well 102', status: 'Producing', liftType: 'Rod Pump', boe: 480, oil: 350, gas: 130, decline: -8.5, loe: 8.20, health: 'good' },
        { id: 'P-103', name: 'Permian Well 103', status: 'Workover', liftType: 'ESP', boe: 0, oil: 0, gas: 0, decline: 0, loe: 0, health: 'warning' },
        { id: 'P-104', name: 'Permian Well 104', status: 'Producing', liftType: 'Gas Lift', boe: 620, oil: 450, gas: 170, decline: -5.1, loe: 6.90, health: 'good' },
        { id: 'P-105', name: 'Permian Well 105', status: 'Producing', liftType: 'ESP', boe: 390, oil: 280, gas: 110, decline: -12.3, loe: 11.50, health: 'critical' },
        { id: 'P-106', name: 'Permian Well 106', status: 'Shut-in', liftType: 'Rod Pump', boe: 0, oil: 0, gas: 0, decline: 0, loe: 0, health: 'warning' },
    ],
    'Eagle Ford': [
        { id: 'EF-201', name: 'Eagle Ford Well 201', status: 'Producing', liftType: 'ESP', boe: 680, oil: 520, gas: 160, decline: -4.5, loe: 6.20, health: 'good' },
        { id: 'EF-202', name: 'Eagle Ford Well 202', status: 'Producing', liftType: 'Gas Lift', boe: 540, oil: 400, gas: 140, decline: -7.8, loe: 8.90, health: 'good' },
        { id: 'EF-203', name: 'Eagle Ford Well 203', status: 'Down', liftType: 'ESP', boe: 0, oil: 0, gas: 0, decline: 0, loe: 0, health: 'critical' },
        { id: 'EF-204', name: 'Eagle Ford Well 204', status: 'Producing', liftType: 'Plunger', boe: 320, oil: 240, gas: 80, decline: -15.2, loe: 14.20, health: 'critical' },
    ],
    'Bakken': [
        { id: 'B-301', name: 'Bakken Well 301', status: 'Producing', liftType: 'Rod Pump', boe: 420, oil: 310, gas: 110, decline: -5.8, loe: 7.40, health: 'good' },
        { id: 'B-302', name: 'Bakken Well 302', status: 'Producing', liftType: 'ESP', boe: 380, oil: 280, gas: 100, decline: -9.2, loe: 9.80, health: 'warning' },
        { id: 'B-303', name: 'Bakken Well 303', status: 'Producing', liftType: 'Gas Lift', boe: 510, oil: 380, gas: 130, decline: -6.1, loe: 7.10, health: 'good' },
    ],
    'DJ Basin': [
        { id: 'DJ-401', name: 'DJ Basin Well 401', status: 'Producing', liftType: 'Plunger', boe: 280, oil: 200, gas: 80, decline: -8.4, loe: 10.20, health: 'warning' },
        { id: 'DJ-402', name: 'DJ Basin Well 402', status: 'Producing', liftType: 'Rod Pump', boe: 340, oil: 250, gas: 90, decline: -7.1, loe: 8.50, health: 'good' },
        { id: 'DJ-403', name: 'DJ Basin Well 403', status: 'Workover', liftType: 'ESP', boe: 0, oil: 0, gas: 0, decline: 0, loe: 0, health: 'warning' },
    ],
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Producing': return 'bg-emerald-100 text-emerald-700';
        case 'Shut-in': return 'bg-rose-100 text-rose-700';
        case 'Down': return 'bg-amber-100 text-amber-700';
        case 'Workover': return 'bg-blue-100 text-blue-700';
        default: return 'bg-zinc-100 text-zinc-700';
    }
};

const getHealthColor = (health: string) => {
    switch (health) {
        case 'good': return 'bg-emerald-500';
        case 'warning': return 'bg-amber-500';
        case 'critical': return 'bg-rose-500';
        default: return 'bg-zinc-400';
    }
};

const BasinDetailModal: React.FC<BasinDetailModalProps> = ({ isOpen, onClose, basinName }) => {
    const [selectedWell, setSelectedWell] = useState<Well | null>(null);

    if (!isOpen) return null;

    const wells = wellDataByBasin[basinName] || [];
    const producingWells = wells.filter(w => w.status === 'Producing');
    const totalBoe = producingWells.reduce((sum, w) => sum + w.boe, 0);
    const totalOil = producingWells.reduce((sum, w) => sum + w.oil, 0);
    const totalGas = producingWells.reduce((sum, w) => sum + w.gas, 0);
    const avgLoe = producingWells.length > 0 ? producingWells.reduce((sum, w) => sum + w.loe, 0) / producingWells.length : 0;

    return (
        <>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-zinc-800">{basinName} Basin</h2>
                            <p className="text-xs text-zinc-500">{wells.length} Wells • {producingWells.length} Producing • Click a well for details</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            <X size={20} className="text-zinc-500" />
                        </button>
                    </div>

                    {/* Summary Cards */}
                    <div className="px-6 py-4 bg-zinc-50/50 grid grid-cols-4 gap-4">
                        <div className="bg-white rounded-lg p-3 border border-zinc-100 shadow-sm">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                                <Activity size={14} />
                                Total BOE/d
                            </div>
                            <div className="text-xl font-bold text-zinc-800">{totalBoe.toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-zinc-100 shadow-sm">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                                <Droplets size={14} />
                                Oil (bbl/d)
                            </div>
                            <div className="text-xl font-bold text-zinc-800">{totalOil.toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-zinc-100 shadow-sm">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                                <Flame size={14} />
                                Gas (mcf/d)
                            </div>
                            <div className="text-xl font-bold text-zinc-800">{totalGas.toLocaleString()}</div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-zinc-100 shadow-sm">
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                                <DollarSign size={14} />
                                Avg LOE ($/boe)
                            </div>
                            <div className="text-xl font-bold text-zinc-800">${avgLoe.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Well Table */}
                    <div className="flex-1 overflow-auto px-6 py-4">
                        <table className="w-full text-left">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-zinc-200">
                                    <th className="py-2 text-xs font-semibold text-zinc-500 uppercase">Well</th>
                                    <th className="py-2 text-xs font-semibold text-zinc-500 uppercase text-center">Status</th>
                                    <th className="py-2 text-xs font-semibold text-zinc-500 uppercase text-center">Lift Type</th>
                                    <th className="py-2 text-xs font-semibold text-zinc-500 uppercase text-right">BOE/d</th>
                                    <th className="py-2 text-xs font-semibold text-zinc-500 uppercase text-right">Oil</th>
                                    <th className="py-2 text-xs font-semibold text-zinc-500 uppercase text-right">Gas</th>
                                    <th className="py-2 text-xs font-semibold text-zinc-500 uppercase text-right">Decline</th>
                                    <th className="py-2 text-xs font-semibold text-zinc-500 uppercase text-right">LOE</th>
                                    <th className="py-2 text-xs font-semibold text-zinc-500 uppercase text-center">Health</th>
                                </tr>
                            </thead>
                            <tbody>
                                {wells.map((well) => (
                                    <tr
                                        key={well.id}
                                        className="border-b border-zinc-50 hover:bg-blue-50 transition-colors cursor-pointer group"
                                        onClick={() => setSelectedWell(well)}
                                    >
                                        <td className="py-3">
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm font-medium text-zinc-800">{well.id}</span>
                                                <ChevronRight size={14} className="text-zinc-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                            <div className="text-[10px] text-zinc-400">{well.name}</div>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(well.status)}`}>
                                                {well.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-center text-xs text-zinc-600">{well.liftType}</td>
                                        <td className="py-3 text-right text-sm font-medium text-zinc-800">{well.boe > 0 ? well.boe.toLocaleString() : '-'}</td>
                                        <td className="py-3 text-right text-xs text-zinc-600">{well.oil > 0 ? well.oil.toLocaleString() : '-'}</td>
                                        <td className="py-3 text-right text-xs text-zinc-600">{well.gas > 0 ? well.gas.toLocaleString() : '-'}</td>
                                        <td className="py-3 text-right text-xs text-zinc-600">{well.decline !== 0 ? `${well.decline}%` : '-'}</td>
                                        <td className="py-3 text-right text-xs text-zinc-600">{well.loe > 0 ? `$${well.loe.toFixed(2)}` : '-'}</td>
                                        <td className="py-3 text-center">
                                            <div className={`w-3 h-3 rounded-full mx-auto ${getHealthColor(well.health)}`}></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            {/* Well Detail Modal */}
            <WellDetailModal
                isOpen={selectedWell !== null}
                onClose={() => setSelectedWell(null)}
                wellId={selectedWell?.id || ''}
                wellName={selectedWell?.name || ''}
                basinName={basinName}
            />
        </>
    );
};

export default BasinDetailModal;
