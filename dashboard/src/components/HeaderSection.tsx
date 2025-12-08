"use client";

import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, Minus, Activity, Droplets, Flame, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import KPIDetailModal from './KPIDetailModal';
import { useFilters, getBasinNameFromFilter, basinMap, statusMap, liftMap, operatorMap, commodityMap, getMonthsForDateRange } from '@/context/FilterContext';

interface KPIItemProps {
    label: string;
    value: string;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    trendLabel?: string;
    icon?: React.ReactNode;
    isLast?: boolean;
    alert?: boolean;
}

const KPIItem: React.FC<KPIItemProps> = ({ label, value, subValue, trend, trendValue, trendLabel, icon, isLast, alert }) => {
    return (
        <div className={`flex-1 px-3 first:pl-0 last:pr-0 ${!isLast ? 'border-r border-zinc-200' : ''}`}>
            <div className="flex justify-between items-start mb-1">
                <span className="text-zinc-500 text-[10px] font-medium uppercase tracking-wider flex items-center gap-1 truncate">
                    {icon && <span className="text-zinc-400">{icon}</span>}
                    {label}
                </span>
            </div>
            <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                    <span className={`text-lg font-bold tracking-tight ${alert ? 'text-red-600' : 'text-zinc-900'}`}>{value}</span>
                </div>
                <div className="flex flex-col mt-1 space-y-0.5">
                    {subValue && <span className="text-[10px] text-zinc-500 truncate" title={subValue}>{subValue}</span>}
                    {trend && (
                        <div className="flex flex-col">
                            {trendLabel && <span className="text-[10px] text-zinc-400 leading-none mb-0.5">{trendLabel}</span>}
                            <div className={`flex items-center text-[10px] font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-zinc-500'}`}>
                                {trend === 'up' ? <ArrowUp size={12} className="mr-0.5" /> : trend === 'down' ? <ArrowDown size={12} className="mr-0.5" /> : <Minus size={12} className="mr-0.5" />}
                                {trendValue}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface KPIColumnProps {
    title: string;
    icon: React.ReactNode;
    items: Omit<KPIItemProps, 'isLast'>[];
    onClick?: () => void;
    filtered?: boolean;
}

const KPIColumn: React.FC<KPIColumnProps> = ({ title, icon, items, onClick, filtered }) => {
    return (
        <div
            className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex flex-col h-full hover:border-zinc-300 hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-zinc-100">
                <div className="text-zinc-400">{icon}</div>
                <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
                {filtered && (
                    <span className="text-[9px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Filtered</span>
                )}
                <span className="text-[10px] text-blue-500 ml-auto">Click for details →</span>
            </div>
            <div className="flex-1 flex flex-row items-center">
                {items.map((item, index) => (
                    <KPIItem
                        key={index}
                        {...item}
                        isLast={index === items.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

// Comprehensive well-level data with ALL filter dimensions
const allWellsData = [
    // Permian wells
    { basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', boe: 120, oil: 100, gas: 120, revenue: 42000, loe: 7.50, downtime: 0, risk: false },
    { basin: 'Permian', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Oil', boe: 95, oil: 80, gas: 90, revenue: 35000, loe: 8.20, downtime: 0, risk: false },
    { basin: 'Permian', status: 'Producing', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Both', boe: 110, oil: 70, gas: 240, revenue: 40000, loe: 7.80, downtime: 0, risk: false },
    { basin: 'Permian', status: 'Shut-in', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', boe: 0, oil: 0, gas: 0, revenue: 0, loe: 12.00, downtime: 24, risk: true },
    { basin: 'Permian', status: 'Workover', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', boe: 0, oil: 0, gas: 0, revenue: 0, loe: 15.00, downtime: 48, risk: true },
    { basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil', boe: 130, oil: 110, gas: 120, revenue: 45000, loe: 7.20, downtime: 0, risk: false },
    // Eagle Ford wells
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', boe: 90, oil: 70, gas: 120, revenue: 32000, loe: 9.50, downtime: 0, risk: false },
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Both', boe: 85, oil: 50, gas: 210, revenue: 30000, loe: 10.00, downtime: 0, risk: false },
    { basin: 'Eagle Ford', status: 'Down', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', boe: 0, oil: 0, gas: 0, revenue: 0, loe: 18.00, downtime: 72, risk: true },
    { basin: 'Eagle Ford', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Gas', boe: 75, oil: 20, gas: 330, revenue: 28000, loe: 11.00, downtime: 0, risk: false },
    { basin: 'Eagle Ford', status: 'Workover', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas', boe: 0, oil: 0, gas: 0, revenue: 0, loe: 14.00, downtime: 36, risk: true },
    // Bakken wells
    { basin: 'Bakken', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', boe: 100, oil: 85, gas: 90, revenue: 38000, loe: 8.00, downtime: 0, risk: false },
    { basin: 'Bakken', status: 'Producing', liftType: 'ESP', operator: 'Partner A', commodity: 'Oil', boe: 95, oil: 80, gas: 90, revenue: 36000, loe: 8.50, downtime: 0, risk: false },
    { basin: 'Bakken', status: 'Shut-in', liftType: 'Gas Lift', operator: 'DGP Operated', commodity: 'Gas', boe: 0, oil: 0, gas: 0, revenue: 0, loe: 13.00, downtime: 24, risk: false },
    { basin: 'Bakken', status: 'Producing', liftType: 'Plunger', operator: 'Partner B', commodity: 'Gas', boe: 80, oil: 30, gas: 300, revenue: 30000, loe: 9.00, downtime: 0, risk: false },
    // DJ Basin wells
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Plunger', operator: 'DGP Operated', commodity: 'Gas', boe: 60, oil: 15, gas: 270, revenue: 22000, loe: 12.00, downtime: 0, risk: false },
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner A', commodity: 'Gas', boe: 55, oil: 10, gas: 270, revenue: 20000, loe: 13.00, downtime: 0, risk: false },
    { basin: 'DJ Basin', status: 'Workover', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', boe: 0, oil: 0, gas: 0, revenue: 0, loe: 16.00, downtime: 48, risk: true },
    { basin: 'DJ Basin', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Both', boe: 50, oil: 25, gas: 150, revenue: 18000, loe: 14.00, downtime: 0, risk: false },
];

const HeaderSection = () => {
    const [selectedKPI, setSelectedKPI] = useState<'production' | 'financial' | 'cost' | 'asset' | null>(null);
    const { filters } = useFilters();

    // Filter wells based on ALL active filters
    const filteredWells = useMemo(() => {
        return allWellsData.filter(well => {
            // Basin filter
            if (filters.basin !== 'all') {
                if (well.basin !== basinMap[filters.basin]) return false;
            }
            // Well Status filter
            if (filters.wellStatus !== 'all') {
                if (well.status !== statusMap[filters.wellStatus]) return false;
            }
            // Lift Type filter
            if (filters.liftType !== 'all') {
                if (well.liftType !== liftMap[filters.liftType]) return false;
            }
            // Operator filter
            if (filters.operator !== 'all') {
                if (well.operator !== operatorMap[filters.operator]) return false;
            }
            // Commodity filter
            if (filters.commodity !== 'all') {
                const selectedCommodity = commodityMap[filters.commodity];
                if (selectedCommodity === 'Oil' && well.commodity !== 'Oil' && well.commodity !== 'Both') return false;
                if (selectedCommodity === 'Gas' && well.commodity !== 'Gas' && well.commodity !== 'Both') return false;
                if (selectedCommodity === 'Both' && well.commodity !== 'Both') return false;
            }
            return true;
        });
    }, [filters]);

    // Apply date range multiplier for demonstration
    const dateMultiplier = useMemo(() => {
        switch (filters.dateRange) {
            case 'today': return 0.03;
            case 'wtd': return 0.25;
            case 'mtd': return 1;
            case 'qtd': return 3;
            case 'ytd': return 12;
            case 'last-month': return 1;
            case 'last-quarter': return 3;
            case 'last-year': return 12;
            default: return 1;
        }
    }, [filters.dateRange]);

    // Aggregate KPIs from filtered wells
    const kpiData = useMemo(() => {
        const totalWells = filteredWells.length;
        const producingWells = filteredWells.filter(w => w.status === 'Producing');
        const offlineWells = filteredWells.filter(w => w.status !== 'Producing');

        const totalBoe = filteredWells.reduce((sum, w) => sum + w.boe, 0);
        const totalOil = filteredWells.reduce((sum, w) => sum + w.oil, 0);
        const totalGas = filteredWells.reduce((sum, w) => sum + w.gas, 0);
        const totalRevenue = filteredWells.reduce((sum, w) => sum + w.revenue, 0) * dateMultiplier;
        const totalDowntime = filteredWells.reduce((sum, w) => sum + w.downtime, 0);
        const riskCount = filteredWells.filter(w => w.risk).length;

        const avgLoe = producingWells.length > 0
            ? producingWells.reduce((sum, w) => sum + w.loe, 0) / producingWells.length
            : 0;

        const netback = totalBoe > 0 ? (totalRevenue / totalBoe) / 1000 : 0;
        const margin = totalBoe > 0 ? netback - avgLoe : 0;

        return {
            boe: totalBoe,
            oil: totalOil,
            gas: totalGas,
            revenue: totalRevenue / 1000000,
            netback: netback * 1000,
            margin: margin,
            loe: avgLoe,
            opexVar: avgLoe < 9 ? -((9 - avgLoe) / 9 * 100) : ((avgLoe - 9) / 9 * 100),
            breakeven: avgLoe * 3.5,
            wells: totalWells,
            offline: offlineWells.length,
            downtime: totalDowntime,
            risks: riskCount,
        };
    }, [filteredWells, dateMultiplier]);

    const isFiltered = filters.basin !== 'all' || filters.wellStatus !== 'all' || filters.liftType !== 'all'
        || filters.operator !== 'all' || filters.commodity !== 'all' || filters.dateRange !== 'mtd';

    return (
        <>
            <div className="w-full grid grid-cols-4 gap-4 p-4 bg-zinc-50 border-b border-zinc-200 h-[200px]">
                <KPIColumn
                    title="Production Performance"
                    icon={<Activity size={18} className="text-brand-gold" />}
                    onClick={() => setSelectedKPI('production')}
                    filtered={isFiltered}
                    items={[
                        { label: "Total BOE/Day", value: kpiData.boe.toLocaleString(), subValue: `${filteredWells.length} wells`, trend: kpiData.boe > 0 ? "up" : "neutral", trendValue: kpiData.boe > 0 ? "Active" : "None" },
                        { label: "Oil (BBL/Day)", value: kpiData.oil.toLocaleString(), trend: "up", trendValue: "+1.2%", trendLabel: "Trend", icon: <Droplets size={12} /> },
                        { label: "Gas (MCF/Day)", value: kpiData.gas.toLocaleString(), trend: "down", trendValue: "-5.8%", trendLabel: "Decline", icon: <Flame size={12} /> }
                    ]}
                />

                <KPIColumn
                    title="Financial Performance"
                    icon={<DollarSign size={18} className="text-brand-gold" />}
                    onClick={() => setSelectedKPI('financial')}
                    filtered={isFiltered}
                    items={[
                        { label: "Gross Revenue", value: `$${kpiData.revenue.toFixed(2)}M`, subValue: filters.dateRange.toUpperCase(), trend: kpiData.revenue > 0 ? "up" : "neutral", trendValue: kpiData.revenue > 0 ? "+8.5%" : "N/A" },
                        { label: "Net Netback", value: `$${kpiData.netback.toFixed(2)}`, subValue: "per BOE", trend: "up", trendValue: "+3.2%" },
                        { label: "Op Margin", value: `$${kpiData.margin.toFixed(2)}`, subValue: "per BOE", trend: kpiData.margin > 25 ? "up" : "neutral", trendValue: kpiData.margin > 25 ? "Good" : "Avg" }
                    ]}
                />

                <KPIColumn
                    title="Cost Efficiency"
                    icon={<TrendingDown size={18} className="text-brand-gold" />}
                    onClick={() => setSelectedKPI('cost')}
                    filtered={isFiltered}
                    items={[
                        { label: "LOE per BOE", value: kpiData.loe > 0 ? `$${kpiData.loe.toFixed(2)}` : "N/A", subValue: "vs. Budget", trend: kpiData.loe < 9 ? "up" : "down", trendValue: kpiData.loe < 9 ? "Under Budget" : "Over Budget" },
                        { label: "OPEX Var", value: `${kpiData.opexVar.toFixed(1)}%`, subValue: "vs Budget", trend: kpiData.opexVar <= 0 ? "up" : "down", trendValue: kpiData.opexVar <= 0 ? "Good" : "High" },
                        { label: "Breakeven", value: kpiData.breakeven > 0 ? `$${kpiData.breakeven.toFixed(2)}` : "N/A", subValue: "Target: $30", trend: kpiData.breakeven <= 30 ? "up" : "down", trendValue: kpiData.breakeven <= 30 ? "On Target" : "Above Tgt" }
                    ]}
                />

                <KPIColumn
                    title="Asset Health"
                    icon={<AlertTriangle size={18} className="text-brand-gold" />}
                    onClick={() => setSelectedKPI('asset')}
                    filtered={isFiltered}
                    items={[
                        { label: "Active Wells", value: kpiData.wells.toString(), subValue: `${kpiData.offline} Offline`, trend: "neutral", trendValue: "Stable" },
                        { label: "Downtime", value: `${kpiData.downtime}h`, subValue: filters.dateRange.toUpperCase(), trend: kpiData.downtime > 24 ? "down" : "up", trendValue: kpiData.downtime > 24 ? "High" : "Low", alert: kpiData.downtime > 24 },
                        { label: "Risk Flags", value: kpiData.risks.toString(), subValue: "Critical", trend: kpiData.risks > 0 ? "down" : "up", trendValue: kpiData.risks > 0 ? "Action" : "Clear", alert: kpiData.risks > 0 }
                    ]}
                />
            </div>

            <KPIDetailModal
                isOpen={selectedKPI !== null}
                onClose={() => setSelectedKPI(null)}
                category={selectedKPI || 'production'}
            />
        </>
    );
};

export default HeaderSection;
