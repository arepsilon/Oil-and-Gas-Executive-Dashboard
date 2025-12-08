"use client";

import React, { useState } from 'react';
import { Calendar, MapPin, Activity, Wrench, Users, Droplets, ChevronDown, X } from 'lucide-react';
import { useFilters, FilterState } from '@/context/FilterContext';

interface FilterOption {
    value: string;
    label: string;
}

const dateRangeOptions: FilterOption[] = [
    { value: 'mtd', label: 'MTD' },
    { value: 'qtd', label: 'QTD' },
    { value: 'ytd', label: 'YTD' },
    { value: 'l12m', label: 'Last 12 Months' },
    { value: 'custom', label: 'Custom' },
];

const basinOptions: FilterOption[] = [
    { value: 'all', label: 'All Basins' },
    { value: 'permian', label: 'Permian' },
    { value: 'eagle-ford', label: 'Eagle Ford' },
    { value: 'bakken', label: 'Bakken' },
    { value: 'dj-basin', label: 'DJ Basin' },
];

const wellStatusOptions: FilterOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'producing', label: 'Producing' },
    { value: 'shut-in', label: 'Shut-in' },
    { value: 'workover', label: 'Workover' },
    { value: 'down', label: 'Down' },
];

const liftTypeOptions: FilterOption[] = [
    { value: 'all', label: 'All Lift Types' },
    { value: 'esp', label: 'ESP' },
    { value: 'rod-pump', label: 'Rod Pump' },
    { value: 'gas-lift', label: 'Gas Lift' },
    { value: 'plunger', label: 'Plunger' },
];

const operatorOptions: FilterOption[] = [
    { value: 'all', label: 'All Operators' },
    { value: 'dg-petro', label: 'DG Petro (100%)' },
    { value: 'jv-partner-a', label: 'JV Partner A (50%)' },
    { value: 'jv-partner-b', label: 'JV Partner B (25%)' },
];

const commodityOptions: FilterOption[] = [
    { value: 'all', label: 'All Commodities' },
    { value: 'oil', label: 'Oil' },
    { value: 'gas', label: 'Gas' },
    { value: 'ngl', label: 'NGL' },
];

interface FilterDropdownProps {
    icon: React.ReactNode;
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ icon, label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-all"
            >
                <span className="text-zinc-400">{icon}</span>
                <span className="hidden xl:inline text-zinc-400">{label}:</span>
                <span className="text-zinc-800">{selectedOption?.label}</span>
                <ChevronDown size={12} className={`text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-50 transition-colors ${value === option.value ? 'text-blue-600 bg-blue-50 font-medium' : 'text-zinc-700'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const FilterBar = () => {
    const { filters, setFilter, clearFilters, activeFiltersCount } = useFilters();

    return (
        <div className="w-full bg-white border-b border-zinc-200 px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mr-2">Filters:</span>

                <FilterDropdown
                    icon={<Calendar size={12} />}
                    label="Period"
                    options={dateRangeOptions}
                    value={filters.dateRange}
                    onChange={(value) => setFilter('dateRange', value)}
                />

                <div className="w-px h-5 bg-zinc-200 mx-1" />

                <FilterDropdown
                    icon={<MapPin size={12} />}
                    label="Basin"
                    options={basinOptions}
                    value={filters.basin}
                    onChange={(value) => setFilter('basin', value)}
                />

                <FilterDropdown
                    icon={<Activity size={12} />}
                    label="Status"
                    options={wellStatusOptions}
                    value={filters.wellStatus}
                    onChange={(value) => setFilter('wellStatus', value)}
                />

                <FilterDropdown
                    icon={<Wrench size={12} />}
                    label="Lift"
                    options={liftTypeOptions}
                    value={filters.liftType}
                    onChange={(value) => setFilter('liftType', value)}
                />

                <FilterDropdown
                    icon={<Users size={12} />}
                    label="Operator"
                    options={operatorOptions}
                    value={filters.operator}
                    onChange={(value) => setFilter('operator', value)}
                />

                <FilterDropdown
                    icon={<Droplets size={12} />}
                    label="Commodity"
                    options={commodityOptions}
                    value={filters.commodity}
                    onChange={(value) => setFilter('commodity', value)}
                />

                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors ml-2"
                    >
                        <X size={10} />
                        Clear ({activeFiltersCount})
                    </button>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
