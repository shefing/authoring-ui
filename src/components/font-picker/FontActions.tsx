'use client'
import React, {useState, useEffect} from 'react'
import {FieldLabel, useField} from '@payloadcms/ui'
import {Button} from './components/button'
import {Popover, PopoverContent, PopoverTrigger} from './components/popover'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from './components/command'
import {cn} from './lib/utils'
import {Type, ChevronDown} from 'lucide-react'
import {TextFieldClientProps} from 'payload'

export const ActionFont: React.FC<TextFieldClientProps & { apiUrl?: string }> = (props) => {
  const { path, apiUrl, field } = props
  const { value, setValue } = useField<string>({ path })
  const [open, setOpen] = useState(false)
  const [fonts, setFonts] = useState<string[]>([
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro', 'Slabo 27px', 'Raleway', 'PT Sans'
  ])

  useEffect(() => {
    if (apiUrl) {
      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setFonts(data.map(f => typeof f === 'string' ? f : f.family))
            }
        })
        .catch(err => console.error('Failed to fetch fonts', err))
    }
  }, [apiUrl])

  return (
    <div className="useTw mb-4 mr-10" >
      <FieldLabel htmlFor={`field-${path}`} label={field.label || 'Font Family'} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span>{value || 'Select font...'}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search font..." />
            <CommandList>
              <CommandEmpty>No font found.</CommandEmpty>
              <CommandGroup>
                {fonts.map((font) => (
                  <CommandItem
                    key={font}
                    onSelect={() => {
                      setValue(font)
                      setOpen(false)
                    }}
                    className="flex items-center justify-between"
                  >
                    <span style={{ fontFamily: font }}>{font}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export const ActionFontSize: React.FC<TextFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  
  const sizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px']

  return (
    <div className="useTw mb-4 mr-10">
      <FieldLabel htmlFor={`field-${path}`} label={field.label || 'Font Size'} />
      <div className="flex gap-2 items-center">
          <select 
            value={value || '16px'} 
            onChange={(e) => setValue(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
              {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
              ))}
          </select>
          <input 
            type="range" 
            min="8" 
            max="100" 
            value={parseInt(value || '16')} 
            onChange={(e) => setValue(e.target.value + 'px')}
            className="w-full"
          />
      </div>
    </div>
  )
}

export const ActionFontStyle: React.FC<TextFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  
  const weights = [
      { label: 'Thin', value: '100' },
      { label: 'Extra Light', value: '200' },
      { label: 'Light', value: '300' },
      { label: 'Regular', value: '400' },
      { label: 'Medium', value: '500' },
      { label: 'Semi Bold', value: '600' },
      { label: 'Bold', value: '700' },
      { label: 'Extra Bold', value: '800' },
      { label: 'Black', value: '900' },
  ]

  return (
    <div className="useTw mb-4 mr-10" >
      <FieldLabel htmlFor={`field-${path}`} label={field.label || 'Font Weight & Style'} />
      <select 
        value={value || '400'} 
        onChange={(e) => setValue(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
          {weights.map(w => (
              <option key={w.value} value={w.value}>{w.label} ({w.value})</option>
          ))}
          <option value="italic">Italic</option>
          <option value="bold-italic">Bold Italic</option>
      </select>
    </div>
  )
}
