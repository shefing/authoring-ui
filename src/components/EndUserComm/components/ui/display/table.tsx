import React from 'react';
import {cn} from '../utils';
import {BUTTON_DISABLED} from '@/components/EndUserComm/lib/formStyles';

interface TableProps {
    children: React.ReactNode;
    className?: string;
}

function Table({children, className = ''}: TableProps) {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
            <table className="w-full">
                {children}
            </table>
        </div>
    );
}

interface TableHeaderProps {
    children: React.ReactNode;
    className?: string;
}

function TableHeader({children, className = ''}: TableHeaderProps) {
    return (
        <thead className={`bg-gray-50 border-b border-gray-200 ${className}`}>
            {children}
        </thead>
    );
}

interface TableBodyProps {
    children: React.ReactNode;
    className?: string;
}

function TableBody({children, className = ''}: TableBodyProps) {
    return (
        <tbody className={`divide-y divide-gray-200 ${className}`}>
            {children}
        </tbody>
    );
}

interface TableRowProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

function TableRow({children, className = '', onClick}: TableRowProps) {
    return (
        <tr
            className={`hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}>
            {children}
        </tr>
    );
}

interface TableHeadProps {
    children: React.ReactNode;
    className?: string;
}

function TableHead({children, className = ''}: TableHeadProps) {
    return (
        <th className={`text-left px-6 py-3 text-gray-600 ${className}`}>
            {children}
        </th>
    );
}

interface TableHeadSortableProps {
    children: React.ReactNode;
    className?: string;
    sortDirection?: 'asc' | 'desc' | null;
    onSort?: () => void;
}

function TableHeadSortable({children, className = '', sortDirection = null, onSort}: TableHeadSortableProps) {
    return (
        <th
            className={cn(
                'text-left px-6 py-3 text-gray-600 cursor-pointer select-none hover:bg-gray-100',
                className
            )}
            onClick={onSort}>
            <div className="flex items-center gap-2">
                <span>{children}</span>
                <span className="w-4 h-4 inline-flex items-center justify-center flex-shrink-0">
                    {sortDirection && (
                        <svg
                            className="w-4 h-4 text-gray-600 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            style={{
                                transform: sortDirection === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}>
                            <path d="M19 9l-7 7-7-7"/>
                        </svg>
                    )}
                </span>
            </div>
        </th>
    );
}

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary';
}

function TableCell({children, className = '', variant}: TableCellProps) {
    const variantClasses = {
        primary: 'text-gray-900',
        secondary: 'text-gray-600 text-sm'
    };

    const textClass = variant ? variantClasses[variant] : '';

    return (
        <td className={`px-6 py-4 ${textClass} ${className}`}>
            {children}
        </td>
    );
}

// Action button components for table cells
interface TableActionButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    title?: string;
    icon: React.ComponentType<{className?: string}>;
}

function TableActionButton({onClick, disabled = false, title, icon: Icon}: TableActionButtonProps) {
    return (
        <button
            className={cn(
                disabled
                    ? `text-gray-300 ${BUTTON_DISABLED}`
                    : 'text-purple-900 hover:text-purple-950 cursor-pointer'
            )}
            onClick={onClick}
            disabled={disabled}
            title={title}>
            <Icon className="w-4 h-4"/>
        </button>
    );
}

interface TableActionsProps {
    children: React.ReactNode;
    className?: string;
}

function TableActions({children, className = ''}: TableActionsProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {children}
        </div>
    );
}


export {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableHeadSortable,
    TableCell,
    TableActionButton,
    TableActions,
};

