'use client'
import {TextField, useField, useFormInitializing} from '@payloadcms/ui'
import {TextFieldClientProps} from 'payload'
import {useEffect} from 'react'

const fetchVariableDetails = async (id: string) => {
  try {
    const response = await fetch(`/api/variables/${id}?depth=1`)
    if (!response.ok) throw new Error('Network response was not ok')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching variable details:', error)
  }
}

const VariableInlineField: React.FC<TextFieldClientProps> = (props) => {
  const formInitializing = useFormInitializing()
  const { path } = props
  const { value: textToDisplay, setValue: setTextToDisplayValue } = useField<string>({
    path: `${path}`,
  })

  const { value: variableId } = useField<string>({
    path: path.replace('textToDisplay', 'variable'),
  })

  useEffect(() => {
    const fetchData = async () => {
      if (formInitializing) return
      if (variableId) {
        const variableData = await fetchVariableDetails(variableId)
        if (variableData && variableData.key !== textToDisplay) {
          setTextToDisplayValue(variableData.key || '')
        }
      }
    }
    fetchData()
  }, [variableId, formInitializing])
  return <TextField {...props} />
}
export default VariableInlineField
