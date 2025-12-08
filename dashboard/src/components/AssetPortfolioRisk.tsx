"use client";

import React from 'react';
import AssetMap from './AssetMap';
import WellStatusCharts from './WellStatusCharts';

const AssetPortfolioRisk = () => {
    return (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-3 border-b border-zinc-100 bg-zinc-50/50">
                <h2 className="font-semibold text-zinc-800">Asset Portfolio & Risk</h2>
            </div>

            <div className="flex-1 flex flex-col min-h-0 p-3 gap-3">
                {/* Top Section: Interactive Map */}
                <div className="flex-[1.2] min-h-0">
                    <AssetMap />
                </div>

                {/* Bottom Section: Well Status Charts */}
                <div className="flex-1 min-h-0">
                    <WellStatusCharts />
                </div>
            </div>
        </div>
    );
};

export default AssetPortfolioRisk;
