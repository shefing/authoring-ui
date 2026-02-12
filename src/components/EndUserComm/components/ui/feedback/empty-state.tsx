import React from 'react';
import type {LucideIcon} from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title?: string;
    message: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon: Icon,
    title,
    message,
    action,
    className = ''
}: EmptyStateProps) {
    return (
        <div className={`text-center py-8 px-4 ${className}`}>
            {Icon && (
                <Icon className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
            )}
            {title && (
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            )}
            <p className="text-gray-500 mb-4">{message}</p>
            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
}

