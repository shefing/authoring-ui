'use client'
import React from 'react';
import type {LucideIcon} from 'lucide-react';

export interface TabItem<T = string> {
    id: T;
    label: string;
    icon?: LucideIcon;
}

interface TabsProps<T = string> {
    tabs: TabItem<T>[];
    activeTab: T;
    onTabChange: (tabId: T) => void;
    children?: React.ReactNode;
    className?: string;
}

export function Tabs<T = string>({
    tabs,
    activeTab,
    onTabChange,
    children,
    className = ''
}: TabsProps<T>) {
    return (
        <div className={`flex items-center justify-between gap-1 border-b border-gray-200 ${className}`}>
            <div className="flex gap-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={String(tab.id)}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
                                isActive
                                    ? 'border-purple-900 text-purple-900 bg-purple-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}>
                            {Icon && <Icon className="w-4 h-4"/>}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {children && (
                <div>
                    {children}
                </div>
            )}
        </div>
    );
}

