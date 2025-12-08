"use client";

import React from 'react';
import { X, Activity, TrendingDown, DollarSign, Wrench, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface WellDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    wellId: string;
    wellName?: string;
    basinName?: string;
}

// Mock production history data
const generateProductionHistory = () => {
    const data = [];
    let oil = 450;
    let gas = 180;
    for (let i = 0; i < 24; i++) {
        const month = new Date(2023, i % 12, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        oil = Math.max(50, oil * (0.96 + Math.random() * 0.02));
        gas = Math.max(30, gas * (0.95 + Math.random() * 0.03));
        data.push({ month, oil: Math.round(oil), gas: Math.round(gas), typeCurve: Math.round(500 * Math.pow(0.97, i)) });
    }
    return data;
};

// Mock cost breakdown
const costBreakdown = [
    { category: 'Lifting', value: 3.20, color: '#3b82f6' },
    { category: 'Workover', value: 1.50, color: '#f59e0b' },
    { category: 'Chemical', value: 0.80, color: '#10b981' },
    { category: 'Power', value: 1.20, color: '#8b5cf6' },
    { category: 'Labor', value: 1.10, color: '#ec4899' },
    { category: 'Other', value: 0.65, color: '#6b7280' },
];

// Mock event log
const eventLog = [
    { date: '2024-12-01', type: 'Maintenance', description: 'ESP pump replaced', status: 'Completed' },
    { date: '2024-11-15', type: 'Workover', description: 'Tubing pull and replace', status: 'Completed' },
    { date: '2024-10-28', type: 'Alarm', description: 'High motor temp alarm', status: 'Resolved' },
    { date: '2024-10-05', type: 'Chemical', description: 'Scale inhibitor treatment', status: 'Completed' },
    { date: '2024-09-18', type: 'Failure', description: 'Rod pump failure', status: 'Completed' },
];

const getEventTypeColor = (type: string) => {
    switch (type) {
        case 'Maintenance': return 'bg-blue-100 text-blue-700';
        case 'Workover': return 'bg-amber-100 text-amber-700';
        case 'Alarm': return 'bg-rose-100 text-rose-700';
        case 'Chemical': return 'bg-emerald-100 text-emerald-700';
        case 'Failure': return 'bg-red-100 text-red-700';
        default: return 'bg-zinc-100 text-zinc-700';
    }
};

const WellDetailModal: React.FC<WellDetailModalProps> = ({ isOpen, onClose, wellId, wellName = 'Well Details', basinName = 'Basin' }) => {
    if (!isOpen) return null;

    const productionData = generateProductionHistory();
    const totalLoe = costBreakdown.reduce((sum, c) => sum + c.value, 0);

    // Mock SCADA data
    const scadaData = {
        tubingPressure: 245,
        casingPressure: 180,
        linePressure: 120,
        motorAmps: 42,
        pumpSpeed: 58,
        status: 'Online'
    };

    // Mock profitability
    const profitability = {
        netback: 38.50,
        breakeven: 28.40,
        irr: 24.5,
        payoutMonths: 18,
        cashFlow: 125000
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-[95%] max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-zinc-800">{wellId}</h2>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${scadaData.status === 'Online' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {scadaData.status}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-500">{wellName} • {basinName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-3 gap-6">

                        {/* Left Column - Production & Decline */}
                        <div className="col-span-2 space-y-4">
                            {/* Production History Chart */}
                            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                                <h3 className="text-sm font-semibold text-zinc-800 mb-3">Production History & Decline Curve</h3>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={productionData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                                            <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#71717a' }} interval={3} />
                                            <YAxis tick={{ fontSize: 9, fill: '#71717a' }} />
                                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} />
                                            <Area type="monotone" dataKey="oil" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Oil (bbl/d)" />
                                            <Area type="monotone" dataKey="gas" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Gas (mcf/d)" />
                                            <Line type="monotone" dataKey="typeCurve" stroke="#f59e0b" strokeDasharray="5 5" name="Type Curve" dot={false} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-sm font-semibold text-zinc-800">Cost Breakdown ($/BOE)</h3>
                                    <span className="text-lg font-bold text-zinc-800">${totalLoe.toFixed(2)}</span>
                                </div>
                                <div className="h-32">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={costBreakdown} layout="vertical" margin={{ top: 0, right: 40, left: 0, bottom: 0 }}>
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="category" type="category" width={60} tick={{ fontSize: 10, fill: '#52525b' }} axisLine={false} tickLine={false} />
                                            <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '6px' }} formatter={(v: number) => [`$${v.toFixed(2)}`, '']} />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                                                {costBreakdown.map((entry, index) => (
                                                    <Cell key={index} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Event Log */}
                            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                                <h3 className="text-sm font-semibold text-zinc-800 mb-3">Event Log</h3>
                                <div className="space-y-2 max-h-32 overflow-auto">
                                    {eventLog.map((event, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs bg-white p-2 rounded border border-zinc-100">
                                            <span className="text-zinc-400 w-20">{event.date}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getEventTypeColor(event.type)}`}>{event.type}</span>
                                            <span className="flex-1 text-zinc-600">{event.description}</span>
                                            <CheckCircle size={14} className="text-emerald-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - SCADA & Profitability */}
                        <div className="space-y-4">
                            {/* SCADA Status */}
                            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                                <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" />
                                    SCADA Status
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white rounded p-2 border border-zinc-100">
                                        <div className="text-[10px] text-zinc-500">Tubing PSI</div>
                                        <div className="text-lg font-bold text-zinc-800">{scadaData.tubingPressure}</div>
                                    </div>
                                    <div className="bg-white rounded p-2 border border-zinc-100">
                                        <div className="text-[10px] text-zinc-500">Casing PSI</div>
                                        <div className="text-lg font-bold text-zinc-800">{scadaData.casingPressure}</div>
                                    </div>
                                    <div className="bg-white rounded p-2 border border-zinc-100">
                                        <div className="text-[10px] text-zinc-500">Line PSI</div>
                                        <div className="text-lg font-bold text-zinc-800">{scadaData.linePressure}</div>
                                    </div>
                                    <div className="bg-white rounded p-2 border border-zinc-100">
                                        <div className="text-[10px] text-zinc-500">Motor Amps</div>
                                        <div className="text-lg font-bold text-zinc-800">{scadaData.motorAmps}</div>
                                    </div>
                                    <div className="col-span-2 bg-white rounded p-2 border border-zinc-100">
                                        <div className="text-[10px] text-zinc-500">Pump Speed (Hz)</div>
                                        <div className="text-lg font-bold text-zinc-800">{scadaData.pumpSpeed}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Profitability Metrics */}
                            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                                <h3 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                                    <DollarSign size={14} className="text-emerald-500" />
                                    Profitability
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-500">Netback ($/BOE)</span>
                                        <span className="text-sm font-bold text-emerald-600">${profitability.netback}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-500">Breakeven ($/BOE)</span>
                                        <span className="text-sm font-bold text-zinc-800">${profitability.breakeven}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-500">IRR</span>
                                        <span className="text-sm font-bold text-blue-600">{profitability.irr}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-zinc-500">Payout</span>
                                        <span className="text-sm font-bold text-zinc-800">{profitability.payoutMonths} months</span>
                                    </div>
                                    <div className="pt-2 border-t border-zinc-200">
                                        <div className="text-xs text-zinc-500">Monthly Cash Flow</div>
                                        <div className="text-xl font-bold text-emerald-600">${(profitability.cashFlow / 1000).toFixed(0)}K</div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-zinc-600 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WellDetailModal;
