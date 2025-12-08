"use client";

import React from 'react';
import ProductionTrendChart from './ProductionTrendChart';
import BasinPerformanceTable from './BasinPerformanceTable';

const ProductionOverview = () => {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-3 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="font-semibold text-zinc-800">Production Overview</h2>
            </div>

            <div className="flex-1 flex flex-col min-h-0 p-3 gap-3">
                {/* Top Section: Trend Chart */}
                <div className="flex-[1.2] min-h-0">
                    <ProductionTrendChart />
                </div>

                {/* Bottom Section: Table */}
                <div className="flex-1 min-h-0">
                    <BasinPerformanceTable />
                </div>
            </div>
        </div>
    );
};

export default ProductionOverview;
