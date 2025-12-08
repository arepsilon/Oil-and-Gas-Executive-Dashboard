"use client";

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDown } from 'lucide-react';
import { useFilters, basinMap, statusMap, liftMap, operatorMap, commodityMap, getMonthsForDateRange } from '@/context/FilterContext';

// Well-level production data with ALL filter dimensions
const allWellsProduction = [
    // Permian - ESP - DGP Operated - Oil
    {
        basin: 'Permian', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', months: [
            { month: 'Jan', actual: 130, forecast: 125 }, { month: 'Feb', actual: 135, forecast: 130 }, { month: 'Mar', actual: 128, forecast: 130 },
            { month: 'Apr', actual: 140, forecast: 135 }, { month: 'May', actual: 138, forecast: 140 }, { month: 'Jun', actual: 145, forecast: 142 },
            { month: 'Jul', actual: 142, forecast: 145 }, { month: 'Aug', actual: 148, forecast: 148 }, { month: 'Sep', actual: 150, forecast: 150 },
            { month: 'Oct', actual: 152, forecast: 152 }, { month: 'Nov', actual: 155, forecast: 155 }, { month: 'Dec', actual: 158, forecast: 158 },
        ]
    },
    // Permian - Rod Pump - Partner A - Oil
    {
        basin: 'Permian', status: 'Producing', liftType: 'Rod Pump', operator: 'Partner A', commodity: 'Oil', months: [
            { month: 'Jan', actual: 95, forecast: 100 }, { month: 'Feb', actual: 98, forecast: 100 }, { month: 'Mar', actual: 92, forecast: 100 },
            { month: 'Apr', actual: 100, forecast: 105 }, { month: 'May', actual: 102, forecast: 105 }, { month: 'Jun', actual: 108, forecast: 108 },
            { month: 'Jul', actual: 105, forecast: 110 }, { month: 'Aug', actual: 110, forecast: 112 }, { month: 'Sep', actual: 112, forecast: 115 },
            { month: 'Oct', actual: 115, forecast: 118 }, { month: 'Nov', actual: 118, forecast: 120 }, { month: 'Dec', actual: 120, forecast: 122 },
        ]
    },
    // Permian - Shut-in - Partner B - Oil
    {
        basin: 'Permian', status: 'Shut-in', liftType: 'ESP', operator: 'Partner B', commodity: 'Oil', months: [
            { month: 'Jan', actual: 80, forecast: 90 }, { month: 'Feb', actual: 70, forecast: 88 }, { month: 'Mar', actual: 0, forecast: 85 },
            { month: 'Apr', actual: 0, forecast: 85 }, { month: 'May', actual: 0, forecast: 85 }, { month: 'Jun', actual: 0, forecast: 85 },
            { month: 'Jul', actual: 0, forecast: 85 }, { month: 'Aug', actual: 0, forecast: 85 }, { month: 'Sep', actual: 0, forecast: 85 },
            { month: 'Oct', actual: 0, forecast: 85 }, { month: 'Nov', actual: 0, forecast: 85 }, { month: 'Dec', actual: 0, forecast: 85 },
        ]
    },
    // Eagle Ford - ESP - DGP Operated - Oil
    {
        basin: 'Eagle Ford', status: 'Producing', liftType: 'ESP', operator: 'DGP Operated', commodity: 'Oil', months: [
            { month: 'Jan', actual: 90, forecast: 95 }, { month: 'Feb', actual: 92, forecast: 95 }, { month: 'Mar', actual: 88, forecast: 95 },
            { month: 'Apr', actual: 95, forecast: 98 }, { month: 'May', actual: 93, forecast: 98 }, { month: 'Jun', actual: 98, forecast: 100 },
            { month: 'Jul', actual: 96, forecast: 100 }, { month: 'Aug', actual: 100, forecast: 102 }, { month: 'Sep', actual: 102, forecast: 105 },
            { month: 'Oct', actual: 105, forecast: 108 }, { month: 'Nov', actual: 108, forecast: 110 }, { month: 'Dec', actual: 110, forecast: 112 },
        ]
    },
    // Eagle Ford - Gas Lift - Partner B - Gas
    {
        basin: 'Eagle Ford', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner B', commodity: 'Gas', months: [
            { month: 'Jan', actual: 85, forecast: 88 }, { month: 'Feb', actual: 87, forecast: 88 }, { month: 'Mar', actual: 82, forecast: 88 },
            { month: 'Apr', actual: 88, forecast: 90 }, { month: 'May', actual: 86, forecast: 90 }, { month: 'Jun', actual: 92, forecast: 92 },
            { month: 'Jul', actual: 90, forecast: 92 }, { month: 'Aug', actual: 94, forecast: 95 }, { month: 'Sep', actual: 95, forecast: 98 },
            { month: 'Oct', actual: 98, forecast: 100 }, { month: 'Nov', actual: 100, forecast: 102 }, { month: 'Dec', actual: 102, forecast: 105 },
        ]
    },
    // Bakken - Rod Pump - DGP Operated - Oil
    {
        basin: 'Bakken', status: 'Producing', liftType: 'Rod Pump', operator: 'DGP Operated', commodity: 'Oil', months: [
            { month: 'Jan', actual: 100, forecast: 105 }, { month: 'Feb', actual: 102, forecast: 105 }, { month: 'Mar', actual: 98, forecast: 105 },
            { month: 'Apr', actual: 105, forecast: 108 }, { month: 'May', actual: 104, forecast: 108 }, { month: 'Jun', actual: 108, forecast: 110 },
            { month: 'Jul', actual: 106, forecast: 110 }, { month: 'Aug', actual: 110, forecast: 112 }, { month: 'Sep', actual: 112, forecast: 115 },
            { month: 'Oct', actual: 115, forecast: 118 }, { month: 'Nov', actual: 118, forecast: 120 }, { month: 'Dec', actual: 120, forecast: 122 },
        ]
    },
    // Bakken - Plunger - Partner B - Gas
    {
        basin: 'Bakken', status: 'Producing', liftType: 'Plunger', operator: 'Partner B', commodity: 'Gas', months: [
            { month: 'Jan', actual: 65, forecast: 70 }, { month: 'Feb', actual: 68, forecast: 70 }, { month: 'Mar', actual: 62, forecast: 70 },
            { month: 'Apr', actual: 70, forecast: 72 }, { month: 'May', actual: 68, forecast: 72 }, { month: 'Jun', actual: 72, forecast: 75 },
            { month: 'Jul', actual: 70, forecast: 75 }, { month: 'Aug', actual: 75, forecast: 78 }, { month: 'Sep', actual: 78, forecast: 80 },
            { month: 'Oct', actual: 80, forecast: 82 }, { month: 'Nov', actual: 82, forecast: 85 }, { month: 'Dec', actual: 85, forecast: 88 },
        ]
    },
    // DJ Basin - Plunger - DGP Operated - Gas
    {
        basin: 'DJ Basin', status: 'Producing', liftType: 'Plunger', operator: 'DGP Operated', commodity: 'Gas', months: [
            { month: 'Jan', actual: 55, forecast: 60 }, { month: 'Feb', actual: 58, forecast: 60 }, { month: 'Mar', actual: 52, forecast: 60 },
            { month: 'Apr', actual: 60, forecast: 62 }, { month: 'May', actual: 58, forecast: 62 }, { month: 'Jun', actual: 62, forecast: 65 },
            { month: 'Jul', actual: 60, forecast: 65 }, { month: 'Aug', actual: 65, forecast: 68 }, { month: 'Sep', actual: 68, forecast: 70 },
            { month: 'Oct', actual: 70, forecast: 72 }, { month: 'Nov', actual: 72, forecast: 75 }, { month: 'Dec', actual: 75, forecast: 78 },
        ]
    },
    // DJ Basin - Gas Lift - Partner A - Both
    {
        basin: 'DJ Basin', status: 'Producing', liftType: 'Gas Lift', operator: 'Partner A', commodity: 'Both', months: [
            { month: 'Jan', actual: 50, forecast: 55 }, { month: 'Feb', actual: 52, forecast: 55 }, { month: 'Mar', actual: 48, forecast: 55 },
            { month: 'Apr', actual: 55, forecast: 58 }, { month: 'May', actual: 53, forecast: 58 }, { month: 'Jun', actual: 58, forecast: 60 },
            { month: 'Jul', actual: 56, forecast: 60 }, { month: 'Aug', actual: 60, forecast: 62 }, { month: 'Sep', actual: 62, forecast: 65 },
            { month: 'Oct', actual: 65, forecast: 68 }, { month: 'Nov', actual: 68, forecast: 70 }, { month: 'Dec', actual: 70, forecast: 72 },
        ]
    },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const actual = payload.find((p: any) => p.dataKey === 'actual')?.value;
        const forecast = payload.find((p: any) => p.dataKey === 'forecast')?.value;
        const variance = actual && forecast ? ((actual - forecast) / forecast) * 100 : 0;
        const isHighVariance = variance < -5;

        return (
            <div className="bg-white p-3 border border-zinc-200 rounded-lg shadow-lg text-xs">
                <p className="font-bold text-zinc-800 mb-1">{label}</p>
                <div className="space-y-1">
                    <p className="text-blue-600 flex justify-between gap-4">
                        <span>Actual:</span>
                        <span className="font-semibold">{actual ? Math.round(actual).toLocaleString() : 'N/A'}</span>
                    </p>
                    <p className="text-zinc-400 flex justify-between gap-4">
                        <span>Forecast:</span>
                        <span className="font-semibold">{forecast ? Math.round(forecast).toLocaleString() : 'N/A'}</span>
                    </p>
                    {actual && forecast && (
                        <div className={`pt-1 border-t border-zinc-100 flex justify-between gap-4 font-medium ${variance >= 0 ? 'text-emerald-600' : isHighVariance ? 'text-rose-600' : 'text-amber-600'}`}>
                            <span>Variance:</span>
                            <span>{variance > 0 ? '+' : ''}{variance.toFixed(1)}%</span>
                        </div>
                    )}
                    {isHighVariance && (
                        <div className="text-[10px] text-rose-500 mt-1 font-medium flex items-center gap-1">
                            <ArrowDown size={10} />
                            &gt;5% Below Forecast
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

const ProductionTrendChart = () => {
    const [metric, setMetric] = useState<'boe' | 'oil' | 'gas'>('boe');
    const { filters } = useFilters();

    // Filter wells based on ALL active filters
    const filteredWells = useMemo(() => {
        return allWellsProduction.filter(well => {
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

    // Aggregate production data from filtered wells
    const chartData = useMemo(() => {
        return displayMonths.map((month) => {
            let totalActual = 0;
            let totalForecast = 0;
            filteredWells.forEach(well => {
                const monthData = well.months.find(m => m.month === month);
                if (monthData) {
                    totalActual += monthData.actual || 0;
                    totalForecast += monthData.forecast || 0;
                }
            });
            return {
                month,
                actual: totalActual > 0 ? totalActual : null,
                forecast: totalForecast,
                oil: totalActual > 0 ? Math.round(totalActual * 0.65) : null,
                gas: totalActual > 0 ? Math.round(totalActual * 0.35) : null,
                oilForecast: Math.round(totalForecast * 0.65),
                gasForecast: Math.round(totalForecast * 0.35),
            };
        });
    }, [filteredWells, displayMonths]);

    const isFiltered = filters.basin !== 'all' || filters.wellStatus !== 'all' || filters.liftType !== 'all'
        || filters.operator !== 'all' || filters.commodity !== 'all' || filters.dateRange !== 'mtd';

    const getDataKeys = () => {
        switch (metric) {
            case 'oil': return { actual: 'oil', forecast: 'oilForecast' };
            case 'gas': return { actual: 'gas', forecast: 'gasForecast' };
            default: return { actual: 'actual', forecast: 'forecast' };
        }
    };

    const { actual: actualKey, forecast: forecastKey } = getDataKeys();

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                    <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                        Production Trend
                        {isFiltered && (
                            <span className="text-[10px] font-normal text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{filteredWells.length} wells</span>
                        )}
                    </h3>
                    <div className="flex bg-zinc-100 rounded-lg p-0.5">
                        {(['boe', 'oil', 'gas'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMetric(m)}
                                className={`px-3 py-1 text-[10px] font-medium rounded-md transition-all uppercase ${metric === m
                                    ? 'bg-white text-zinc-900 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 10 }} tickFormatter={(value) => `${value}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                        <Line type="monotone" dataKey={forecastKey} name="Forecast" stroke="#a1a1aa" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                        <Line
                            type="monotone"
                            dataKey={actualKey}
                            name="Actual"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={(props: any) => {
                                const { cx, cy, payload } = props;
                                const actual = payload[actualKey];
                                const forecast = payload[forecastKey];
                                if (actual === null || actual === undefined) return <></>;
                                const variance = actual && forecast ? ((actual - forecast) / forecast) * 100 : 0;
                                const isHighVariance = variance < -5;
                                if (isHighVariance) {
                                    return <circle cx={cx} cy={cy} r={4} fill="#e11d48" stroke="white" strokeWidth={2} />;
                                }
                                return <circle cx={cx} cy={cy} r={3} fill="#2563eb" strokeWidth={0} />;
                            }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProductionTrendChart;
