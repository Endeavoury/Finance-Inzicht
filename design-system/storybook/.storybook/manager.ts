import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Finance Inzicht · Design System',
    brandUrl: '/',
    colorPrimary: '#278ee0',
    colorSecondary: '#3da4f2',
    appBg: '#080b10',
    appContentBg: '#10151d',
    appBorderColor: '#29333f',
    textColor: '#e8edf4',
    textMutedColor: '#778495',
  }),
});
