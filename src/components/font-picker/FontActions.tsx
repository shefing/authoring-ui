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
  const [inputValue, setInputValue] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [fonts, setFonts] = useState<string[]>([
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro', 'Slabo 27px', 'Raleway', 'PT Sans'
  ])

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      console.log(`[DEBUG_LOG] ActionFont syncing value: ${value}`);
      setInputValue(value || '')
    }
  }, [value])

  const handleChange = (val: string) => {
    console.log(`[DEBUG_LOG] ActionFont handleChange: ${val}`);
    setInputValue(val)
    setValue(val)
  }

  // Load font preview in admin
  useEffect(() => {
    if (inputValue && !['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', '-apple-system'].includes(inputValue.toLowerCase())) {
        const linkId = `admin-font-${inputValue.replace(/\s+/g, '-').toLowerCase()}`
        if (!document.getElementById(linkId)) {
            const link = document.createElement('link')
            link.id = linkId
            link.rel = 'stylesheet'
            link.href = `https://fonts.googleapis.com/css2?family=${inputValue.replace(/\s+/g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`
            document.head.appendChild(link)
        }
    }
  }, [inputValue])

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
    <div className="useTw mr-10 fontAction w-45" >
      <FieldLabel htmlFor={`field-${path}`} label={field.label || 'Font Family'} />
      <Popover open={open} onOpenChange={setOpen} >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span style={{ fontFamily: inputValue || 'inherit' }}>{inputValue || 'Select font...'}</span>
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
                      handleChange(font)
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
  const [inputValue, setInputValue] = useState(value || '')
  
  const sizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px']

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      console.log(`[DEBUG_LOG] ActionFontSize syncing value: ${value}`);
      setInputValue(value || '')
    }
  }, [value])

  const handleChange = (val: string) => {
    console.log(`[DEBUG_LOG] ActionFontSize handleChange: ${val}`);
    setInputValue(val)
    setValue(val)
  }

  // Ensure current value is in sizes list so select can show it
  const displaySizes = [...sizes]
  if (inputValue && !sizes.includes(inputValue)) {
    displaySizes.push(inputValue)
    displaySizes.sort((a, b) => parseInt(a) - parseInt(b))
  }

  return (
    <div className="useTw fontAction">
      <FieldLabel htmlFor={`field-${path}`} label={field.label || 'Font Size'} />
      <div className="flex gap-2 items-center">
          <select 
            value={inputValue} 
            onChange={(e) => handleChange(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
              <option value="" disabled>Select...</option>
              {displaySizes.map(size => (
                  <option key={size} value={size}>{size}</option>
              ))}
          </select>
      </div>
    </div>
  )
}

export const ActionFontStyle: React.FC<TextFieldClientProps> = (props) => {
  const { path, field } = props
  const { value, setValue } = useField<string>({ path })
  const [inputValue, setInputValue] = useState(value || '')
  
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

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      console.log(`[DEBUG_LOG] ActionFontStyle syncing value: ${value}`);
      setInputValue(value || '')
    }
  }, [value])

  const handleChange = (val: string) => {
    console.log(`[DEBUG_LOG] ActionFontStyle handleChange: ${val}`);
    setInputValue(val)
    setValue(val)
  }

  return (
    <div className="useTw mr-10 fontAction" >
      <FieldLabel htmlFor={`field-${path}`} label={field.label || 'Font Weight & Style'} />
      <select 
        value={inputValue} 
        onChange={(e) => handleChange(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
          <option value="" disabled>Select...</option>
          {weights.map(w => (
              <option key={w.value} value={w.value}>{w.label} ({w.value})</option>
          ))}
          <option value="italic">Italic</option>
          <option value="bold-italic">Bold Italic</option>
      </select>
    </div>
  )
}
