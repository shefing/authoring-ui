import React from 'react';
import {X} from 'lucide-react';

interface FilterPanelProps {
    title: string;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    children: React.ReactNode;
    className?: string;
    gap?: string;
}

export function FilterPanel({
    title,
    hasActiveFilters,
    onClearFilters,
    children,
    className = '',
    gap = 'gap-4'
}: FilterPanelProps) {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-gray-900">{title}</h2>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-xs text-purple-700 hover:text-purple-800 flex items-center gap-1 px-2 py-1">
                        <X className="w-3 h-3"/>
                        Clear All
                    </button>
                )}
            </div>

            {/* Filters Content */}
            <div className={`flex flex-wrap ${gap}`}>
                {children}
            </div>
        </div>
    );
}

