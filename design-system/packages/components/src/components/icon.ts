import { css, html, nothing, type CSSResultGroup, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles } from '@finance-inzicht/styles';
import { DsElement } from '../core/ds-element.js';

export type DsIconName =
  | 'plus'
  | 'search'
  | 'refresh'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-down'
  | 'home'
  | 'table'
  | 'calendar'
  | 'settings'
  | 'upload'
  | 'user'
  | 'close'
  | 'check'
  | 'alert'
  | 'info'
  | 'menu'
  | 'wallet'
  | 'chart';
const paths: Record<DsIconName, TemplateResult> = {
  plus: html`<path d="M12 5v14M5 12h14" />`,
  search: html`<circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />`,
  refresh: html`<path d="M20 11a8 8 0 1 0-2 5.5M20 4v7h-7" />`,
  'chevron-left': html`<path d="m15 18-6-6 6-6" />`,
  'chevron-right': html`<path d="m9 18 6-6-6-6" />`,
  'chevron-down': html`<path d="m6 9 6 6 6-6" />`,
  home: html`<path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />`,
  table: html`<rect x="3" y="4" width="18" height="16" rx="1" /><path
      d="M3 9h18M8 4v16M15 4v16"
    />`,
  calendar: html`<rect x="3" y="5" width="18" height="16" rx="2" /><path
      d="M16 3v4M8 3v4M3 10h18"
    />`,
  settings: html`<circle cx="12" cy="12" r="3" /><path
      d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"
    />`,
  upload: html`<path d="M12 16V3m0 0L7 8m5-5 5 5M4 15v5h16v-5" />`,
  user: html`<circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />`,
  close: html`<path d="m6 6 12 12M18 6 6 18" />`,
  check: html`<path d="m5 12 4 4L19 6" />`,
  alert: html`<path d="M12 3 2.5 20h19ZM12 9v4m0 3h.01" />`,
  info: html`<circle cx="12" cy="12" r="9" /><path d="M12 11v6m0-10h.01" />`,
  menu: html`<path d="M4 7h16M4 12h16M4 17h16" />`,
  wallet: html`<path
    d="M3 6h16a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2Zm0 0 3-3h12v3m-1 5h4v4h-4a2 2 0 1 1 0-4Z"
  />`,
  chart: html`<path d="M4 20V10m6 10V4m6 16v-7m4 7H2" />`,
};

export class DsIcon extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
        width: 1em;
        height: 1em;
        vertical-align: -0.125em;
      }
      svg {
        width: 100%;
        height: 100%;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `,
  ];
  @property() name: DsIconName = 'info';
  @property() label = '';
  protected override render() {
    return html`<svg
      viewBox="0 0 24 24"
      role=${this.label ? 'img' : 'presentation'}
      aria-label=${this.label || nothing}
      aria-hidden=${this.label ? nothing : 'true'}
      part="svg"
    >
      ${paths[this.name] ?? paths.info}
    </svg>`;
  }
}
