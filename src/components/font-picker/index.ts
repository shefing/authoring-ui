import {Field} from 'payload';

interface FontFieldOptions {
  name?: string;
  label?: string;
  apiUrl?: string;
}

export const createFontFamilyField = ({
  name = 'fontFamily',
  label = 'Font Family',
  apiUrl = '/api/fonts',
}: FontFieldOptions = {}): Field => ({
  name,
  type: 'text',
  label,
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
}: FontFieldOptions = {}): Field => ({
  name,
  type: 'text',
  label,
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
}: FontFieldOptions = {}): Field => ({
  name,
  type: 'text',
  label,
  admin: {
    width : '25%',
    components: {
      Field: '/components/font-picker/FontActions#ActionFontStyle',
    },
  },
});
