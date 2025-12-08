import React from 'react';

import MarginAnalysis from './MarginAnalysis';

const FinancialPerformance = () => {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-3 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="font-semibold text-zinc-800">Financial Performance</h2>
            </div>

            <div className="flex-1 flex flex-col min-h-0 p-3">
                <MarginAnalysis />
            </div>
        </div>
    );
};

export default FinancialPerformance;
