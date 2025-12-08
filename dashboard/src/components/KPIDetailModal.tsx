"use client";

import React from 'react';
import { X, Activity, DollarSign, TrendingDown, AlertTriangle, Droplets, Flame, Wrench, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface KPIDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: 'production' | 'financial' | 'cost' | 'asset';
}

// Mock data for each category
const productionByBasin = [
    { name: 'Permian', oil: 5200, gas: 15000, boe: 7700 },
    { name: 'Eagle Ford', oil: 2100, gas: 6500, boe: 3183 },
    { name: 'Bakken', oil: 680, gas: 2800, boe: 1147 },
    { name: 'DJ Basin', oil: 260, gas: 960, boe: 420 },
];

const productionTrend = [
    { month: 'Jul', actual: 11800, forecast: 12000 },
    { month: 'Aug', actual: 12100, forecast: 12100 },
    { month: 'Sep', actual: 12300, forecast: 12200 },
    { month: 'Oct', actual: 12450, forecast: 12350 },
    { month: 'Nov', actual: 12400, forecast: 12500 },
    { month: 'Dec', actual: 12450, forecast: 12600 },
];

const revenueByStream = [
    { name: 'Oil Sales', value: 3200000, color: '#10b981' },
    { name: 'Gas Sales', value: 800000, color: '#3b82f6' },
    { name: 'NGL Sales', value: 200000, color: '#8b5cf6' },
];

const costBreakdown = [
    { category: 'LOE', budget: 1200, actual: 1150 },
    { category: 'Workover', budget: 400, actual: 380 },
    { category: 'Chemical', budget: 200, actual: 210 },
    { category: 'Power', budget: 300, actual: 290 },
    { category: 'Labor', budget: 500, actual: 520 },
];

const wellStatus = [
    { name: 'Producing', value: 298, color: '#10b981' },
    { name: 'Shut-in', value: 22, color: '#f59e0b' },
    { name: 'Workover', value: 12, color: '#3b82f6' },
    { name: 'Down', value: 10, color: '#ef4444' },
];

const riskItems = [
    { well: 'P-105', issue: 'High decline rate (-12.3%)', severity: 'critical', daysOpen: 5 },
    { well: 'EF-203', issue: 'Down - ESP failure', severity: 'critical', daysOpen: 3 },
    { well: 'DJ-401', issue: 'Low casing pressure', severity: 'warning', daysOpen: 8 },
    { well: 'B-302', issue: 'Above LOE threshold', severity: 'warning', daysOpen: 12 },
    { well: 'P-103', issue: 'Workover delayed', severity: 'warning', daysOpen: 7 },
];

const getCategoryConfig = (category: string) => {
    switch (category) {
        case 'production':
            return { title: 'Production Performance', icon: <Activity size={20} className="text-brand-gold" />, color: '#10b981' };
        case 'financial':
            return { title: 'Financial Performance', icon: <DollarSign size={20} className="text-brand-gold" />, color: '#3b82f6' };
        case 'cost':
            return { title: 'Cost Efficiency', icon: <TrendingDown size={20} className="text-brand-gold" />, color: '#8b5cf6' };
        case 'asset':
            return { title: 'Asset Health', icon: <AlertTriangle size={20} className="text-brand-gold" />, color: '#f59e0b' };
        default:
            return { title: 'Details', icon: null, color: '#6b7280' };
    }
};

