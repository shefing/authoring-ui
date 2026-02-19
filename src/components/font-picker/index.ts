import {Field} from 'payload';

interface FontFieldOptions {
  name?: string;
  label?: string;
  apiUrl?: string;
  defaultValue?: string | ((args: any) => Promise<string | null | undefined> | string | null | undefined);
}

export const createFontFamilyField = ({
  name = 'fontFamily',
  label = 'Font Family',
  apiUrl = '/api/fonts',
  defaultValue,
}: FontFieldOptions = {}): Field => ({
  name,
  type: 'text',
  label,
  defaultValue,
  admin: {
    width : '25%',
    components: {
      Field: {
        path: '/components/font-picker/FontActions#ActionFont',
        clientProps: {
          apiUrl,
        },
      },
    },
  },
});

export const createFontSizeField = ({
  name = 'fontSize',
  label = 'Font Size',
  defaultValue,
}: FontFieldOptions = {}): Field => ({
  name,
  type: 'text',
  label,
  defaultValue,
  admin: {
    width : '25%',
    components: {
      Field: '/components/font-picker/FontActions#ActionFontSize',
    },
  },
});

export const createFontWeightField = ({
  name = 'fontWeight',
  label = 'Font Weight & Style',
  defaultValue,
}: FontFieldOptions = {}): Field => ({
  name,
  type: 'text',
  label,
  defaultValue,
  admin: {
    width : '25%',
    components: {
      Field: '/components/font-picker/FontActions#ActionFontStyle',
    },
  },
});
