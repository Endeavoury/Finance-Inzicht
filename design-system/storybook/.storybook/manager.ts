import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';
addons.setConfig({
  theme: create({
    base: 'dark',
    brandTitle: 'Finance Inzicht · Design System',
    brandUrl: '/',
    colorPrimary: '#2f91dc',
    colorSecondary: '#62b2ec',
    appBg: '#07090d',
    appContentBg: '#10141a',
    appBorderColor: '#29333f',
    textColor: '#f0f3f7',
    textMutedColor: '#748191',
  }),
});
