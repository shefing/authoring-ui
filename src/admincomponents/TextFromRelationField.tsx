'use client'
import { FieldLabel, TextInput, useField, useFormFields, useFormInitializing } from '@payloadcms/ui';
import { TextFieldClientProps } from 'payload';
import React, { useEffect } from 'react';

export interface TextFromRelationFieldProps {
  relationField: string;
  relationDisplayField: string;
  fetchEndpoint: string;
}

const TextFromRelationField: React.FC<TextFromRelationFieldProps & TextFieldClientProps> = (props) => {
  const { relationField, relationDisplayField, fetchEndpoint, path, field } = props;
  const formInitializing = useFormInitializing();

  const { value, setValue } = useField<string>({
    path: path,
  });

  // Watch the relation field value using useFormFields
  const relationValue = useFormFields(([fields]) => {
    // If we are in an array, relationField might need to be prefixed
    const parentPath = path.includes('.') ? path.substring(0, path.lastIndexOf('.') + 1) : '';
    const fullRelationPath = parentPath + relationField;
    return fields[fullRelationPath]?.value;
  });

  useEffect(() => {
    const fetchData = async () => {
      if (formInitializing) {
        return;
      }

      if (relationValue) {
        const response = await fetch(`${fetchEndpoint}/${relationValue}?depth=0`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data && data[relationDisplayField] !== value) {
          setValue(data[relationDisplayField] || '');
        } else {
          console.log('No data returned');
        }
      }
    };
    fetchData();
  }, [relationValue]);

  return (
    <div className="field-type text">
      <FieldLabel
        htmlFor={`field-${path?.replace(/\./gi, '__')}`}
        label={field?.label || ''}
      />
      <TextInput 
        value={value || ''} 
        path={path} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
      />
    </div>
  );
};

export default TextFromRelationField;
