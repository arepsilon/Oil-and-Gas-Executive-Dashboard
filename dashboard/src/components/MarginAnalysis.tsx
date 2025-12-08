"use client";

import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { useFilters, basinMap, statusMap, liftMap, operatorMap, commodityMap, getMonthsForDateRange } from '@/context/FilterContext';
import RevenueWaterfallChart from './RevenueWaterfallChart';

// Well-level financial data with ALL filter dimensions
const allWellsFinancial = [
    // Permian wells
    { basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', netback: 48, margin: 32, breakeven: 25 },
    { basin: 'Permian', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Oil', netback: 42, margin: 28, breakeven: 28 },
    { basin: 'Permian', status: 'Producing', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Both', netback: 45, margin: 30, breakeven: 26 },
    { basin: 'Permian', status: 'Shut-in', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', netback: 0, margin: 0, breakeven: 35 },
    { basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil', netback: 50, margin: 34, breakeven: 24 },
    // Eagle Ford wells
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', netback: 40, margin: 26, breakeven: 32 },
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas', netback: 38, margin: 24, breakeven: 34 },
    { basin: 'Eagle Ford', status: 'Down', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', netback: 0, margin: 0, breakeven: 40 },
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Gas', netback: 35, margin: 22, breakeven: 36 },
    // Bakken wells
    { basin: 'Bakken', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', netback: 42, margin: 28, breakeven: 30 },
    { basin: 'Bakken', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil', netback: 40, margin: 26, breakeven: 31 },
    { basin: 'Bakken', status: 'Producing', liftType: 'Plunger', operator: 'Partner B', commodity: 'Gas', netback: 38, margin: 24, breakeven: 32 },
    // DJ Basin wells
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Plunger', operator: 'DGP Operated', commodity: 'Gas', netback: 32, margin: 18, breakeven: 38 },
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner A', commodity: 'Both', netback: 30, margin: 16, breakeven: 40 },
    { basin: 'DJ Basin', status: 'Workover', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', netback: 0, margin: 0, breakeven: 45 },
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Both', netback: 28, margin: 14, breakeven: 42 },
];

// Netback trend by month
const netbackTrend = [
    { month: 'Jan', value: 38 }, { month: 'Feb', value: 40 }, { month: 'Mar', value: 39 },
    { month: 'Apr', value: 42 }, { month: 'May', value: 41 }, { month: 'Jun', value: 43 },
    { month: 'Jul', value: 45 }, { month: 'Aug', value: 44 }, { month: 'Sep', value: 46 },
    { month: 'Oct', value: 47 }, { month: 'Nov', value: 48 }, { month: 'Dec', value: 50 },
];

const MarginAnalysis = () => {
    const { filters } = useFilters();

    // Filter wells based on ALL active filters
    const filteredWells = useMemo(() => {
        return allWellsFinancial.filter(well => {
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

    // Calculate adjusted netback trend
    const netbackData = useMemo(() => {
        const producingWells = filteredWells.filter(w => w.netback > 0);
        const avgNetback = producingWells.length > 0
            ? producingWells.reduce((sum, w) => sum + w.netback, 0) / producingWells.length
            : 0;
        const adjustment = avgNetback - 42;

        return netbackTrend
            .filter(d => displayMonths.includes(d.month))
            .map(d => ({
                ...d,
                value: Math.max(0, d.value + adjustment)
            }));
    }, [filteredWells, displayMonths]);

    // Aggregate margin by basin
    const marginData = useMemo(() => {
        const basinAggregate = new Map<string, { margin: number; count: number }>();

        filteredWells.forEach(well => {
            if (well.margin > 0) {
                const existing = basinAggregate.get(well.basin) || { margin: 0, count: 0 };
                basinAggregate.set(well.basin, {
                    margin: existing.margin + well.margin,
                    count: existing.count + 1,
                });
            }
        });

        return Array.from(basinAggregate.entries())
            .map(([name, data]) => ({
                name,
                value: data.count > 0 ? Math.round(data.margin / data.count) : 0
            }))
            .filter(d => d.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [filteredWells]);

    // Breakeven distribution
    const breakevenData = useMemo(() => {
        const ranges = [
            { range: '<$20', min: 0, max: 20, count: 0 },
            { range: '$20-30', min: 20, max: 30, count: 0 },
            { range: '$30-40', min: 30, max: 40, count: 0 },
            { range: '$40-50', min: 40, max: 50, count: 0 },
            { range: '>$50', min: 50, max: 999, count: 0 },
        ];

        filteredWells.forEach(well => {
            for (const range of ranges) {
                if (well.breakeven >= range.min && well.breakeven < range.max) {
                    range.count++;
                    break;
                }
            }
        });

        return ranges.map(r => ({ range: r.range, count: r.count }));
    }, [filteredWells]);

    const isFiltered = filters.basin !== 'all' || filters.wellStatus !== 'all' || filters.liftType !== 'all'
        || filters.operator !== 'all' || filters.commodity !== 'all' || filters.dateRange !== 'mtd';

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 grid grid-cols-2 grid-rows-[1.2fr_1fr_1fr] gap-0">
                {/* 1. Revenue Waterfall */}
                <div className="flex flex-col border-b border-zinc-100 p-2 col-span-2">
                    <RevenueWaterfallChart />
                </div>

                {/* 2. Netback Trend */}
                <div className="flex flex-col border-b border-zinc-100 p-2">
                    <h4 className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                        Netback per BOE ($)
                        {isFiltered && <span className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-[8px] font-medium normal-case">{filteredWells.length} wells</span>}
                    </h4>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={netbackData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#71717a' }} interval={Math.max(0, Math.floor(netbackData.length / 4) - 1)} tickLine={false} axisLine={false} dy={5} />
                                <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fontSize: 9, fill: '#71717a' }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ fontSize: '11px', borderRadius: '6px', padding: '8px', border: '1px solid #e4e4e7' }}
                                    itemStyle={{ padding: 0, color: '#10b981', fontWeight: 600 }}
                                    formatter={(value: number) => [`$${value.toFixed(0)}`, 'Netback']}
                                    labelStyle={{ marginBottom: '4px', color: '#52525b' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Op Margin by Asset */}
                <div className="flex flex-col border-r border-zinc-100 p-2">
                    <h4 className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                        Op Margin by Asset (%)
                        {isFiltered && <span className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-[8px] font-medium normal-case">Filtered</span>}
                    </h4>
                    <div className="flex-1 min-h-0">
                        {marginData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-xs text-zinc-400">No data</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={marginData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={70} tick={{ fontSize: 10, fill: '#52525b', fontWeight: 500 }} interval={0} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ fontSize: '11px', borderRadius: '6px', padding: '8px', border: '1px solid #e4e4e7' }} formatter={(value: number) => [`${value}%`, 'Margin']} />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16}>
                                        <LabelList dataKey="value" position="right" fill="#3b82f6" fontSize={10} fontWeight={600} formatter={(val: any) => `${val}%`} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* 4. Breakeven Distribution */}
                <div className="flex flex-col p-2 col-span-2 border-t border-zinc-100">
                    <h4 className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                        Breakeven Dist ($/bbl)
                        {isFiltered && <span className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-[8px] font-medium normal-case">Filtered</span>}
                    </h4>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={breakevenData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                <XAxis dataKey="range" tick={{ fontSize: 9, fill: '#71717a' }} interval={0} tickLine={false} axisLine={false} dy={5} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f4f4f5' }} contentStyle={{ fontSize: '11px', borderRadius: '6px', padding: '8px', border: '1px solid #e4e4e7' }} formatter={(value: number) => [value, 'Wells']} />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24}>
                                    <LabelList dataKey="count" position="top" fill="#8b5cf6" fontSize={10} fontWeight={600} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarginAnalysis;
