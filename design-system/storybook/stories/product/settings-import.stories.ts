import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import { productHeader, productSidebar, productStyles } from './product-fixtures.js';
const types = [
  { label: 'Current account', value: 'current' },
  { label: 'Savings account', value: 'savings' },
  { label: 'Investment account', value: 'investment' },
];
const meta: Meta = {
  title: 'Current Product/Settings & Import',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};
export default meta;
export const AccountSettings: StoryObj = {
  globals: { theme: 'dark' },
  render: () =>
    html`${productStyles}
      <div class="product">
        <ds-app-shell
          >${productSidebar()}${productHeader('Accounts')}<ds-page-header
            eyebrow="Account settings"
            heading="Name and organize accounts"
            description="Custom names and account types are stored separately from bank source data."
          ></ds-page-header>
          <div class="content settings">
            ${[
              ['Daily account', 'NL91 •••• 4300', '€12,840.22', 'current'],
              ['Rainy day fund', 'NL38 •••• 9308', '€9,200.00', 'savings'],
            ].map(
              (account) =>
                html`<ds-card
                  ><ds-inline slot="header" justify="between"
                    ><ds-inline
                      ><ds-icon name="wallet"></ds-icon>
                      <div>
                        <strong>${account[0]}</strong
                        ><small style="display:block;color:var(--ds-color-text-muted)"
                          >${account[1]}</small
                        >
                      </div></ds-inline
                    ><strong>${account[2]}</strong></ds-inline
                  ><ds-stack
                    ><ds-input label="Custom account name" value=${account[0]}></ds-input
                    ><ds-select
                      label="Account type"
                      value=${account[3]}
                      .options=${types}
                    ></ds-select
                    ><ds-button>Save account</ds-button></ds-stack
                  ></ds-card
                >`,
            )}
          </div></ds-app-shell
        >
      </div>`,
};
export const ImportWorkflow: StoryObj = {
  globals: { theme: 'dark' },
  render: () =>
    html`${productStyles}
      <div class="product">
        <ds-app-shell
          >${productSidebar()}${productHeader('Upload CAMT')}<ds-page-header
            eyebrow="Data ingestion"
            heading="Import bank statements"
            description="Upload one CAMT XML file or a ZIP archive."
          ></ds-page-header>
          <div class="content">
            <ds-panel heading="New import"
              ><label class="drop"
                ><div>
                  <ds-icon
                    name="upload"
                    style="font-size:32px;color:var(--ds-color-accent-primary)"
                  ></ds-icon>
                  <h3>Choose or drop an XML / ZIP file</h3>
                  <p style="color:var(--ds-color-text-muted)">Maximum ZIP size 2 GiB</p>
                  <ds-button variant="secondary">Choose file</ds-button>
                </div></label
              ></ds-panel
            ><ds-alert tone="success" heading="Import queued"
              >The statement is ready for background processing.</ds-alert
            >
          </div></ds-app-shell
        >
      </div>`,
};
