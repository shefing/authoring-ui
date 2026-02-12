import React from 'react';
import {X} from 'lucide-react';

export interface ActiveFilter {
    category: string;
    label: string;
    value: string;
    colorClass?: string; // Tailwind class like "bg-blue-100"
}

interface ActiveFiltersDisplayProps {
    filters: ActiveFilter[];
    onRemoveFilter: (category: string, value: string) => void;
    onClearAll: () => void;
    className?: string;
}

export function ActiveFiltersDisplay({
    filters,
    onRemoveFilter,
    onClearAll,
    className = ''
}: ActiveFiltersDisplayProps) {
    if (filters.length === 0) {
        return null;
    }

    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">
                    Active Filters
                </span>
                <button
                    onClick={onClearAll}
                    className="text-xs text-purple-700 hover:text-purple-800 flex items-center gap-1 px-2 py-1">
                    <X className="w-3 h-3"/>
                    Clear All
                </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {filters.map((filter, index) => (
                    <div
                        key={`${filter.category}-${filter.value}-${index}`}
                        className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-300 rounded px-2.5 py-1 text-xs">
                        {filter.colorClass && (
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${filter.colorClass}`}/>
                        )}
                        <span className="text-purple-900">
                            <span className="font-medium">{filter.category}:</span>{' '}
                            {filter.label}
                        </span>
                        <button
                            onClick={() => onRemoveFilter(filter.category, filter.value)}
                            className="text-purple-700 hover:text-purple-900 flex-shrink-0"
                            title="Remove filter">
                            <X className="w-3 h-3"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

