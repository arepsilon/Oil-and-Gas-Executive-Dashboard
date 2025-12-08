"use client";

import React from 'react';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const data = [
    { month: 'Jan', budget: 4000, actual: 3800, cumulativeBudget: 4000 },
    { month: 'Feb', budget: 3500, actual: 3200, cumulativeBudget: 7500 },
    { month: 'Mar', budget: 4200, actual: 4500, cumulativeBudget: 11700 },
    { month: 'Apr', budget: 3800, actual: 3900, cumulativeBudget: 15500 },
    { month: 'May', budget: 4500, actual: 4100, cumulativeBudget: 20000 },
    { month: 'Jun', budget: 4000, actual: 4300, cumulativeBudget: 24000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-zinc-200 rounded-lg shadow-lg text-xs">
                <p className="font-bold text-zinc-800 mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
                        <span className="capitalize">{entry.name}:</span>
                        <span className="font-medium">${entry.value.toLocaleString()}k</span>
                    </p>
                ))}
                <div className="mt-2 pt-2 border-t border-zinc-100">
                    <p className="text-zinc-500">
                        Variance: <span className={payload[0].payload.actual > payload[0].payload.budget ? "text-rose-500" : "text-emerald-500"}>
                            {((payload[0].payload.actual - payload[0].payload.budget) / payload[0].payload.budget * 100).toFixed(1)}%
                        </span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const CapexBudgetChart = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-zinc-700">Capex: Actual vs Budget (YTD)</h3>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                        <span className="text-zinc-500">Actual</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-1 bg-zinc-800 rounded-full"></div>
                        <span className="text-zinc-500">Cum. Budget</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            tickFormatter={(value) => `$${value / 1000}M`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            tickFormatter={(value) => `$${value / 1000}M`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f4f4f5' }} />
                        <Bar yAxisId="left" dataKey="actual" name="Actual" barSize={32} radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.actual > entry.budget ? '#fbbf24' : '#10b981'} />
                            ))}
                        </Bar>
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="cumulativeBudget"
                            name="Cumulative Budget"
                            stroke="#27272a"
                            strokeWidth={2}
                            dot={{ r: 3, fill: '#27272a', strokeWidth: 0 }}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CapexBudgetChart;
