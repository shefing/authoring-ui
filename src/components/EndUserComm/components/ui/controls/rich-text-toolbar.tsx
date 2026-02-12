import React from 'react';
import {Bold, Italic, Link, List, ListOrdered, type LucideIcon, Underline} from 'lucide-react';
import {BUTTON_DISABLED} from '@/components/EndUserComm/lib/formStyles';

export type FormatAction = 'bold' | 'italic' | 'underline' | 'ul' | 'ol' | 'link';

interface ToolbarButton {
    action: FormatAction;
    icon: LucideIcon;
    title: string;
    dividerBefore?: boolean;
    disabled?: boolean;
}

interface RichTextToolbarProps {
    onFormat: (action: FormatAction, value?: string) => void;
    showHelperText?: boolean;
    className?: string;
    activeFormats?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        ul?: boolean;
        ol?: boolean;
        link?: boolean;
    };
    disabled?: boolean;
}

const toolbarButtons: ToolbarButton[] = [
    {action: 'bold', icon: Bold, title: 'Bold'},
    {action: 'italic', icon: Italic, title: 'Italic'},
    {action: 'underline', icon: Underline, title: 'Underline'},
    {action: 'ul', icon: List, title: 'Bullet List', dividerBefore: true},
    {action: 'ol', icon: ListOrdered, title: 'Numbered List'},
    {action: 'link', icon: Link, title: 'Insert Link', dividerBefore: true, disabled: true},
];

export function RichTextToolbar({
    onFormat,
    showHelperText = true,
    className = '',
    activeFormats = {},
    disabled = false
}: RichTextToolbarProps) {
    return (
        <div className={`flex items-center gap-1 p-2 bg-gray-50 ${className}`}>
            {toolbarButtons.map((button, index) => {
                const Icon = button.icon;
                const isActive = activeFormats[button.action as keyof typeof activeFormats];
                const isDisabled = button.disabled || disabled;
                const buttonClass = isDisabled
                    ? BUTTON_DISABLED
                    : isActive
                    ? 'bg-purple-100 text-purple-900 hover:bg-purple-200'
                    : 'hover:bg-gray-200';
                const iconClass = isDisabled ? 'text-gray-400' : isActive ? 'text-purple-900' : 'text-gray-700';
                
                return (
                    <React.Fragment key={button.action}>
                        {button.dividerBefore && index > 0 && (
                            <div className="w-px h-6 bg-gray-300 mx-1"/>
                        )}
                        <button
                            type="button"
                            onClick={() => !isDisabled && onFormat(button.action)}
                            disabled={isDisabled}
                            className={`p-1.5 rounded transition-colors ${buttonClass}`}
                            title={button.title}>
                            <Icon className={`w-4 h-4 ${iconClass}`}/>
                        </button>
                    </React.Fragment>
                );
            })}
            {showHelperText && (
                <div className="ml-auto text-xs text-gray-500">
                    Select text to format
                </div>
            )}
        </div>
    );
}
