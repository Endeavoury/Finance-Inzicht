import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
const sidebar = () =>
  html`<ds-sidebar slot="sidebar"
    ><strong slot="brand" style="font-size:15px">◈ &nbsp;Design System</strong
    ><ds-sidebar-item value="overview" active
      ><ds-icon slot="icon" name="home"></ds-icon>Overview</ds-sidebar-item
    ><ds-sidebar-item value="monthly"
      ><ds-icon slot="icon" name="calendar"></ds-icon>Monthly</ds-sidebar-item
    ><ds-sidebar-item value="ledger"
      ><ds-icon slot="icon" name="table"></ds-icon>Ledger</ds-sidebar-item
    ><ds-sidebar-item value="settings"
      ><ds-icon slot="icon" name="settings"></ds-icon>Settings</ds-sidebar-item
    ><ds-status-badge slot="footer" tone="success">System online</ds-status-badge></ds-sidebar
  >`;
const meta: Meta = {
  title: 'Components/Navigation',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
export const SidebarItems: StoryObj = {
  render: () => html`<div style="width:230px;height:620px">${sidebar()}</div>`,
};
export const ApplicationShell: StoryObj = {
  render: () =>
    html`<div style="margin:-24px">
      <ds-app-shell
        >${sidebar()}<ds-inline slot="header" justify="between" style="height:72px;padding:0 24px"
          ><strong>Overview</strong
          ><ds-inline
            ><ds-icon-button label="Refresh"><ds-icon name="refresh"></ds-icon></ds-icon-button
            ><ds-avatar name="Design Preview"></ds-avatar></ds-inline></ds-inline
        ><ds-page-header
          eyebrow="Operations"
          heading="System overview"
          description="Responsive shell built entirely from custom elements."
        ></ds-page-header>
        <div style="margin-top:16px">
          <ds-kpi-grid
            ><ds-metric label="Online" value="24" tone="success"></ds-metric
            ><ds-metric label="Warnings" value="2" tone="warning"></ds-metric
            ><ds-metric label="Offline" value="1" tone="danger"></ds-metric
            ><ds-metric label="Updates" value="6" tone="accent"></ds-metric
          ></ds-kpi-grid></div
      ></ds-app-shell>
    </div>`,
};
