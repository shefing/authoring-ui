import React from 'react';
import {Filter} from 'lucide-react';

interface FilterToggleProps {
    isActive: boolean;
    onToggle: () => void;
}

export function FilterToggle({isActive, onToggle}: FilterToggleProps) {
    return (
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <button
                onClick={onToggle}
                className={`p-1.5 rounded transition-colors ${isActive ? 'bg-purple-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Toggle Filters">
                <Filter className="w-4 h-4"/>
            </button>
        </div>
    );
}

