"use client";

import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFilters, basinMap, statusMap, liftMap, operatorMap, commodityMap, getMonthsForDateRange } from '@/context/FilterContext';

// Well-level revenue data with ALL filter dimensions
const allWellsRevenue = [
    // Permian - ESP - DGP Operated - Oil
    {
        basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', months: [
            { month: 'Jan', revenue: 180, netIncome: 85 }, { month: 'Feb', revenue: 195, netIncome: 95 }, { month: 'Mar', revenue: 185, netIncome: 88 },
            { month: 'Apr', revenue: 210, netIncome: 105 }, { month: 'May', revenue: 200, netIncome: 98 }, { month: 'Jun', revenue: 220, netIncome: 115 },
            { month: 'Jul', revenue: 230, netIncome: 120 }, { month: 'Aug', revenue: 225, netIncome: 118 }, { month: 'Sep', revenue: 240, netIncome: 130 },
            { month: 'Oct', revenue: 245, netIncome: 135 }, { month: 'Nov', revenue: 250, netIncome: 140 }, { month: 'Dec', revenue: 260, netIncome: 150 },
        ]
    },
    // Permian - Rod Pump - Partner A - Oil
    {
        basin: 'Permian', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Oil', months: [
            { month: 'Jan', revenue: 140, netIncome: 60 }, { month: 'Feb', revenue: 150, netIncome: 65 }, { month: 'Mar', revenue: 145, netIncome: 62 },
            { month: 'Apr', revenue: 160, netIncome: 72 }, { month: 'May', revenue: 155, netIncome: 70 }, { month: 'Jun', revenue: 170, netIncome: 80 },
            { month: 'Jul', revenue: 175, netIncome: 85 }, { month: 'Aug', revenue: 172, netIncome: 83 }, { month: 'Sep', revenue: 185, netIncome: 92 },
            { month: 'Oct', revenue: 190, netIncome: 95 }, { month: 'Nov', revenue: 195, netIncome: 98 }, { month: 'Dec', revenue: 200, netIncome: 100 },
        ]
    },
    // Permian - Shut-in
    {
        basin: 'Permian', status: 'Shut-in', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', months: [
            { month: 'Jan', revenue: 100, netIncome: 40 }, { month: 'Feb', revenue: 80, netIncome: 25 }, { month: 'Mar', revenue: 0, netIncome: -10 },
            { month: 'Apr', revenue: 0, netIncome: -10 }, { month: 'May', revenue: 0, netIncome: -10 }, { month: 'Jun', revenue: 0, netIncome: -10 },
            { month: 'Jul', revenue: 0, netIncome: -10 }, { month: 'Aug', revenue: 0, netIncome: -10 }, { month: 'Sep', revenue: 0, netIncome: -10 },
            { month: 'Oct', revenue: 0, netIncome: -10 }, { month: 'Nov', revenue: 0, netIncome: -10 }, { month: 'Dec', revenue: 0, netIncome: -10 },
        ]
    },
    // Eagle Ford - ESP - DGP Operated - Oil
    {
        basin: 'Eagle Ford', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', months: [
            { month: 'Jan', revenue: 120, netIncome: 48 }, { month: 'Feb', revenue: 130, netIncome: 53 }, { month: 'Mar', revenue: 125, netIncome: 50 },
            { month: 'Apr', revenue: 140, netIncome: 58 }, { month: 'May', revenue: 135, netIncome: 56 }, { month: 'Jun', revenue: 150, netIncome: 68 },
            { month: 'Jul', revenue: 155, netIncome: 72 }, { month: 'Aug', revenue: 152, netIncome: 70 }, { month: 'Sep', revenue: 160, netIncome: 78 },
            { month: 'Oct', revenue: 165, netIncome: 82 }, { month: 'Nov', revenue: 170, netIncome: 85 }, { month: 'Dec', revenue: 175, netIncome: 88 },
        ]
    },
    // Eagle Ford - Gas Lift - Partner B - Gas
    {
        basin: 'Eagle Ford', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas', months: [
            { month: 'Jan', revenue: 100, netIncome: 38 }, { month: 'Feb', revenue: 108, netIncome: 42 }, { month: 'Mar', revenue: 105, netIncome: 40 },
            { month: 'Apr', revenue: 115, netIncome: 48 }, { month: 'May', revenue: 112, netIncome: 46 }, { month: 'Jun', revenue: 125, netIncome: 55 },
            { month: 'Jul', revenue: 128, netIncome: 58 }, { month: 'Aug', revenue: 126, netIncome: 56 }, { month: 'Sep', revenue: 135, netIncome: 62 },
            { month: 'Oct', revenue: 140, netIncome: 65 }, { month: 'Nov', revenue: 145, netIncome: 68 }, { month: 'Dec', revenue: 150, netIncome: 72 },
        ]
    },
    // Bakken - Rod Pump - DGP Operated - Oil
    {
        basin: 'Bakken', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', months: [
            { month: 'Jan', revenue: 110, netIncome: 42 }, { month: 'Feb', revenue: 115, netIncome: 45 }, { month: 'Mar', revenue: 112, netIncome: 43 },
            { month: 'Apr', revenue: 122, netIncome: 50 }, { month: 'May', revenue: 118, netIncome: 48 }, { month: 'Jun', revenue: 130, netIncome: 57 },
            { month: 'Jul', revenue: 135, netIncome: 60 }, { month: 'Aug', revenue: 132, netIncome: 58 }, { month: 'Sep', revenue: 142, netIncome: 65 },
            { month: 'Oct', revenue: 148, netIncome: 68 }, { month: 'Nov', revenue: 152, netIncome: 72 }, { month: 'Dec', revenue: 158, netIncome: 75 },
        ]
    },
    // DJ Basin - Plunger - DGP Operated - Gas
    {
        basin: 'DJ Basin', status: 'Producing', liftType: 'Plunger', operator: 'DGP Operated', commodity: 'Gas', months: [
            { month: 'Jan', revenue: 55, netIncome: 18 }, { month: 'Feb', revenue: 58, netIncome: 20 }, { month: 'Mar', revenue: 55, netIncome: 18 },
            { month: 'Apr', revenue: 62, netIncome: 22 }, { month: 'May', revenue: 60, netIncome: 20 }, { month: 'Jun', revenue: 68, netIncome: 28 },
            { month: 'Jul', revenue: 70, netIncome: 30 }, { month: 'Aug', revenue: 68, netIncome: 28 }, { month: 'Sep', revenue: 75, netIncome: 32 },
            { month: 'Oct', revenue: 78, netIncome: 35 }, { month: 'Nov', revenue: 82, netIncome: 38 }, { month: 'Dec', revenue: 85, netIncome: 40 },
        ]
    },
    // DJ Basin - Gas Lift - Partner A - Both
    {
        basin: 'DJ Basin', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner A', commodity: 'Both', months: [
            { month: 'Jan', revenue: 48, netIncome: 15 }, { month: 'Feb', revenue: 52, netIncome: 18 }, { month: 'Mar', revenue: 50, netIncome: 16 },
            { month: 'Apr', revenue: 55, netIncome: 20 }, { month: 'May', revenue: 52, netIncome: 18 }, { month: 'Jun', revenue: 60, netIncome: 25 },
            { month: 'Jul', revenue: 62, netIncome: 27 }, { month: 'Aug', revenue: 60, netIncome: 25 }, { month: 'Sep', revenue: 68, netIncome: 30 },
            { month: 'Oct', revenue: 72, netIncome: 32 }, { month: 'Nov', revenue: 75, netIncome: 35 }, { month: 'Dec', revenue: 78, netIncome: 38 },
        ]
    },
];

