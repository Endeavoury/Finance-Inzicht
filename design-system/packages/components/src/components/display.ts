import { css, html, nothing, type CSSResultGroup } from 'lit';
import { property } from 'lit/decorators.js';
import { foundationStyles, surfaceStyles } from '@finance-inzicht/styles';
import { DsElement, type DsTone } from '../core/ds-element.js';

export class DsBadge extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
      }
      .badge {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-1);
        min-height: 1.375rem;
        padding: 0 var(--ds-space-2);
        border: 1px solid var(--ds-color-border-default);
        border-radius: var(--ds-radius-round);
        background: var(--ds-color-bg-hover);
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-xs);
        font-weight: var(--ds-font-weight-semibold);
        white-space: nowrap;
      }
      :host([tone='accent']) .badge,
      :host([tone='info']) .badge {
        background: var(--ds-color-info-soft);
        border-color: color-mix(in srgb, var(--ds-color-info) 30%, transparent);
        color: var(--ds-color-info);
      }
      :host([tone='success']) .badge {
        background: var(--ds-color-success-soft);
        border-color: color-mix(in srgb, var(--ds-color-success) 30%, transparent);
        color: var(--ds-color-success);
      }
      :host([tone='warning']) .badge {
        background: var(--ds-color-warning-soft);
        border-color: color-mix(in srgb, var(--ds-color-warning) 30%, transparent);
        color: var(--ds-color-warning);
      }
      :host([tone='danger']) .badge {
        background: var(--ds-color-danger-soft);
        border-color: color-mix(in srgb, var(--ds-color-danger) 30%, transparent);
        color: var(--ds-color-danger);
      }
    `,
  ];
  @property({ reflect: true }) tone: DsTone = 'neutral';
  protected override render() {
    return html`<span class="badge" part="badge"><slot></slot></span>`;
  }
}

export class DsStatusBadge extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
      }
      .status {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-2);
        color: var(--ds-color-text-secondary);
        font-size: var(--ds-font-size-sm);
        font-weight: var(--ds-font-weight-medium);
        white-space: nowrap;
      }
      .dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background: var(--ds-color-text-muted);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-text-muted) 12%, transparent);
      }
      :host([tone='success']) .dot {
        background: var(--ds-color-success);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-success) 14%, transparent);
      }
      :host([tone='warning']) .dot {
        background: var(--ds-color-warning);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-warning) 14%, transparent);
      }
      :host([tone='danger']) .dot {
        background: var(--ds-color-danger);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--ds-color-danger) 14%, transparent);
      }
      :host([tone='info']) .dot,
      :host([tone='accent']) .dot {
        background: var(--ds-color-info);
      }
    `,
  ];
  @property({ reflect: true }) tone: DsTone = 'neutral';
  protected override render() {
    return html`<span class="status" part="status"
      ><span class="dot" part="indicator" aria-hidden="true"></span><slot></slot
    ></span>`;
  }
}

export class DsAvatar extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    css`
      :host {
        display: inline-flex;
      }
      .avatar {
        display: grid;
        place-items: center;
        width: 2rem;
        height: 2rem;
        border-radius: var(--ds-radius-md);
        overflow: hidden;
        background: linear-gradient(
          145deg,
          var(--ds-color-accent-hover),
          var(--ds-color-accent-active)
        );
        color: var(--ds-color-text-inverse);
        font-size: var(--ds-font-size-xs);
        font-weight: var(--ds-font-weight-semibold);
        text-transform: uppercase;
      }
      :host([size='small']) .avatar {
        width: 1.5rem;
        height: 1.5rem;
      }
      :host([size='large']) .avatar {
        width: 2.75rem;
        height: 2.75rem;
        font-size: var(--ds-font-size-sm);
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `,
  ];
  @property() name = '';
  @property() src = '';
  @property({ reflect: true }) size: 'small' | 'medium' | 'large' = 'medium';
  private initials() {
    return (
      this.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0] ?? '')
        .join('') || '?'
    );
  }
  protected override render() {
    return html`<span class="avatar" part="avatar" role="img" aria-label=${this.name || 'User'}
      >${this.src ? html`<img src=${this.src} alt="" />` : this.initials()}</span
    >`;
  }
}

