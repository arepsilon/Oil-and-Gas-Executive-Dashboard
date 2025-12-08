"use client";

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ComposedChart, Area, Line } from 'recharts';
import { useFilters, basinMap, statusMap, liftMap, operatorMap, commodityMap, getMonthsForDateRange } from '@/context/FilterContext';

// Well-level AFE data with ALL filter dimensions
const allWellsAFE = [
    // Permian wells
    { basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', approved: 1.8, spent: 1.5, burndown: [100, 88, 76, 64, 52, 40, 28, 18, 8, 5, 3, 1] },
    { basin: 'Permian', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Oil', approved: 1.2, spent: 1.1, burndown: [100, 90, 80, 70, 60, 50, 40, 30, 20, 15, 10, 5] },
    { basin: 'Permian', status: 'Producing', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Both', approved: 1.5, spent: 1.3, burndown: [100, 88, 76, 64, 52, 40, 28, 18, 8, 4, 2, 0] },
    { basin: 'Permian', status: 'Shut-in', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', approved: 0.8, spent: 0.9, burndown: [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45] },
    // Eagle Ford wells
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', approved: 1.0, spent: 1.2, burndown: [100, 95, 92, 88, 85, 82, 78, 75, 72, 68, 65, 62] },
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas', approved: 0.9, spent: 0.95, burndown: [100, 92, 84, 76, 68, 60, 52, 44, 36, 28, 20, 12] },
    { basin: 'Eagle Ford', status: 'Down', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', approved: 0.7, spent: 0.8, burndown: [100, 95, 90, 90, 90, 90, 90, 90, 90, 88, 85, 82] },
    // Bakken wells
    { basin: 'Bakken', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', approved: 1.4, spent: 1.2, burndown: [100, 85, 70, 55, 40, 30, 20, 12, 5, 2, 1, 0] },
    { basin: 'Bakken', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil', approved: 1.3, spent: 1.1, burndown: [100, 86, 72, 58, 44, 32, 22, 14, 6, 3, 1, 0] },
    { basin: 'Bakken', status: 'Producing', liftType: 'Plunger', operator: 'Partner B', commodity: 'Gas', approved: 0.9, spent: 0.8, burndown: [100, 88, 76, 64, 52, 40, 28, 18, 8, 4, 2, 0] },
    // DJ Basin wells
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Plunger', operator: 'DGP Operated', commodity: 'Gas', approved: 0.7, spent: 0.55, burndown: [100, 90, 80, 70, 60, 50, 42, 35, 28, 22, 18, 15] },
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner A', commodity: 'Both', approved: 0.6, spent: 0.5, burndown: [100, 88, 76, 64, 55, 48, 40, 35, 30, 25, 20, 15] },
    { basin: 'DJ Basin', status: 'Workover', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', approved: 0.5, spent: 0.6, burndown: [100, 100, 98, 95, 92, 90, 88, 85, 82, 80, 78, 75] },
];

// Capex by Category Data
const capexCategoryData = [
    { name: 'Drilling', value: 45, color: '#3b82f6' },
    { name: 'Completion', value: 35, color: '#10b981' },
    { name: 'Facilities', value: 20, color: '#8b5cf6' },
];

const AFECapexTracking = () => {
    const { filters } = useFilters();

    // Filter wells based on ALL active filters
    const filteredWells = useMemo(() => {
        return allWellsAFE.filter(well => {
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

    // Get months to display based on date range filter
    const displayMonths = useMemo(() => getMonthsForDateRange(filters.dateRange), [filters.dateRange]);
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Aggregate AFE spend by basin
    const afeSpendData = useMemo(() => {
        const basinAggregate = new Map<string, { approved: number; spent: number }>();

        filteredWells.forEach(well => {
            const existing = basinAggregate.get(well.basin) || { approved: 0, spent: 0 };
            basinAggregate.set(well.basin, {
                approved: existing.approved + well.approved,
                spent: existing.spent + well.spent,
            });
        });

        return Array.from(basinAggregate.entries())
            .map(([name, data]) => ({
                name,
                approved: parseFloat(data.approved.toFixed(1)),
                spent: parseFloat(data.spent.toFixed(1)),
            }))
            .sort((a, b) => b.approved - a.approved);
    }, [filteredWells]);

    // Aggregate burndown data
    const burndownData = useMemo(() => {
        if (filteredWells.length === 0) {
            return displayMonths.map(month => ({ month, planned: 100, actual: 100 }));
        }

        return displayMonths.map((month) => {
            const monthIdx = allMonths.indexOf(month);
            let totalActual = 0;
            filteredWells.forEach(well => {
                totalActual += well.burndown[monthIdx] || 0;
            });
            const avgActual = totalActual / filteredWells.length;
            const planned = 100 - (monthIdx * 8);

            return {
                month,
                planned: Math.max(0, planned),
                actual: Math.round(avgActual),
            };
        });
    }, [filteredWells, displayMonths]);

    const isFiltered = filters.basin !== 'all' || filters.wellStatus !== 'all' || filters.liftType !== 'all'
        || filters.operator !== 'all' || filters.commodity !== 'all' || filters.dateRange !== 'mtd';

    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-800">AFE & Capex Tracking</h2>
                {isFiltered && (
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{filteredWells.length} wells</span>
                )}
            </div>

            <div className="flex-1 grid grid-rows-3 gap-0 p-2 min-h-0">
                {/* 1. AFE Spend vs Approved Budget */}
                <div className="flex flex-col border-b border-zinc-100 pb-2">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1">AFE Spend vs Budget ($M)</h4>
                    <div className="flex-1 min-h-0">
                        {afeSpendData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-xs text-zinc-400">No data</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={afeSpendData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                                    <XAxis type="number" tick={{ fontSize: 8, fill: '#71717a' }} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" width={75} tick={{ fontSize: 8, fill: '#52525b' }} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '4px', padding: '4px' }} />
                                    <Bar dataKey="approved" fill="#94a3b8" name="Approved" barSize={8} radius={[0, 2, 2, 0]} />
                                    <Bar dataKey="spent" name="Spent" barSize={8} radius={[0, 2, 2, 0]}>
                                        {afeSpendData.map((entry, index) => (
                                            <Cell key={index} fill={entry.spent > entry.approved ? '#ef4444' : '#10b981'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* 2. AFE Burn-down Chart */}
                <div className="flex flex-col border-b border-zinc-100 py-2">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1">AFE Burn-down (%)</h4>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={burndownData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="month" tick={{ fontSize: 8, fill: '#71717a' }} tickLine={false} axisLine={false} interval={Math.max(0, Math.floor(burndownData.length / 4) - 1)} />
                                <YAxis tick={{ fontSize: 8, fill: '#71717a' }} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '4px', padding: '4px' }} />
                                <Area type="monotone" dataKey="planned" fill="#e0e7ff" stroke="#6366f1" strokeWidth={1} strokeDasharray="3 3" fillOpacity={0.3} name="Planned" />
                                <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2, fill: '#3b82f6' }} name="Actual" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Capex by Category */}
                <div className="flex flex-col pt-2">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide mb-1">Capex by Category</h4>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={capexCategoryData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#71717a' }} tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 8, fill: '#71717a' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '4px', padding: '4px' }} formatter={(v: number) => [`${v}%`, 'Share']} />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                                    {capexCategoryData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AFECapexTracking;
