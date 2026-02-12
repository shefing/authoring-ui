import React from 'react';

export interface FilterOption {
    key: string;
    name: string;
    value: number;
    colorClass: string; // Tailwind class like "bg-blue-100"
}

interface FilterButtonsProps {
    label: string;
    options: FilterOption[];
    selectedValues?: string[];
    totalCount: number;
    onFilterChange: (key: string) => void;
    onClearFilter: () => void;
}

export function FilterButtons({
    label,
    options,
    selectedValues = [],
    totalCount,
    onFilterChange,
    onClearFilter
}: FilterButtonsProps) {
    const hasSelection = selectedValues.length > 0;

    return (
        <div>
            <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                {label}
            </label>
            <div className="flex flex-wrap gap-1.5">
                <button
                    onClick={onClearFilter}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors ${
                        !hasSelection
                            ? 'bg-purple-50 border-purple-300 text-purple-900'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}>
                    <span>All</span>
                    <span className="font-medium">({totalCount})</span>
                </button>
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option.key);
                    return (
                        <button
                            key={option.key}
                            onClick={() => onFilterChange(option.key)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors ${
                                isSelected
                                    ? 'bg-purple-50 border-purple-300 text-purple-900'
                                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${option.colorClass}`}/>
                            <span>{option.name}</span>
                            <span className="font-medium">({option.value})</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

