import {CollectionConfig} from 'payload'
import {createIconSelectField} from "@/components/icon-select";

export const Buttons: CollectionConfig = {
  slug: 'buttons',
  labels: {
    singular: '🔘 Button',
    plural: '🔘 Buttons',
  },
  enableQueryPresets: true,
  admin: {
    group: 'Configuration',
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields:[
    {type:'row',fields:[
    {
      name: 'name',
      type: 'text',
      admin:{
        width :'25%',
      },
      required: true,
    },
    {
      name: 'label',
      type: 'text',
      admin:{
        width :'20%',
      },
    },
        {
          name: 'action',
          type: 'select',
          options: [
            { label: 'Cancel', value: 'Cancel' },
            { label: 'Acknowledge', value: 'Acknowledge' },
          ],
          defaultValue: 'Acknowledge',
          admin:{
            width :'20%',
          },
        },
    createIconSelectField({name:'icon',label:'Icon'}),
      ]},
    {
      name: 'otherAttributes',
      type: 'json',
    },
  ],
}

export default Buttons
