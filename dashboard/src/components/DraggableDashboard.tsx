"use client";

import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import ProductionOverview from './ProductionOverview';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DraggableDashboard = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Layout definition
    // 12 columns total
    const layouts = {
        lg: [
            { i: 'production-overview', x: 0, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
        ],
        md: [
            { i: 'production-overview', x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 3 },
        ],
        sm: [
            { i: 'production-overview', x: 0, y: 0, w: 6, h: 4, minW: 2, minH: 3 },
        ]
    };

    if (!mounted) return null;

    return (
        <div className="h-full w-full overflow-hidden relative">
            <div className="absolute top-2 right-2 z-50">
                <button
                    className="text-[10px] text-zinc-400 hover:text-zinc-600 transition-colors bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-zinc-100 shadow-sm"
                    onClick={() => window.location.reload()}
                >
                    Reset Layout
                </button>
            </div>
            <ResponsiveGridLayout
                className="layout"
                layouts={layouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={150}
                draggableHandle=".drag-handle"
                margin={[16, 16]}
            >
                <div key="production-overview" className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
                    <div className="drag-handle h-6 bg-zinc-50 border-b border-zinc-100 cursor-move flex items-center justify-center">
                        <div className="w-8 h-1 bg-zinc-200 rounded-full"></div>
                    </div>
                    <div className="flex-1 min-h-0 p-2">
                        <ProductionOverview />
                    </div>
                </div>
            </ResponsiveGridLayout>
        </div>
    );
};

export default DraggableDashboard;