const RevenueWaterfallChart = () => {
    const { filters } = useFilters();

    // Filter wells based on ALL active filters
    const filteredWells = useMemo(() => {
        return allWellsRevenue.filter(well => {
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

    // Aggregate revenue data
    const chartData = useMemo(() => {
        return displayMonths.map((month) => {
            let totalRevenue = 0;
            let totalNetIncome = 0;
            filteredWells.forEach(well => {
                const monthData = well.months.find(m => m.month === month);
                if (monthData) {
                    totalRevenue += monthData.revenue;
                    totalNetIncome += monthData.netIncome;
                }
            });
            return { month, revenue: totalRevenue, netIncome: totalNetIncome };
        });
    }, [filteredWells, displayMonths]);

    const isFiltered = filters.basin !== 'all' || filters.wellStatus !== 'all' || filters.liftType !== 'all'
        || filters.operator !== 'all' || filters.commodity !== 'all' || filters.dateRange !== 'mtd';

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-2">
                    Revenue vs Net Income ($K)
                    {isFiltered && <span className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-[8px] font-medium normal-case">{filteredWells.length} wells</span>}
                </h4>
                <div className="flex gap-3 text-[9px]">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-blue-500"></div>
                        <span className="text-zinc-500">Revenue</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-0.5 bg-emerald-500"></div>
                        <span className="text-zinc-500">Net Income</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                        <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#71717a' }} tickLine={false} axisLine={false} dy={5} interval={Math.max(0, Math.floor(chartData.length / 6) - 1)} />
                        <YAxis tick={{ fontSize: 9, fill: '#71717a' }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                        <Tooltip
                            contentStyle={{ fontSize: '11px', borderRadius: '6px', padding: '8px', border: '1px solid #e4e4e7' }}
                            formatter={(value: number, name: string) => [`$${value}K`, name === 'revenue' ? 'Gross Revenue' : 'Net Income']}
                            labelStyle={{ marginBottom: '4px', color: '#52525b' }}
                        />
                        <Bar dataKey="revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={20} fillOpacity={0.8} />
                        <Line type="monotone" dataKey="netIncome" stroke="#10b981" strokeWidth={2} dot={{ r: 2, fill: '#10b981', strokeWidth: 0 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueWaterfallChart;
