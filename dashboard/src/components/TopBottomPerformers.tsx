"use client";

import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { useFilters, getBasinNameFromFilter } from '@/context/FilterContext';

// All wells data with basin info
const allTopWells = [
    { name: 'P-102A', basin: 'Permian', value: 1240, metric: 'BOE/d', liftType: 'ESP', status: 'Producing' },
    { name: 'EF-44B', basin: 'Eagle Ford', value: 980, metric: 'BOE/d', liftType: 'Gas Lift', status: 'Producing' },
    { name: 'P-108C', basin: 'Permian', value: 920, metric: 'BOE/d', liftType: 'Rod Pump', status: 'Producing' },
    { name: 'P-105C', basin: 'Permian', value: 820, metric: 'BOE/d', liftType: 'ESP', status: 'Producing' },
    { name: 'EF-55A', basin: 'Eagle Ford', value: 790, metric: 'BOE/d', liftType: 'ESP', status: 'Producing' },
    { name: 'B-301X', basin: 'Bakken', value: 750, metric: 'BOE/d', liftType: 'Rod Pump', status: 'Producing' },
    { name: 'DJ-501A', basin: 'DJ Basin', value: 680, metric: 'BOE/d', liftType: 'Plunger', status: 'Producing' },
    { name: 'B-305A', basin: 'Bakken', value: 620, metric: 'BOE/d', liftType: 'ESP', status: 'Producing' },
];

const allBottomWells = [
    { name: 'B-302D', basin: 'Bakken', value: -12.50, metric: 'Margin', liftType: 'Rod Pump', status: 'Producing' },
    { name: 'P-099X', basin: 'Permian', value: 24.40, metric: 'LOE', liftType: 'ESP', status: 'Shut-in' },
    { name: 'EF-12C', basin: 'Eagle Ford', value: -4.20, metric: 'Margin', liftType: 'Gas Lift', status: 'Workover' },
    { name: 'DJ-504B', basin: 'DJ Basin', value: 18.90, metric: 'LOE', liftType: 'Plunger', status: 'Producing' },
    { name: 'B-305A', basin: 'Bakken', value: -2.10, metric: 'Margin', liftType: 'ESP', status: 'Producing' },
    { name: 'P-112X', basin: 'Permian', value: 16.50, metric: 'LOE', liftType: 'Rod Pump', status: 'Down' },
    { name: 'EF-203C', basin: 'Eagle Ford', value: -1.80, metric: 'Margin', liftType: 'ESP', status: 'Producing' },
];

const statusMap: Record<string, string> = {
    'producing': 'Producing',
    'shut-in': 'Shut-in',
    'workover': 'Workover',
    'down': 'Down',
};

const liftMap: Record<string, string> = {
    'esp': 'ESP',
    'rod-pump': 'Rod Pump',
    'gas-lift': 'Gas Lift',
    'plunger': 'Plunger',
};

const TopBottomPerformers = () => {
    const [activeTab, setActiveTab] = useState<'top' | 'bottom'>('top');
    const { filters } = useFilters();

    const filteredTopWells = useMemo(() => {
        return allTopWells.filter(well => {
            if (filters.basin !== 'all') {
                const selectedBasin = getBasinNameFromFilter(filters.basin);
                if (well.basin !== selectedBasin) return false;
            }
            if (filters.wellStatus !== 'all') {
                const selectedStatus = statusMap[filters.wellStatus];
                if (well.status !== selectedStatus) return false;
            }
            if (filters.liftType !== 'all') {
                const selectedLift = liftMap[filters.liftType];
                if (well.liftType !== selectedLift) return false;
            }
            return true;
        }).slice(0, 5);
    }, [filters]);

    const filteredBottomWells = useMemo(() => {
        return allBottomWells.filter(well => {
            if (filters.basin !== 'all') {
                const selectedBasin = getBasinNameFromFilter(filters.basin);
                if (well.basin !== selectedBasin) return false;
            }
            if (filters.wellStatus !== 'all') {
                const selectedStatus = statusMap[filters.wellStatus];
                if (well.status !== selectedStatus) return false;
            }
            if (filters.liftType !== 'all') {
                const selectedLift = liftMap[filters.liftType];
                if (well.liftType !== selectedLift) return false;
            }
            return true;
        }).slice(0, 5);
    }, [filters]);

    const currentWells = activeTab === 'top' ? filteredTopWells : filteredBottomWells;
    const hasFilters = filters.basin !== 'all' || filters.wellStatus !== 'all' || filters.liftType !== 'all';

    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
                <div className="flex space-x-1 bg-zinc-100 p-0.5 rounded-lg">
                    <button
                        onClick={() => setActiveTab('top')}
                        className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${activeTab === 'top' ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        Top Performers
                    </button>
                    <button
                        onClick={() => setActiveTab('bottom')}
                        className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all ${activeTab === 'bottom' ? 'bg-white text-rose-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        Bottom Performers
                    </button>
                </div>
                {hasFilters && (
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Filtered</span>
                )}
            </div>

            <div className="flex-1 overflow-auto">
                <div className="space-y-2">
                    {currentWells.length === 0 ? (
                        <div className="text-center py-8 text-xs text-zinc-400">
                            No wells match current filters
                        </div>
                    ) : (
                        currentWells.map((well, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeTab === 'top' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        <span className="text-[10px] font-bold">{idx + 1}</span>
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-zinc-800">{well.name}</div>
                                        <div className="text-[10px] text-zinc-400">{well.basin}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xs font-bold ${activeTab === 'top' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                        {typeof well.value === 'number' && well.metric !== 'BOE/d'
                                            ? (well.value < 0 ? `-$${Math.abs(well.value).toFixed(2)}` : `$${well.value.toFixed(2)}`)
                                            : well.value.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-zinc-400">{well.metric}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-100 text-center">
                <button className="text-[10px] text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 w-full">
                    View Recommendations
                    <ArrowUpRight size={10} />
                </button>
            </div>
        </div>
    );
};

export default TopBottomPerformers;
