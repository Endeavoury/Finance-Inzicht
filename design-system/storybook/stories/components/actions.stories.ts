import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const meta: Meta = {
  title: 'Components/Actions',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};
export default meta;
export const ButtonPlayground: StoryObj = {
  args: { variant: 'primary', size: 'medium', disabled: false, loading: false },
  render: (args) =>
    html`<ds-button
      variant=${args['variant']}
      size=${args['size']}
      ?disabled=${args['disabled']}
      ?loading=${args['loading']}
      ><ds-icon slot="prefix" name="plus"></ds-icon>Add transaction</ds-button
    >`,
};
export const VariantsAndSizes: StoryObj = {
  render: () =>
    html`<ds-stack
      >${['small', 'medium', 'large'].map((size) => html`<ds-inline>${['primary', 'secondary', 'ghost', 'danger'].map((variant) => html`<ds-button variant=${variant} size=${size}>${variant}</ds-button>`)}</ds-inline>`)}</ds-stack
    >`,
};
export const LoadingDisabledAndWidth: StoryObj = {
  render: () =>
    html`<ds-stack
      ><ds-inline
        ><ds-button loading>Saving</ds-button><ds-button disabled>Unavailable</ds-button></ds-inline
      ><ds-button full-width>Full-width action</ds-button></ds-stack
    >`,
};
export const IconButtonAndGroup: StoryObj = {
  render: () =>
    html`<ds-inline
      ><ds-icon-button label="Refresh"><ds-icon name="refresh"></ds-icon></ds-icon-button
      ><ds-button-group label="Period navigation"
        ><ds-icon-button label="Previous"><ds-icon name="chevron-left"></ds-icon></ds-icon-button
        ><ds-button variant="secondary">August 2026</ds-button
        ><ds-icon-button label="Next"
          ><ds-icon name="chevron-right"></ds-icon></ds-icon-button></ds-button-group
    ></ds-inline>`,
};
