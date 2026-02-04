'use client'
import React from 'react'
import { Button } from '@/components/color-picker/components/button'

export const Dashboard: React.FC = () => {
  return (
    <div className="twp p-8 flex flex-col gap-6">
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h1 className="text-3xl font-bold text-foreground mb-4">Tailwind v4 + shadcn in Payload Admin</h1>
        <p className="text-muted-foreground mb-6">
          This component is styled using Tailwind v4 utilities and is scoped to the <code>.twp</code> class.
          It should not affect the rest of the Payload Admin UI.
        </p>
        
        <div className="flex flex-col gap-4 max-w-sm">
          <label className="text-sm font-medium text-foreground">Test Input</label>
          <input 
            type="text" 
            placeholder="Type something..." 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          
          <Button size="lg" className="w-full">
            shadcn Button
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-primary-foreground p-4 rounded-md shadow">
          Primary Color
        </div>
        <div className="bg-secondary text-secondary-foreground p-4 rounded-md shadow border">
          Secondary Color
        </div>
        <div className="bg-destructive text-destructive-foreground p-4 rounded-md shadow">
          Destructive Color
        </div>
      </div>
    </div>
  )
}
