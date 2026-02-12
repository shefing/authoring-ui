import React from 'react';
import {Label} from '../controls/label';

interface FieldGroupProps {
    label: string;
    htmlFor?: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    children: React.ReactNode;
    className?: string;
}

export function FieldGroup({
    label,
    htmlFor,
    required = false,
    error,
    helperText,
    children,
    className = ''
}: FieldGroupProps) {
    return (
        <div className={`mb-4 ${className}`}>
            <Label
                htmlFor={htmlFor}
                className="block text-gray-700 mb-1.5 text-sm font-medium">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {children}
            {error && (
                <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
            {helperText && !error && (
                <p className="text-xs text-gray-500 mt-1">{helperText}</p>
            )}
        </div>
    );
}

