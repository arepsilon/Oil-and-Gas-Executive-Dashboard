"use client";

import React from 'react';
import { AlertTriangle, Clock, TrendingDown, DollarSign } from 'lucide-react';

const alerts = [
    {
        id: 1,
        type: 'Lease Expiration',
        count: 12,
        severity: 'High',
        action: 'Review HBP status',
        icon: Clock,
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    },
    {
        id: 2,
        type: 'High LOE (>$15)',
        count: 8,
        severity: 'High',
        action: 'Evaluate shut-in',
        icon: DollarSign,
        color: 'text-rose-600',
        bg: 'bg-rose-50'
    },
    {
        id: 3,
        type: 'Prod Variance >10%',
        count: 23,
        severity: 'Medium',
        action: 'Investigation needed',
        icon: TrendingDown,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    {
        id: 4,
        type: 'Budget Overrun',
        count: 4,
        severity: 'Medium',
        action: 'Cost control review',
        icon: AlertTriangle,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
];

const RiskAlerts = () => {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-rose-500" />
                    Risk & Alerts
                </h3>
                <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">4 Active</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
                <div className="space-y-2">
                    {alerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-2 rounded-lg border border-zinc-100 hover:bg-zinc-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${alert.bg} ${alert.color}`}>
                                    <alert.icon size={14} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-zinc-800">{alert.type}</span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${alert.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-zinc-500 mt-0.5">
                                        <span className="font-medium text-zinc-700">{alert.count} items</span> • {alert.action}
                                    </div>
                                </div>
                            </div>
                            <button className="text-[10px] font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RiskAlerts;
