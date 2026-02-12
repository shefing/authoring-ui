import React from 'react';

interface InfoFieldProps {
  label: string;
  children: React.ReactNode;
}

export function InfoField({ label, children }: InfoFieldProps) {
  return (
    <div className="flex-1">
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <div className="text-gray-900">{children}</div>
    </div>
  );
}

