import React from 'react';
import {Input} from './input';
import {Label} from './label';
import {cn} from '../utils';
import {BUTTON_DISABLED} from '@/components/EndUserComm/lib/formStyles';

interface ColorInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

export function ColorInput({label, value, onChange, className = '', disabled = false}: ColorInputProps) {
    return (
        <div className={className}>
            <Label className="block text-gray-600 mb-1 text-xs">
                {label}
            </Label>
            <div className="flex gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={cn(
                        "w-10 h-9 rounded border border-gray-300 cursor-pointer",
                        BUTTON_DISABLED
                    )}/>
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="flex-1"/>
            </div>
        </div>
    );
}

