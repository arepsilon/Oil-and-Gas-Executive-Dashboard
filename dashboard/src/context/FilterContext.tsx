"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FilterState {
    dateRange: string;
    basin: string;
    wellStatus: string;
    liftType: string;
    operator: string;
    commodity: string;
}

interface FilterContextType {
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    setFilter: (key: keyof FilterState, value: string) => void;
    clearFilters: () => void;
    activeFiltersCount: number;
}

const defaultFilters: FilterState = {
    dateRange: 'ytd',
    basin: 'all',
    wellStatus: 'all',
    liftType: 'all',
    operator: 'all',
    commodity: 'all',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [filters, setFilters] = useState<FilterState>(defaultFilters);

    const setFilter = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            ...defaultFilters,
            dateRange: filters.dateRange, // Keep date range when clearing
        });
    };

    const activeFiltersCount = [
        filters.basin,
        filters.wellStatus,
        filters.liftType,
        filters.operator,
        filters.commodity,
        filters.dateRange !== 'mtd' ? filters.dateRange : 'mtd'
    ].filter(v => v !== 'all' && v !== 'mtd').length;

    return (
        <FilterContext.Provider value={{ filters, setFilters, setFilter, clearFilters, activeFiltersCount }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilters = () => {
    const context = useContext(FilterContext);
    if (context === undefined) {
        throw new Error('useFilters must be used within a FilterProvider');
    }
    return context;
};

// Filter value maps
export const basinMap: Record<string, string> = {
    'permian': 'Permian',
    'eagle-ford': 'Eagle Ford',
    'bakken': 'Bakken',
    'dj-basin': 'DJ Basin',
};

export const statusMap: Record<string, string> = {
    'producing': 'Producing',
    'shut-in': 'Shut-in',
    'workover': 'Workover',
    'down': 'Down',
};

export const liftMap: Record<string, string> = {
    'esp': 'ESP',
    'rod-pump': 'Rod Pump',
    'gas-lift': 'Gas Lift',
    'plunger': 'Plunger',
};

export const operatorMap: Record<string, string> = {
    'dgp-operated': 'DGP Operated',
    'partner-a': 'Partner A',
    'partner-b': 'Partner B',
};

export const commodityMap: Record<string, string> = {
    'oil': 'Oil',
    'gas': 'Gas',
    'both': 'Both',
};

// Date range months map
export const getMonthsForDateRange = (dateRange: string): string[] => {
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    switch (dateRange) {
        case 'today':
            return ['Dec']; // Current month
        case 'wtd':
            return ['Dec']; // This week = current month
        case 'mtd':
            return ['Dec']; // Month to date
        case 'qtd':
            return ['Oct', 'Nov', 'Dec']; // Quarter to date (Q4)
        case 'ytd':
            return allMonths.slice(0, 12); // Year to date
        case 'last-month':
            return ['Nov'];
        case 'last-quarter':
            return ['Jul', 'Aug', 'Sep']; // Q3
        case 'last-year':
            return allMonths; // All months from previous year
        default:
            return allMonths.slice(0, 9); // Default: Jan-Sep
    }
};

// Helper function to check if a well matches the current filters
export const matchesFilters = (
    well: {
        basin?: string;
        status?: string;
        liftType?: string;
        operator?: string;
        commodity?: string;
    },
    filters: FilterState
): boolean => {
    // Basin filter
    if (filters.basin !== 'all' && well.basin && well.basin !== basinMap[filters.basin]) {
        return false;
    }

    // Well Status filter
    if (filters.wellStatus !== 'all' && well.status && well.status !== statusMap[filters.wellStatus]) {
        return false;
    }

    // Lift Type filter
    if (filters.liftType !== 'all' && well.liftType && well.liftType !== liftMap[filters.liftType]) {
        return false;
    }

    // Operator filter
    if (filters.operator !== 'all' && well.operator && well.operator !== operatorMap[filters.operator]) {
        return false;
    }

    // Commodity filter
    if (filters.commodity !== 'all' && well.commodity) {
        const selectedCommodity = commodityMap[filters.commodity];
        if (selectedCommodity === 'Oil' && well.commodity !== 'Oil' && well.commodity !== 'Both') {
            return false;
        }
        if (selectedCommodity === 'Gas' && well.commodity !== 'Gas' && well.commodity !== 'Both') {
            return false;
        }
    }

    return true;
};

// Helper to get basin name from filter value
export const getBasinNameFromFilter = (filterValue: string): string | null => {
    return basinMap[filterValue] || null;
};
