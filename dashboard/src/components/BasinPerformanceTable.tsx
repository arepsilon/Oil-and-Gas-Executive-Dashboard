"use client";

import React, { useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import BasinDetailModal from './BasinDetailModal';
import { useFilters, basinMap, statusMap, liftMap, operatorMap, commodityMap } from '@/context/FilterContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface WellData {
    basin: string;
    status: string;
    liftType: string;
    operator: string;
    commodity: string;
    boe: number;
    vsForecast: number;
    decline: number;
    loe: number;
}

// Well-level data with ALL filter dimensions
const allWellsData: WellData[] = [
    // Permian wells
    { basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', boe: 120, vsForecast: 3.5, decline: -7.5, loe: 7.50 },
    { basin: 'Permian', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Oil', boe: 95, vsForecast: 1.2, decline: -8.0, loe: 8.20 },
    { basin: 'Permian', status: 'Producing', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Both', boe: 110, vsForecast: 2.8, decline: -9.0, loe: 7.80 },
    { basin: 'Permian', status: 'Shut-in', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', boe: 0, vsForecast: -100, decline: 0, loe: 12.00 },
    { basin: 'Permian', status: 'Workover', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', boe: 0, vsForecast: -100, decline: 0, loe: 15.00 },
    { basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil', boe: 130, vsForecast: 4.2, decline: -7.0, loe: 7.20 },
    // Eagle Ford wells
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', boe: 90, vsForecast: -2.5, decline: -11.0, loe: 9.50 },
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas', boe: 85, vsForecast: -3.8, decline: -12.5, loe: 10.00 },
    { basin: 'Eagle Ford', status: 'Down', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', boe: 0, vsForecast: -100, decline: 0, loe: 18.00 },
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Gas', boe: 75, vsForecast: -5.2, decline: -13.0, loe: 11.00 },
    { basin: 'Eagle Ford', status: 'Workover', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas', boe: 0, vsForecast: -100, decline: 0, loe: 14.00 },
    // Bakken wells
    { basin: 'Bakken', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', boe: 100, vsForecast: 2.5, decline: -5.5, loe: 8.00 },
    { basin: 'Bakken', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil', boe: 95, vsForecast: 1.8, decline: -6.0, loe: 8.50 },
    { basin: 'Bakken', status: 'Shut-in', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Gas', boe: 0, vsForecast: -100, decline: 0, loe: 13.00 },
    { basin: 'Bakken', status: 'Producing', liftType: 'Plunger', operator: 'Partner B', commodity: 'Gas', boe: 80, vsForecast: 0.5, decline: -7.0, loe: 9.00 },
    // DJ Basin wells
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Plunger', operator: 'DGP Operated', commodity: 'Gas', boe: 60, vsForecast: -5.5, decline: -14.0, loe: 12.00 },
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner A', commodity: 'Both', boe: 55, vsForecast: -7.2, decline: -16.0, loe: 13.00 },
    { basin: 'DJ Basin', status: 'Workover', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', boe: 0, vsForecast: -100, decline: 0, loe: 16.00 },
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Both', boe: 50, vsForecast: -8.0, decline: -17.0, loe: 14.00 },
];

const BasinPerformanceTable = () => {
    const [showAll, setShowAll] = useState(false);
    const [selectedBasin, setSelectedBasin] = useState<string | null>(null);
    const { filters } = useFilters();

    // Filter wells based on ALL active filters
    const filteredWells = useMemo(() => {
        return allWellsData.filter(well => {
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

    // Aggregate by basin
    const basinData = useMemo(() => {
        const basinAggregate = new Map<string, { boe: number; vsForecast: number; decline: number; wells: number; loe: number; count: number }>();

        filteredWells.forEach(well => {
            const existing = basinAggregate.get(well.basin) || { boe: 0, vsForecast: 0, decline: 0, wells: 0, loe: 0, count: 0 };
            basinAggregate.set(well.basin, {
                boe: existing.boe + well.boe,
                vsForecast: existing.vsForecast + (well.boe > 0 ? well.vsForecast : 0),
                decline: existing.decline + (well.boe > 0 ? well.decline : 0),
                wells: existing.wells + 1,
                loe: existing.loe + (well.boe > 0 ? well.loe : 0),
                count: existing.count + (well.boe > 0 ? 1 : 0),
            });
        });

        return Array.from(basinAggregate.entries()).map(([name, data]) => ({
            name,
            boe: data.boe,
            vsForecast: data.count > 0 ? data.vsForecast / data.count : 0,
            decline: data.count > 0 ? data.decline / data.count : 0,
            wells: data.wells,
            loe: data.count > 0 ? data.loe / data.count : 0,
        })).sort((a, b) => b.boe - a.boe);
    }, [filteredWells]);

    const displayedData = showAll ? basinData : basinData.slice(0, 4);
    const isFiltered = filters.basin !== 'all' || filters.wellStatus !== 'all' || filters.liftType !== 'all'
        || filters.operator !== 'all' || filters.commodity !== 'all';

    return (
        <>
            <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                        Basin Performance
                        {isFiltered && (
                            <span className="text-[10px] font-normal text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                {filteredWells.length} wells
                            </span>
                        )}
                    </h3>
                    {basinData.length > 4 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="text-[10px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            {showAll ? "Show Less" : "View All"}
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="border-b border-zinc-100">
                                <th className="py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Basin</th>
                                <th className="py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right">BOE/d</th>
                                <th className="py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right">vs Fcst</th>
                                <th className="py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right">Decline</th>
                                <th className="py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider text-right">LOE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-xs text-zinc-400">
                                        No wells match current filters
                                    </td>
                                </tr>
                            ) : (
                                displayedData.map((basin) => (
                                    <tr
                                        key={basin.name}
                                        className="group hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0 cursor-pointer"
                                        onClick={() => setSelectedBasin(basin.name)}
                                    >
                                        <td className="py-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-medium text-zinc-800">{basin.name}</span>
                                                <ChevronRight size={12} className="text-zinc-300 group-hover:text-zinc-500 opacity-0 group-hover:opacity-100 transition-all" />
                                            </div>
                                            <div className="text-[10px] text-zinc-400">{basin.wells} Wells</div>
                                        </td>
                                        <td className="py-1 text-right text-xs font-medium text-zinc-700">
                                            {basin.boe.toLocaleString()}
                                        </td>
                                        <td className="py-1 text-right">
                                            <div className={cn(
                                                "inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                                                basin.vsForecast >= 0 ? "bg-emerald-50 text-emerald-700" :
                                                    basin.vsForecast > -5 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"
                                            )}>
                                                {basin.vsForecast > 0 ? '+' : ''}{basin.vsForecast.toFixed(1)}%
                                            </div>
                                        </td>
                                        <td className="py-1 text-right text-[10px] text-zinc-500">
                                            {basin.decline.toFixed(1)}%
                                        </td>
                                        <td className="py-1 text-right text-xs font-medium text-zinc-700">
                                            ${basin.loe.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <BasinDetailModal
                isOpen={selectedBasin !== null}
                onClose={() => setSelectedBasin(null)}
                basinName={selectedBasin || ''}
            />
        </>
    );
};

export default BasinPerformanceTable;