export class DsCard extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    css`
      :host {
        display: block;
      }
      .card {
        overflow: hidden;
      }
      .header,
      .body,
      .footer {
        padding: var(--ds-space-4);
      }
      .header {
        display: flex;
        justify-content: space-between;
        gap: var(--ds-space-4);
        border-bottom: 1px solid var(--ds-color-border-subtle);
      }
      .footer {
        border-top: 1px solid var(--ds-color-border-subtle);
      }
      .header:empty,
      .footer:empty {
        display: none;
      }
      :host([padding='none']) .body {
        padding: 0;
      }
      :host([padding='compact']) .body {
        padding: var(--ds-space-3);
      }
    `,
  ];
  @property({ reflect: true }) padding: 'none' | 'compact' | 'normal' = 'normal';
  protected override render() {
    return html`<article class="card surface" part="card">
      <div class="header" part="header">
        <slot name="header"></slot><slot name="actions"></slot>
      </div>
      <div class="body" part="body"><slot></slot></div>
      <div class="footer" part="footer"><slot name="footer"></slot></div>
    </article>`;
  }
}

export class DsPanel extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    css`
      :host {
        display: block;
      }
      .panel {
        padding: var(--ds-space-4);
      }
      header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--ds-space-4);
        padding-bottom: var(--ds-space-3);
        margin-bottom: var(--ds-space-3);
        border-bottom: 1px solid var(--ds-color-border-subtle);
      }
      h2 {
        margin: var(--ds-space-1) 0 0;
        font-size: var(--ds-font-size-xl);
        line-height: var(--ds-line-height-tight);
      }
      .description {
        margin: var(--ds-space-1) 0 0;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-sm);
      }
    `,
  ];
  @property() heading = '';
  @property() eyebrow = '';
  @property() description = '';
  protected override render() {
    const hasHeader =
      this.heading ||
      this.eyebrow ||
      this.description ||
      this.querySelector('[slot=header]') ||
      this.querySelector('[slot=actions]');
    return html`<section class="panel surface" part="panel">
      ${
        hasHeader
          ? html`<header part="header">
              <div>
                <slot name="header"
                  >${this.eyebrow ? html`<p class="eyebrow">${this.eyebrow}</p>` : nothing}${this.heading ? html`<h2>${this.heading}</h2>` : nothing}${this.description ? html`<p class="description">${this.description}</p>` : nothing}</slot
                >
              </div>
              <slot name="actions"></slot>
            </header>`
          : nothing
      }
      <div part="body"><slot></slot></div>
    </section>`;
  }
}

export class DsMetric extends DsElement {
  static override styles: CSSResultGroup = [
    foundationStyles,
    surfaceStyles,
    css`
      :host {
        display: block;
        min-width: 0;
      }
      .metric {
        position: relative;
        min-height: 6.25rem;
        padding: var(--ds-space-4);
        overflow: hidden;
      }
      .metric::before {
        content: '';
        position: absolute;
        inset: 0 0 auto;
        height: 2px;
        background: var(--ds-color-border-strong);
      }
      :host([tone='accent']) .metric::before,
      :host([tone='info']) .metric::before {
        background: var(--ds-color-info);
      }
      :host([tone='success']) .metric::before {
        background: var(--ds-color-success);
      }
      :host([tone='warning']) .metric::before {
        background: var(--ds-color-warning);
      }
      :host([tone='danger']) .metric::before {
        background: var(--ds-color-danger);
      }
      .label {
        display: block;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
        font-weight: var(--ds-font-weight-semibold);
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .value {
        display: block;
        margin: var(--ds-space-3) 0 var(--ds-space-1);
        font-size: var(--ds-font-size-2xl);
        font-weight: var(--ds-font-weight-semibold);
        line-height: var(--ds-line-height-tight);
        overflow-wrap: anywhere;
      }
      .detail {
        display: block;
        color: var(--ds-color-text-muted);
        font-size: var(--ds-font-size-xs);
      }
      :host([tone='success']) .value {
        color: var(--ds-color-success);
      }
      :host([tone='warning']) .value {
        color: var(--ds-color-warning);
      }
      :host([tone='danger']) .value {
        color: var(--ds-color-danger);
      }
      :host([tone='accent']) .value,
      :host([tone='info']) .value {
        color: var(--ds-color-info);
      }
    `,
  ];
  @property() label = '';
  @property() value = '';
  @property() detail = '';
  @property({ reflect: true }) tone: DsTone = 'neutral';
  protected override render() {
    return html`<article class="metric surface" part="metric">
      <span class="label" part="label">${this.label}</span
      ><strong class="value" part="value">${this.value || html`<slot></slot>`}</strong
      ><span class="detail" part="detail">${this.detail}<slot name="detail"></slot></span>
    </article>`;
  }
}
