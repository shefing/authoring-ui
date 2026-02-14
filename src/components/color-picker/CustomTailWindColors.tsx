'use client'
import {useEffect, useState} from 'react'
import {FieldLabel, useField} from '@payloadcms/ui'
import {Button} from './components/button'
import {Popover, PopoverContent, PopoverTrigger} from './components/popover'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from './components/command'
import {cn} from './lib/utils'
import {Paintbrush} from 'lucide-react'
import {resolveTailwindColor} from '@/app/(frontend)/lib/utils'
import TailWindColors from './TailWindColors'
import {SelectFieldClientProps} from 'payload'

type Props = {
  isFont?: boolean
  isBackground?: boolean
} & SelectFieldClientProps

const createColorTailwindOption = () => {
  const result: { color: string; value: string; label: string }[] = []
  for (const [category, colorArray] of Object.entries(TailWindColors)) {
    colorArray.forEach((color, index) => {
      const categoryLowe = category.toLowerCase()
      result.push({
        color,
        value:
          index == 0
            ? `${categoryLowe}-50`
            : index == 10
              ? `${categoryLowe}-950`
              : `${categoryLowe}-${index * 100}`,
        label:
          color +
          ' ' +
          (index == 0
            ? `${category}-50`
            : index == 10
              ? `${category}-950`
              : `${category}-${index * 100}`),
      })
    })
  }
  result.push({
    color: '#ffffff',
    value: 'white',
    label: '#ffffff white',
  })
  result.push({
    color: '#000000',
    value: 'black',
    label: '#000000 black',
  })
  return result
}

const colors: { color: string; value: string; label: string }[] = createColorTailwindOption()
export const SelectColor: React.FC<Props> = (props) => {
  const { path } = props
  const { isFont, isBackground, field } = props
  const { value, setValue } = useField<string>({ path })
  const [inputValue, setInputValue] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [fontColor, setFontColor] = useState('#000000')
  const [selectColor, setSelectColor] = useState<{ color: string; value: string; label: string } | null>(null)
  const labelToUse = field.label ? field.label : 'Color'

  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      console.log(`[DEBUG_LOG] SelectColor syncing value for ${path}: ${value}`);
      setInputValue(value || '')
    }
  }, [value, path])

  useEffect(() => {
    const obj = colors.find((color) => color.value === inputValue) || null
    setSelectColor(obj)
    
    // Use the found object's color if available, otherwise try to resolve it from the name
    const colorHex = obj?.color || (inputValue ? resolveTailwindColor(inputValue) : null)
    
    if (isFont) setFontColor(colorHex || '#000000')
    if (isBackground) setBackgroundColor(colorHex || '#FFFFFF')
  }, [inputValue, isFont, isBackground])

  const handleSelect = (label: string) => {
    const obj = colors.find((color) => color.label === label) || null
    console.log(`[DEBUG_LOG] SelectColor handleSelect: ${label}, value: ${obj?.value}`);
    setInputValue(obj?.value || '')
    setValue(obj?.value)
    setOpen(false)
  }

  return (
    <div className="mr-10" >
      {
        <FieldLabel
          htmlFor={`bfColourPickerField-${path?.replace(/\./gi, '__')}`}
          label={labelToUse}
        />
      }
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'comp w-[130px] justify-start text-left font-normal',
              !selectColor && 'text-muted-foreground ',
            )}
            style={{ backgroundColor: backgroundColor }}
          >
            <div className="comp w-full flex items-center gap-2">
              {(selectColor || inputValue) ? (
                <div
                  className="comp h-4 w-4 rounded !bg-center !bg-cover transition-all"
                  style={{ backgroundColor: selectColor ? selectColor.color : (inputValue ? resolveTailwindColor(inputValue) : 'transparent') }}
                />
              ) : (
                <Paintbrush className="h-4 w-4" />
              )}
              <div className="comp truncate flex-1" style={{ color: fontColor }}>
                {selectColor ? selectColor.value : (inputValue || 'Pick a color')}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="useTw comp mb-[10px] p-0" side="right" align="start">
          <Command>
            <CommandInput className="comp" placeholder="Search color..." autoFocus={false} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <div className="comp grid grid-cols-11 gap-2">
                  {colors.map((clr) => (
                    <CommandItem
                      key={clr.color + clr.label}
                      value={clr.label}
                      style={{ background: clr.color }}
                      className="comp rounded-md h-6 w-6 cursor-pointer active:scale-105"
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
export const SelectColorBackground: React.FC<Props> = (props) => {
  return <SelectColor {...props} isBackground={true} />
}
export const SelectColorFont: React.FC<Props> = (props) => {
  return <SelectColor {...props} isFont={true} />
}