"use client";

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFilters, basinMap, statusMap, liftMap, operatorMap, commodityMap } from '@/context/FilterContext';

// Well-level data with ALL filter dimensions
const allWells = [
    // Permian wells
    { basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil' },
    { basin: 'Permian', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Oil' },
    { basin: 'Permian', status: 'Producing', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Both' },
    { basin: 'Permian', status: 'Shut-in', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil' },
    { basin: 'Permian', status: 'Workover', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil' },
    { basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil' },
    // Eagle Ford wells
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil' },
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas' },
    { basin: 'Eagle Ford', status: 'Down', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil' },
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Gas' },
    { basin: 'Eagle Ford', status: 'Workover', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas' },
    // Bakken wells
    { basin: 'Bakken', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil' },
    { basin: 'Bakken', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil' },
    { basin: 'Bakken', status: 'Shut-in', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Gas' },
    { basin: 'Bakken', status: 'Producing', liftType: 'Plunger', operator: 'Partner B', commodity: 'Gas' },
    // DJ Basin wells
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Plunger', operator: 'DGP Operated', commodity: 'Gas' },
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner A', commodity: 'Both' },
    { basin: 'DJ Basin', status: 'Workover', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil' },
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Both' },
];

const statusColors: Record<string, string> = {
    'Producing': '#10b981',
    'Shut-in': '#f59e0b',
    'Workover': '#3b82f6',
    'Down': '#ef4444',
};

const liftColors: Record<string, string> = {
    'ESP': '#3b82f6',
    'Rod Pump': '#10b981',
    'Gas Lift': '#f59e0b',
    'Plunger': '#8b5cf6',
};

const basinColors: Record<string, string> = {
    'Permian': '#10b981',
    'Eagle Ford': '#3b82f6',
    'Bakken': '#f59e0b',
    'DJ Basin': '#8b5cf6',
};

interface DonutChartProps {
    title: string;
    data: { name: string; value: number; color: string }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ title, data }) => {
    return (
        <div className="flex flex-col h-full">
            <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wide text-center">{title}</h4>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius="40%"
                            outerRadius="80%"
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ fontSize: '10px', borderRadius: '4px', padding: '4px 8px' }}
                            formatter={(value: number, name: string) => [value, name]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-2 gap-y-0 text-[8px] mt-1">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-zinc-600">{item.name}</span>
                        <span className="text-zinc-800 font-semibold">({item.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const WellStatusCharts = () => {
    const { filters } = useFilters();

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

    // Aggregate status data
    const statusData = useMemo(() => {
        const counts = new Map<string, number>();
        filteredWells.forEach(well => {
            counts.set(well.status, (counts.get(well.status) || 0) + 1);
        });
        return Array.from(counts.entries()).map(([name, value]) => ({
            name,
            value,
            color: statusColors[name] || '#71717a'
        }));
    }, [filteredWells]);

    // Aggregate lift type data
    const liftData = useMemo(() => {
        const counts = new Map<string, number>();
        filteredWells.forEach(well => {
            counts.set(well.liftType, (counts.get(well.liftType) || 0) + 1);
        });
        return Array.from(counts.entries()).map(([name, value]) => ({
            name,
            value,
            color: liftColors[name] || '#71717a'
        })).sort((a, b) => b.value - a.value);
    }, [filteredWells]);

    // Aggregate basin data
    const basinData = useMemo(() => {
        const counts = new Map<string, number>();
        filteredWells.forEach(well => {
            counts.set(well.basin, (counts.get(well.basin) || 0) + 1);
        });
        return Array.from(counts.entries()).map(([name, value]) => ({
            name,
            value,
            color: basinColors[name] || '#71717a'
        })).sort((a, b) => b.value - a.value);
    }, [filteredWells]);

    const isFiltered = filters.basin !== 'all' || filters.wellStatus !== 'all' || filters.liftType !== 'all'
        || filters.operator !== 'all' || filters.commodity !== 'all';

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-1 px-1">
                <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    Well Distribution
                    {isFiltered && (
                        <span className="text-[10px] font-normal text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{filteredWells.length} wells</span>
                    )}
                </h3>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-1 min-h-0">
                <DonutChart title="By Status" data={statusData} />
                <DonutChart title="By Lift Type" data={liftData} />
                <DonutChart title="By Basin" data={basinData} />
            </div>
        </div>
    );
};

export default WellStatusCharts;
