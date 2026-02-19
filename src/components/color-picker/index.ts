import {Field} from 'payload';

interface ColorFieldOptions {
  name?: string;
  label?: string;
  defaultValue?: string | ((args: any) => Promise<string | null | undefined> | string | null | undefined);
}

export const createColorField = ({
  name = 'color',
  label = 'Color',
  defaultValue,
}: ColorFieldOptions): Field => ({
  name,
  type: 'text',
  label,
  defaultValue,
  admin: {
    components: {
      Field: '/components/color-picker/CustomTailWindColors#SelectColorFont',
    },
  },
});
export const createBackgroundColorField = ({
  name = 'backgroundColor',
  label = 'Color',
  defaultValue,
}: ColorFieldOptions): Field => ({
  name,
  type: 'text',
  label,
  defaultValue,
  admin: {
    components: {
      Field: '/components/color-picker/CustomTailWindColors#SelectColorBackground',
    },
  },
});
