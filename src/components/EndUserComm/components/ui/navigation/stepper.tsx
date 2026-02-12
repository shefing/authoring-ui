import React from 'react';
import {Check} from 'lucide-react';

export interface Step {
    id: string | number;
    label: string;
    description?: string;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
    className?: string;
}

export function Stepper({steps, currentStep, className = ''}: StepperProps) {
    return (
        <div className={`flex items-center justify-between mb-6 ${className}`}>
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                const isLast = index === steps.length - 1;

                return (
                    <React.Fragment key={step.id}>
                        <div className="flex items-center flex-1">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                                isCompleted
                                    ? 'bg-purple-900 border-purple-900 text-white'
                                    : isActive
                                        ? 'border-purple-900 bg-white text-purple-900'
                                        : 'border-gray-300 bg-white text-gray-400'
                            }`}>
                                {isCompleted ? (
                                    <Check className="w-4 h-4"/>
                                ) : (
                                    <span className="text-sm font-medium">{stepNumber}</span>
                                )}
                            </div>
                            <div className="ml-3 flex-1">
                                <span className={`text-sm font-medium ${
                                    isActive ? 'text-purple-900' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                    {step.label}
                                </span>
                                {step.description && (
                                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                                )}
                            </div>
                        </div>
                        {!isLast && (
                            <div className={`h-0.5 flex-1 mx-2 ${isCompleted ? 'bg-purple-900' : 'bg-gray-300'}`}/>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

