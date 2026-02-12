import React from 'react';

interface PreviewContainerProps {
  children: React.ReactNode;
}

export function PreviewContainer({ children }: PreviewContainerProps) {
  return (
    <div 
      className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex items-center justify-center">
      {children}
    </div>
  );
}

