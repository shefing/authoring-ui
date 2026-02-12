import React from 'react';
import {cn} from '../utils';
import {BUTTON_DISABLED} from '@/components/EndUserComm/lib/formStyles';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

function Card({children, className = ''}: CardProps) {
    return (
        <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col ${className}`}>
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

function CardHeader({children, className = ''}: CardHeaderProps) {
    return (
        <div className={`p-6 border-b border-gray-200 ${className}`}>
            {children}
        </div>
    );
}

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

function CardBody({children, className = ''}: CardBodyProps) {
    return (
        <div className={`p-6 space-y-4 flex-1 ${className}`}>
            {children}
        </div>
    );
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

function CardFooter({children, className = ''}: CardFooterProps) {
    return (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between mt-auto ${className}`}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

function CardTitle({children, className = ''}: CardTitleProps) {
    return (
        <h3 className={`text-gray-900 ${className}`}>
            {children}
        </h3>
    );
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

function CardDescription({children, className = ''}: CardDescriptionProps) {
    return (
        <p className={`text-gray-600 text-sm ${className}`}>
            {children}
        </p>
    );
}

// Card action button for primary actions with text + icon
interface CardActionButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    icon: React.ComponentType<{className?: string}>;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
}

function CardActionButton({onClick, disabled = false, icon: Icon, children, variant = 'primary'}: CardActionButtonProps) {
    const variantClasses = {
        primary: 'text-purple-900 hover:text-purple-950',
        secondary: 'text-blue-600 hover:text-blue-800'
    };

    return (
        <button
            className={cn(
                variantClasses[variant],
                'flex items-center gap-1 text-sm',
                disabled ? BUTTON_DISABLED : 'cursor-pointer'
            )}
            onClick={onClick}
            disabled={disabled}>
            <Icon className="w-4 h-4"/>
            {children}
        </button>
    );
}

// Simple icon button for card actions
interface CardIconButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    title?: string;
    icon: React.ComponentType<{className?: string}>;
}

function CardIconButton({onClick, disabled = false, title, icon: Icon}: CardIconButtonProps) {
    return (
        <button
            className={disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-800 cursor-pointer'}
            onClick={onClick}
            disabled={disabled}
            title={title}>
            <Icon className="w-4 h-4"/>
        </button>
    );
}

interface CardActionsProps {
    children: React.ReactNode;
    className?: string;
}

function CardActions({children, className = ''}: CardActionsProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {children}
        </div>
    );
}

export {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardTitle,
    CardDescription,
    CardActionButton,
    CardIconButton,
    CardActions,
};

