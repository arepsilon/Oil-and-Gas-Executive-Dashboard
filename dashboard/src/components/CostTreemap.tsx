"use client";

import React, { useState } from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { ChevronLeft, ZoomIn } from 'lucide-react';

const initialData = [
    {
        name: 'Labor',
        size: 450,
        performance: 2.5,
        children: [
            { name: 'PetroStaff', size: 300, performance: 1.2 },
            { name: 'RigHands Inc', size: 150, performance: 5.1 },
        ],
    },
    {
        name: 'Chemical',
        size: 280,
        performance: -1.5,
        children: [
            { name: 'ChemCo', size: 180, performance: -2.0 },
            { name: 'SolutionsPlus', size: 100, performance: -0.5 },
        ],
    },
    {
        name: 'Power',
        size: 320,
        performance: 4.2,
        children: [
            { name: 'TX Energy', size: 250, performance: 5.5 },
            { name: 'GenRentals', size: 70, performance: 0.1 },
        ],
    },
    {
        name: 'Water Disposal',
        size: 210,
        performance: -3.2,
        children: [
            { name: 'AquaHaul', size: 150, performance: -4.0 },
            { name: 'PipeLine Sys', size: 60, performance: -1.2 },
        ],
    },
    {
        name: 'Compression',
        size: 180,
        performance: 1.8,
        children: [
            { name: 'CompPress', size: 120, performance: 2.5 },
            { name: 'ValveTech', size: 60, performance: 0.5 },
        ],
    },
    {
        name: 'Workovers',
        size: 150,
        performance: 8.5,
        children: [
            { name: 'WellService', size: 100, performance: 10.2 },
            { name: 'RigUp', size: 50, performance: 5.1 },
        ],
    },
];

const TreemapContent = (props: any) => {
    const { x, y, width, height, name, performance, onClick, totalSize, value } = props;
    const percentShare = totalSize ? ((value / totalSize) * 100).toFixed(1) : 0;

    // Word wrap logic
    const words = name.split(' ');
    const lines = [];
    let currentLine = words[0];
    const maxCharsPerLine = Math.max(5, Math.floor(width / 7)); // Approx 7px per char

    for (let i = 1; i < words.length; i++) {
        if (currentLine.length + 1 + words[i].length <= maxCharsPerLine) {
            currentLine += ' ' + words[i];
        } else {
            lines.push(currentLine);
            currentLine = words[i];
        }
    }
    lines.push(currentLine);

    return (
        <g onClick={() => onClick && onClick(props)}>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: performance > 5 ? '#f43f5e' : performance > 0 ? '#fbbf24' : '#10b981',
                    stroke: '#fff',
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                }}
            />
            {width > 40 && height > 20 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 - (lines.length * 6)} // Adjust vertical center based on line count
                    textAnchor="middle"
                    fill="#1f2937"
                    stroke="none"
                    fontSize={width < 80 ? 11 : 13}
                    fontWeight="normal"
                    style={{ pointerEvents: 'none' }}
                >
                    {lines.map((line, index) => (
                        <tspan x={x + width / 2} dy={index === 0 ? 0 : 14} key={index}>
                            {line}
                        </tspan>
                    ))}
                </text>
            )}
            {width > 40 && height > 20 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + (lines.length * 6) + 12} // Position below the text block
                    textAnchor="middle"
                    fill="#1f2937"
                    stroke="none"
                    fontSize={11}
                    fontWeight="normal"
                    style={{ pointerEvents: 'none' }}
                >
                    {percentShare}%
                </text>
            )}
        </g>
    );
};

const CustomTooltip = ({ active, payload, totalSize }: any) => {
    if (active && payload && payload.length && payload[0].payload) {
        const data = payload[0].payload;
        const percentShare = totalSize ? ((data.size / totalSize) * 100).toFixed(1) : 0;
        return (
            <div className="bg-white p-2 border border-zinc-200 rounded shadow-lg text-xs z-50">
                <p className="font-bold text-zinc-800">{data.name}</p>
                <p className="text-zinc-500">Spend: ${data.size}k ({percentShare}%)</p>
                <p className={`font-medium ${data.performance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    Vs Budget: {data.performance > 0 ? '+' : ''}{data.performance}%
                </p>
                {data.children && (
                    <div className="mt-1 text-[10px] text-zinc-400 flex items-center gap-1">
                        <ZoomIn size={10} /> Click to drill down
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const CostTreemap = () => {
    const [drillPath, setDrillPath] = useState<any[]>([]);

    const currentRoot = drillPath.length > 0 ? drillPath[drillPath.length - 1] : null;

    // If at root, show categories (strip children to force leaf rendering).
    // If drilled down, show the children of the current root.
    const currentData = currentRoot
        ? currentRoot.children
        : initialData.map(({ children, ...rest }) => rest);

    const handleNodeClick = (node: any) => {
        // If we are at the root level, find the original node with children
        if (drillPath.length === 0) {
            const originalNode = initialData.find(n => n.name === node.name);
            if (originalNode && originalNode.children) {
                setDrillPath([...drillPath, originalNode]);
            }
        }
        // If we supported deeper nesting, we would handle it here
    };

    const handleBack = () => {
        setDrillPath(drillPath.slice(0, -1));
    };

    // Calculate total size for percentage calculation
    const totalSize = currentData.reduce((acc: number, item: any) => acc + item.size, 0);

    return (
        <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    {drillPath.length > 0 ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 px-2 py-1 rounded-md transition-colors"
                        >
                            <ChevronLeft size={14} /> Back to Categories
                        </button>
                    ) : (
                        <h3 className="text-sm font-semibold text-zinc-800">OPEX Breakdown</h3>
                    )}
                </div>

                <div className="flex items-center gap-2 text-[10px]">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-sm"></div>Under</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-sm"></div>Over</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-500 rounded-sm"></div>Alert (&gt;5%)</span>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={currentData}
                        dataKey="size"
                        aspectRatio={4 / 3}
                        fill="#8884d8"
                        content={(props) => <TreemapContent {...props} totalSize={totalSize} onClick={handleNodeClick} />}
                        animationDuration={400}
                    >
                        <Tooltip content={<CustomTooltip totalSize={totalSize} />} />
                    </Treemap>
                </ResponsiveContainer>
            </div>

            {drillPath.length === 0 && (
                <div className="text-[10px] text-zinc-400 text-center mt-1 italic">
                    Click any category to view Vendor breakdown
                </div>
            )}
        </div>
    );
};

export default CostTreemap;