const KPIDetailModal: React.FC<KPIDetailModalProps> = ({ isOpen, onClose, category }) => {
    if (!isOpen) return null;

    const config = getCategoryConfig(category);

    const renderProductionContent = () => (
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Production by Basin (BOE/d)</h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productionByBasin} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ fontSize: '11px' }} />
                            <Bar dataKey="oil" fill="#10b981" name="Oil" stackId="a" />
                            <Bar dataKey="gas" fill="#3b82f6" name="Gas (BOE)" stackId="a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Actual vs Forecast Trend</h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={productionTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} domain={[11000, 13000]} />
                            <Tooltip contentStyle={{ fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} name="Actual" />
                            <Line type="monotone" dataKey="forecast" stroke="#94a3b8" strokeDasharray="5 5" name="Forecast" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="col-span-2 bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Basin Summary</h4>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-200">
                            <th className="py-2 text-left text-xs text-zinc-500 font-semibold">Basin</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">Oil (bbl/d)</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">Gas (mcf/d)</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">Total BOE/d</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">% of Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productionByBasin.map((basin) => (
                            <tr key={basin.name} className="border-b border-zinc-50">
                                <td className="py-2 font-medium text-zinc-800">{basin.name}</td>
                                <td className="py-2 text-right text-zinc-700">{basin.oil.toLocaleString()}</td>
                                <td className="py-2 text-right text-zinc-700">{basin.gas.toLocaleString()}</td>
                                <td className="py-2 text-right font-semibold text-zinc-800">{basin.boe.toLocaleString()}</td>
                                <td className="py-2 text-right text-zinc-500">{((basin.boe / 12450) * 100).toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderFinancialContent = () => (
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Revenue by Stream</h4>
                <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={revenueByStream} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                                {revenueByStream.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v: number) => `$${(v / 1000000).toFixed(2)}M`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Financial Summary</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-xs text-zinc-500">Gross Revenue (MTD)</span>
                        <span className="text-lg font-bold text-zinc-800">$4.2M</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-xs text-zinc-500">Operating Costs</span>
                        <span className="text-lg font-bold text-rose-600">-$1.8M</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-xs text-zinc-500">Net Operating Income</span>
                        <span className="text-lg font-bold text-emerald-600">$2.4M</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-xs text-zinc-500">Netback ($/BOE)</span>
                        <span className="text-lg font-bold text-blue-600">$42.50</span>
                    </div>
                </div>
            </div>
            <div className="col-span-2 bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Revenue by Basin</h4>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-200">
                            <th className="py-2 text-left text-xs text-zinc-500 font-semibold">Basin</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">Revenue</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">Costs</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">NOI</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">Margin</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-zinc-50"><td className="py-2 font-medium text-zinc-800">Permian</td><td className="py-2 text-right text-zinc-700">$2.6M</td><td className="py-2 text-right text-zinc-700">$1.0M</td><td className="py-2 text-right font-semibold text-emerald-600">$1.6M</td><td className="py-2 text-right text-zinc-700">61.5%</td></tr>
                        <tr className="border-b border-zinc-50"><td className="py-2 font-medium text-zinc-800">Eagle Ford</td><td className="py-2 text-right text-zinc-700">$1.1M</td><td className="py-2 text-right text-zinc-700">$0.5M</td><td className="py-2 text-right font-semibold text-emerald-600">$0.6M</td><td className="py-2 text-right text-zinc-700">54.5%</td></tr>
                        <tr className="border-b border-zinc-50"><td className="py-2 font-medium text-zinc-800">Bakken</td><td className="py-2 text-right text-zinc-700">$0.4M</td><td className="py-2 text-right text-zinc-700">$0.2M</td><td className="py-2 text-right font-semibold text-emerald-600">$0.2M</td><td className="py-2 text-right text-zinc-700">50.0%</td></tr>
                        <tr><td className="py-2 font-medium text-zinc-800">DJ Basin</td><td className="py-2 text-right text-zinc-700">$0.1M</td><td className="py-2 text-right text-zinc-700">$0.1M</td><td className="py-2 text-right font-semibold text-amber-600">$0.0M</td><td className="py-2 text-right text-zinc-700">35.0%</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderCostContent = () => (
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Budget vs Actual ($K)</h4>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costBreakdown} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                            <XAxis type="number" tick={{ fontSize: 10 }} />
                            <YAxis dataKey="category" type="category" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ fontSize: '11px' }} />
                            <Legend wrapperStyle={{ fontSize: '10px' }} />
                            <Bar dataKey="budget" fill="#94a3b8" name="Budget" />
                            <Bar dataKey="actual" fill="#8b5cf6" name="Actual" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Cost Metrics</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-xs text-zinc-500">LOE per BOE</span>
                        <span className="text-lg font-bold text-emerald-600">$8.45 <span className="text-xs text-zinc-400">(Budget: $8.80)</span></span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-xs text-zinc-500">Total OPEX Variance</span>
                        <span className="text-lg font-bold text-emerald-600">-1.2%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-xs text-zinc-500">Breakeven Price</span>
                        <span className="text-lg font-bold text-amber-600">$32.00 <span className="text-xs text-zinc-400">(Tgt: $30)</span></span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-xs text-zinc-500">Cost per Well/Month</span>
                        <span className="text-lg font-bold text-zinc-800">$7,850</span>
                    </div>
                </div>
            </div>
            <div className="col-span-2 bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">LOE by Basin ($/BOE)</h4>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-zinc-200">
                            <th className="py-2 text-left text-xs text-zinc-500 font-semibold">Basin</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">LOE</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">Budget</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">Variance</th>
                            <th className="py-2 text-right text-xs text-zinc-500 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-zinc-50"><td className="py-2 font-medium text-zinc-800">Permian</td><td className="py-2 text-right text-zinc-700">$8.45</td><td className="py-2 text-right text-zinc-700">$8.80</td><td className="py-2 text-right font-semibold text-emerald-600">-4.0%</td><td className="py-2 text-right"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Under</span></td></tr>
                        <tr className="border-b border-zinc-50"><td className="py-2 font-medium text-zinc-800">Eagle Ford</td><td className="py-2 text-right text-zinc-700">$11.20</td><td className="py-2 text-right text-zinc-700">$10.50</td><td className="py-2 text-right font-semibold text-rose-600">+6.7%</td><td className="py-2 text-right"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">Over</span></td></tr>
                        <tr className="border-b border-zinc-50"><td className="py-2 font-medium text-zinc-800">Bakken</td><td className="py-2 text-right text-zinc-700">$6.80</td><td className="py-2 text-right text-zinc-700">$7.00</td><td className="py-2 text-right font-semibold text-emerald-600">-2.9%</td><td className="py-2 text-right"><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Under</span></td></tr>
                        <tr><td className="py-2 font-medium text-zinc-800">DJ Basin</td><td className="py-2 text-right text-zinc-700">$14.50</td><td className="py-2 text-right text-zinc-700">$12.00</td><td className="py-2 text-right font-semibold text-rose-600">+20.8%</td><td className="py-2 text-right"><span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">Over</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderAssetContent = () => (
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Well Status Distribution</h4>
                <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={wellStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                                {wellStatus.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3">Asset Summary</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-xs text-zinc-500">Total Active Wells</span>
                        <span className="text-lg font-bold text-zinc-800">342</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-xs text-zinc-500">Producing</span>
                        <span className="text-lg font-bold text-emerald-600">298 (87%)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-zinc-100">
                        <span className="text-xs text-zinc-500">Total Downtime (MTD)</span>
                        <span className="text-lg font-bold text-rose-600">48h</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-xs text-zinc-500">Uptime %</span>
                        <span className="text-lg font-bold text-emerald-600">99.3%</span>
                    </div>
                </div>
            </div>
            <div className="col-span-2 bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                <h4 className="text-sm font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                    <AlertCircle size={14} className="text-rose-500" />
                    Risk Flags ({riskItems.length})
                </h4>
                <div className="space-y-2 max-h-40 overflow-auto">
                    {riskItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs bg-white p-2 rounded border border-zinc-100">
                            <span className="font-medium text-zinc-800 w-16">{item.well}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${item.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{item.severity}</span>
                            <span className="flex-1 text-zinc-600">{item.issue}</span>
                            <span className="text-zinc-400">{item.daysOpen}d open</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {config.icon}
                        <div>
                            <h2 className="text-xl font-bold text-zinc-800">{config.title}</h2>
                            <p className="text-xs text-zinc-500">Detailed breakdown and analysis</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {category === 'production' && renderProductionContent()}
                    {category === 'financial' && renderFinancialContent()}
                    {category === 'cost' && renderCostContent()}
                    {category === 'asset' && renderAssetContent()}
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

export default KPIDetailModal;
