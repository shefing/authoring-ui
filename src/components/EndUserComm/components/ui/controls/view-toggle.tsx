import React from 'react';
import {Table as TableIcon} from 'lucide-react';

type ViewMode = 'grid' | 'table';

interface ViewToggleProps {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({viewMode, onViewModeChange}: ViewToggleProps) {
    return (
        <div className="flex gap-2 bg-white rounded-lg border border-gray-200 p-1">
            <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-purple-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Grid View">
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <rect
                        x="1"
                        y="1"
                        width="6"
                        height="6"
                        rx="1"/>
                    <rect
                        x="9"
                        y="1"
                        width="6"
                        height="6"
                        rx="1"/>
                    <rect
                        x="1"
                        y="9"
                        width="6"
                        height="6"
                        rx="1"/>
                    <rect
                        x="9"
                        y="9"
                        width="6"
                        height="6"
                        rx="1"/>
                </svg>
            </button>
            <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-purple-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Table View">
                <TableIcon className="w-4 h-4"/>
            </button>
        </div>
    );
}

