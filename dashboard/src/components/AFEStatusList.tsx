"use client";

import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const afeData = [
    {
        id: 'AFE-2024-001',
        project: 'Permian Pad A Drilling',
        budget: 12500000,
        incurred: 8200000,
        progress: 65,
        status: 'On Track',
        startDate: '2024-01-15',
        type: 'Drilling'
    },
    {
        id: 'AFE-2024-012',
        project: 'Eagle Ford Completions',
        budget: 8400000,
        incurred: 7900000,
        progress: 94,
        status: 'Risk',
        startDate: '2024-02-01',
        type: 'Completions'
    },
    {
        id: 'AFE-2024-008',
        project: 'Infrastructure Expansion',
        budget: 4200000,
        incurred: 1500000,
        progress: 35,
        status: 'On Track',
        startDate: '2024-03-10',
        type: 'Facilities'
    },
    {
        id: 'AFE-2024-015',
        project: 'Water Recycling Plant',
        budget: 3100000,
        incurred: 3400000,
        progress: 110,
        status: 'Over Budget',
        startDate: '2024-01-20',
        type: 'Facilities'
    },
    {
        id: 'AFE-2024-022',
        project: 'Workover Campaign Q2',
        budget: 1800000,
        incurred: 900000,
        progress: 50,
        status: 'On Track',
        startDate: '2024-04-01',
        type: 'Workover'
    },
];

const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
        case 'On Track':
            return (
                <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <CheckCircle2 size={10} /> On Track
                </span>
            );
        case 'Risk':
            return (
                <span className="flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    <Clock size={10} /> At Risk
                </span>
            );
        case 'Over Budget':
            return (
                <span className="flex items-center gap-1 text-[10px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    <AlertCircle size={10} /> Over Budget
                </span>
            );
        default:
            return null;
    }
};

const AFEStatusList = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-zinc-700">Active AFE Status</h3>
                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">View All</button>
            </div>

            <div className="flex-1 overflow-auto pr-2">
                <div className="space-y-3">
                    {afeData.map((afe) => (
                        <div key={afe.id} className="p-3 bg-zinc-50 rounded-lg border border-zinc-100 hover:border-zinc-200 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-medium text-zinc-800">{afe.project}</h4>
                                        <StatusBadge status={afe.status} />
                                    </div>
                                    <p className="text-[10px] text-zinc-500">{afe.id} • {afe.type}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-zinc-800">${(afe.incurred / 1000000).toFixed(1)}M</p>
                                    <p className="text-[10px] text-zinc-500">of ${(afe.budget / 1000000).toFixed(1)}M</p>
                                </div>
                            </div>

                            <div className="relative pt-1">
                                <div className="flex mb-1 items-center justify-between">
                                    <div className="text-[10px] font-medium text-zinc-600">
                                        {afe.progress}% Used
                                    </div>
                                </div>
                                <div className="overflow-hidden h-1.5 text-xs flex rounded bg-zinc-200">
                                    <div
                                        style={{ width: `${Math.min(afe.progress, 100)}%` }}
                                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${afe.progress > 100 ? 'bg-rose-500' :
                                                afe.progress > 90 ? 'bg-amber-400' : 'bg-emerald-500'
                                            }`}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AFEStatusList;
