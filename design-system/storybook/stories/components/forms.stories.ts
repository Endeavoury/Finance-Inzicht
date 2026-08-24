import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const accountOptions = [
  { label: 'All accounts', value: 'all' },
  { label: 'Daily account · 4300', value: 'daily' },
  { label: 'Savings · 9308', value: 'savings' },
];
const meta: Meta = {
  title: 'Components/Forms',
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
};
export default meta;
export const InputPlayground: StoryObj = {
  args: {
    label: 'Device name',
    placeholder: 'Enter a name',
    helpText: 'Names can contain letters, numbers, and spaces.',
    error: '',
    disabled: false,
    required: false,
    size: 'medium',
  },
  render: (args) =>
    html`<ds-input
      label=${args['label']}
      placeholder=${args['placeholder']}
      helpText=${args['helpText']}
      error=${args['error']}
      ?disabled=${args['disabled']}
      ?required=${args['required']}
      size=${args['size']}
    ></ds-input>`,
};
export const InputStates: StoryObj = {
  render: () =>
    html`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px"
    >
      <ds-input label="Default" placeholder="Value"></ds-input
      ><ds-input label="Required" required value="Finance gateway"></ds-input
      ><ds-input label="Error" value="x" error="Use at least three characters"></ds-input
      ><ds-input label="Disabled" value="Managed by policy" disabled></ds-input
      ><ds-input
        label="Long content"
        value="A deliberately long value that demonstrates horizontal control behavior"
      ></ds-input>
    </div>`,
};
export const SearchInput: StoryObj = {
  render: () =>
    html`<ds-search-input
      label="Search ledger"
      placeholder="Counterparty, IBAN, reference or description"
      value="Albert"
    ></ds-search-input>`,
};
export const Select: StoryObj = {
  render: () =>
    html`<ds-select
      label="Account"
      value="daily"
      .options=${accountOptions}
      helpText="Choose the account scope"
    ></ds-select>`,
};
export const Checkbox: StoryObj = {
  render: () =>
    html`<ds-stack
      ><ds-checkbox checked>Apply to future matching entries</ds-checkbox
      ><ds-checkbox required helpText="This choice is required">Accept policy</ds-checkbox
      ><ds-checkbox disabled>Unavailable option</ds-checkbox></ds-stack
    >`,
};
export const FormFieldComposition: StoryObj = {
  render: () =>
    html`<ds-form-field
      label="Composed field"
      helpText="Form field can arrange a custom or native control"
      ><input
        style="height:40px;border:1px solid var(--ds-color-border-default);border-radius:7px;background:var(--ds-color-bg-surface);color:var(--ds-color-text-primary);padding:0 12px"
        value="Native consumer control"
    /></ds-form-field>`,
};
export const NativeFormSubmission: StoryObj = {
  render: () =>
    html`<form
      @submit=${(event: SubmitEvent) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget as HTMLFormElement);
        alert(JSON.stringify(Object.fromEntries(data)));
      }}
    >
      <ds-stack
        ><ds-input name="name" label="Name" value="Gateway" required></ds-input
        ><ds-select
          name="account"
          label="Account"
          value="daily"
          .options=${accountOptions}
        ></ds-select
        ><ds-checkbox name="enabled" checked>Enabled</ds-checkbox
        ><ds-button type="submit">Submit native form</ds-button></ds-stack
      >
    </form>`,
};
