import React from 'react';
import type {LucideIcon} from 'lucide-react';

interface SectionHeaderProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    className?: string;
    iconClassName?: string;
}

export function SectionHeader({
    icon: Icon,
    title,
    description,
    className = '',
    iconClassName = ''
}: SectionHeaderProps) {
    return (
        <div className={`flex items-center gap-2 text-gray-900 mb-4 ${className}`}>
            {Icon && (
                <Icon className={`w-5 h-5 text-purple-700 ${iconClassName}`}/>
            )}
            <div className="flex-1">
                <h3 className="text-lg font-semibold">{title}</h3>
                {description && (
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}

